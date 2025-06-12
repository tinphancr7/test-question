// src/components/SortableRow.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Question } from "../types";

interface SortableRowProps {
  question: Question;
  index: number;
  onAddQuestion: (question: Question) => void;
  // isSelected prop không còn cần thiết cho luồng này
}

export default function SortableRow({
  question,
  index,
  onAddQuestion,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging ? "#e0e7ff" : "",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-gray-50"
      {...attributes}
      {...listeners}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {question.difficulty}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {question.problemType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div>{question.title}</div>
        <div className="text-xs text-gray-500">{question.category}</div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-center cursor-move">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-gray-400 mx-auto"
        >
          <path
            fillRule="evenodd"
            d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM10.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
            clipRule="evenodd"
          />
        </svg>
      </td>
    </tr>
  );
}
