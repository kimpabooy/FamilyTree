import { useCallback, useEffect, useRef, useState } from "react";
import { type Node, type Edge } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { deletePerson, getPersonsByTree } from "../services/PersonService";
import type {
  Person,
  ParentChildRelation,
  PartnerRelation,
} from "../types/Models";
import type {
  CreateParentChildRequest,
  CreatePartnerRelationRequest,
} from "../types/Requests";
import { PartnerType } from "../types/Enums";
import {
  getParentChildRelationsByTree,
  getPartnerRelations,
  createParentChildRelation,
  createPartnerRelation,
  deleteParentChildRelation,
  deletePartnerRelation,
} from "../services/RelationService";

const NODE_WIDTH = 190;
const NODE_HEIGHT = 60;
const GROUND_OFFSET = 80;
const H_GAP = 24; // Minsta horisontellt mellanrum mellan noder på samma rad
const PARTNER_GAP = 16; // Extra tätt mellanrum mellan partners

// ── Dagre ─────────────────────────────────────────────────────────────────────

function runDagre(nodes: Node[], parentChildEdges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes;
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ direction: "TB", nodesep: 40, ranksep: 120 });
  nodes.forEach((n) =>
    graph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }),
  );
  parentChildEdges.forEach((e) => graph.setEdge(e.source, e.target));
  dagre.layout(graph);
  return nodes.map((n) => {
    const pos = graph.node(n.id);
    return {
      ...n,
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
    };
  });
}

// ── Partner-justering ─────────────────────────────────────────────────────────
// Placerar partner-par bredvid varandra på samma Y-nivå.

function adjustPartnerPositions(nodes: Node[], partnerEdges: Edge[]): Node[] {
  const nodeMap = new Map(
    nodes.map((n) => [n.id, { ...n, position: { ...n.position } }]),
  );
  const seen = new Set<string>();

  for (const e of partnerEdges) {
    const pairKey = [e.source, e.target].sort().join(":");
    if (seen.has(pairKey)) continue;
    seen.add(pairKey);

    const a = nodeMap.get(e.source);
    const b = nodeMap.get(e.target);
    if (!a || !b) continue;

    // Samma Y (medelvärde)
    const avgY = (a.position.y + b.position.y) / 2;
    const [left, right] = a.position.x <= b.position.x ? [a, b] : [b, a];
    const centerX = (left.position.x + right.position.x) / 2;

    left.position = { x: centerX - NODE_WIDTH - PARTNER_GAP / 2, y: avgY };
    right.position = { x: centerX + PARTNER_GAP / 2, y: avgY };
  }

  return nodes.map((n) => nodeMap.get(n.id) ?? n);
}

// ── Kollisionsdetektering per rad ─────────────────────────────────────────────
//
// Grupperar noder på samma Y-nivå (±5px tolerans) och sprider ut dem
// med minst H_GAP mellanrum. Partner-par hålls ihop som en enhet.

function resolveRowCollisions(nodes: Node[], partnerEdges: Edge[]): Node[] {
  // Bygg partner-par-map: nodeId → partnerId
  const partnerOf = new Map<string, string>();
  for (const e of partnerEdges) {
    partnerOf.set(e.source, e.target);
    partnerOf.set(e.target, e.source);
  }

  // Gruppera noder per Y-rad (tolerans 5px)
  const rows = new Map<number, Node[]>();
  for (const node of nodes) {
    const y = node.position.y;
    let rowKey = y;
    for (const key of rows.keys()) {
      if (Math.abs(key - y) < 5) {
        rowKey = key;
        break;
      }
    }
    if (!rows.has(rowKey)) rows.set(rowKey, []);
    rows.get(rowKey)!.push(node);
  }

  const result = new Map(
    nodes.map((n) => [n.id, { ...n, position: { ...n.position } }]),
  );

  for (const [, row] of rows) {
    if (row.length < 2) continue;

    // Sortera efter nuvarande X
    row.sort((a, b) => a.position.x - b.position.x);

    // Identifiera partner-par — de behandlas som en enhet (blockbredd = 2*NODE_WIDTH + PARTNER_GAP)
    const seen = new Set<string>();
    const blocks: { ids: string[]; centerX: number; width: number }[] = [];

    for (const node of row) {
      if (seen.has(node.id)) continue;
      seen.add(node.id);
      const partner = partnerOf.get(node.id);
      if (partner && row.find((n) => n.id === partner) && !seen.has(partner)) {
        seen.add(partner);
        const partnerNode = row.find((n) => n.id === partner)!;
        const centerX =
          (node.position.x + partnerNode.position.x + NODE_WIDTH) / 2;
        blocks.push({
          ids: [node.id, partner],
          centerX,
          width: NODE_WIDTH * 2 + PARTNER_GAP,
        });
      } else {
        blocks.push({
          ids: [node.id],
          centerX: node.position.x + NODE_WIDTH / 2,
          width: NODE_WIDTH,
        });
      }
    }

    // Beräkna total bredd och centrera gruppen
    const totalWidth =
      blocks.reduce((sum, b) => sum + b.width, 0) + H_GAP * (blocks.length - 1);

    // Centerpunkten för hela raden baseras på Dagres ursprungliga centerpunkt
    const rowCenterX =
      row.reduce((sum, n) => sum + n.position.x + NODE_WIDTH / 2, 0) /
      row.length;

    let currentX = rowCenterX - totalWidth / 2;

    for (const block of blocks) {
      if (block.ids.length === 2) {
        // Partner-par: vänster och höger
        const [leftId, rightId] =
          result.get(block.ids[0])!.position.x <=
          result.get(block.ids[1])!.position.x
            ? block.ids
            : [block.ids[1], block.ids[0]];

        result.get(leftId)!.position.x = currentX;
        result.get(rightId)!.position.x = currentX + NODE_WIDTH + PARTNER_GAP;
      } else {
        result.get(block.ids[0])!.position.x = currentX;
      }
      currentX += block.width + H_GAP;
    }
  }

  return nodes.map((n) => result.get(n.id) ?? n);
}

// ── Layout ────────────────────────────────────────────────────────────────────

function applyTreeLayout(
  aliveNodes: Node[],
  deceasedNodes: Node[],
  parentChildEdges: Edge[],
  partnerEdges: Edge[],
): Node[] {
  const aliveIds = new Set(aliveNodes.map((n) => n.id));
  const deadIds = new Set(deceasedNodes.map((n) => n.id));

  const processGroup = (
    nodes: Node[],
    pcEdges: Edge[],
    direction: "up" | "down",
  ): Node[] => {
    if (nodes.length === 0) return [];

    const groupIds = new Set(nodes.map((n) => n.id));
    const groupPC = pcEdges.filter(
      (e) => groupIds.has(e.source) && groupIds.has(e.target),
    );
    const groupPart = partnerEdges.filter(
      (e) => groupIds.has(e.source) && groupIds.has(e.target),
    );

    const laid = runDagre(nodes, groupPC);
    const maxY = laid.reduce(
      (max, n) => Math.max(max, n.position.y + NODE_HEIGHT),
      0,
    );

    const shifted = laid.map((n) => ({
      ...n,
      position: {
        x: n.position.x,
        y:
          direction === "up"
            ? n.position.y - maxY - GROUND_OFFSET
            : GROUND_OFFSET + n.position.y - NODE_HEIGHT / 2,
      },
    }));

    const partnered = adjustPartnerPositions(shifted, groupPart);
    return resolveRowCollisions(partnered, groupPart);
  };

  return [
    ...processGroup(
      aliveNodes,
      parentChildEdges.filter(
        (e) => aliveIds.has(e.source) && aliveIds.has(e.target),
      ),
      "up",
    ),
    ...processGroup(
      deceasedNodes,
      parentChildEdges.filter(
        (e) => deadIds.has(e.source) && deadIds.has(e.target),
      ),
      "down",
    ),
  ];
}

// ── Kant-klassificering ───────────────────────────────────────────────────────

function classifyEdge(
  edge: Edge,
  nodeMap: Map<string, Node>,
  readOnly: boolean,
): Edge {
  const base = readOnly
    ? { ...edge, data: { ...(edge.data ?? {}), readOnly: true } }
    : edge;

  const source = nodeMap.get(base.source);
  const target = nodeMap.get(base.target);
  if (!source || !target) return base;

  const crosses =
    (source.position.y < 0 && target.position.y > 0) ||
    (source.position.y > 0 && target.position.y < 0);

  // Family-kanter som korsar marklinjen → "cross-ground"-typ
  if (base.type === "family" && crosses) {
    return { ...base, type: "cross-ground" };
  }

  // Partner-kanter som korsar marklinjen → behåll typen men markera med crossGround
  if (base.type === "partner" && crosses) {
    return { ...base, data: { ...(base.data ?? {}), crossGround: true } };
  }

  return base;
}

// ── Node/Edge-builders ────────────────────────────────────────────────────────

function buildPersonNode(person: Person): Node {
  return {
    id: String(person.id),
    type: person.deathDate !== null ? "deceased" : "person",
    position: { x: 0, y: 0 },
    data: { person },
    style: { width: NODE_WIDTH },
  };
}

function buildParentChildEdges(relations: ParentChildRelation[]): Edge[] {
  return relations.map((r) => ({
    id: `pc-${r.id}`,
    source: String(r.parentId),
    target: String(r.childId),
    type: "family",
    animated: false,
    style: { stroke: "#6b7280" },
  }));
}

function buildPartnerEdge(sourceId: number, relation: PartnerRelation): Edge {
  return {
    id: `partner-${relation.id}`,
    source: String(sourceId),
    target: String(relation.partner.id),
    type: "partner",
    animated: false,
    style: { stroke: "#e879a0", strokeDasharray: "6 3" },
  };
}

// ── Datahämtning för partnerrelationer ──────────────────────────────────────
async function fetchPartnerSeeds(persons: Person[]) {
  const seen = new Set<number>();
  const seeds: { sourceId: number; relation: PartnerRelation }[] = [];
  await Promise.all(
    persons.map(async (p) => {
      const rels = await getPartnerRelations(p.id);
      rels.forEach((r) => {
        if (seen.has(r.id)) return;
        seen.add(r.id);
        seeds.push({ sourceId: p.id, relation: r });
      });
    }),
  );
  return seeds;
}

// ── Layout + klassificering i ett steg ───────────────────────────────────────
function buildLayout(allNodes: Node[], allEdges: Edge[], readOnly: boolean) {
  const validNodeIds = new Set(allNodes.map((n) => n.id));
  const validEdges = allEdges.filter(
    (e) => validNodeIds.has(e.source) && validNodeIds.has(e.target),
  );
  const pcEdges = validEdges.filter((e) => e.type === "family");
  const partnerEdges = validEdges.filter((e) => e.type === "partner");
  const aliveNodes = allNodes.filter((n) => n.type === "person");
  const deadNodes = allNodes.filter((n) => n.type === "deceased");

  const laidNodes = applyTreeLayout(
    aliveNodes,
    deadNodes,
    pcEdges,
    partnerEdges,
  );
  const nodeMap = new Map(laidNodes.map((n) => [n.id, n]));
  const classified = validEdges.map((e) => classifyEdge(e, nodeMap, readOnly));

  return { nodes: laidNodes, edges: classified };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useFamilyTreeView(familyTreeId: number, readOnly = false) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rawEdgesRef = useRef<Edge[]>([]);
  const rawNodesRef = useRef<Node[]>([]);

  const applyLayout = useCallback(() => {
    const { nodes: ln, edges: ce } = buildLayout(
      rawNodesRef.current,
      rawEdgesRef.current,
      readOnly,
    );
    setNodes(ln);
    setEdges(ce);
  }, [readOnly]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [persons, relations] = await Promise.all([
        getPersonsByTree(familyTreeId),
        getParentChildRelationsByTree(familyTreeId),
      ]);
      const partnerSeeds = await fetchPartnerSeeds(persons);
      rawNodesRef.current = persons.map(buildPersonNode);
      rawEdgesRef.current = [
        ...buildParentChildEdges(relations),
        ...partnerSeeds.map(({ sourceId, relation }) =>
          buildPartnerEdge(sourceId, relation),
        ),
      ];
      applyLayout();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Okänt fel");
    } finally {
      setLoading(false);
    }
  }, [familyTreeId, applyLayout]);

  useEffect(() => {
    load();
  }, [load]);

  const addPersonLocally = useCallback(
    (newPerson: Person) => {
      rawNodesRef.current = [
        ...rawNodesRef.current,
        buildPersonNode(newPerson),
      ];
      applyLayout();
    },
    [applyLayout],
  );

  const updatePersonLocally = useCallback(
    (updatedPerson: Person) => {
      rawNodesRef.current = rawNodesRef.current.map((n) =>
        n.id === String(updatedPerson.id)
          ? {
              ...n,
              type: updatedPerson.deathDate !== null ? "deceased" : "person",
              data: { person: updatedPerson },
            }
          : n,
      );
      applyLayout();
    },
    [applyLayout],
  );

  async function addParentChildEdge(parentId: number, childId: number) {
    const created = await createParentChildRelation({
      parentId,
      childId,
    } as CreateParentChildRequest);
    rawEdgesRef.current = [
      ...rawEdgesRef.current,
      {
        id: `pc-${created.id}`,
        source: String(parentId),
        target: String(childId),
        type: "family",
        animated: false,
        style: { stroke: "#6b7280" },
      },
    ];
    applyLayout();
  }

  async function addPartnerEdge(person1Id: number, person2Id: number) {
    const created = await createPartnerRelation({
      person1Id,
      person2Id,
      partnerType: PartnerType.Current,
    } as CreatePartnerRelationRequest);
    rawEdgesRef.current = [
      ...rawEdgesRef.current,
      buildPartnerEdge(person1Id, created),
    ];
    applyLayout();
  }

  async function removeEdge(edgeId: string) {
    const rawId = edgeId.replace("cross-ground-", "");
    if (rawId.startsWith("pc-"))
      await deleteParentChildRelation(Number(rawId.replace("pc-", "")));
    else if (rawId.startsWith("partner-"))
      await deletePartnerRelation(Number(rawId.replace("partner-", "")));
    else throw new Error(`Okänd edge-typ: ${edgeId}`);
    rawEdgesRef.current = rawEdgesRef.current.filter((e) => e.id !== rawId);
    applyLayout();
  }

  async function removePerson(personId: number) {
    await deletePerson(personId);
    const key = String(personId);
    rawNodesRef.current = rawNodesRef.current.filter((n) => n.id !== key);
    rawEdgesRef.current = rawEdgesRef.current.filter(
      (e) => e.source !== key && e.target !== key,
    );
    applyLayout();
  }

  return {
    nodes,
    edges,
    loading,
    error,
    setNodes,
    setEdges,
    addParentChildEdge,
    addPartnerEdge,
    removeEdge,
    removePerson,
    addPersonLocally,
    updatePersonLocally,
  };
}
