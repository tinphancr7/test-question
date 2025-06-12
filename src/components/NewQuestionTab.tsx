import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Question } from "../types";
import ProblemCardOverlay from "./ProblemCardOverlay";
import SortableQuestionCard from "./SortableQuestionCard";
import TableRowOverlay from "./TableRowOverlay";
interface NewQuestionTabProps {
  onAddQuestion: (question: Question) => void;
  onAddAllQuestions: (questions: Question[]) => void;
  availableQuestions: Question[];
  setAvailableQuestions: (questions: Question[]) => void;
}

export default function NewQuestionTab({
  onAddQuestion,
  onAddAllQuestions,
  availableQuestions, // Sử dụng initialQuestions làm mặc định
  setAvailableQuestions, // Hàm này sẽ được cung cấp từ component cha
}: NewQuestionTabProps) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor)
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const activeQuestion = activeId
    ? availableQuestions.find((q) => q.id === activeId)
    : null;
  const filteredQuestions = availableQuestions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (question.questionText &&
        question.questionText.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddAll = () => {
    onAddAllQuestions(filteredQuestions); // Add tất cả các câu hỏi đang được lọc
    setSearchTerm(""); // Reset search term sau khi add all
  };
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    // Xử lý kéo thả TRONG CHÍNH panel Selected problem list
    if (active.id !== over.id) {
      setAvailableQuestions((prevSelected) => {
        const oldIndex = prevSelected.findIndex((q) => q.id === active.id);
        const newIndex = prevSelected.findIndex((q) => q.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(prevSelected, oldIndex, newIndex);
        }
        return prevSelected;
      });
    }
    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const handleRemoveQuestionFromAvailable = (idToRemove: string) => {
    setAvailableQuestions((prevAvailable) => {
      return prevAvailable.filter((q) => q.id !== idToRemove);
    });
  };
  return (
    <div className="space-y-4">
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
              onAddQuestion={onAddQuestion} // Hàm này sẽ được gọi khi người dùng kéo thả câu hỏi vào Selected problem list
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeQuestion ? (
            // Render overlay phù hợp với vị trí activeId được kéo từ đâu
            availableQuestions.some((q) => q.id === activeQuestion.id) ? (
              <ProblemCardOverlay problem={activeQuestion} />
            ) : (
              <TableRowOverlay question={activeQuestion} />
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
