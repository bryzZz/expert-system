import React, { useMemo } from "react";
import { Building } from "../types";
import { getEnergyBalance } from "../lib/getEnergyBalance";

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

  const [energyProduction, energyConsumption, balance] = useMemo(
    () => getEnergyBalance(structuredClone(avgForecast), buildings),
    [avgForecast, buildings]
  );

  return (
    <>
      <h3 className="text-base font-semibold mb-2">
        Баланс энергопотребления (МВт за такт в среднем)
      </h3>
      <div className="mb-2 max-w-xs">
        <div className="h-2 bg-gradient-to-r relative from-cyan-600 to-yellow-400 via-green-600">
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
    </>
  );
};
