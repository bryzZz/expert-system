import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";
import uniq from "lodash/uniq";

import Hospital from "../assets/icons/hospital.svg";
import House from "../assets/icons/house.svg";
import Factory from "../assets/icons/factory.svg";
import SolarPanel from "../assets/icons/solar-panel.svg";
import Windmill from "../assets/icons/windmill.svg";
import Station from "../assets/icons/station.svg";
import SubStation from "../assets/icons/sub-station.svg";

interface GraphProps {
  lines: string[][];
}

export const Graph: React.FC<GraphProps> = ({ lines }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = uniq(lines.flat())
      .map((label) => {
        const res = {
          id: label,
          label,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        if (label.startsWith("hospital")) {
          res.shape = "image";
          res.image = Hospital;
        }
        if (label.startsWith("home")) {
          res.shape = "image";
          res.image = House;
        }
        if (label.startsWith("factory")) {
          res.shape = "image";
          res.image = Factory;
        }
        if (label.startsWith("solarPanel")) {
          res.shape = "image";
          res.image = SolarPanel;
        }
        if (label.startsWith("windmill")) {
          res.shape = "image";
          res.image = Windmill;
        }

        return res;
      })
      .concat([
        { id: "station", label: "station", shape: "image", image: Station },
        {
          id: "sub station",
          label: "sub station",
          shape: "image",
          image: SubStation,
        },
        { id: "1", label: "1", color: "yellow", font: { color: "black" } },
        { id: "2", label: "2", color: "yellow", font: { color: "black" } },
        { id: "3", label: "3", color: "yellow", font: { color: "black" } },
        { id: "4", label: "4", color: "yellow", font: { color: "black" } },
        { id: "5", label: "5", color: "yellow", font: { color: "black" } },
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
        edges.push({ from: (i + 1).toString(), to: obj });
      });
    });

    new Network(
      containerRef.current,
      { nodes, edges },
      {
        autoResize: true,
        height: "500px",
        nodes: {
          font: { size: 20, color: "white" },
        },
      }
    );
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className="border bg-green-700 rounded border-zinc-600"
    ></div>
  );
};
