import React, {useState} from "react";

const QuestionSubCategory = ({title, initialQuestionCount, children}) => {
	// Changed initial state to false so the arrow is initially pointing down/right (collapsed)
	const [isExpanded, setIsExpanded] = useState(false);
	const [isChecked, setIsChecked] = useState(true);
	const [questionCount, setQuestionCount] = useState(initialQuestionCount);

	return (
		<div className="pl-4 py-1">
			<div
				className="flex items-center justify-between cursor-pointer border-b border-gray-200 pb-2"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex items-center">
					{/* Moved button to the left */}
					<button
						className="text-gray-600 mr-2"
						onClick={(e) => e.stopPropagation()}
					>
						{" "}
						{/* Added stopPropagation */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`h-5 w-5 transition-transform duration-200 ${
								isExpanded ? "rotate-180" : ""
							}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					<input
						type="checkbox"
						className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
						checked={isChecked}
						onChange={(e) => {
							e.stopPropagation();
							setIsChecked(e.target.checked);
						}}
					/>
					<span className="text-gray-700">{title}</span>
				</div>
				<div className="flex items-center space-x-3">
					<input
						type="number"
						className="w-16 border rounded-md px-2 py-1 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={questionCount}
						onChange={(e) => {
							e.stopPropagation();
							setQuestionCount(parseInt(e.target.value) || 0);
						}} // Added stopPropagation
					/>
					<div
						className="p-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
						onClick={(e) => e.stopPropagation()}
					>
						{" "}
						{/* Added stopPropagation */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 15V9m-3 3h6m-9 0a9 9 0 1118 0A9 9 0 0112 3z"
							/>
						</svg>
					</div>
					<div
						className="p-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
						onClick={(e) => e.stopPropagation()}
					>
						{" "}
						{/* Added stopPropagation */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
							/>
						</svg>
					</div>
					{/* Removed the 'N' radius */}
				</div>
			</div>
			{isExpanded && (
				<div className="border-l border-gray-200 ml-3 mt-1">{children}</div>
			)}
		</div>
	);
};

export default QuestionSubCategory;
