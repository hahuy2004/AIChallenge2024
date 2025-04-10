// src/components/Sidebar.js
import React from "react";
import NavigationButton from "./NavigationButton";
import { FaSearch, FaImage, FaHistory, FaPaperPlane, FaRobot } from "react-icons/fa";

const NavigationSidebar = ({activeContent, handleContentChange }) => {
  return (
    <div
      className="fixed inset-y-20 left-0 w-50 bg-gray-200 p-4" 
    >
      <NavigationButton
        icon={<FaSearch size={24} />}
        onClick={() => handleContentChange("metadata")}
        isActive={activeContent === "metadata"}
      >
        Metadata Search
      </NavigationButton>
      <NavigationButton
        icon={<FaImage size={24} />}
        onClick={() => handleContentChange("image")}
        isActive={activeContent === "image"}
      >
        Image Search
      </NavigationButton>
      <NavigationButton
        icon={<FaRobot size={24} />}
        onClick={() => handleContentChange("chatbot")}
        isActive={activeContent === "chatbot"}
      >
        ChatBot
      </NavigationButton>
      <NavigationButton
        icon={<FaHistory size={24} />}
        onClick={() => handleContentChange("history")}
        isActive={activeContent === "history"}
      >
        History
      </NavigationButton>
      <NavigationButton
        icon={<FaPaperPlane size={24} />}
        // onClick={() => handleContentChange("submit")}
        onClick={() => window.open('/submit', '_blank')}
        isActive={activeContent === "submit"}
      >
        Submit
      </NavigationButton>
    </div>
  );
};

export default NavigationSidebar;
