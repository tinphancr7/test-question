// src/App.tsx
import React, {useState} from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	DragOverlay,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type {DragStartEvent, DragEndEvent} from "@dnd-kit/core";

import {Question} from "./types";
import {initialQuestions} from "./data/questions"; // Dùng làm nguồn dữ liệu ban đầu
import TableRowOverlay from "./components/TableRowOverlay";
import ProblemCardOverlay from "./components/ProblemCardOverlay";
import SortableRow from "./components/SortableRow";
import SortableProblemCard from "./components/SortableProblemCard";
import NewQuestionTab from "./components/NewQuestionTab";

export default function App() {
	const [activeTab, setActiveTab] = useState("summary");
	const [activeId, setActiveId] = useState<string | null>(null);

	// State cho danh sách câu hỏi CÓ SẴN (chưa được chọn, hiển thị ở tab "New question")
	const [availableQuestions, setAvailableQuestions] =
		useState<Question[]>(initialQuestions);

	// State cho danh sách câu hỏi ĐÃ ĐƯỢC CHỌN (hiển thị ở panel bên phải)
	// Khởi tạo rỗng hoặc với một số câu hỏi mặc định nếu cần
	const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

	const sensors = useSensors(
		useSensor(MouseSensor, {activationConstraint: {distance: 8}}),
		useSensor(TouchSensor, {activationConstraint: {delay: 200, tolerance: 6}}),
		useSensor(KeyboardSensor)
	);

	const activeQuestion = activeId
		? availableQuestions.find((q) => q.id === activeId) ||
		  selectedQuestions.find((q) => q.id === activeId)
		: null;

	function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string);
	}

	function handleDragEnd(event: DragEndEvent) {
		const {active, over} = event;
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

	return (
		<div className="min-h-screen bg-gray-100 font-inter">
			<div className="flex w-full min-h-screen bg-white rounded-lg shadow-md overflow-hidden p-4">
				<div className="flex-1 flex flex-col min-w-0">
					<div className="w-full">
						<div className="flex border-b border-gray-200">
							<button
								className={`py-3 px-6 text-sm font-medium transition-colors duration-200 ${
									activeTab === "summary"
										? "text-indigo-600 border-b-2 border-indigo-600"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => setActiveTab("summary")}
							>
								Worksheet summary
							</button>
							<button
								className={`py-3 px-6 text-sm font-medium transition-colors duration-200 ${
									activeTab === "new-question"
										? "text-indigo-600 border-b-2 border-indigo-600"
										: "text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => setActiveTab("new-question")}
							>
								New question
							</button>
						</div>

						<div className="flex-1 overflow-y-auto">
							{activeTab === "summary" && (
								<div className="p-6">
									<div className="mb-8 p-4 bg-gray-50 rounded-lg">
										<h2 className="text-lg font-semibold text-gray-800 mb-2">
											Total Questions{" "}
											{availableQuestions.length + selectedQuestions.length}{" "}
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
									<div className="flex items-center space-x-4 mb-6">
										<div className="relative flex-grow">
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
										<button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
											Get more question
										</button>
									</div>
									<DndContext
										sensors={sensors}
										collisionDetection={closestCenter}
										onDragStart={handleDragStart}
										onDragEnd={handleDragEnd} // Kéo thả giữa các panel phức tạp hơn, tạm thời chỉ cho phép kéo thả trong cùng 1 panel
										onDragCancel={handleDragCancel}
									>
										<div className="overflow-x-auto rounded-lg border border-gray-200">
											<table className="min-w-full divide-y divide-gray-200">
												<thead className="bg-gray-50">
													<tr>
														<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"></th>
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
														items={availableQuestions.map((q) => q.id)}
														strategy={verticalListSortingStrategy}
													>
														{availableQuestions.map((question, index) => (
															<SortableRow
																key={question.id}
																question={question}
																index={index}
																onAddQuestion={handleAddQuestionToSelected}
																// Không cần isSelected nữa
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
							)}

							{activeTab === "new-question" && (
								<NewQuestionTab
									availableQuestions={availableQuestions}
									onAddQuestion={handleAddQuestionToSelected}
									onAddAllQuestions={handleAddAllQuestionsToSelected}
								/>
							)}
						</div>
					</div>
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
								{selectedQuestions.map((problem, index) => (
									<SortableProblemCard
										key={problem.id}
										problem={problem}
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
