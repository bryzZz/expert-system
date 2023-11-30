import React, { useState } from "react";
import Select from "react-select";

import { BuildingType } from "../types";
import { options } from "../constants";

interface BuildingFormProps {
  onSubmit: (type: BuildingType, price: string) => void;
}

export const BuildingForm: React.FC<BuildingFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<BuildingType | "">("");
  const [price, setPrice] = useState("");

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.includes(".") && value.split(".")[1].length > 2) return;

    setPrice(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "" || price === "") return;

    onSubmit(type, price);

    setType("");
    setPrice("");
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Введите данные аукциона</h2>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 flex-wrap mb-2"
      >
        <div className="flex items-center gap-2">
          <label className="flex flex-col gap-1">
            Тип:
            <Select
              classNamePrefix="select"
              options={options}
              value={options.find((opt) => opt.value === type) ?? null}
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
              step={0.01}
            />
          </label>
        </div>

        <button className="px-6 py-2 bg-blue-600 text-white rounded self-end">
          Submit
        </button>
      </form>
    </>
  );
};
