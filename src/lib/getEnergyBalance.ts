import { Building } from "../types";
import { clamp } from "../utils";

export const getEnergyBalance = (
  avgForecasts: Record<string, number>,
  buildings: Building[]
) => {
  let res = 50;

  const maxSun = 10;
  const maxWind = 9;

  if (avgForecasts["Солнце"] >= maxSun) avgForecasts["Солнце"] = 15;
  else avgForecasts["Солнце"] = 15 * (avgForecasts["Солнце"] / maxSun);

  if (avgForecasts["Ветер"] >= maxWind) avgForecasts["Ветер"] = 15;
  else avgForecasts["Ветер"] = 15 * (avgForecasts["Ветер"] / maxWind);

  let avgReceive = 0,
    avgSpend = 0;

  for (const building of buildings) {
    switch (building.type) {
      case "home":
        avgSpend += avgForecasts["Дома"];
        break;
      case "factory":
        avgSpend += avgForecasts["Заводы"];
        break;
      case "hospital":
        avgSpend += avgForecasts["Больницы"];
        break;
      case "solarPanel":
        avgReceive += avgForecasts["Солнце"];
        break;
      case "windmill":
        avgReceive += avgForecasts["Ветер"];
        break;
    }
  }

  const diff = avgReceive - avgSpend;
  res += 50 * (diff / 2);

  return [avgReceive, avgSpend, clamp(res, 0, 100)];
};
