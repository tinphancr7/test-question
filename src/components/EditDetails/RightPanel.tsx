import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import type {
  DragStartEvent,
  DragEndEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";

import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { useState } from "react";
import type { Question } from "../../types";
import ProblemCardOverlay from "./ProblemCardOverlay";
import SortableQuestionCard from "./SortableQuestionCard";
import { FaCheck } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";

interface RightPanelProps {
  selectedQuestions: Question[];
  onRemoveSelectedQuestion: (id: string) => void;
  onRemoveAllSelectedQuestions: () => void;
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
  sensors: SensorDescriptor<SensorOptions>[];
  activeQuestion?: Question | null;
  onPrevStep: () => void;
  showRemoveAll?: boolean;
}

const RightPanel = ({
  selectedQuestions,
  onRemoveSelectedQuestion,
  onRemoveAllSelectedQuestions,
  onDragStart,
  onDragEnd,
  onDragCancel,
  sensors,
  activeQuestion,
  onPrevStep,
  showRemoveAll,
}: RightPanelProps) => {
  const [showAnswer, setShowAnswer] = useState(true);

  return (
    <div className="fixed top-0 right-0 w-[47vw] h-screen bg-[#1D1D1D] border-gray-200 flex flex-col z-10">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h4 className="text-white font-semibold ">
          Selected problem list ({selectedQuestions.length} items)
        </h4>
        <div className="flex items-center gap-2">
          {showRemoveAll && (
            <button
              onClick={onRemoveAllSelectedQuestions}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100"
            >
              <FaRegTrashAlt size={16} />
              <span>Delete all</span>
            </button>
          )}
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100">
            <span className="text-gray-700">A→Z</span>
            <span>Sort</span>
          </button>
          <div className="inline-flex items-center px-3 py-1  rounded bg-white gap-1 cursor-pointer text-sm">
            <label className="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                checked={showAnswer}
                onChange={(e) => setShowAnswer(e.target.checked)}
                className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FaCheck size={14} />
              </span>
            </label>
            <span className="text-gray-700">Show answer</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedQuestions.length === 0 && (
          <div className="text-center text-white py-10">
            No problems selected yet.
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <SortableContext
            items={selectedQuestions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {selectedQuestions.map((question, index) => (
              <SortableQuestionCard
                key={question.id}
                question={question}
                index={index}
                onRemoveQuestion={onRemoveSelectedQuestion}
                showAnswer={showAnswer}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeQuestion ? (
              <ProblemCardOverlay problem={activeQuestion} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <div className="p-4 border-t border-gray-200 flex justify-between gap-4 items-center bg-[#1D1D1D]">
        <button
          onClick={onPrevStep}
          className="px-5 flex-1 h-14 bg-white flex items-center justify-center gap-1 py-2 border text-primary border-primary rounded-md  hover:bg-gray-50"
        >
          <span>
            <RiArrowLeftSLine size={18} />
          </span>
          Previous
        </button>
        <button className="px-5 flex-1 h-14 flex items-center justify-center gap-1 py-2 bg-primary text-white rounded-md ">
          Next step
          <span>
            <RiArrowRightSLine size={18} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
