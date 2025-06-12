// src/App.tsx
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

import { Tab, Tabs } from "@heroui/react";
import NewQuestionTab from "./components/NewQuestionTab";
import ProblemCardOverlay from "./components/ProblemCardOverlay";
import SortableQuestionCard from "./components/SortableQuestionCard";
import SortableRow from "./components/SortableRow";
import Summary from "./components/Summary";
import TableRowOverlay from "./components/TableRowOverlay";
import { Question } from "./types";
import { initialQuestions } from "./data/questions";
export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [availableQuestions, setAvailableQuestions] =
    useState<Question[]>(initialQuestions);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor)
  );

  const activeQuestion = activeId
    ? selectedQuestions.find((q) => q.id === activeId)
    : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    // Xử lý kéo thả TRONG CHÍNH panel Selected problem list
    if (active.id !== over.id) {
      setSelectedQuestions((prevSelected) => {
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

  // Hàm thêm câu hỏi vào danh sách đã chọn và xóa khỏi danh sách có sẵn
  const handleAddQuestionToSelected = (questionToAdd: Question) => {
    setSelectedQuestions((prevSelected) => {
      // Chỉ thêm nếu câu hỏi chưa có trong danh sách được chọn
      if (!prevSelected.some((q) => q.id === questionToAdd.id)) {
        return [...prevSelected, questionToAdd];
      }
      return prevSelected;
    });

    // Xóa câu hỏi khỏi danh sách có sẵn
    setAvailableQuestions((prevAvailable) =>
      prevAvailable.filter((q) => q.id !== questionToAdd.id)
    );
  };

  // Hàm thêm TẤT CẢ câu hỏi đang hiển thị/lọc vào danh sách đã chọn
  const handleAddAllQuestionsToSelected = (questionsToAdd: Question[]) => {
    setSelectedQuestions((prevSelected) => {
      const newQuestions = questionsToAdd.filter(
        (q) => !prevSelected.some((sq) => sq.id === q.id)
      );
      return [...prevSelected, ...newQuestions];
    });

    // Xóa tất cả các câu hỏi đã thêm khỏi danh sách có sẵn
    setAvailableQuestions((prevAvailable) =>
      prevAvailable.filter((q) => !questionsToAdd.some((qa) => qa.id === q.id))
    );
  };

  // Hàm xóa câu hỏi khỏi danh sách đã chọn và đưa nó trở lại danh sách có sẵn
  const handleRemoveQuestionFromSelected = (idToRemove: string) => {
    let removedQuestion: Question | undefined;
    setSelectedQuestions((prevSelected) => {
      const updatedSelected = prevSelected.filter((q) => {
        if (q.id === idToRemove) {
          removedQuestion = q;
          return false;
        }
        return true;
      });
      return updatedSelected;
    });

    if (removedQuestion) {
      setAvailableQuestions((prevAvailable) => {
        // Đảm bảo không thêm trùng lặp nếu somehow đã tồn tại
        if (!prevAvailable.some((q) => q.id === removedQuestion!.id)) {
          // Đưa câu hỏi trở lại danh sách có sẵn, có thể sắp xếp lại theo id hoặc vị trí ban đầu
          // Ở đây đơn giản là thêm vào cuối
          return [...prevAvailable, removedQuestion!];
        }
        return prevAvailable;
      });
    }
  };
  const [selected, setSelected] = useState("new-question");

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <div className="flex w-full min-h-screen bg-white rounded-lg shadow-md overflow-hidden ">
        <div className="flex-1">
          <Tabs
            fullWidth
            aria-label="Tabs form"
            selectedKey={selected}
            variant="light"
            size="md"
            classNames={{
              cursor: "bg-[#F5F7FA] ",
              base: "px-2.5 pt-3",
            }}
            onSelectionChange={setSelected}
          >
            <Tab key="summary" title="Worksheet summary">
              <div className="border-t py-4">
                <Summary />
              </div>
              <div>
                <div className="flex items-center justify-between py-3 px-6">
                  <div className="relative w-[300px] ">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <button className="px-6 py-2 bg-transparent border-[#D48806] rounded-lg border text-[#D48806] transition-colors duration-200">
                    Get more question
                  </button>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                >
                  <div className="overflow-x-auto ">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Difficulty
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Problem type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <SortableContext
                          items={selectedQuestions.map((q) => q.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {selectedQuestions.map((question, index) => (
                            <SortableRow
                              key={question.id}
                              question={question}
                              index={index}
                              onAddQuestion={handleAddQuestionToSelected}
                            />
                          ))}
                        </SortableContext>
                      </tbody>
                    </table>
                  </div>
                  <DragOverlay>
                    {activeQuestion ? (
                      <TableRowOverlay question={activeQuestion} />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            </Tab>
            <Tab key="new-question" title="New question">
              <div className="border-t py-4">
                <Summary />
              </div>
              <NewQuestionTab
                availableQuestions={availableQuestions}
                setAvailableQuestions={setAvailableQuestions}
                onAddQuestion={handleAddQuestionToSelected}
                onAddAllQuestions={handleAddAllQuestionsToSelected}
              />
            </Tab>
          </Tabs>
        </div>
        <div className="flex-1 border-l border-gray-200 flex flex-col min-w-0">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-800">
              Selected problem list ({selectedQuestions.length} items)
            </h3>
            <div className="flex items-center space-x-3">
              <button className="text-gray-400 hover:text-gray-600">
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
                  className="lucide lucide-list-filter"
                >
                  <path d="M2.5 10h19" />
                  <path d="M6.5 6h11" />
                  <path d="M10.5 14h3" />
                  <path d="M12 2v20" />
                </svg>
              </button>
              <div className="flex items-center">
                <span className="text-gray-700 text-sm mr-2">Show answer</span>
                <input
                  type="checkbox"
                  id="checkbox-show-answer"
                  className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedQuestions.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No problems selected yet. Add some from the left panel or the
                "New question" tab!
              </div>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
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
                    onRemoveQuestion={handleRemoveQuestionFromSelected}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeQuestion ? (
                  // Render overlay phù hợp với vị trí activeId được kéo từ đâu
                  selectedQuestions.some((q) => q.id === activeQuestion.id) ? (
                    <ProblemCardOverlay problem={activeQuestion} />
                  ) : (
                    <TableRowOverlay question={activeQuestion} />
                  )
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-white">
            <button className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              Previous
            </button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
              Next step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
