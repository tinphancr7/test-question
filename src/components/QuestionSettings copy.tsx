import React, { useState } from "react";
import TreeMenu from "./TreeMenu";
import type { TreeMenuItem } from "./TreeMenu";

// Main App component
const QuestionSettingsV2 = () => {
  // Sample data for the course outline
  const initialCourseData = [
    {
      id: "toeic",
      label: "TOEIC",
      score: 50,
      isLocked: false,
      isChecked: false,
      children: [
        {
          id: "listening",
          label: "Listening",
          score: 25,
          isLocked: false,
          isChecked: false,
          children: [
            {
              id: "part-conversations",
              label: "Part : Conversations",
              score: 25,
              isLocked: false,
              isChecked: false,
              children: [
                {
                  id: "topic-office-communication",
                  label: "Topic : Office communication",
                  score: 25,
                  isLocked: false,
                  isChecked: false,
                  children: [
                    {
                      id: "context-meeting-rescheduling",
                      label: "Context : Meeting rescheduling",
                      score: 10,
                      isLocked: true,
                      isChecked: false,
                    },
                    {
                      id: "question-types-inference",
                      label:
                        "Question types : What is the man's problem ? ( inference )",
                      score: 40,
                      isLocked: false,
                      isChecked: false,
                      hasRedBadge: true,
                      redBadgeValue: "4 0",
                    },
                    {
                      id: "question-types-prediction",
                      label:
                        "Question types : What will the woman likely do next ? ( prediction )",
                      score: 8,
                      isLocked: false,
                      isChecked: false,
                    },
                  ],
                },
              ],
            },
            {
              id: "part-short-talks",
              label: "Part : Short Talks .",
              score: 25,
              isLocked: false,
              isChecked: false,
            },
          ],
        },
        {
          id: "reading",
          label: "Reading",
          score: 50,
          isLocked: false,
          isChecked: false,
          children: [
            {
              id: "part-reading-comprehension",
              label: "Part : Reading Comprehension",
              score: 50,
              isLocked: false,
              isChecked: false,
              children: [
                {
                  id: "emails",
                  label: "Emails",
                  score: 25,
                  isLocked: false,
                  isChecked: false,
                },
                {
                  id: "topic-advertisements",
                  label: "Topic : Advertisements",
                  score: 25,
                  isLocked: false,
                  isChecked: false,
                },
              ],
            },
          ],
        },
        {
          id: "grammar-toeic",
          label: "Grammar",
          score: null,
          isLocked: false,
          isChecked: false,
        },
      ],
    },
    {
      id: "ielts",
      label: "IELTS",
      score: null,
      isLocked: false,
      isChecked: false,
      children: [
        {
          id: "listening-ielts",
          label: "Listening",
          score: null,
          isLocked: false,
          isChecked: false,
        },
        {
          id: "reading-ielts",
          label: "Reading",
          score: null,
          isLocked: false,
          isChecked: false,
        },
        {
          id: "grammar-ielts",
          label: "Grammar",
          score: null,
          isLocked: false,
          isChecked: false,
        },
      ],
    },
  ];

  const [courseData, setCourseData] = useState<TreeMenuItem[]>(
    initialCourseData as TreeMenuItem[]
  );

  // Function to update an item's property (isChecked or score)
  const updateItem = (
    id: string,
    key: string,
    value: any,
    currentData: TreeMenuItem[]
  ): TreeMenuItem[] => {
    return currentData.map((item: TreeMenuItem) => {
      if (item.id === id) {
        return { ...item, [key]: value };
      } else if (item.children) {
        return { ...item, children: updateItem(id, key, value, item.children) };
      }
      return item;
    });
  };

  // Handle item property change (checkbox or score)
  const handleItemChange = (id: string, key: string, value: any) => {
    setCourseData((prevData) => updateItem(id, key, value, prevData));
  };

  // Custom render function for TreeMenu
  const renderTreeMenuItem = (
    item: TreeMenuItem,
    level: number,
    isExpanded: boolean,
    toggleExpand: () => void,
    onItemChange: (id: string, key: string, value: any) => void
  ) => {
    return (
      <div
        className={`flex items-center py-3 pr-4 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
          level === 0 ? "bg-gray-50" : ""
        }`}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        onClick={toggleExpand}
      >
        <div className="flex-shrink-0 w-6">
          {item.children && item.children.length > 0 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-3 flex-shrink-0"
          checked={item.isChecked}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            onItemChange(item.id, "isChecked", e.target.checked);
          }}
        />
        <span className="flex-grow text-sm sm:text-base text-gray-800 truncate">
          {item.label}
        </span>
        <div className="flex items-center ml-auto pr-4 flex-shrink-0">
          {item.score !== null && item.score !== undefined && (
            <input
              type="number"
              className={`w-16 text-center border rounded-md px-1 py-0.5 text-gray-700 font-medium text-sm sm:text-base mr-2 ${
                item.isLocked
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              value={item.score}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const newScore = parseInt(e.target.value, 10);
                onItemChange(
                  item.id,
                  "score",
                  isNaN(newScore) ? null : newScore
                );
              }}
              readOnly={item.isLocked}
            />
          )}
          {item.isLocked ? (
            <span className="ml-1">🔒</span>
          ) : (
            <span className="ml-1">🔓</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="font-inter flex justify-center items-start">
      <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <TreeMenu
          data={courseData}
          onItemChange={handleItemChange}
          renderItem={renderTreeMenuItem}
        />
      </div>
    </div>
  );
};

export default QuestionSettingsV2;
