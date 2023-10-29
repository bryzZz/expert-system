import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";

interface GraphProps {
  lines: string[][];
}

export const Graph: React.FC<GraphProps> = ({ lines }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = lines
      .flat()
      .map((label) => ({
        id: label,
        label,
      }))
      .concat([
        { id: "station", label: "station" },
        { id: "sub station", label: "sub station" },
        { id: "1", label: "1" },
        { id: "2", label: "2" },
        { id: "3", label: "3" },
        { id: "4", label: "4" },
        { id: "5", label: "5" },
      ]);

    const edges = [
      { from: "station", to: "1" },
      { from: "station", to: "2" },
      { from: "station", to: "5" },
      { from: "5", to: "sub station" },
      { from: "sub station", to: "3" },
      { from: "sub station", to: "4" },
    ];

    lines.forEach((line, i) => {
      line.forEach((obj) => {
        edges.push({ from: i.toString(), to: obj });
      });
    });

    new Network(
      containerRef.current,
      { nodes, edges },
      { autoResize: true, height: "500px" }
    );
  }, [lines]);

  return (
    <div ref={containerRef} className="border rounded border-zinc-600"></div>
  );
};
