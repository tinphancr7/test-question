// src/App.tsx
import {
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import {useMemo, useState} from "react";

import {Tab, Tabs} from "@heroui/react";
import {initialQuestions} from "../../data/questions";
import type {Question} from "../../types";
import Summary from "./Summary";
import QuestionHeader from "./QuestionHeader";
import WorksheetSummaryTab from "./WorksheetSummaryTab";
import NewQuestionTab from "./NewQuestionTab";
import RightPanel from "./RightPanel";

const EditDetails = ({onPrevStep}: {onPrevStep: () => void}) => {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
	const [availableQuestions, setAvailableQuestions] =
		useState<Question[]>(initialQuestions);
	const [selected, setSelected] = useState("new-question");

	const sensors = useSensors(
		useSensor(MouseSensor, {activationConstraint: {distance: 8}}),
		useSensor(TouchSensor, {
			activationConstraint: {delay: 200, tolerance: 6},
		}),
		useSensor(KeyboardSensor)
	);

	const activeQuestion = useMemo(
		() => (activeId ? selectedQuestions.find((q) => q.id === activeId) : null),
		[activeId, selectedQuestions]
	);

	const handleDragStart = (event: any) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: any) => {
		const {active, over} = event;
		if (!over) return;
		if (active.id !== over.id) {
			setSelectedQuestions((prev) => {
				const oldIndex = prev.findIndex((q) => q.id === active.id);
				const newIndex = prev.findIndex((q) => q.id === over.id);
				return oldIndex !== -1 && newIndex !== -1
					? arrayMove(prev, oldIndex, newIndex)
					: prev;
			});
		}
		setActiveId(null);
	};

	const handleDragCancel = () => setActiveId(null);

	const addQuestionToSelected = (question: Question) => {
		setSelectedQuestions((prev) =>
			prev.some((q) => q.id === question.id) ? prev : [...prev, question]
		);
		setAvailableQuestions((prev) => prev.filter((q) => q.id !== question.id));
	};

	const addAllToSelected = (questions: Question[]) => {
		setSelectedQuestions((prev) => {
			const newQs = questions.filter((q) => !prev.some((pq) => pq.id === q.id));
			return [...prev, ...newQs];
		});
		setAvailableQuestions((prev) =>
			prev.filter((q) => !questions.some((qa) => qa.id === q.id))
		);
	};

	const removeSelectedQuestion = (id: string) => {
		let removed: Question | undefined;
		setSelectedQuestions((prev) => {
			const updated = prev.filter((q) => {
				if (q.id === id) removed = q;
				return q.id !== id;
			});
			return updated;
		});
		if (removed) {
			setAvailableQuestions((prev) =>
				prev.some((q) => q.id === removed!.id) ? prev : [...prev, removed!]
			);
		}
	};

	return (
		<div className="flex w-full  bg-white rounded-lg shadow-md overflow-hidden">
			<div className="w-[53%]">
				<Tabs
					fullWidth
					aria-label="Tabs form"
					selectedKey={selected}
					variant="light"
					size="md"
					classNames={{
						tab: "h-10",
						cursor: "bg-[#F5F7FA] ",
						base: "px-2.5 pt-3",
					}}
					onSelectionChange={(key) => setSelected(String(key))}
				>
					<Tab key="summary" title="Worksheet summary">
						<div className="px-6 border-t pt-4">
							<Summary />
							<QuestionHeader
								onSearchChange={(e) => console.log(e.target.value)}
								onGetMoreClick={() => console.log("get more")}
								showAddAll={false}
							/>
							<WorksheetSummaryTab
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}
								onDragCancel={handleDragCancel}
								sensors={sensors}
								selectedQuestions={selectedQuestions}
								activeQuestion={activeQuestion}
							/>
						</div>
					</Tab>
					<Tab key="new-question" title="New question">
						<div className="px-6 border-t pt-4 ">
							<Summary />
							<QuestionHeader
								onSearchChange={(e) => console.log(e.target.value)}
								onGetMoreClick={() => console.log("get more")}
								onAddAllClick={() => addAllToSelected(availableQuestions)}
								showAddAll
							/>
							<NewQuestionTab
								availableQuestions={availableQuestions}
								setAvailableQuestions={setAvailableQuestions}
								onAddQuestion={addQuestionToSelected}
								sensors={sensors}
							/>
						</div>
					</Tab>
				</Tabs>
			</div>

			<div className="w-[47%] ">
				<RightPanel
					selectedQuestions={selectedQuestions}
					removeSelectedQuestion={removeSelectedQuestion}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					onDragCancel={handleDragCancel}
					sensors={sensors}
					activeQuestion={activeQuestion}
					onPrevStep={onPrevStep}
				/>
			</div>
		</div>
	);
};

export default EditDetails;
