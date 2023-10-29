import React, { useMemo } from "react";
import { Building, BuildingType } from "../types";
import { clamp } from "../utils";

const getAvg = (arr: number[]) => {
  return arr.reduce((acc, cur) => acc + cur) / arr.length;
};

interface EnergyBalanceProps {
  forecasts: Record<string, number[]>;
  buildings: Building[];
}

export const EnergyBalance: React.FC<EnergyBalanceProps> = ({
  forecasts,
  buildings,
}) => {
  const avgForecast = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(forecasts).map(([key, value]) => [key, getAvg(value)])
      ),
    [forecasts]
  );

  const objectsCount = useMemo(
    () =>
      buildings.reduce((acc, cur) => {
        if (cur.type in acc) {
          acc[cur.type] += 1;
        } else {
          acc[cur.type] = 1;
        }

        return acc;
      }, {} as Record<BuildingType, number>),
    [buildings]
  );

  const energyProduction = useMemo(
    () =>
      (objectsCount["solarPanel"] ?? 0) * avgForecast["Солнце"] +
      (objectsCount["windmill"] ?? 0) * avgForecast["Ветер"],
    [avgForecast, objectsCount]
  );

  const energyConsumption = useMemo(
    () =>
      (objectsCount["home"] ?? 0) * avgForecast["Дома"] +
      (objectsCount["hospital"] ?? 0) * avgForecast["Больницы"] +
      (objectsCount["factory"] ?? 0) * avgForecast["Заводы"],
    [avgForecast, objectsCount]
  );

  const balance = useMemo(() => {
    if (energyConsumption === 0 && energyProduction === 0) return 50;

    return clamp(150 - energyConsumption / (energyProduction / 100), 0, 100);
  }, [energyConsumption, energyProduction]);

  return (
    <div className="mb-2 max-w-xs">
      <div className="h-2 bg-gradient-to-r relative from-red-600 via-yellow-400 to-green-600">
        <div
          className="absolute bg-white border border-zinc-600 rounded-sm w-2 h-5 top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
          style={{
            left: `${balance}%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span>Потребление ({energyConsumption.toFixed(2)})</span>
        <span>Производство ({energyProduction.toFixed(2)})</span>
      </div>
    </div>
  );
};
