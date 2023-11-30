import { BuildingType } from "./types";

export const options: { value: BuildingType; label: string }[] = [
  { value: "home", label: "Дом" },
  { value: "factory", label: "Завод" },
  { value: "hospital", label: "Больница" },
  { value: "solarPanel", label: "Солнечная панель" },
  { value: "windmill", label: "Ветряная мельница" },
];
