import React, {useState} from "react";
import {Question} from "../types";

interface NewQuestionFormProps {
	onAddQuestion: (newQuestion: Question) => void;
}

export default function NewQuestionForm({onAddQuestion}: NewQuestionFormProps) {
	const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
		id: `new-${Date.now()}`, // Tạo ID duy nhất
		difficulty: 1,
		problemType: "Multiple choice",
		title: "",
		category: "",
		questionType: "",
		emailExcerpt: "",
		questionText: "",
		answerChoices: ["", "", "", ""],
		correctAnswer: "",
		explanation: "",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const {name, value} = e.target;
		setNewQuestion((prev) => ({...prev, [name]: value}));
	};

	const handleAnswerChoiceChange = (index: number, value: string) => {
		const updatedChoices = [...(newQuestion.answerChoices || ["", "", "", ""])];
		updatedChoices[index] = value;
		setNewQuestion((prev) => ({...prev, answerChoices: updatedChoices}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newQuestion.questionText && newQuestion.correctAnswer) {
			onAddQuestion(newQuestion as Question);
			// Reset form sau khi thêm
			setNewQuestion({
				id: `new-${Date.now()}`,
				difficulty: 1,
				problemType: "Multiple choice",
				title: "",
				category: "",
				questionType: "",
				emailExcerpt: "",
				questionText: "",
				answerChoices: ["", "", "", ""],
				correctAnswer: "",
				explanation: "",
			});
		} else {
			alert("Question text and Correct Answer are required!");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 p-6 bg-white rounded-lg shadow-md"
		>
			<h3 className="text-lg font-semibold text-gray-800">Add New Question</h3>

			<div>
				<label
					htmlFor="title"
					className="block text-sm font-medium text-gray-700"
				>
					Title
				</label>
				<input
					type="text"
					name="title"
					id="title"
					value={newQuestion.title}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
				/>
			</div>

			<div>
				<label
					htmlFor="category"
					className="block text-sm font-medium text-gray-700"
				>
					Category
				</label>
				<input
					type="text"
					name="category"
					id="category"
					value={newQuestion.category}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
				/>
			</div>

			<div>
				<label
					htmlFor="difficulty"
					className="block text-sm font-medium text-gray-700"
				>
					Difficulty
				</label>
				<input
					type="number"
					name="difficulty"
					id="difficulty"
					value={newQuestion.difficulty}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
					min="1"
					max="5"
				/>
			</div>

			<div>
				<label
					htmlFor="problemType"
					className="block text-sm font-medium text-gray-700"
				>
					Problem Type
				</label>
				<select
					name="problemType"
					id="problemType"
					value={newQuestion.problemType}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
				>
					<option value="Multiple choice">Multiple choice</option>
					<option value="Fill in the blank">Fill in the blank</option>
					<option value="Objective">Objective</option>
					<option value="Arranging">Arranging</option>
				</select>
			</div>

			<div>
				<label
					htmlFor="questionType"
					className="block text-sm font-medium text-gray-700"
				>
					Question Type
				</label>
				<input
					type="text"
					name="questionType"
					id="questionType"
					value={newQuestion.questionType}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
				/>
			</div>

			<div>
				<label
					htmlFor="emailExcerpt"
					className="block text-sm font-medium text-gray-700"
				>
					Email Excerpt (HTML allowed)
				</label>
				<textarea
					name="emailExcerpt"
					id="emailExcerpt"
					value={newQuestion.emailExcerpt}
					onChange={handleChange}
					rows={3}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
				></textarea>
			</div>

			<div>
				<label
					htmlFor="questionText"
					className="block text-sm font-medium text-gray-700"
				>
					Question Text <span className="text-red-500">*</span>
				</label>
				<textarea
					name="questionText"
					id="questionText"
					value={newQuestion.questionText}
					onChange={handleChange}
					rows={3}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
					required
				></textarea>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700">
					Answer Choices
				</label>
				{newQuestion.answerChoices?.map((choice, index) => (
					<div key={index} className="flex items-center mt-1">
						<span className="mr-2 text-gray-600">{`(${String.fromCharCode(
							65 + index
						)})`}</span>
						<input
							type="text"
							value={choice}
							onChange={(e) => handleAnswerChoiceChange(index, e.target.value)}
							className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
						/>
					</div>
				))}
			</div>

			<div>
				<label
					htmlFor="correctAnswer"
					className="block text-sm font-medium text-gray-700"
				>
					Correct Answer <span className="text-red-500">*</span>
				</label>
				<input
					type="text"
					name="correctAnswer"
					id="correctAnswer"
					value={newQuestion.correctAnswer}
					onChange={handleChange}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="explanation"
					className="block text-sm font-medium text-gray-700"
				>
					Explanation
				</label>
				<textarea
					name="explanation"
					id="explanation"
					value={newQuestion.explanation}
					onChange={handleChange}
					rows={3}
					className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
				></textarea>
			</div>

			<button
				type="submit"
				className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Add Question to Selected List
			</button>
		</form>
	);
}
