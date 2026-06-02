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

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;
const GROUND_OFFSET = 80;

// ── Dagre ─────────────────────────────────────────────────────────────────────

function runDagre(nodes: Node[], parentChildEdges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes;
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ direction: "TB", nodesep: 20, ranksep: 120 });
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

function applyTreeLayout(
  aliveNodes: Node[],
  deceasedNodes: Node[],
  parentChildEdges: Edge[],
): Node[] {
  const aliveIds = new Set(aliveNodes.map((n) => n.id));
  const deadIds = new Set(deceasedNodes.map((n) => n.id));

  const laidAlive = runDagre(
    aliveNodes,
    parentChildEdges.filter(
      (e) => aliveIds.has(e.source) && aliveIds.has(e.target),
    ),
  );
  const aliveMaxY = laidAlive.reduce(
    (max, n) => Math.max(max, n.position.y + NODE_HEIGHT),
    0,
  );
  const positionedAlive = laidAlive.map((n) => ({
    ...n,
    position: { x: n.position.x, y: n.position.y - aliveMaxY - GROUND_OFFSET },
  }));

  const laidDead = runDagre(
    deceasedNodes,
    parentChildEdges.filter(
      (e) => deadIds.has(e.source) && deadIds.has(e.target),
    ),
  );
  const positionedDead = laidDead.map((n) => ({
    ...n,
    position: {
      x: n.position.x,
      y: GROUND_OFFSET + n.position.y - NODE_HEIGHT / 2,
    },
  }));

  return [...positionedAlive, ...positionedDead];
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
  if (base.type !== "family") return base;

  const source = nodeMap.get(base.source);
  const target = nodeMap.get(base.target);
  if (!source || !target) return base;

  const crosses =
    (source.position.y < 0 && target.position.y > 0) ||
    (source.position.y > 0 && target.position.y < 0);

  return crosses ? { ...base, type: "cross-ground" } : base;
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
    style: { stroke: "#3d2202" },
    // Hade style: { stroke: "#6b7280" }, Gör stylen till grenar
  }));
}

// Enda partner-edge-builder — används både vid inläsning (via .map) och vid
// skapande av enskild kant, så vi slipper duplicerad kod.
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

async function fetchPartnerSeeds(
  persons: Person[],
): Promise<{ sourceId: number; relation: PartnerRelation }[]> {
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

// ── Layout + klassificering ───────────────────────────────────────────────────

function buildLayout(
  allNodes: Node[],
  allEdges: Edge[],
  readOnly: boolean,
): { nodes: Node[]; edges: Edge[] } {
  const validNodeIds = new Set(allNodes.map((n) => n.id));

  // Filtrera bort kanter vars noder inte längre finns (t.ex. efter borttagning)
  const validEdges = allEdges.filter(
    (e) => validNodeIds.has(e.source) && validNodeIds.has(e.target),
  );

  const pcEdges = validEdges.filter((e) => e.type === "family");
  const aliveNodes = allNodes.filter((n) => n.type === "person");
  const deadNodes = allNodes.filter((n) => n.type === "deceased");

  const laidNodes = applyTreeLayout(aliveNodes, deadNodes, pcEdges);
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
    const { nodes: laidNodes, edges: classifiedEdges } = buildLayout(
      rawNodesRef.current,
      rawEdgesRef.current,
      readOnly,
    );
    setNodes(laidNodes);
    setEdges(classifiedEdges);
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

  // ── Lokala uppdateringar ──────────────────────────────────────────────────

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

  // ── API-operationer ───────────────────────────────────────────────────────

  async function addParentChildEdge(
    parentId: number,
    childId: number,
  ): Promise<void> {
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
        style: { stroke: "#3d2202" },
      },
    ];
    applyLayout();
  }

  async function addPartnerEdge(
    person1Id: number,
    person2Id: number,
  ): Promise<void> {
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

  async function removeEdge(edgeId: string): Promise<void> {
    // Matcha på prefix oavsett om typen ändrats till "cross-ground"
    const rawId = edgeId.replace("cross-ground-", "");
    if (rawId.startsWith("pc-"))
      await deleteParentChildRelation(Number(rawId.replace("pc-", "")));
    else if (rawId.startsWith("partner-"))
      await deletePartnerRelation(Number(rawId.replace("partner-", "")));
    else throw new Error(`Okänd edge-typ: ${edgeId}`);

    rawEdgesRef.current = rawEdgesRef.current.filter((e) => e.id !== rawId);
    applyLayout();
  }

  async function removePerson(personId: number): Promise<void> {
    await deletePerson(personId);

    const personKey = String(personId);
    rawNodesRef.current = rawNodesRef.current.filter((n) => n.id !== personKey);

    // Ta bort alla kanter kopplade till personen
    rawEdgesRef.current = rawEdgesRef.current.filter(
      (e) => e.source !== personKey && e.target !== personKey,
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
    updatePersonLocally,
  };
}
