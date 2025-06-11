// src/components/NewQuestionTab.tsx
import React, {useState} from "react";
import {Question} from "../types";
import NewQuestionCard from "./NewQuestionCard";

interface NewQuestionTabProps {
	availableQuestions: Question[]; // Danh sách câu hỏi CÓ SẴN (chưa được chọn)
	onAddQuestion: (question: Question) => void;
	onAddAllQuestions: (questions: Question[]) => void;
}

export default function NewQuestionTab({
	availableQuestions,
	onAddQuestion,
	onAddAllQuestions,
}: NewQuestionTabProps) {
	const [searchTerm, setSearchTerm] = useState("");

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

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<div className="relative flex-grow mr-4">
					<input
						type="text"
						placeholder="Search"
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
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
				<button
					className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
					onClick={handleAddAll}
				>
					Add all
				</button>
			</div>

			<div className="space-y-4">
				{filteredQuestions.length === 0 ? (
					<div className="text-center text-gray-500 py-10">
						No questions found matching your search.
					</div>
				) : (
					filteredQuestions.map((question, index) => (
						<NewQuestionCard
							key={question.id}
							question={question}
							index={index}
							onAddQuestion={onAddQuestion}
						/>
					))
				)}
			</div>
		</div>
	);
}
