export const buildingTypes = [
  "home",
  "factory",
  "hospital",
  "solarPanel",
  "windmill",
] as const;
export type BuildingType = (typeof buildingTypes)[number];

export interface Building {
  type: BuildingType;
  price: number;
}
