import React, {useMemo} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {FaRegTrashAlt} from "react-icons/fa";
import {MdDragIndicator} from "react-icons/md";
import {Question} from "../types";

const Badge = ({children}: {children: React.ReactNode}) => (
	<span className="inline-flex w-fit items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/10">
		{children}
	</span>
);

interface SortableQuestionCardProps {
	question: Question;
	index: number;
	onRemoveQuestion: (id: string) => void;
	onAddQuestion?: (question: Question) => void;
	showAnswer?: boolean;
}

const SortableQuestionCard = React.memo(function SortableQuestionCard({
	question,
	index,
	onRemoveQuestion,
	onAddQuestion,
	showAnswer = true,
}: SortableQuestionCardProps) {
	const {
		id,
		difficulty,
		questionType,
		emailExcerpt,
		questionText,
		answerChoices,
		correctAnswer,
		explanation,
	} = question;

	const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
		useSortable({id});

	const style = useMemo(
		() => ({
			transform: CSS.Transform.toString(transform),
			transition,
			zIndex: isDragging ? 10 : 0,
			opacity: isDragging ? 0.8 : 1,
			backgroundColor: isDragging ? "#e0e7ff" : "",
		}),
		[transform, transition, isDragging]
	);

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="border border-gray-200 bg-white rounded-lg shadow-sm"
			{...attributes}
			{...listeners}
		>
			<div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
				<div className="flex items-center space-x-2">
					<MdDragIndicator size={18} className="cursor-move" />
					<span className="font-semibold text-gray-800">{index + 1}</span>
					<span className="text-gray-500">
						Question types: What is the man's question ({questionType})
					</span>
				</div>
				<div className="flex items-center gap-3">
					<button
						className="text-gray-500 hover:text-red-600"
						onClick={() => onRemoveQuestion(id)}
					>
						<FaRegTrashAlt size={18} />
					</button>
					{onAddQuestion && (
						<button
							className="px-3 py-1 text-gray-500 border rounded-md bg-white"
							onClick={() => onAddQuestion(question)}
						>
							Add
						</button>
					)}
				</div>
			</div>

			<div className="py-3 px-8 grid grid-cols-[120px_1fr] text-sm gap-x-3 items-start">
				<div className="flex flex-col space-y-2">
					<Badge>{questionType}</Badge>
					<Badge>Difficulty: {difficulty}</Badge>
				</div>

				<div>
					{emailExcerpt && (
						<div className="text-sm text-gray-700 whitespace-normal mb-4">
							<h4 className="font-semibold mb-1">Email Text (Excerpt)</h4>
							<div dangerouslySetInnerHTML={{__html: emailExcerpt}} />
						</div>
					)}

					<p className="text-gray-900 font-medium whitespace-normal">
						Question: {questionText}
					</p>

					<p className="text-gray-900 font-medium whitespace-normal ">
						Answer Choices:
					</p>
					<ul className="text-sm text-gray-700 space-y-1 mb-4">
						{answerChoices?.map((choice, idx) => (
							<li key={idx} className="flex items-center">
								{choice}
							</li>
						))}
					</ul>
				</div>
				{showAnswer && <Badge>Correct Answer</Badge>}

				{showAnswer && (
					<div>
						<div className="text-gray-900 font-medium whitespace-normal">
							Correct Answer:
						</div>
						<p className="text-sm text-gray-700 mb-4">{correctAnswer}</p>
					</div>
				)}

				<Badge>Explanation</Badge>
				<div>
					<div className="text-gray-900 font-medium whitespace-normal">
						Explanation for Correct Answer:
					</div>
					<p className="text-sm text-gray-700">{explanation}</p>
				</div>
			</div>
		</div>
	);
});

export default SortableQuestionCard;
