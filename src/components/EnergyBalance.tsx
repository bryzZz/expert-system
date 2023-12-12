import React, { useMemo } from "react";
import { Building } from "../types";
import { getEnergyBalance } from "../lib/getEnergyBalance";

const getHelperText = (energyConsumption: number, energyProduction: number) => {
  const delta = energyProduction - energyConsumption;

  if (delta < -7)
    return "У вас сильно не хватает электричества. Рекоммендуем купить электростанцию.";

  if (delta >= -6 && delta < -3)
    return "У вас не хватает электроэнергии. Рекоммендуем купить электростанцию или внимательно докупать электричество.";

  if (delta >= -2 && delta < -0.5)
    return "У вас немного не хватает электричества. Рекоммендуем докупать его самостоятельно.";

  if (delta >= -0.5 && delta <= 0.5)
    return "Ваше среднее энергопотребление сбалансировано. Рекоммендуем внимательно пользоваться накопителем.";

  if (delta > 0.5 && delta < 3)
    return "У вас могут образовываться излишки электроэнергии. Рекоммендуем вовремя их продавать.";

  return "У вас вырабатывается достаточно электроэнергии, чтобы купить больше построек.";
};

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
      <div className="max-w-xs">
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
      <p className="mb-2 text-sm text-neutral-800">
        {getHelperText(energyConsumption, energyProduction)}
      </p>
    </>
  );
};
