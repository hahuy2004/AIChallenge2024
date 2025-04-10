import React from "react";
import { Tooltip } from 'react-tooltip'
import { Fragment, useState } from "react";
import { Combobox, Transition, Textarea } from "@headlessui/react";
import { HiChevronUpDown } from "react-icons/hi2";
import { AiOutlineCheck } from "react-icons/ai";


export default function Tabs({ queryHistory, handleHistory, selected, setSelected }) {
  const [query, setQuery] = useState("");
  const [currentRecord, setCurrentRecord] = useState(-1);

  const filteredHistory =
    query === ""
      ? queryHistory
      : queryHistory.filter((history) =>
        history.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, ""))
      );

  const handleSelectHistoryRecord = (history, index) => {
    setSelected(history);
    handleHistory(index);
    setCurrentRecord(index);
  }

  return (
    <div className="w-100 ml-4 rounded-lg w-[728px]">
      <div className="h-[90vh] flex flex-col overflow-y-scroll justify-start gap-y-3">
              {queryHistory.length === 0 
                ? <div className="relative cursor-default select-none mx-4 py-2 px-4 text-gray-700 bg-gray-200">
                    Search something first.
                  </div>
                : filteredHistory.length === 0 && query !== "" 
                  ? <div className="relative cursor-default select-none py-2 px-4 text-gray-700 bg-gray-200">
                    Nothing found.
                  </div>
                  : filteredHistory.map((history, index) => {
                    return <button type="button" key={index} 
                    className={`max-w-[600px] bg-gray-200 text-gray-900 p-2 rounded-md text-left hover:opacity-80 ${currentRecord === index ? "opacity-60" : ""}`}
                    onClick={() => handleSelectHistoryRecord(history, index)}
                    >
                      <h1 className="font-normal">ID: {index}</h1>
                      <h2 className="font-bold">Text: {history.name.replace("extra_", "")}</h2>
                      <h2 className="font-light">Is metadata used: {history.name.includes("extra_") === true ? "YES" : "NO"}</h2>
                    </button>
                  })}
            </div>
      <Tooltip anchorSelect="[data-tooltip-id]" place="left" className="z-50" />
    </div>
  );
}
