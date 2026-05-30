import { useCallback, useEffect, useRef, useState } from "react";
import { type Node, type Edge } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { getPersonsByTree } from "../services/PersonService";
import type {
  Person,
  ParentChildRelation,
  PartnerRelation,
} from "../types/Models";
import type { CreateParentChildRequest } from "../types/Requests";
import {
  getParentChildRelationsByTree,
  getPartnerRelations,
  createParentChildRelation,
  deleteParentChildRelation,
  deletePartnerRelation,
} from "../services/RelationService";

const NODE_WIDTH  = 200;
const NODE_HEIGHT = 60;
// Vertikalt avstånd från marklinjen till första nod-raden
const GROUND_OFFSET = 80;

// ── Dagre-layout ─────────────────────────────────────────────────────────────

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
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });
}

/**
 * Beräknar layout för levande och avlidna separat.
 *
 * Levande:  Dagre TB, Y-värden positiva (grenar upp från marklinjen).
 * Avlidna:  Dagre TB, Y-värden speglas negativt (rötter ned från marklinjen).
 *
 * Marklinjen är vid Y = 0.
 */
function applyTreeLayout(
  aliveNodes: Node[],
  deceasedNodes: Node[],
  parentChildEdges: Edge[],
): Node[] {
  const aliveIds  = new Set(aliveNodes.map((n) => n.id));
  const deadIds   = new Set(deceasedNodes.map((n) => n.id));

  const aliveEdges = parentChildEdges.filter(
    (e) => aliveIds.has(e.source) && aliveIds.has(e.target),
  );
  const deadEdges = parentChildEdges.filter(
    (e) => deadIds.has(e.source) && deadIds.has(e.target),
  );

  const laidAlive = runDagre(aliveNodes, aliveEdges);

  // Hitta max Y i levande-layouten för att veta hur högt trädet är
  const aliveMaxY = laidAlive.reduce(
    (max, n) => Math.max(max, n.position.y + NODE_HEIGHT),
    0,
  );

  // Positionera levande noder ovanför marklinjen
  const positionedAlive = laidAlive.map((n) => ({
    ...n,
    position: {
      x: n.position.x,
      // Flytta upp så att nedersta raden är GROUND_OFFSET ovanför Y=0
      y: n.position.y - aliveMaxY - GROUND_OFFSET,
    },
  }));

  // Dagre för avlidna (TB = föräldrar ovanför barn i databasen)
  const laidDead = runDagre(deceasedNodes, deadEdges);

  // Spegla och placera under marklinjen
  const positionedDead = laidDead.map((n) => ({
    ...n,
    position: {
      x: n.position.x,
      y: GROUND_OFFSET + (n.position.y - NODE_HEIGHT / 2),
    },
  }));

  return [...positionedAlive, ...positionedDead];
}

// ── Node/Edge-builders ────────────────────────────────────────────────────────

function buildPersonNode(person: Person): Node {
  const isDeceased = person.deathDate !== null;
  return {
    id: String(person.id),
    type: isDeceased ? "deceased" : "person",
    position: { x: 0, y: 0 },
    data: { person },
    style: {
      width: NODE_WIDTH,
    },
  };
}

function buildGroundNode(): Node {
  return {
    id: "ground-marker",
    type: "ground",
    position: { x: -500, y: -NODE_HEIGHT / 2 },
    data: {},
    // Marklinjen sträcks horisontellt via CSS — bredden hanteras i nod-komponenten
    style: { width: 2000, pointerEvents: "none" },
    selectable: false,
    draggable: false,
    connectable: false,
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

function buildPartnerEdges(
  seeds: { sourceId: number; relation: PartnerRelation }[],
): Edge[] {
  return seeds.map(({ sourceId, relation }) => ({
    id: `partner-${relation.id}`,
    source: String(sourceId),
    target: String(relation.partner.id),
    type: "partner",
    animated: false,
    style: { stroke: "#e879a0", strokeDasharray: "6 3" },
  }));
}

async function fetchPartnerSeeds(
  persons: Person[],
): Promise<{ sourceId: number; relation: PartnerRelation }[]> {
  const seen  = new Set<number>();
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

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useFamilyTreeView(familyTreeId: number) {
  const [nodes, setNodes]     = useState<Node[]>([]);
  const [edges, setEdges]     = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const edgesRef = useRef<Edge[]>([]);

  const setEdgesAndRef = useCallback(
    (updater: Edge[] | ((prev: Edge[]) => Edge[])) => {
      setEdges((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        edgesRef.current = next;
        return next;
      });
    },
    [],
  );

  const rebuildLayout = useCallback(
    (allNodes: Node[], allEdges: Edge[]): Node[] => {
      const pcEdges      = allEdges.filter((e) => e.type === "family");
      const aliveNodes   = allNodes.filter((n) => n.type === "person");
      const deadNodes    = allNodes.filter((n) => n.type === "deceased");
      const groundNode   = allNodes.find((n) => n.type === "ground");
      const laid         = applyTreeLayout(aliveNodes, deadNodes, pcEdges);
      return groundNode ? [...laid, groundNode] : laid;
    },
    [],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [persons, relations] = await Promise.all([
        getPersonsByTree(familyTreeId),
        getParentChildRelationsByTree(familyTreeId),
      ]);
      const partnerSeeds = await fetchPartnerSeeds(persons);

      const personNodes = persons.map(buildPersonNode);
      const groundNode  = buildGroundNode();

      const pcEdges      = buildParentChildEdges(relations);
      const partnerEdges = buildPartnerEdges(partnerSeeds);
      const allEdges     = [...pcEdges, ...partnerEdges];

      const laidNodes = rebuildLayout(
        [...personNodes, groundNode],
        allEdges,
      );

      edgesRef.current = allEdges;
      setNodes(laidNodes);
      setEdgesAndRef(allEdges);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Okänt fel");
    } finally {
      setLoading(false);
    }
  }, [familyTreeId, rebuildLayout, setEdgesAndRef]);

  useEffect(() => {
    load();
  }, [load]);

  async function addParentChildEdge(
    parentId: number,
    childId: number,
  ): Promise<void> {
    const request: CreateParentChildRequest = { parentId, childId };
    const created = await createParentChildRelation(request);

    const newEdge: Edge = {
      id: `pc-${created.id}`,
      source: String(parentId),
      target: String(childId),
      type: "family",
      animated: false,
      style: { stroke: "#6b7280" },
    };

    const updated = [...edgesRef.current, newEdge];
    setEdgesAndRef(updated);
    setNodes((prev) => rebuildLayout(prev, updated));
  }

  async function removeEdge(edgeId: string): Promise<void> {
    if (edgeId.startsWith("pc-")) {
      await deleteParentChildRelation(Number(edgeId.replace("pc-", "")));
    } else if (edgeId.startsWith("partner-")) {
      await deletePartnerRelation(Number(edgeId.replace("partner-", "")));
    } else {
      throw new Error(`Okänd edge-typ: ${edgeId}`);
    }

    const updated = edgesRef.current.filter((e) => e.id !== edgeId);
    setEdgesAndRef(updated);
    setNodes((prev) => rebuildLayout(prev, updated));
  }

  return {
    nodes,
    edges,
    loading,
    error,
    setNodes,
    setEdges: setEdgesAndRef,
    addParentChildEdge,
    removeEdge,
  };
}