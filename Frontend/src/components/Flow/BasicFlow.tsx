import { useState, useCallback } from 'react';
import '@xyflow/react/dist/style.css';
import { 
    ReactFlow, 
    applyNodeChanges, 
    applyEdgeChanges, 
    addEdge, 
    type Node, 
    type Edge, 
    type Connection, 
    type NodeChange } from '@xyflow/react';

const initialNodes: Node[] = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
    { id: 'n3', position: { x: 0, y: 200 }, data: { label: 'Node 3' } },
    { id: 'n4', position: { x: 0, y: 300 }, data: { label: 'Node 4' } },
];
const initialEdges: Edge[] = [
    { id: 'n1-n2', source: 'n1', target: 'n2' },
    { id: 'n2-n3', source: 'n2', target: 'n3' },
    { id: 'n3-n4', source: 'n3', target: 'n4' }
];

export default function BasicFlow() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // Handlers for node and edge changes, and for connecting nodes
    const onNodesChange = useCallback(
        (changes: NodeChange<Node>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );

    // The onEdgesChange handler updates the edges state when edges are added, removed, or changed.
    // The onConnect handler adds a new edge when two nodes are connected.
    const onEdgesChange = useCallback((
        changes: Parameters<typeof applyEdgeChanges>[0]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), [],
    );

    // The onConnect handler adds a new edge to the edges state when a connection is made between two nodes.
    // It uses the addEdge function from React Flow to create the new edge based on the connection parameters.
    const onConnect = useCallback((params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), [],
    );

    return (
        <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        />
        </div>
    );
}