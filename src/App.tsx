import React, { useState } from "react";

import { DropZone } from "./components/DropZone";
import { getTopology } from "./lib/getTopology";
import { Graph } from "./components/Graph";
import { Building, BuildingType } from "./types";
import { EnergyBalance } from "./components/EnergyBalance";
import { ForecastsChart } from "./components/ForecastsChart";
import { BuildingForm } from "./components/BuildingForm";
import { options } from "./constants";

export const App: React.FC = () => {
  const [forecasts, setForecasts] = useState<null | Record<string, number[]>>(
    null
  );
  const [buildings, setBuildings] = useState<Building[]>([]);

  const [lines, setLines] = useState<string[][] | null>(null);

  const handleSubmit = (type: BuildingType, price: string) => {
    setBuildings((p) => [...p, { type, price: Number(price) }]);
  };

  const handleConstructClick = () => {
    if (!forecasts) return;

    const objectsCount = buildings.reduce((acc, cur) => {
      if (cur.type in acc) {
        acc[cur.type] += 1;
      } else {
        acc[cur.type] = 1;
      }

      return acc;
    }, {} as Record<BuildingType, number>);

    setLines(getTopology(forecasts, objectsCount));
  };

  return (
    <>
      <header className="border-b border-zinc-700">
        <div className="main-container py-3">
          <h1 className="text-2xl font-semibold">Super DUper Expert System</h1>
        </div>
      </header>

      <main className="main-container pt-4 pb-32">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Загрузите прогнозы</h2>

          <div className="flex gap-4 flex-col md:flex-row">
            <DropZone onChange={setForecasts} />

            {forecasts && <ForecastsChart data={forecasts} />}
          </div>
        </div>

        {buildings.length !== 0 && (
          <>
            <h2 className="text-lg font-semibold mb-2">Куплено</h2>

            <div className="mb-2 pb-2 flex flex-col gap-2 border-b border-zinc-700">
              {buildings.map(({ type, price }, i) => (
                <p key={i} className="text-lg">
                  {options.find((opt) => opt.value === type)?.label} - {price}
                </p>
              ))}
            </div>
          </>
        )}

        <BuildingForm onSubmit={handleSubmit} />

        {forecasts && (
          <EnergyBalance forecasts={forecasts} buildings={buildings} />
        )}

        <button
          onClick={handleConstructClick}
          className="px-6 py-2 bg-blue-600 text-white rounded self-end mb-2"
        >
          Construct graph
        </button>

        {lines && <Graph lines={lines} />}
      </main>
    </>
  );
};
