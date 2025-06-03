import React, {useRef, useState} from "react";

const Header = () => {
	const [numQuestions, setNumQuestions] = useState(100);
	const subjects = [
		"English",
		"Math",
		"Korean",
		"Subject 3",
		"Subject 1",
		"Subject 1",
		"Subject 1",
		// "Subject 1",
		// "Subject 2",
		// "Subject 4",
		// "Subject 5",
		// "Subject 6",
		// "Subject 7",
	]; // Added more subjects for demonstration
	const [activeSubject, setActiveSubject] = useState("English"); // State to manage active subject
	const scrollContainerRef = useRef(null); // Ref for the scrollable container

	// Function to scroll left
	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({
				left: -200, // Scroll amount, adjust as needed
				behavior: "smooth",
			});
		}
	};

	// Function to scroll right
	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({
				left: 200, // Scroll amount, adjust as needed
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="p-4 sm:p-6 border-b border-gray-200">
			<div className="flex items-center mb-5">
				<div
					ref={scrollContainerRef}
					className="flex flex-nowrap items-center gap-2 overflow-x-auto hide-scrollbar flex-grow"
				>
					{subjects.map((subject, index) => (
						<button
							key={index}
							className={`px-4 py-2 border rounded-md text-sm whitespace-nowrap flex-shrink-0 ${
								activeSubject === subject && index === 0 // Only "English" is active in the image
									? "bg-yellow-100 border-yellow-400 text-yellow-800"
									: "bg-white text-gray-700 hover:bg-gray-50"
							}`}
							onClick={() => setActiveSubject(subject)}
						>
							{subject}
						</button>
					))}
				</div>
				{/* Navigation arrows */}
				<div className="flex items-center space-x-1 ml-2 flex-shrink-0">
					<button
						className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
						onClick={scrollLeft}
					>
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
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<button
						className="p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
						onClick={scrollRight}
					>
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
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			</div>
			<div className="flex gap-2 items-center">
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
					<button className="bg-yellow-100 border-yellow-400 text-yellow-800 px-4 py-2 border rounded-md hover:bg-gray-50 text-sm">
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

					<div className="bg-gray-200 w-[1px] mx-1 h-8 "></div>
					<input
						type="number"
						id="numQuestions"
						className="w-20 border rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={numQuestions}
						onChange={(e) => setNumQuestions(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default Header;
