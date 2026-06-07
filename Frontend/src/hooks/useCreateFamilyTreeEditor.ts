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
const GROUND_OFFSET = 120; // Förskjut noder ovanför Y=0 (marklinjen)

interface LocalPerson {
  localId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string | null;
  deathDate: string | null;
}

type RelationType = "parent-child" | "partner";

interface LocalRelation {
  parentLocalId: string;
  childLocalId: string;
  type: RelationType;
}

export interface AddPersonInput {
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string | null;
  deathDate: string | null;
}

// ── Layout ────────────────────────────────────────────────────────────────────
//
// Kör Dagre och förskjuter sedan alla noder uppåt så att de hamnar
// ovanför marklinjen (Y=0). Levande noder → negativa Y-värden.

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  if (nodes.length === 0) return nodes;

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ direction: "TB", nodesep: 40, ranksep: 120 });

  nodes.forEach((n) =>
    graph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }),
  );

  // Bara förälder-barn-kanter påverkar Dagre-layouten
  edges
    .filter((e) => !e.id.startsWith("local-partner-"))
    .forEach((e) => graph.setEdge(e.source, e.target));

  dagre.layout(graph);

  const laid = nodes.map((n) => {
    const { x, y } = graph.node(n.id);
    return {
      ...n,
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
    };
  });

  // Hitta det lägsta Y+höjd-värdet (botten på trädet)
  const maxY = laid.reduce(
    (max, n) => Math.max(max, n.position.y + NODE_HEIGHT),
    0,
  );

  // Förskjut hela gruppen uppåt så att botten hamnar vid -GROUND_OFFSET
  return laid.map((n) => ({
    ...n,
    position: {
      x: n.position.x,
      y: n.position.y - maxY - GROUND_OFFSET,
    },
  }));
}

// ── Node-builder ──────────────────────────────────────────────────────────────
//
// Sätter INTE inline style — PersonNode/DeceasedPersonNode hanterar
// sin egen styling baserat på data.person.gender och data.person.deathDate.

function buildNode(person: LocalPerson): Node {
  const isDeceased = person.deathDate !== null;

  return {
    id: person.localId,
    type: isDeceased ? "deceased" : "person",
    position: { x: 0, y: 0 },
    data: {
      person: {
        id: 0,
        firstName: person.firstName,
        lastName: person.lastName,
        gender: person.gender,
        birthDate: person.birthDate,
        deathDate: person.deathDate,
        profileImageUrl: null,
        familyTreeId: 0,
        createdDate: "",
        updatedDate: null,
      },
    },
    // Ingen style här — undviker dubbel styling ovanpå nodkomponentens egna stil
    style: { width: NODE_WIDTH },
  };
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCreateFamilyFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [treeName, setTreeName] = useState("");
  const [persons, setPersons] = useState<LocalPerson[]>([]);
  const [relations, setRelations] = useState<LocalRelation[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const goToStep2 = useCallback(() => {
    if (treeName.trim()) setStep(2);
  }, [treeName]);

  const addPerson = useCallback((input: AddPersonInput) => {
    const localId = `local-${Date.now()}`;
    const person: LocalPerson = { localId, ...input };

    setPersons((prev) => [...prev, person]);
    setNodes((prevNodes) => {
      const newNodes = [...prevNodes, buildNode(person)];
      return applyDagreLayout(newNodes, edgesRef.current);
    });
  }, []);

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
        type: "family",
        animated: false,
        style: { stroke: "#3d2202" },
      };

      const updatedEdges = [...edgesRef.current, newEdge];
      setEdgesAndRef(updatedEdges);
      setNodes((prevNodes) => applyDagreLayout(prevNodes, updatedEdges));
    },
    [setEdgesAndRef],
  );

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
      };

      setEdgesAndRef([...edgesRef.current, newEdge]);
    },
    [setEdgesAndRef],
  );

  const saveAll = useCallback(async (): Promise<number | null> => {
    setSaving(true);
    setError(null);
    try {
      const tree = await createFamilyTree({ name: treeName, isPublic: false });

      const idMap = new Map<string, number>();
      for (const p of persons) {
        const created = await createPerson({
          firstName: p.firstName,
          lastName: p.lastName,
          gender: p.gender,
          familyTreeId: tree.id,
          birthDate: p.birthDate,
          deathDate: p.deathDate,
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
          const req: CreatePartnerRelationRequest = {
            person1Id: id1,
            person2Id: id2,
            partnerType: 0,
          };
          await createPartnerRelation(req);
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
