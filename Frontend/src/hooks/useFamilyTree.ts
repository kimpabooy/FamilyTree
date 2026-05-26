import { useCallback, useEffect, useState } from "react";
import { type Node, type Edge } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { getPersonsByTree } from "../services/PersonService";
import type { Person, ParentChildRelation } from "../types/Models";
import type { CreateParentChildRequest } from "../types/Requests";
import {
  getParentChildRelationsByTree,
  createParentChildRelation,
  deleteParentChildRelation,
} from "../services/RelationService";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

// Dagre-layout: beräknar x/y automatiskt baserat på förälder-barn-relationer
function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({})); // Default edge label krävs av dagre, även om vi inte använder den
  graph.setGraph({
    direction: "TB", // Top -> Bottom
    nodesep: 10, // horisontellt avstånd mellan noder på samma nivå
    ranksep: 120, // vertikalt avstånd mellan nivåer
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return nodes.map((node) => {
    const { x, y } = graph.node(node.id);
    return {
      ...node,
      position: {
        x: x - NODE_WIDTH,
        y: y - NODE_HEIGHT,
      },
    };
  });
}

function buildNodes(persons: Person[]): Node[] {
  return persons.map((person) => ({
    id: String(person.id),
    position: { x: 0, y: 0 }, // Dagre skriver över dessa
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

      const rawNodes = buildNodes(persons);
      const rawEdges = buildEdges(relations);
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
      style: { stroke: "#6b806d" },
    };

    // Kör om layout med den nya kanten
    setEdges((prevEdges) => {
      const updatedEdges = [...prevEdges, newEdge];
      setNodes((prevNodes) => applyDagreLayout(prevNodes, updatedEdges));
      return updatedEdges;
    });
  }

  async function removeEdge(edgeId: string): Promise<void> {
    const dbId = Number(edgeId.replace("pc-", ""));
    await deleteParentChildRelation(dbId);
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
