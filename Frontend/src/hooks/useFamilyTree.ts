import { useCallback, useEffect, useState } from "react";
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

/*
  useFamilyTreeFlow — hämtar ett befintligt träd från backend och bygger
  React Flow-noder och kanter med Dagre-layout.
  Exponerar addParentChildEdge och removeEdge för FamilyFlow att använda.
*/

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ direction: "TB", nodesep: 10, ranksep: 120 });

  nodes.forEach((node) =>
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT }),
  );
  edges
    .filter((edge) => edge.type === "parent-child")
    .forEach((edge) => graph.setEdge(edge.source, edge.target));

  dagre.layout(graph);

  return nodes.map((node) => {
    const { x, y } = graph.node(node.id);
    return {
      ...node,
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
    };
  });
}

function buildNodes(persons: Person[]): Node[] {
  return persons.map((person) => ({
    id: String(person.id),
    position: { x: 0, y: 0 },
    data: {
      label: `${person.firstName} ${person.lastName}`,
      person,
    },
    style: {
      width: NODE_WIDTH,
      background:
        person.gender === 0
          ? "#dbeafe"
          : person.gender === 1
            ? "#fce7f3"
            : "#f3f4f6",
      border: "1px solid #d1d5db",
      borderRadius: 8,
      fontSize: 13,
      padding: "8px 12px",
    },
  }));
}

function buildEdges(relations: ParentChildRelation[]): Edge[] {
  return relations.map((r) => ({
    id: `pc-${r.id}`,
    source: String(r.parentId),
    target: String(r.childId),
    type: "parent-child",
    animated: false,
    style: { stroke: "#6b7280" },
  }));
}

function buildPartnerEdges(
  relations: { sourceId: number; relation: PartnerRelation }[],
): Edge[] {
  return relations.map(({ sourceId, relation }) => ({
    id: `partner-${relation.id}`,
    source: String(sourceId),
    target: String(relation.partner.id),
    type: "partner",
    animated: false,
    style: { stroke: "#e879a0", strokeDasharray: "6 3" },
    label: "Partner",
  }));
}

async function buildPartnerRelationSeeds(
  persons: Person[],
): Promise<{ sourceId: number; relation: PartnerRelation }[]> {
  const seenRelationIds = new Set<number>();
  const seeds: { sourceId: number; relation: PartnerRelation }[] = [];

  await Promise.all(
    persons.map(async (person) => {
      const relations = await getPartnerRelations(person.id);
      relations.forEach((relation) => {
        if (seenRelationIds.has(relation.id)) return;
        seenRelationIds.add(relation.id);
        seeds.push({ sourceId: person.id, relation });
      });
    }),
  );

  return seeds;
}

export function useFamilyTreeFlow(familyTreeId: number) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [persons, relations] = await Promise.all([
        getPersonsByTree(familyTreeId),
        getParentChildRelationsByTree(familyTreeId),
      ]);
      const partnerRelationSeeds = await buildPartnerRelationSeeds(persons);

      const rawNodes = buildNodes(persons);
      const rawEdges = [
        ...buildEdges(relations),
        ...buildPartnerEdges(partnerRelationSeeds),
      ];
      const laidOutNodes = applyDagreLayout(rawNodes, rawEdges);

      setNodes(laidOutNodes);
      setEdges(rawEdges);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Okänt fel");
    } finally {
      setLoading(false);
    }
  }, [familyTreeId]);

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
      type: "parent-child",
      animated: false,
      style: { stroke: "#6b7280" },
    };

    setEdges((prevEdges) => {
      const updatedEdges = [...prevEdges, newEdge];
      setNodes((prevNodes) => applyDagreLayout(prevNodes, updatedEdges));
      return updatedEdges;
    });
  }

  async function removeEdge(edgeId: string): Promise<void> {
    if (edgeId.startsWith("pc-")) {
      const dbId = Number(edgeId.replace("pc-", ""));
      await deleteParentChildRelation(dbId);
    } else if (edgeId.startsWith("partner-")) {
      const dbId = Number(edgeId.replace("partner-", ""));
      await deletePartnerRelation(dbId);
    } else {
      throw new Error(`Okänd edge-typ: ${edgeId}`);
    }

    setEdges((prevEdges) => {
      const updatedEdges = prevEdges.filter((e) => e.id !== edgeId);
      setNodes((prevNodes) => applyDagreLayout(prevNodes, updatedEdges));
      return updatedEdges;
    });
  }

  return {
    nodes,
    edges,
    loading,
    error,
    setNodes,
    setEdges,
    addParentChildEdge,
    removeEdge,
  };
}
