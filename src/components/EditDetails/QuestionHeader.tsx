// components/QuestionHeader.tsx
import React from "react";
import { IoSearch } from "react-icons/io5";

interface QuestionHeaderProps {
  searchPlaceholder?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGetMoreClick?: () => void;
  onAddAllClick?: () => void;
  showAddAll?: boolean;
}

const QuestionHeader = ({
  searchPlaceholder = "Search",
  onSearchChange,
  onGetMoreClick,
  onAddAllClick,
  showAddAll = false,
}: QuestionHeaderProps) => {
  return (
    <div className="flex items-center justify-between py-3 ">
      <div className="relative w-[300px]">
        <input
          type="text"
          placeholder={searchPlaceholder}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 h-10 border border-gray-300 rounded-md focus:outline-none"
        />
        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

      <div className="flex gap-2 h-10">
        <button
          onClick={onGetMoreClick}
          className="px-6 py-2 bg-transparent border-primary rounded-lg border text-primary transition-colors duration-200"
        >
          Get more question
        </button>

        {showAddAll && (
          <button
            onClick={onAddAllClick}
            className="py-2 px-4 bg-primary text-white rounded-lg transition-colors duration-200"
          >
            Add all
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionHeader;
