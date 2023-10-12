import React, { useState } from "react";
import Select from "react-select";

const buildingTypes = ["home", "factory", "hospital"] as const;
type BuildingType = (typeof buildingTypes)[number];

const buildingNames: Record<BuildingType, string> = {
  home: "Дом",
  factory: "Завод",
  hospital: "Больница",
};

interface Building {
  type: BuildingType;
  price: number;
}

const options = [
  { value: "home", label: "Дом" },
  { value: "factory", label: "Завод" },
  { value: "hospital", label: "Больница" },
];

export const App: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);

  const [type, setType] = useState<BuildingType | "">("");
  const [price, setPrice] = useState("0");

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

  return (
    <>
      <header className="border-b border-zinc-700">
        <div className="main-container py-3">
          <h1 className="text-2xl font-semibold">Super DUper Expert System</h1>
        </div>
      </header>

      <main className="main-container pt-4">
        <h2 className="text-lg font-semibold mb-2">Введите данные аукциона</h2>

        <div className="py-2 mb-2 flex flex-col gap-2 border-b border-zinc-700">
          {buildings.map(({ type, price }) => (
            <p className="text-lg">
              {buildingNames[type]} - {price}
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
              />
            </label>

            <label className="flex flex-col gap-1 w-full">
              Цена:
              <input
                className="border border-zinc-700 outline-none w-full max-w-[200px] rounded-sm px-2 py-[6px]"
                type="number"
                value={price}
                onChange={handlePriceChange}
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
