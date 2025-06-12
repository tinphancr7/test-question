import type {DragEndEvent, DragStartEvent} from "@dnd-kit/core";
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
import {useState} from "react";
import {Question} from "../types";
import ProblemCardOverlay from "./ProblemCardOverlay";
import SortableQuestionCard from "./SortableQuestionCard";
interface NewQuestionTabProps {
	onAddQuestion: (question: Question) => void;
	availableQuestions: Question[];
	setAvailableQuestions: (questions: Question[]) => void;
	sensors: ReturnType<typeof useSensors>;
}

export default function NewQuestionTab({
	onAddQuestion,
	availableQuestions,
	setAvailableQuestions,
	sensors,
}: NewQuestionTabProps) {
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

	function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string);
	}

	function handleDragEnd(event: DragEndEvent) {
		const {active, over} = event;
		if (!over) return;

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
}
