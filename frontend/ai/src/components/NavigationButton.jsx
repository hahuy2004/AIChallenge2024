import React from "react";

const NavigationButton = ({icon, children, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex flex-col items-center py-4 px-2 mb-4 rounded focus:outline-none ${
        isActive
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
        <div className="mb-1">{icon}</div>
        <span>{children}</span>
    </button>
  );
};

export default NavigationButton;
