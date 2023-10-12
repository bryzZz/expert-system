import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";

import { CSVToArray } from "../utils";

interface DropZoneProps {
  onChange: (forecasts: Record<string, number[]>) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onChange }) => {
  const onDrop = useCallback(
    (droppedFiles: File[]) => {
      droppedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          onChange(CSVToArray(reader.result as string));
        };
        reader.readAsText(file);
      });
    },
    [onChange]
  );
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: { "text/csv": [] },
      multiple: false,
    });

  return (
    <div {...getRootProps()} className="w-fit">
      <input {...getInputProps()} />

      <div
        className={twMerge(
          "flex items-center justify-center rounded-2xl py-8 px-16 flex-col border-2 border-dashed border-zinc-400",
          isDragActive && "border-zinc-600"
        )}
      >
        {acceptedFiles.length ? (
          <div>{acceptedFiles[0].name}</div>
        ) : (
          <>
            <p className="text-center leading-4 max-w-[170px] mb-[18px]">
              Перетащите csv файл в эту область
            </p>
            <button
              type="button"
              className="px-3 py-2 text-sm font-bold bg-blue-600 rounded text-white"
            >
              Выбрать файл
            </button>
          </>
        )}
      </div>
    </div>
  );
};
