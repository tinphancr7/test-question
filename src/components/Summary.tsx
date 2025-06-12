import React from "react";

const Summary = () => {
  return (
    <div className="mx-6 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Total Questions 1000
        {/* Tổng số câu hỏi */}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        16 Multiple choice - 84 Fill in the blank (Placeholder)
      </p>

      <div className="flex justify-between items-center text-xs font-medium text-gray-700 mb-2">
        <span>40 question</span>
        <span>40 question</span>
        <span>40 question</span>
        <span>40 question</span>
        <span>40 question</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden mb-3">
        <div className="bg-red-500 w-1/5"></div>
        <div className="bg-orange-400 w-1/5"></div>
        <div className="bg-yellow-400 w-1/5"></div>
        <div className="bg-lime-400 w-1/5"></div>
        <div className="bg-green-500 w-1/5"></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
          <span>Very Hard</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-orange-400 mr-1"></span>
          <span>Hard</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
          <span>Medium</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-lime-400 mr-1"></span>
          <span>Lower-Medium</span>
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          <span>Normal</span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
