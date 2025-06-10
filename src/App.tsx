import React, {useState} from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
	DragOverlay, // Import DragOverlay
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

// SortableRow component to handle drag and drop for each table row
function SortableRow({question}) {
	const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
		useSortable({id: question.id}); // dnd-kit requires unique string IDs

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 0, // Keep dragging item on top
		opacity: isDragging ? 0.8 : 1, // Visual cue for dragging
		backgroundColor: isDragging ? "#e0e7ff" : "", // Light blue background when dragging
	};

	return (
		<tr
			ref={setNodeRef}
			style={style}
			className="hover:bg-gray-50"
			{...attributes} // Apply D&D attributes (aria-roledescription, etc.)
			{...listeners} // Apply D&D event listeners (onMouseDown, onTouchStart, etc.)
		>
			{/* New TD for the drag handle icon */}
			<td className="px-3 py-2 whitespace-nowrap text-center cursor-move">
				{/* SVG for a "grip" or "holder" icon */}
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

// Main App component
export default function App() {
	const [activeTab, setActiveTab] = useState("summary"); // State for active tab
	const [activeId, setActiveId] = useState(null); // State to track the ID of the actively dragged item

	// Dummy data for the question list - now managed by useState for reordering
	const [questions, setQuestions] = useState([
		{
			id: "1", // dnd-kit requires string IDs
			difficulty: 1,
			problemType: "Multiple choice",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / 고3 > Listening",
		},
		{
			id: "2",
			difficulty: 1,
			problemType: "Multiple choice",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
		},
		{
			id: "3",
			difficulty: 1,
			problemType: "Fill in the blank",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
		},
		{
			id: "4",
			difficulty: 1,
			problemType: "Objective",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
		},
		{
			id: "5",
			difficulty: 1,
			problemType: "Arranging",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
		},
		{
			id: "6",
			difficulty: 1,
			problemType: "Multiple choice",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
		},
		{
			id: "7",
			difficulty: 1,
			problemType: "Fill in the blank",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
		},
		{
			id: "8",
			difficulty: 1,
			problemType: "Objective",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
		},
		{
			id: "9",
			difficulty: 1,
			problemType: "Objective",
			title: "제 11 회 Listening Test (고3)",
			category: "English > 영역별 학습 / G3 > Listening",
		},
	]);

	// Configure dnd-kit sensors for mouse and touch interactions
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 8, // Require pointer to move 8 pixels before drag starts
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 200, // Require holding for 200ms before drag starts
				tolerance: 6,
			},
		}),
		useSensor(KeyboardSensor) // For accessibility with keyboard
	);

	// Find the currently dragged item based on activeId
	const activeQuestion = activeId
		? questions.find((q) => q.id === activeId)
		: null;

	// Handle the start of a drag operation
	function handleDragStart(event) {
		setActiveId(event.active.id);
	}

	// Handle the end of a drag operation
	function handleDragEnd(event) {
		const {active, over} = event;

		if (active.id !== over.id) {
			setQuestions((questions) => {
				const oldIndex = questions.findIndex((q) => q.id === active.id);
				const newIndex = questions.findIndex((q) => q.id === over.id);
				return arrayMove(questions, oldIndex, newIndex); // Reorder the array
			});
		}
		setActiveId(null); // Reset active ID after drag ends
	}

	// Handle drag cancel (e.g., pressing ESC key)
	function handleDragCancel() {
		setActiveId(null);
	}

	return (
		// Main container with full width, min height, background, and padding
		<div className="min-h-screen bg-gray-100 p-4 font-inter">
			{/* Card-like container for the entire UI */}
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
				{/* Tabs section */}
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

				{/* Content based on active tab */}
				{activeTab === "summary" && (
					<div className="p-6">
						{/* Total Questions Summary Section */}
						<div className="mb-8 p-4 bg-gray-50 rounded-lg">
							<h2 className="text-lg font-semibold text-gray-800 mb-2">
								Total Questions 100
							</h2>
							<p className="text-sm text-gray-600 mb-4">
								16 Multiple choice - 84 Fill in the blank
							</p>

							{/* Question distribution bars */}
							<div className="flex justify-between items-center text-xs font-medium text-gray-700 mb-2">
								<span>40 question</span>
								<span>40 question</span>
								<span>40 question</span>
								<span>40 question</span>
								<span>40 question</span>
							</div>
							<div className="flex h-2 rounded-full overflow-hidden mb-3">
								{/* Each div represents a segment of the progress bar */}
								<div className="bg-red-500 w-1/5"></div> {/* Very Hard */}
								<div className="bg-orange-400 w-1/5"></div> {/* Hard */}
								<div className="bg-yellow-400 w-1/5"></div> {/* Medium */}
								<div className="bg-lime-400 w-1/5"></div> {/* Lower-Medium */}
								<div className="bg-green-500 w-1/5"></div> {/* Normal */}
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

						{/* Search and Action Button Section */}
						<div className="flex items-center space-x-4 mb-6">
							<div className="relative flex-grow">
								<input
									type="text"
									placeholder="Search"
									className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
								/>
								{/* Search icon (magnifying glass) */}
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

						{/* Questions Table Section */}
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragStart={handleDragStart} // Added handleDragStart
							onDragEnd={handleDragEnd}
							onDragCancel={handleDragCancel} // Added handleDragCancel
						>
							<div className="overflow-x-auto rounded-lg border border-gray-200">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											{/* New header for the drag handle icon column */}
											<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
												{/* Empty header for the drag handle */}
											</th>
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
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
												{/* Empty header for the three dots icon column */}
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										<SortableContext
											items={questions.map((q) => q.id)} // Pass item IDs to SortableContext
											strategy={verticalListSortingStrategy}
										>
											{questions.map((question) => (
												<SortableRow key={question.id} question={question} />
											))}
										</SortableContext>
									</tbody>
								</table>
							</div>
							{/* DragOverlay for visual feedback during drag */}
							<DragOverlay>
								{activeQuestion ? (
									<table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden">
										<tbody>
											{/* Render a single row inside the overlay */}
											<tr className="bg-white">
												{/* New TD for the drag handle icon in the overlay */}
												{/* <td className="px-3 py-2 whitespace-nowrap text-center">
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
												</td> */}
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													{activeQuestion.id}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{activeQuestion.difficulty}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{activeQuestion.problemType}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													<div>{activeQuestion.title}</div>
													<div className="text-xs text-gray-500">
														{activeQuestion.category}
													</div>
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
										</tbody>
									</table>
								) : null}
							</DragOverlay>
						</DndContext>
					</div>
				)}

				{/* Placeholder for "New question" tab content */}
				{activeTab === "new-question" && (
					<div className="p-6 text-center text-gray-500">
						Content for creating a new question would go here.
					</div>
				)}
			</div>
		</div>
	);
}
