import { Switch } from "@headlessui/react";
import { FaMoon } from 'react-icons/fa'; // For moon icon

export default function Example({ bgColor, setBgColor }) {
  return (
    <div className="">
      <Switch
        checked={bgColor}
        onChange={setBgColor}
        className={`${bgColor ? "bg-yellow-500 border border-transparent" : "bg-gray-800"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${bgColor ? "translate-x-9" : "translate-x-0"}
            flex justify-center items-center
            pointer-events-none inline-flex h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        >
          {bgColor ? (
            <div className="bg-black w-full h-full rounded-full"></div> // Black circle for true state
          ) : (
            <FaMoon className="text-yellow-400" /> // Moon icon for false state
          )}
        </span>
      </Switch>
    </div>
  );
}
