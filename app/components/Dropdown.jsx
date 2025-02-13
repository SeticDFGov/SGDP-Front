import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ name, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-full "
      >
        {name}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
          <ul className="py-2 text-gray-700">
            {children}
          </ul>
        </div>
      )}
    </div>
  );
}
