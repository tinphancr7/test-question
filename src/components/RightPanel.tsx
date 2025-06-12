import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableQuestionCard from "./SortableQuestionCard";
import {closestCenter, DndContext, DragOverlay} from "@dnd-kit/core";
import ProblemCardOverlay from "./ProblemCardOverlay";
import {RiArrowLeftSLine, RiArrowRightSLine} from "react-icons/ri";
import {useState} from "react";
import type {Question} from "../types";

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

export default function RightPanel({
	selectedQuestions,
	removeSelectedQuestion,
	onDragStart,
	onDragEnd,
	onDragCancel,
	sensors,
	activeQuestion,
	onPrevStep,
}: RightPanelProps) {
	const [showAnswer, setShowAnswer] = useState(true);

	return (
		<div className="flex-1 h-full  bg-[#1D1D1D] border-gray-200 flex flex-col min-w-0">
			<div className="p-4 border-b border-gray-200 flex items-center justify-between">
				<h3 className="text-white font-semibold ">
					Selected problem list ({selectedQuestions.length} items)
				</h3>
				<div className="flex items-center gap-2">
					<button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100">
						<span className="text-gray-700">A→Z</span>
						<span>Sort</span>
					</button>
					<label className="inline-flex items-center px-3 py-1  rounded bg-white gap-1 cursor-pointer text-sm">
						<input
							type="checkbox"
							checked={showAnswer}
							onChange={(e) => setShowAnswer(e.target.checked)}
							className="accent-yellow-500 text-white"
						/>
						<span className="text-gray-700">Show answer</span>
					</label>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{selectedQuestions.length === 0 && (
					<div className="text-center text-gray-500 py-10">
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
}
