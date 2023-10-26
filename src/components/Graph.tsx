import React, { useEffect, useRef } from "react";
import { Graph as DGraph, Layout, Renderer } from "graphdracula";

interface GraphProps {
  lines: string[][];
}

export const Graph: React.FC<GraphProps> = ({ lines }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flagRef = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (flagRef.current) {
      document.querySelector(".Graph > *")?.remove();
    }

    const width = containerRef.current.clientWidth;

    const graph = new DGraph();

    for (let i = 0; i < lines.length; i++) {
      for (const object of lines[i]) {
        graph.addEdge((i + 1).toString(), object);
      }
    }

    graph.addEdge("sub station", "3");
    graph.addEdge("sub station", "4");

    graph.addEdge("station", "1");
    graph.addEdge("station", "2");

    graph.addEdge("station", "5");
    graph.addEdge("5", "sub station");

    const layout = new Layout.Spring(graph);
    const renderer = new Renderer.Raphael(".Graph", graph, width, 600);

    layout.layout();
    renderer.draw();

    flagRef.current = true;
  }, [lines]);

  return (
    <div ref={containerRef} className="Graph border border-zinc-600"></div>
  );
};
