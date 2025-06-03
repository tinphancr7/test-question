import {useState} from "react";
import {BiLock, BiPencil} from "react-icons/bi";
import {BsUnlock} from "react-icons/bs";

const TestSettings = () => {
	// State to manage the selected difficulty level, defaulting to 1 as per the image
	const [selectedDifficulty, setSelectedDifficulty] = useState(1);
	// State to manage question types, their enabled status, and count
	const [questionTypes, setQuestionTypes] = useState({
		multipleChoice: {enabled: true, count: 25},
		subjective: {enabled: true, count: 25},
		objective: {enabled: true, count: 25},
		arrangement: {enabled: true, count: 25}, // Enabled and count 25 based on image
		fillInTheBlank: {enabled: false, count: 0},
		questionGroup: {enabled: false, count: 0},
	});

	// Handler for toggling the enabled status of a question type
	const handleQuestionTypeChange = (type) => {
		setQuestionTypes((prev) => ({
			...prev,
			[type]: {...prev[type], enabled: !prev[type].enabled},
		}));
	};

	// Handler for changing the count of questions for a specific type
	const handleQuestionCountChange = (type, value) => {
		setQuestionTypes((prev) => ({
			...prev,
			[type]: {...prev[type], count: parseInt(value) || 0}, // Ensure count is a number
		}));
	};
	const [value, setValue] = useState(25);
	const [locked, setLocked] = useState(false);

	return (
		// Main container for the settings form, with a light gray background and minimum height
		<div className=" bg-gray-100 min-h-screen ">
			{/* White card-like container for the form content */}
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{/* Section for Test Name, Author Name, Original Price, and Test Status */}
				{/* Uses a responsive grid layout for two columns on medium screens and above */}
				<div className="p-4 sm:p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
					{/* Test Name Input */}
					<div className="flex flex-col  items-start ">
						<label
							htmlFor="testName"
							className="w-full  text-gray-700 text-sm font-medium mb-1  shrink-0"
						>
							Test name <span className="text-red-500">*</span>
						</label>

						<input
							type="text"
							className="flex-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 text-sm"
						/>
					</div>

					{/* Author Name Input */}
					<div className="flex flex-col  items-start ">
						<label
							htmlFor="authorName"
							className="w-full  text-gray-700 text-sm font-medium mb-1  shrink-0"
						>
							Author name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							className="flex-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 text-sm"
						/>
					</div>

					{/* Original Price Input */}
					<div className="flex flex-col  items-start ">
						<label
							htmlFor="originalPrice"
							className="w-full  text-gray-700 text-sm font-medium mb-1  shrink-0"
						>
							Original price (won) <span className="text-red-500">*</span>
						</label>
						<div className="flex-1 w-full flex items-center border border-gray-300 rounded-md overflow-hidden">
							<input
								type="number"
								id="originalPrice"
								className="flex-1 px-3 py-2 text-gray-800 text-sm focus:outline-none"
								defaultValue="20"
							/>
							<span className="bg-gray-50 border-l border-gray-300 px-3 py-2 text-gray-600 text-sm">
								₩
							</span>
							{/* Dropdown arrow for currency */}
							<button className="bg-gray-50 border-l border-gray-300 px-3 py-2 text-gray-600">
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

					{/* Test Status Radio Buttons */}
					<div className="flex flex-col  items-start ">
						<label className="w-full sm:w-32 text-gray-700 text-sm font-medium mb-1 sm:mb-0 shrink-0">
							Test status <span className="text-red-500">*</span>
						</label>
						<div className="flex items-center">
							<input
								type="radio"
								id="private"
								name="testStatus"
								className="mr-1 text-blue-600 focus:ring-blue-500 rounded-full" // Added rounded-full for radio
								defaultChecked
							/>
							<label htmlFor="private" className="mr-4 text-sm text-gray-800">
								Private
							</label>
							<input
								type="radio"
								id="public"
								name="testStatus"
								className="mr-1 text-blue-600 focus:ring-blue-500 rounded-full" // Added rounded-full for radio
							/>
							<label htmlFor="public" className="text-sm text-gray-800">
								Public
							</label>
						</div>
					</div>
				</div>

				{/* Special Category Dropdown */}
				<div className="p-4 sm:p-6 border-b border-gray-200">
					<label
						htmlFor="specialCategory"
						className="block text-gray-700 text-sm font-medium mb-2"
					>
						Special category <span className="text-red-500">*</span>
					</label>
					<select
						id="specialCategory"
						className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option>Junior high school</option>
						<option>High school</option>
					</select>
				</div>

				{/* Thumbnail Image Upload Area */}
				<div className="p-4 sm:p-6 border-b border-gray-200">
					<label className="block text-gray-700 text-sm font-medium mb-2">
						Thumbnail image <span className="text-red-500">*</span>
					</label>
					<div className="flex items-center justify-center w-36 h-36 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100">
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
							<span className="mt-2 block text-xs">Upload photo</span>
						</div>
					</div>
				</div>

				{/* Test Level (Difficulty) Section */}
				<div className="p-4 sm:p-6 border-b border-gray-200">
					<div className="flex items-center justify-between mb-3">
						<label className="block text-gray-700 text-sm font-medium">
							Test level (difficulty)
						</label>
						{/* Difficult setting button with icon */}
						<button className="flex items-center text-gray-600 text-xs px-2 py-1 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100">
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
							Difficult setting
						</button>
					</div>
					{/* Difficulty level buttons */}
					<div className="flex flex-wrap items-center gap-2">
						{[1, 2, 3, 4, 5].map((level) => (
							<button
								key={level}
								className={`flex-1 px-4 py-2 border rounded-md text-sm ${
									selectedDifficulty === level
										? "bg-blue-500 text-white border-blue-500"
										: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
								}`}
								onClick={() => setSelectedDifficulty(level)}
							>
								{level}
							</button>
						))}
					</div>
				</div>

				{/* Question Type Section */}
				<div className="p-4 sm:p-6 border-b border-gray-200">
					<div className="flex items-center justify-between mb-3">
						<label className="block text-gray-700 text-sm font-medium">
							Question type
						</label>
						{/* "OFF AI Learning" checkbox */}
						<div className="flex items-center text-gray-600 text-xs px-2 py-1 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100">
							<input
								type="checkbox"
								id="offAILearning"
								className="mr-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
							/>
							<label htmlFor="offAILearning" className="text-xs">
								OFF AI Learning
							</label>
						</div>
					</div>

					{/* Grid for question type cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
						{Object.keys(questionTypes).map((type) => (
							<div
								key={type}
								className="relative  rounded-xl border border-yellow-400 p-4 shadow-sm"
							>
								{/* Edit icon */}
								<div className="absolute top-1 right-1 text-gray-500 hover:text-black cursor-pointer">
									<BiPencil size={18} />
								</div>

								{/* Checkbox */}
								<div className="flex justify-center mb-2">
									<input
										type="checkbox"
										checked={questionTypes[type].enabled}
										onChange={() => handleQuestionTypeChange(type)}
										className="form-checkbox h-5 w-5 text-yellow-500 bg-yellow-400 border-yellow-400 rounded"
										readOnly
									/>
								</div>

								{/* Label */}
								<div className="text-center capitalize  text-sm mb-2">
									{type.replace(/([A-Z])/g, " $1").trim()}
								</div>

								{/* Number input and lock */}
								<div className="flex justify-center items-center gap-1">
									<input
										type="number"
										value={questionTypes[type].count}
										onChange={(e) =>
											handleQuestionCountChange(type, e.target.value)
										}
										disabled={!questionTypes[type].enabled}
										className="w-14 text-center px-1 py-0.5 border rounded focus:outline-none disabled:bg-gray-100"
									/>
									<button onClick={() => handleQuestionTypeChange(type)}>
										{questionTypes[type].enabled ? (
											<BsUnlock size={14} className="text-black" />
										) : (
											<BiLock size={14} className="text-black" />
										)}
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Additional Options Section */}
				<div className="p-4 sm:p-6 border-b border-gray-200">
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
							Excluding existing launch problems
						</label>
					</div>
				</div>

				{/* Pass Rate and Test Duration Section */}
				{/* Uses a responsive grid layout for two columns on medium screens and above */}
				<div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
					{/* Pass Rate Input */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center">
						<label
							htmlFor="passRate"
							className="w-full sm:w-32 text-gray-700 text-sm font-medium mb-1 sm:mb-0 shrink-0"
						>
							Pass rate <span className="text-red-500">*</span>
						</label>
						<div className="flex-1 w-full flex items-center border border-gray-300 rounded-md overflow-hidden">
							<input
								type="number"
								id="passRate"
								className="flex-1 px-3 py-2 text-gray-800 text-sm focus:outline-none"
								defaultValue="80"
							/>
							<span className="bg-gray-50 border-l border-gray-300 px-3 py-2 text-gray-600 text-sm">
								%
							</span>
						</div>
					</div>

					{/* Test Duration Input */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center">
						<label
							htmlFor="testDuration"
							className="w-full sm:w-32 text-gray-700 text-sm font-medium mb-1 sm:mb-0 shrink-0"
						>
							Test duration <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="testDuration"
							className="flex-1 w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							defaultValue="05:05:05"
						/>
					</div>
				</div>

				{/* Action Buttons (Cancel and Next Step) */}
				<div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
					<button className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
						Cancel
					</button>
					<button className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center">
						Next step
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 ml-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default TestSettings;
