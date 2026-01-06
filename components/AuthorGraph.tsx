"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { AuthorGraph as AuthorGraphType } from "@/lib/types";

// Layout configuration
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB", ranksep: 80, nodesep: 60 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 40,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

interface AuthorGraphProps {
  data: AuthorGraphType;
  onNodeClick?: (nodeId: string, nodeType: string) => void;
}

export default function AuthorGraph({ data, onNodeClick }: AuthorGraphProps) {
  // Convert graph data to React Flow format
  const initialNodes: Node[] = useMemo(
    () =>
      data.nodes.map((node) => ({
        id: node.id,
        type: node.type === "AUTHOR" ? "default" : "default",
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold">{node.label}</div>
              {node.metadata?.birthYear && (
                <div className="text-xs text-gray-500">
                  {node.metadata.birthYear}
                  {node.metadata.deathYear && ` - ${node.metadata.deathYear}`}
                </div>
              )}
              {node.metadata?.publicationYear && (
                <div className="text-xs text-gray-500">
                  {node.metadata.publicationYear}
                </div>
              )}
            </div>
          ),
        },
        position: { x: 0, y: 0 }, // Will be auto-laid out
        style: {
          background: node.type === "AUTHOR" ? "#dbeafe" : "#fef3c7",
          border: `2px solid ${node.type === "AUTHOR" ? "#3b82f6" : "#f59e0b"}`,
          borderRadius: "8px",
          padding: "12px",
          minWidth: "150px",
        },
      })),
    [data.nodes]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      data.edges.map((edge, idx) => ({
        id: `${edge.source}-${edge.target}-${idx}`,
        source: edge.source,
        target: edge.target,
        label: edge.type === "WROTE" ? "wrote" : "influenced",
        type: "smoothstep",
        animated: edge.type === "INFLUENCED",
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: {
          stroke: edge.type === "INFLUENCED" ? "#ef4444" : "#6b7280",
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: 11,
          fill: "#666",
        },
      })),
    [data.edges]
  );

  // Apply dagre layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(initialNodes, initialEdges);
  }, [initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const graphNode = data.nodes.find((n) => n.id === node.id);
      if (graphNode && onNodeClick) {
        onNodeClick(graphNode.id, graphNode.type);
      }
    },
    [data.nodes, onNodeClick]
  );

  return (
    <div className="w-full h-[600px] border border-gray-300 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const graphNode = data.nodes.find((n) => n.id === node.id);
            return graphNode?.type === "AUTHOR" ? "#3b82f6" : "#f59e0b";
          }}
        />
      </ReactFlow>
    </div>
  );
}
