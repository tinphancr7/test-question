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
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import type {DragStartEvent, DragEndEvent} from "@dnd-kit/core";

type Question = {
	id: string;
	difficulty: number;
	problemType: string;
	title: string;
	category: string;
	questionType?: string;
	emailExcerpt?: string;
	questionText?: string;
	answerChoices?: string[];
	correctAnswer?: string;
	explanation?: string;
};

function TableRowOverlay({question}: {question: Question}) {
	return (
		<table className="min-w-full divide-y divide-gray-200 shadow-lg bg-white opacity-90">
			<tbody>
				<tr style={{display: "table-row"}}>
					<td className="px-3 py-2 whitespace-nowrap text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-5 h-5 text-gray-400 mx-auto"
						>
							<path
								fillRule="evenodd"
								d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM10.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
								clipRule="evenodd"
							/>
						</svg>
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
						{question.id}
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
						{question.difficulty}
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
						{question.problemType}
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
						<div>{question.title}</div>
						<div className="text-xs text-gray-500">{question.category}</div>
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
						<button className="text-gray-500">
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z"></path>
							</svg>
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	);
}

function ProblemCardOverlay({problem}: {problem: Question}) {
	return (
		<div className="border border-gray-200 rounded-lg shadow-lg bg-white opacity-90 w-full">
			<div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
				<div className="flex items-center space-x-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-5 h-5 text-gray-400 mx-auto"
					>
						<path
							fillRule="evenodd"
							d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM10.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
							clipRule="evenodd"
						/>
					</svg>
					<span className="font-semibold text-gray-800">{problem.id}</span>
					<span className="text-sm text-gray-500">
						Question types: ({problem.questionType})
					</span>
				</div>
			</div>
			<div className="p-3">
				{problem.emailExcerpt && (
					<div
						className="mb-2 text-sm text-gray-700 whitespace-normal"
						dangerouslySetInnerHTML={{__html: problem.emailExcerpt}}
					/>
				)}
				<p className="text-gray-900 font-medium whitespace-normal">
					Question: {problem.questionText}
				</p>
			</div>
		</div>
	);
}

function SortableRow({question, index}: {question: Question; index: number}) {
	const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
		useSortable({id: question.id});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 0,
		opacity: isDragging ? 0.8 : 1,
		backgroundColor: isDragging ? "#e0e7ff" : "",
	};

	return (
		<tr
			ref={setNodeRef}
			style={style}
			className="hover:bg-gray-50"
			{...attributes}
			{...listeners}
		>
			<td className="px-3 py-2 whitespace-nowrap text-center cursor-move">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="w-5 h-5 text-gray-400 mx-auto"
				>
					<path
						fillRule="evenodd"
						d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM10.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
						clipRule="evenodd"
					/>
				</svg>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
				{index + 1}
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				{question.difficulty}
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				{question.problemType}
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
				<div>{question.title}</div>
				<div className="text-xs text-gray-500">{question.category}</div>
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
				<button className="text-gray-500 hover:text-gray-700">
					<svg
						className="w-5 h-5"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z"></path>
					</svg>
				</button>
			</td>
		</tr>
	);
}

function SortableProblemCard({
	problem,
	index,
}: {
	problem: Question;
	index: number;
}) {
	const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
		useSortable({id: problem.id});

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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-5 h-5 text-gray-400 cursor-grab"
					>
						<path
							fillRule="evenodd"
							d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM10.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
							clipRule="evenodd"
						/>
					</svg>
					<span className="font-semibold text-gray-800">{index + 1}</span>
					<span className="text-sm text-gray-500">
						Question types: What is the man's problem ({problem.questionType})
					</span>
				</div>
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
						className="lucide lucide-trash-2"
					>
						<path d="M3 6h18" />
						<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
						<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
						<line x1="10" x2="10" y1="11" y2="17" />
						<line x1="14" x2="14" y1="11" y2="17" />
					</svg>
				</button>
			</div>
			<div className="p-3 grid grid-cols-[120px_1fr] gap-x-3 items-start">
				<div className="flex flex-col space-y-2">
					<span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
						{problem.problemType}
					</span>
					<span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-800/10">
						Difficulty: {problem.difficulty}
					</span>
				</div>
				<div className="col-span-1">
					{problem.emailExcerpt && (
						<div className="mb-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-normal">
							<h4 className="font-semibold mb-1">Email Text (Excerpt)</h4>
							<div
								dangerouslySetInnerHTML={{
									__html: problem.emailExcerpt,
								}}
							/>
						</div>
					)}
					<p className="text-gray-900 mb-3 font-medium whitespace-normal">
						Question: {problem.questionText}
					</p>
				</div>
				<div className="col-start-2">
					<ul className="text-sm text-gray-700 space-y-1 mb-3">
						{problem.answerChoices &&
							problem.answerChoices.map((choice, idx) => (
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
					<p className="text-sm text-green-800 mb-3">{problem.correctAnswer}</p>
				</div>
				<div className="col-start-1">
					<span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/10">
						Explanation
					</span>
				</div>
				<div className="col-start-2">
					<p className="text-sm text-gray-700">{problem.explanation}</p>
				</div>
			</div>
		</div>
	);
}

export default function App() {
	const [activeTab, setActiveTab] = useState("summary");
	const [activeId, setActiveId] = useState<string | null>(null);

	const [questions, setQuestions] = useState<Question[]>([
		{
			id: "1",
			difficulty: 1,
			problemType: "Multiple choice",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / 고3 > Listening",
			questionType: "inference",
			emailExcerpt: `From: Laura Kim <br> To: James Torres <br> Subject: Delay in Shipment <br> Dear James, I wanted to inform you that the shipment originally scheduled to arrive this Friday will be delayed due to unforeseen customs inspections. We are working closely with the shipping partner and expect the delivery to be completed next Wednesday. Please let your team know. Best regards, Laura`,
			questionText:
				"Why is James likely to infer that his team needs to change the shipping partner?",
			answerChoices: [
				"① His team needs to change the shipping partner",
				"② His team is responsible for customs clearance",
				"③ His team was expecting the shipment this Friday",
				"④ His team must cancel the shipment",
			],
			correctAnswer: "③ His team was expecting the shipment this Friday",
			explanation:
				"Laura asked James to let his team know about the delay. Since the shipment was originally planned for Friday, we can infer that the team was expecting it then.",
		},
		{
			id: "2",
			difficulty: 1,
			problemType: "Multiple choice",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
			questionType: "comprehension",
			emailExcerpt: `Subject: Meeting Reminder<br>Hi team, Just a friendly reminder about our meeting scheduled for tomorrow at 10 AM in Conference Room 3. Please come prepared to discuss the Q3 budget. See you there!`,
			questionText: "What is the main purpose of this email?",
			answerChoices: [
				"① To schedule a new meeting",
				"② To remind about an upcoming meeting",
				"③ To discuss Q3 financial results",
				"④ To book Conference Room 3",
			],
			correctAnswer: "② To remind about an upcoming meeting",
			explanation:
				"The email explicitly states 'Just a friendly reminder about our meeting scheduled for tomorrow'.",
		},
		{
			id: "3",
			difficulty: 1,
			problemType: "Fill in the blank",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
			questionType: "grammar",
			questionText: "The cat sat ___ the mat.",
			answerChoices: ["① on", "② in", "③ at", "④ by"],
			correctAnswer: "① on",
			explanation:
				"The preposition 'on' is used to indicate a position on a surface.",
		},
		{
			id: "4",
			difficulty: 1,
			problemType: "Objective",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
			questionType: "prediction",
			questionText:
				"Choose the correct article to complete the sentence: 'She adopted ___ cat from the shelter.'",
			answerChoices: ["① a", "② an", "③ the", "④ (no article)"],
			correctAnswer: "③ the",
			explanation:
				"The correct article is 'the' because 'cat' is a specific noun.",
		},
		{
			id: "5",
			difficulty: 1,
			problemType: "Arranging",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
			questionType: "sequencing",
			questionText:
				"Arrange the following steps to make a cup of tea: A. Pour hot water. B. Add tea bag. C. Drink. D. Add milk and sugar.",
			answerChoices: [
				"① B, A, D, C",
				"② A, B, C, D",
				"③ B, D, A, C",
				"④ C, D, A, B",
			],
			correctAnswer: "① B, A, D, C",
			explanation:
				"The logical order to make tea is to first add the tea bag, then hot water, then milk and sugar, and finally drink.",
		},
		{
			id: "6",
			difficulty: 1,
			problemType: "Multiple choice",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
			questionType: "inference",
			emailExcerpt: `Subject: Project Update<br>Team, The deadline for Phase 1 has been moved to next Friday. We need to accelerate our efforts.`,
			questionText: "What can be inferred about the project's progress?",
			answerChoices: [
				"① It's ahead of schedule",
				"② It's behind schedule",
				"③ It's on schedule",
				"④ The project is canceled",
			],
			correctAnswer: "② It's behind schedule",
			explanation:
				"The phrase 'accelerate our efforts' suggests that the project is behind its original schedule.",
		},
		{
			id: "7",
			difficulty: 1,
			problemType: "Fill in the blank",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
			questionType: "vocabulary",
			questionText:
				"She has a very ___ personality, always cheering others up.",
			answerChoices: ["① gloomy", "② vibrant", "③ shy", "④ dull"],
			correctAnswer: "② vibrant",
			explanation:
				"The word 'vibrant' best describes a personality that is always cheering others up.",
		},
		{
			id: "8",
			difficulty: 1,
			problemType: "Objective",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
			questionType: "grammar",
			questionText: "Neither John ___ Mary was at the party.",
			answerChoices: ["① or", "② nor", "③ and", "④ but"],
			correctAnswer: "② nor",
			explanation:
				"'Neither' is always followed by 'nor' in correlative conjunctions.",
		},
		{
			id: "9",
			difficulty: 1,
			problemType: "Objective",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
			questionType: "reading_comprehension",
			emailExcerpt: `Subject: New Policy<br>All employees are required to review the updated remote work policy by Friday.`,
			questionText: "What action is required by employees?",
			answerChoices: [
				"① Attend a meeting about the policy",
				"② Sign a new contract",
				"③ Review the updated policy",
				"④ Submit a remote work request",
			],
			correctAnswer: "③ Review the updated policy",
			explanation:
				"The email clearly states 'All employees are required to review the updated remote work policy'.",
		},
	]);

	const sensors = useSensors(
		useSensor(MouseSensor, {activationConstraint: {distance: 8}}),
		useSensor(TouchSensor, {activationConstraint: {delay: 200, tolerance: 6}}),
		useSensor(KeyboardSensor)
	);

	const activeQuestion = activeId
		? questions.find((q) => q.id === activeId)
		: null;

	function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string);
	}

	function handleDragEnd(event: DragEndEvent) {
		const {active, over} = event;
		if (!over) return;

		if (active.id !== over.id) {
			setQuestions((prevQuestions) => {
				const oldIndex = prevQuestions.findIndex((q) => q.id === active.id);
				const newIndex = prevQuestions.findIndex((q) => q.id === over.id);

				if (oldIndex !== -1 && newIndex !== -1) {
					return arrayMove(prevQuestions, oldIndex, newIndex);
				}
				return prevQuestions;
			});
		}
		setActiveId(null);
	}

	function handleDragCancel() {
		setActiveId(null);
	}

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

						<div className="flex-1 overflow-y-auto p-6">
							{activeTab === "summary" && (
								<>
									<div className="mb-8 p-4 bg-gray-50 rounded-lg">
										<h2 className="text-lg font-semibold text-gray-800 mb-2">
											Total Questions 100
										</h2>
										<p className="text-sm text-gray-600 mb-4">
											16 Multiple choice - 84 Fill in the blank
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
										onDragEnd={handleDragEnd}
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
														items={questions.map((q) => q.id)}
														strategy={verticalListSortingStrategy}
													>
														{questions.map((question, index) => (
															<SortableRow
																key={question.id}
																question={question}
																index={index}
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
								</>
							)}

							{activeTab === "new-question" && (
								<div className="p-6 text-center text-gray-500">
									Content for creating a new question would go here.
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="flex-1 border-l border-gray-200 flex flex-col min-w-0">
					<div className="p-4 border-b border-gray-200 flex items-center justify-between">
						<h3 className="text-md font-semibold text-gray-800">
							Selected problem list
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
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
							onDragCancel={handleDragCancel}
						>
							<SortableContext
								items={questions.map((q) => q.id)}
								strategy={verticalListSortingStrategy}
							>
								{questions.map((problem, index) => (
									<SortableProblemCard
										key={problem.id}
										problem={problem}
										index={index}
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
