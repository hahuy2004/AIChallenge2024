import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { words } from "../helper/words";
import trie from "trie-prefix-tree";

function SearchTag({ addTag, bgColor }) {
  let trie = require("trie-prefix-tree");
  let tagTrie = trie(words);
  const [activeSearch, setActiveSearch] = useState(words.slice(0,50));

  const handleChange = (e) => {
    if (e.target.value === "") setActiveSearch(words.slice(0, 50));
    else setActiveSearch(tagTrie.getPrefix(e.target.value));
  };

  return (
    <div className="flex flex-wrap relative h-full w-full hover:ease-in-out transition-all ">
      <input
        type="search"
        placeholder="Search for tags"
        className={`h-fit transition-all hover:drop-shadow-[0px_2px_1px_rgba(255,255,255,0.2)] placeholder:italic text-lg w-full p-1 pl-4 rounded-full transition-colors duration-300 ${
          bgColor ? "text-black font-bold bg-slate-200" : "text-slate-300 bg-slate-800"
        }`}
        onChange={(e) => handleChange(e)}
      ></input>
      {activeSearch.length > 0 && (
        <div className={`h-[75px] overflow-auto flex-wrap p-1 gap-1 w-full rounded-md flex-auto flex transition-colors duration-300 ${bgColor ? "text-black font-bold bg-slate-200" : "bg-slate-800 text-white"} `}>
          {activeSearch.map((tag) => (
            <span
              key={tag}
              onClick={() => addTag(tag)}
              className={`h-fit relative cursor-pointer hover:ring-2 ring-slate-400 w-max p-0.5 rounded-md transition-colors duration-300 ${bgColor ? "text-black font-bold bg-slate-400" : "bg-slate-700"}`}
            >
              {tag.replace("_", " ")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchTag;
