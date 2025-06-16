import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useCallback } from "react";

import ProblemCardOverlay from "./ProblemCardOverlay";
import SortableQuestionCard from "./SortableQuestionCard";
import type { Question } from "../../types";

interface NewQuestionTabProps {
  onAddQuestion: (question: Question) => void;
  availableQuestions: Question[];
  setAvailableQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  sensors: ReturnType<typeof useSensors>;
}

const NewQuestionTab = ({
  onAddQuestion,
  availableQuestions,
  setAvailableQuestions,
  sensors,
}: NewQuestionTabProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeQuestion = activeId
    ? availableQuestions.find((q) => q.id === activeId)
    : null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      if (active.id !== over.id) {
        setAvailableQuestions((prevSelected: Question[]) => {
          const oldIndex: number = prevSelected.findIndex(
            (q: Question) => q.id === active.id
          );
          const newIndex: number = prevSelected.findIndex(
            (q: Question) => q.id === over.id
          );

          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(prevSelected, oldIndex, newIndex);
          }
          return prevSelected;
        });
      }
      setActiveId(null);
    },
    [setAvailableQuestions]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleRemoveQuestionFromAvailable = (idToRemove: string) => {
    setAvailableQuestions((prevAvailable) => {
      return prevAvailable.filter((q: Question) => q.id !== idToRemove);
    });
  };
  return (
    <div className="space-y-4 ">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={availableQuestions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {availableQuestions.map((question, index) => (
            <SortableQuestionCard
              key={question.id}
              question={question}
              index={index}
              onRemoveQuestion={handleRemoveQuestionFromAvailable}
              onAddQuestion={onAddQuestion}
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
  );
};

export default NewQuestionTab;
