import React, {useState} from "react";

// Main App Component
function App() {
	return (
		<div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans">
			<div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
				{/* Header Section */}
				<Header />

				{/* Main Content Area */}
				{/* Flex layout for left and right panels, adapting for mobile and desktop */}
				<div className="flex flex-col lg:flex-row p-4 sm:p-6 border-t border-gray-200">
					{/* Left Panel: Question Settings */}
					<div className="w-full lg:w-2/3 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 mb-6 lg:mb-0">
						<QuestionSettings />
					</div>

					{/* Right Panel: Test Settings */}
					<div className="w-full lg:w-1/3 pl-0 lg:pl-6">
						<TestSettings />
					</div>
				</div>

				{/* Footer Section */}
				<Footer />
			</div>
		</div>
	);
}

// Header Component
function Header() {
	return (
		<div className="p-4 sm:p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
			{/* Test Name */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center">
				<label
					htmlFor="testName"
					className="w-full sm:w-24 text-gray-700 text-sm font-medium mb-1 sm:mb-0"
				>
					Test name
				</label>
				<div className="flex-1 w-full border rounded-md px-3 py-2 text-gray-800">
					고1 수능모의고사
				</div>
			</div>

			{/* Author Name */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center">
				<label
					htmlFor="authorName"
					className="w-full sm:w-24 text-gray-700 text-sm font-medium mb-1 sm:mb-0"
				>
					Author name
				</label>
				<div className="flex items-center flex-1 w-full">
					<div className="flex-1 border rounded-md px-3 py-2 text-gray-800 mr-2">
						T.E System
					</div>
					<div className="w-8 h-8 flex items-center justify-center bg-purple-500 text-white rounded-full font-bold text-sm">
						T
					</div>
				</div>
			</div>

			{/* Test Status */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center">
				<label className="w-full sm:w-24 text-gray-700 text-sm font-medium mb-1 sm:mb-0">
					Test status
				</label>
				<div className="flex items-center">
					<input
						type="radio"
						id="private"
						name="testStatus"
						className="mr-1"
						defaultChecked
					/>
					<label htmlFor="private" className="mr-4 text-sm text-gray-800">
						Private
					</label>
					<input type="radio" id="public" name="testStatus" className="mr-1" />
					<label htmlFor="public" className="text-sm text-gray-800">
						Public
					</label>
				</div>
			</div>

			{/* Original Price */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center">
				<label
					htmlFor="originalPrice"
					className="w-full sm:w-24 text-gray-700 text-sm font-medium mb-1 sm:mb-0"
				>
					Original price
				</label>
				<div className="flex-1 w-full flex items-center border rounded-md overflow-hidden">
					<input
						type="number"
						id="originalPrice"
						className="flex-1 px-3 py-2 text-gray-800 focus:outline-none"
						defaultValue="20"
					/>
					<span className="bg-gray-100 border-l border-gray-200 px-3 py-2 text-gray-600">
						₩
					</span>
					<button className="bg-gray-100 border-l border-gray-200 px-3 py-2 text-gray-600">
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
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}

// QuestionSettings Component (Left Panel)
function QuestionSettings() {
	const [numQuestions, setNumQuestions] = useState(100);

	return (
		<div>
			{/* Number of Questions */}
			<div className="mb-6">
				<label
					htmlFor="numQuestions"
					className="block text-gray-700 text-sm font-medium mb-2"
				>
					Number of questions:{" "}
					<span className="font-normal text-gray-600">
						Maximum 150 questions
					</span>
				</label>
				<div className="flex flex-wrap items-center gap-2">
					<input
						type="number"
						id="numQuestions"
						className="w-24 border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={numQuestions}
						onChange={(e) => setNumQuestions(e.target.value)}
					/>
					<button className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm">
						100
					</button>
					<button className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm">
						75
					</button>
					<button className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm">
						50
					</button>
					<button className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm">
						25
					</button>
					<button className="px-4 py-2 border rounded-md bg-blue-50 text-blue-700 border-blue-200 text-sm">
						100
					</button>
				</div>
			</div>

			{/* TOEIC Section */}
			<QuestionCategory
				title="TOEIC"
				initialQuestionCount={50}
				defaultExpanded={true}
			>
				{/* Sub-categories for TOEIC */}
				<QuestionSubCategory title="Listening" initialQuestionCount={50}>
					<QuestionType title="Part: Conversations" initialQuestionCount={25}>
						<QuestionType
							title="Topic: Office communication"
							initialQuestionCount={25}
						>
							<QuestionType
								title="Context: Meeting rescheduling"
								initialQuestionCount={10}
							/>
						</QuestionType>
						<QuestionType
							title="Question types: What is the man's problem? (inference)"
							initialQuestionCount={4}
						/>
						<QuestionType
							title="Question types: What will the woman likely do next? (prediction)"
							initialQuestionCount={8}
						/>
					</QuestionType>
					<QuestionType title="Part: Short Talks" initialQuestionCount={25} />
				</QuestionSubCategory>
				<QuestionSubCategory title="Reading" initialQuestionCount={50}>
					<QuestionType
						title="Part: Reading Comprehension"
						initialQuestionCount={50}
					>
						<QuestionType title="Emails" initialQuestionCount={25} />
						<QuestionType
							title="Topic: Advertisements"
							initialQuestionCount={25}
						/>
					</QuestionType>
				</QuestionSubCategory>
				<QuestionSubCategory title="Grammar" initialQuestionCount={0} />
			</QuestionCategory>

			{/* IELTS Section */}
			<QuestionCategory
				title="IELTS"
				initialQuestionCount={0}
				defaultExpanded={false}
			>
				{/* Sub-categories for IELTS */}
				<QuestionSubCategory title="Listening" initialQuestionCount={0} />
				<QuestionSubCategory title="Reading" initialQuestionCount={0} />
				<QuestionSubCategory title="Grammar" initialQuestionCount={0} />
			</QuestionCategory>
		</div>
	);
}

// QuestionCategory Component (e.g., TOEIC, IELTS)
function QuestionCategory({
	title,
	initialQuestionCount,
	children,
	defaultExpanded = false,
}) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const [isChecked, setIsChecked] = useState(true); // Represents the main checkbox for the category
	const [questionCount, setQuestionCount] = useState(initialQuestionCount);

	return (
		<div className="border border-gray-200 rounded-md mb-4 overflow-hidden">
			<div
				className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer border-b border-gray-200"
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
							e.stopPropagation(); // Prevent toggling expansion when clicking checkbox
							setIsChecked(e.target.checked);
						}}
					/>
					<span className="font-semibold text-gray-800">{title}</span>
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
				</div>
			</div>
			{isExpanded && <div className="p-3 bg-white">{children}</div>}
		</div>
	);
}

// QuestionSubCategory Component (e.g., Listening, Reading)
function QuestionSubCategory({title, initialQuestionCount, children}) {
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
}

// QuestionType Component (e.g., Part: Conversations, Topic: Office communication)
function QuestionType({title, initialQuestionCount, children}) {
	// Changed initial state to false so the arrow is initially pointing down/right (collapsed)
	const [isExpanded, setIsExpanded] = useState(false);
	const [isChecked, setIsChecked] = useState(true);
	const [questionCount, setQuestionCount] = useState(initialQuestionCount);

	// Determine border color based on questionCount
	const borderColorClass =
		questionCount === 0 ? "border-red-400" : "border-gray-200";

	return (
		<div className="pl-4 py-1">
			<div
				className={`flex items-center justify-between cursor-pointer border-l-2 ${borderColorClass} pl-2 border-b border-gray-200 pb-2`}
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
					<span className="text-gray-700 text-sm">{title}</span>
				</div>
				<div className="flex items-center space-x-3">
					<input
						type="number"
						className={`w-16 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
							questionCount === 0
								? "text-red-500 border-red-400"
								: "text-gray-800 border-gray-200"
						}`}
						value={questionCount}
						onChange={(e) => {
							e.stopPropagation();
							setQuestionCount(parseInt(e.target.value) || 0);
						}} // Added stopPropagation
					/>
					{questionCount === 0 && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 text-red-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					)}
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
				<div className="pl-4 border-l border-gray-200">{children}</div>
			)}
		</div>
	);
}

// TestSettings Component (Right Panel)
function TestSettings() {
	const [selectedDifficulty, setSelectedDifficulty] = useState(5); // Default to 5
	const [questionTypes, setQuestionTypes] = useState({
		multipleChoice: {enabled: true, count: 25},
		subjective: {enabled: true, count: 25},
		objective: {enabled: true, count: 25},
		arrangement: {enabled: false, count: 25}, // Updated from 0 to 25 based on image
		fillInTheBlank: {enabled: false, count: 0},
		questionGroup: {enabled: false, count: 0},
	});

	const handleQuestionTypeChange = (type) => {
		setQuestionTypes((prev) => ({
			...prev,
			[type]: {...prev[type], enabled: !prev[type].enabled},
		}));
	};

	const handleQuestionCountChange = (type, value) => {
		setQuestionTypes((prev) => ({
			...prev,
			[type]: {...prev[type], count: parseInt(value) || 0},
		}));
	};

	return (
		<div>
			{/* Special Category */}
			<div className="mb-6">
				<label
					htmlFor="specialCategory"
					className="block text-gray-700 text-sm font-medium mb-2"
				>
					Special category
				</label>
				<select
					id="specialCategory"
					className="w-full border rounded-md px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option>Junior high school</option>
					<option>High school</option>
				</select>
			</div>

			{/* Thumbnail Image */}
			<div className="mb-6">
				<label className="block text-gray-700 text-sm font-medium mb-2">
					Thumbnail image
				</label>
				<div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100">
					<div className="text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="mx-auto h-8 w-8 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
						<span className="mt-2 block text-sm">Upload photos</span>
					</div>
				</div>
			</div>

			{/* Test Level (Difficulty) */}
			<div className="mb-6">
				<label className="block text-gray-700 text-sm font-medium mb-2">
					Test level (difficulty)
				</label>
				<div className="flex flex-wrap items-center gap-2">
					{[1, 2, 3, 4, 5].map((level) => (
						<button
							key={level}
							className={`flex-1 px-4 py-2 border rounded-md text-sm ${
								selectedDifficulty === level
									? "bg-blue-500 text-white"
									: "bg-white text-gray-700 hover:bg-gray-50"
							}`}
							onClick={() => setSelectedDifficulty(level)}
						>
							{level}
						</button>
					))}
					{/* Removed the 'N' radius */}
					<button className="px-3 py-2 border rounded-md text-gray-700 bg-white text-sm flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 mr-1"
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
						<span>Offset setting</span>
					</button>
				</div>
			</div>

			{/* Question Type */}
			<div className="mb-6">
				<label className="block text-gray-700 text-sm font-medium mb-2">
					Question type
				</label>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
					{Object.keys(questionTypes).map((type) => (
						<div
							key={type}
							className="border border-gray-200 rounded-md overflow-hidden"
						>
							<div className="flex items-center justify-between p-2 bg-gray-50">
								<div className="flex items-center">
									<input
										type="checkbox"
										className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
										checked={questionTypes[type].enabled}
										onChange={() => handleQuestionTypeChange(type)}
									/>
									<span className="text-sm capitalize">
										{type.replace(/([A-Z])/g, " $1").trim()}
									</span>
								</div>
								{/* Add edit/settings icons */}
								<div className="flex space-x-1">
									<div className="p-1 rounded-md bg-gray-200 text-gray-600 cursor-pointer hover:bg-gray-300">
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
												d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.232z"
											/>
										</svg>
									</div>
									<div className="p-1 rounded-md bg-gray-200 text-gray-600 cursor-pointer hover:bg-gray-300">
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
								</div>
							</div>
							<div className="p-2 bg-white flex items-center">
								<input
									type="number"
									className="w-full border rounded-md px-2 py-1 text-sm text-gray-800 focus:outline-none"
									value={questionTypes[type].count}
									onChange={(e) =>
										handleQuestionCountChange(type, e.target.value)
									}
									disabled={!questionTypes[type].enabled}
								/>
							</div>
						</div>
					))}
					{/* Removed the 'N' radius */}
					<div className="relative col-span-full mt-2 flex justify-end">
						<button className="px-3 py-2 border rounded-md text-gray-700 bg-white text-sm flex items-center hover:bg-gray-50">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4 mr-1"
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
							<span>Off AI Learning</span>
						</button>
					</div>
				</div>
			</div>

			{/* Additional Options */}
			<div className="mb-6">
				<label className="block text-gray-700 text-sm font-medium mb-2">
					Additional options
				</label>
				<div className="flex items-center">
					<input
						type="checkbox"
						id="excludeDuplicate"
						className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
					/>
					<label htmlFor="excludeDuplicate" className="text-gray-700 text-sm">
						Excluding duplicate problems
					</label>
					{/* Removed the 'N' radius */}
				</div>
			</div>

			{/* Pass Rate */}
			<div className="mb-6">
				<label
					htmlFor="passRate"
					className="block text-gray-700 text-sm font-medium mb-2"
				>
					Pass rate
				</label>
				<div className="flex items-center border rounded-md overflow-hidden">
					<input
						type="number"
						id="passRate"
						className="flex-1 px-3 py-2 text-gray-800 focus:outline-none"
						defaultValue="80"
					/>
					<span className="bg-gray-100 border-l border-gray-200 px-3 py-2 text-gray-600">
						%
					</span>
				</div>
			</div>

			{/* Test Duration */}
			<div className="mb-6">
				<label
					htmlFor="testDuration"
					className="block text-gray-700 text-sm font-medium mb-2"
				>
					Test duration
				</label>
				<input
					type="text"
					id="testDuration"
					className="w-full border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
					defaultValue="05:05:05"
				/>
			</div>
		</div>
	);
}

// Footer Component
function Footer() {
	return (
		<div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 bg-gray-50">
			<button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100">
				Cancel
			</button>
			<button className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
				Next step &gt;
			</button>
		</div>
	);
}

export default App;
