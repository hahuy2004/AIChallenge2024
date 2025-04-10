import React from 'react'
import useDragger from "../hooks/useDragger";
import Image from "next/image"

function DragObject({type, id, handleMove, handleDelete}) {

  useDragger(id, handleMove)

  return (
    <div
      id={`${id}`}
      className="hover:border border-slate-900 transition select-none overflow-hidden resize box top-0 left-0 absolute h-[80px] w-[80px] cursor-pointer rounded-md"
      >
      <Image
        onDragStart={(e) => e.preventDefault()}
        src={`/icons/${type}.png`}
        alt="dragObject"
        sizes='100%'
        fill
        className=" select-none"
      />
      <button
        onClick={() => handleDelete(id)}
        className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 text-white text-xs"
      >
        X 
      </button>
    </div>
  );
}

export default DragObject