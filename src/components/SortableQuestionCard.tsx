import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Question } from "../types";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";

interface SortableQuestionCardProps {
  question: Question;
  index: number;
  onRemoveQuestion: (id: string) => void;
  onAddQuestion?: (question: Question) => void; // Optional, if you want to add functionality later
}

export default function SortableQuestionCard({
  question,
  index,
  onRemoveQuestion,
  onAddQuestion,
}: SortableQuestionCardProps) {
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
    <div
      ref={setNodeRef}
      style={style}
      className="border border-gray-200 rounded-lg shadow-sm"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MdDragIndicator size={18} className="cursor-move" />
          <span className="font-semibold text-gray-800">{index + 1}</span>
          <span className="text-sm text-gray-500">
            Question types: What is the man's question ({question.questionType})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="text-gray-400 hover:text-red-600"
            onClick={() => onRemoveQuestion(question.id)}
          >
            <FaRegTrashAlt size={18} />
          </button>
          {onAddQuestion && (
            <button
              className="px-3 py-1 border rounded-md bg-white"
              onClick={() => onAddQuestion(question)}
            >
              Add
            </button>
          )}
        </div>
      </div>
      <div className="p-3 grid grid-cols-[120px_1fr] gap-x-3 items-start">
        <div className="flex flex-col space-y-2">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {question.questionType}
          </span>
          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-800/10">
            Difficulty: {question.difficulty}
          </span>
        </div>
        <div className="col-span-1">
          {question.emailExcerpt && (
            <div className="mb-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-normal">
              <h4 className="font-semibold mb-1">Email Text (Excerpt)</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: question.emailExcerpt,
                }}
              />
            </div>
          )}
          <p className="text-gray-900 mb-3 font-medium whitespace-normal">
            Question: {question.questionText}
          </p>
        </div>
        <div className="col-start-2">
          <ul className="text-sm text-gray-700 space-y-1 mb-3">
            {question.answerChoices &&
              question.answerChoices.map((choice, idx) => (
                <li key={idx} className="flex items-center">
                  {choice}
                </li>
              ))}
          </ul>
        </div>
        <div className="col-start-1"></div>
        <div className="col-start-1">
          <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Correct Answer
          </span>
        </div>
        <div className="col-start-2">
          <p className="text-sm text-green-800 mb-3">
            {question.correctAnswer}
          </p>
        </div>
        <div className="col-start-1">
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/10">
            Explanation
          </span>
        </div>
        <div className="col-start-2">
          <p className="text-sm text-gray-700">{question.explanation}</p>
        </div>
      </div>
    </div>
  );
}
