import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core';

import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useState } from 'react';
import type { Question } from '../../types';
import ProblemCardOverlay from './ProblemCardOverlay';
import SortableQuestionCard from './SortableQuestionCard';

interface RightPanelProps {
  selectedQuestions: Question[];
  removeSelectedQuestion: (id: string) => void;
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  onDragCancel: () => void;
  sensors: any;
  activeQuestion?: Question | null;
  onPrevStep: () => void;
}

const RightPanel = ({
  selectedQuestions,
  removeSelectedQuestion,
  onDragStart,
  onDragEnd,
  onDragCancel,
  sensors,
  activeQuestion,
  onPrevStep,
}: RightPanelProps) => {
  const [showAnswer, setShowAnswer] = useState(true);

  return (
    <div className="flex-1 h-full  bg-[#1D1D1D] border-gray-200 flex flex-col min-w-0">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h4 className="text-white font-semibold ">
          Selected problem list ({selectedQuestions.length} items)
        </h4>
        <div className="flex items-center gap-2">
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
                className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-amber-600 checked:border-amber-600"
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
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
                onRemoveQuestion={removeSelectedQuestion}
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
          className="px-5 flex-1 h-14 bg-white flex items-center justify-center gap-1 py-2 border text-[#FAAD14] border-[#FAAD14] rounded-md  hover:bg-gray-50"
        >
          <span>
            <RiArrowLeftSLine size={18} />
          </span>
          Previous
        </button>
        <button className="px-5 flex-1 h-14 flex items-center justify-center gap-1 py-2 bg-[#FAAD14] text-white rounded-md ">
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
