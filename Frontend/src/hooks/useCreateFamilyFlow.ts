import { useState, useCallback, useRef } from "react";
import { type Node, type Edge } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { createFamilyTree } from "../services/FamilytreeService";
import { createPerson } from "../services/PersonService";
import {
  createParentChildRelation,
  createPartnerRelation,
} from "../services/RelationService";
import type { Gender } from "../types/Enums";
import type { CreatePartnerRelationRequest } from "../types/Requests";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

interface LocalPerson {
  localId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
}

type RelationType = "parent-child" | "partner";

interface LocalRelation {
  parentLocalId: string;
  childLocalId: string;
  type: RelationType;
}

interface AddPersonInput {
  firstName: string;
  lastName: string;
  gender: Gender;
}

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ direction: "TB", nodesep: 10, ranksep: 120 });

  nodes.forEach((n) =>
    graph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }),
  );

  edges
    .filter((e) => !e.id.startsWith("local-partner-"))
    .forEach((e) => graph.setEdge(e.source, e.target));

  dagre.layout(graph);

  return nodes.map((n) => {
    const { x, y } = graph.node(n.id);
    return {
      ...n,
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
    };
  });
}

function buildNode(person: LocalPerson): Node {
  return {
    id: person.localId,
    position: { x: 0, y: 0 },
    data: { label: `${person.firstName} ${person.lastName}` },
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
  };
}

export function useCreateFamilyFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [treeName, setTreeName] = useState("");
  const [persons, setPersons] = useState<LocalPerson[]>([]);
  const [relations, setRelations] = useState<LocalRelation[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref för att läsa senaste edges synkront utan att trigga extra renders
  const edgesRef = useRef<Edge[]>([]);

  // Håll ref i sync med state
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

  const goToStep2 = useCallback(() => {
    if (treeName.trim()) setStep(2);
  }, [treeName]);

  // ── Lägg till person ────────────────────────────────────────────────────────
  // Läser edges via ref — inga nästlade state-uppdateringar, inga race conditions.
  const addPerson = useCallback((input: AddPersonInput) => {
    const localId = `local-${Date.now()}`;
    const person: LocalPerson = { localId, ...input };

    setPersons((prev) => [...prev, person]);

    setNodes((prevNodes) => {
      const newNodes = [...prevNodes, buildNode(person)];
      return applyDagreLayout(newNodes, edgesRef.current);
    });
  }, []);

  // ── Förälder → barn ─────────────────────────────────────────────────────────
  const connectPersons = useCallback(
    (parentLocalId: string, childLocalId: string) => {
      setRelations((prev) => {
        const exists = prev.some(
          (r) =>
            r.parentLocalId === parentLocalId &&
            r.childLocalId === childLocalId &&
            r.type === "parent-child",
        );
        if (exists) return prev;
        return [...prev, { parentLocalId, childLocalId, type: "parent-child" }];
      });

      const edgeId = `local-edge-${parentLocalId}-${childLocalId}`;
      if (edgesRef.current.find((e) => e.id === edgeId)) return;

      const newEdge: Edge = {
        id: edgeId,
        source: parentLocalId,
        target: childLocalId,
        type: "parent-child",
        animated: false,
        style: { stroke: "#6b7280" },
      };

      const updatedEdges = [...edgesRef.current, newEdge];
      setEdgesAndRef(updatedEdges);
      setNodes((prevNodes) => applyDagreLayout(prevNodes, updatedEdges));
    },
    [setEdgesAndRef],
  );

  // ── Partner ─────────────────────────────────────────────────────────────────
  const connectPartners = useCallback(
    (person1LocalId: string, person2LocalId: string) => {
      setRelations((prev) => {
        const exists = prev.some(
          (r) =>
            r.parentLocalId === person1LocalId &&
            r.childLocalId === person2LocalId &&
            r.type === "partner",
        );
        if (exists) return prev;
        return [
          ...prev,
          {
            parentLocalId: person1LocalId,
            childLocalId: person2LocalId,
            type: "partner",
          },
        ];
      });

      const edgeId = `local-partner-${person1LocalId}-${person2LocalId}`;
      if (edgesRef.current.find((e) => e.id === edgeId)) return;

      const newEdge: Edge = {
        id: edgeId,
        source: person1LocalId,
        target: person2LocalId,
        type: "partner",
        animated: false,
        style: { stroke: "#e879a0", strokeDasharray: "6 3" },
        label: "Partner",
      };

      // Partner-kanter påverkar inte dagre-layouten
      setEdgesAndRef([...edgesRef.current, newEdge]);
    },
    [setEdgesAndRef],
  );

  // ── Spara allt till backend ─────────────────────────────────────────────────
  const saveAll = useCallback(async (): Promise<number | null> => {
    setSaving(true);
    setError(null);
    try {
      const tree = await createFamilyTree({
        name: treeName,
        isPublic: false,
        ownerId: "",
      });

      const idMap = new Map<string, number>();
      for (const p of persons) {
        const created = await createPerson({
          firstName: p.firstName,
          lastName: p.lastName,
          gender: p.gender,
          familyTreeId: tree.id,
          birthDate: null,
          deathDate: null,
          profileImageUrl: null,
        });
        idMap.set(p.localId, created.id);
      }

      for (const relation of relations) {
        const id1 = idMap.get(relation.parentLocalId);
        const id2 = idMap.get(relation.childLocalId);
        if (id1 === undefined || id2 === undefined) continue;

        if (relation.type === "parent-child") {
          await createParentChildRelation({ parentId: id1, childId: id2 });
        } else if (relation.type === "partner") {
          const partnerRequest: CreatePartnerRelationRequest = {
            person1Id: id1,
            person2Id: id2,
            partnerType: 0,
          };
          await createPartnerRelation(partnerRequest);
        }
      }

      return tree.id;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Okänt fel vid sparning");
      return null;
    } finally {
      setSaving(false);
    }
  }, [treeName, persons, relations]);

  return {
    step,
    treeName,
    setTreeName,
    nodes,
    edges,
    saving,
    error,
    setNodes,
    setEdges: setEdgesAndRef,
    goToStep2,
    addPerson,
    connectPersons,
    connectPartners,
    saveAll,
  };
}
