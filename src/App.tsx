import React, { useState } from "react";
import Select from "react-select";
import { DropZone } from "./components/DropZone";

const buildingTypes = [
  "home",
  "factory",
  "hospital",
  "solarPanel",
  "windmill",
] as const;
type BuildingType = (typeof buildingTypes)[number];

interface Building {
  type: BuildingType;
  price: number;
}

const options: { value: BuildingType; label: string }[] = [
  { value: "home", label: "Дом" },
  { value: "factory", label: "Завод" },
  { value: "hospital", label: "Больница" },
  { value: "solarPanel", label: "Солнечная панель" },
  { value: "windmill", label: "Ветряная мельница" },
];

export const App: React.FC = () => {
  const [forecasts, setForecasts] = useState({} as Record<string, number[]>);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [type, setType] = useState<BuildingType | "">("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "" || price === "") return;

    setBuildings((p) => [...p, { type, price: Number(price) }]);
    setType("");
    setPrice("");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  console.log(forecasts);

  return (
    <>
      <header className="border-b border-zinc-700">
        <div className="main-container py-3">
          <h1 className="text-2xl font-semibold">Super DUper Expert System</h1>
        </div>
      </header>

      <main className="main-container pt-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Загрузите прогнозы</h2>

          <DropZone onChange={setForecasts} />
        </div>

        <h2 className="text-lg font-semibold mb-2">Введите данные аукциона</h2>

        <div className="py-2 mb-2 flex flex-col gap-2 border-b border-zinc-700">
          {buildings.map(({ type, price }, i) => (
            <p key={i} className="text-lg">
              {options.find((opt) => opt.value === type)?.label} - {price}
            </p>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <label className="flex flex-col gap-1">
              Тип:
              <Select
                classNamePrefix="select"
                options={options}
                value={options.find((opt) => opt.value === type)}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(v) => setType(v?.value as any)}
                isSearchable={false}
              />
            </label>

            <label className="flex flex-col gap-1 w-full">
              Цена:
              <input
                className="border border-zinc-700 outline-none w-full max-w-[200px] rounded-sm px-2 py-[6px]"
                type="number"
                value={price}
                onChange={handlePriceChange}
                placeholder="Цена"
              />
            </label>
          </div>

          <button className="px-6 py-2 bg-blue-600 text-white rounded self-end">
            Submit
          </button>
        </form>
      </main>
    </>
  );
};
