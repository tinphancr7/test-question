import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Question} from "../types";

interface SortableProblemCardProps {
	problem: Question;
	index: number;
	onRemoveQuestion: (id: string) => void; // Thêm prop này
}

export default function SortableProblemCard({
	problem,
	index,
	onRemoveQuestion,
}: SortableProblemCardProps) {
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
				<button
					className="text-gray-400 hover:text-red-600"
					onClick={() => onRemoveQuestion(problem.id)}
				>
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
