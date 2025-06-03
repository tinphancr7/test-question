import React, {useState, useEffect, useRef} from "react";
import {BiLock} from "react-icons/bi";
import {BsUnlock} from "react-icons/bs";
import {IoIosUnlock, IoMdLock} from "react-icons/io";
import {TiLockOpen} from "react-icons/ti";

// Main App component
const QuestionSettingsV2 = () => {
	// Sample data for the course outline
	const initialCourseData = [
		{
			id: "toeic",
			label: "TOEIC",
			score: 50,
			isLocked: false,
			isChecked: false,
			children: [
				{
					id: "listening",
					label: "Listening",
					score: 25,
					isLocked: false,
					isChecked: false,
					children: [
						{
							id: "part-conversations",
							label: "Part : Conversations",
							score: 25,
							isLocked: false,
							isChecked: false,
							children: [
								{
									id: "topic-office-communication",
									label: "Topic : Office communication",
									score: 25,
									isLocked: false,
									isChecked: false,
									children: [
										{
											id: "context-meeting-rescheduling",
											label: "Context : Meeting rescheduling",
											score: 10,
											isLocked: true,
											isChecked: false,
										},
										{
											id: "question-types-inference",
											label:
												"Question types : What is the man's problem ? ( inference )",
											score: 40,
											isLocked: false,
											isChecked: false,
											hasRedBadge: true,
											redBadgeValue: "4 0",
										},
										{
											id: "question-types-prediction",
											label:
												"Question types : What will the woman likely do next ? ( prediction )",
											score: 8,
											isLocked: false,
											isChecked: false,
										},
									],
								},
							],
						},
						{
							id: "part-short-talks",
							label: "Part : Short Talks .",
							score: 25,
							isLocked: false,
							isChecked: false,
						},
					],
				},
				{
					id: "reading",
					label: "Reading",
					score: 50,
					isLocked: false,
					isChecked: false,
					children: [
						{
							id: "part-reading-comprehension",
							label: "Part : Reading Comprehension",
							score: 50,
							isLocked: false,
							isChecked: false,
							children: [
								{
									id: "emails",
									label: "Emails",
									score: 25,
									isLocked: false,
									isChecked: false,
								},
								{
									id: "topic-advertisements",
									label: "Topic : Advertisements",
									score: 25,
									isLocked: false,
									isChecked: false,
								},
							],
						},
					],
				},
				{
					id: "grammar-toeic",
					label: "Grammar",
					score: null,
					isLocked: false,
					isChecked: false,
				},
			],
		},
		{
			id: "ielts",
			label: "IELTS",
			score: null,
			isLocked: false,
			isChecked: false,
			children: [
				{
					id: "listening-ielts",
					label: "Listening",
					score: null,
					isLocked: false,
					isChecked: false,
				},
				{
					id: "reading-ielts",
					label: "Reading",
					score: null,
					isLocked: false,
					isChecked: false,
				},
				{
					id: "grammar-ielts",
					label: "Grammar",
					score: null,
					isLocked: false,
					isChecked: false,
				},
			],
		},
	];

	const [courseData, setCourseData] = useState(initialCourseData);

	// Function to update an item's property (isChecked or score)
	const updateItem = (id, key, value, currentData) => {
		return currentData.map((item) => {
			if (item.id === id) {
				return {...item, [key]: value};
			} else if (item.children) {
				return {...item, children: updateItem(id, key, value, item.children)};
			}
			return item;
		});
	};

	// Handle item property change (checkbox or score)
	const handleItemChange = (id, key, value) => {
		setCourseData((prevData) => updateItem(id, key, value, prevData));
	};

	return (
		<div className="  font-inter flex justify-center items-start">
			<div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
				{courseData.map((item) => (
					<CourseItem
						key={item.id}
						item={item}
						level={0}
						onItemChange={handleItemChange}
					/>
				))}
			</div>
		</div>
	);
};

// CourseItem component to render each item recursively
const CourseItem = ({item, level, onItemChange}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const contentRef = useRef(null);
	const [maxHeight, setMaxHeight] = useState("0px"); // Manage maxHeight in state

	// Determine padding based on nesting level
	const paddingLeft = `${level * 1.5 + 1}rem`; // 1.5rem per level + base 1rem

	// Toggle expansion state
	const toggleExpand = () => {
		if (item.children && item.children.length > 0) {
			setIsExpanded((prev) => !prev);
		}
	};

	// Set max-height for smooth transition
	// useEffect(() => {
	// 	if (!contentRef.current) return;

	// 	if (isExpanded) {
	// 		// When expanding, set max-height to the actual scrollHeight
	// 		// Use requestAnimationFrame to ensure accurate measurement after render
	// 		// requestAnimationFrame(() => {
	// 		// 	if (contentRef.current) {
	// 		// 		// Check again in case component unmounted
	// 		// 		setMaxHeight(`${contentRef.current.scrollHeight}px`);
	// 		// 	}
	// 		// });
	// 		setMaxHeight(`${contentRef.current.scrollHeight}px`);
	// 	} else {
	// 		// When collapsing, first set max-height to its current scrollHeight
	// 		// to ensure the transition starts from the correct height.
	// 		// Then, in the next animation frame, set it to 0.
	// 		// setMaxHeight(`${contentRef.current.scrollHeight}px`);
	// 		// requestAnimationFrame(() => {
	// 		// 	if (contentRef.current) {
	// 		// 		// Check again in case component unmounted
	// 		// 		setMaxHeight("0px");
	// 		// 	}
	// 		// });
	// 		setMaxHeight("0px");
	// 	}
	// }, [isExpanded]);
	// Set max-height for smooth transition
	useEffect(() => {
		if (!contentRef.current) return;

		if (isExpanded) {
			// When expanding, set max-height to a large value to ensure all content is visible.
			// This avoids issues with scrollHeight calculation for expansion.
			setMaxHeight("1000px"); // A sufficiently large value to cover all content
		} else {
			// When collapsing, directly set max-height to 0.
			// The CSS transition will handle the animation from its current height.
			setMaxHeight("0px");
		}
	}, [isExpanded]); // Only depend on isExpanded

	// Icon for expand/collapse
	const ChevronIcon = ({expanded}) => (
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
			className={`transition-transform duration-200 ${
				expanded ? "rotate-90" : ""
			}`}
		>
			<path d="m9 18 6-6-6-6" />
		</svg>
	);

	return (
		<div className="border-b border-gray-200 ">
			<div
				className={`flex items-center  py-3 pr-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
					level === 0 ? "bg-gray-50" : ""
				}`}
				style={{paddingLeft: paddingLeft}}
				onClick={toggleExpand}
			>
				{/* Expand/Collapse icon */}
				<div className="flex-shrink-0 w-6">
					{item.children && item.children.length > 0 && (
						<ChevronIcon expanded={isExpanded} />
					)}
				</div>

				{/* Checkbox */}
				<input
					type="checkbox"
					className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-3 flex-shrink-0"
					checked={item.isChecked}
					onChange={(e) => {
						e.stopPropagation(); // Prevent toggling expansion when clicking checkbox
						onItemChange(item.id, "isChecked", e.target.checked);
					}}
				/>

				{/* Label */}
				<span className="flex-grow text-sm sm:text-base text-gray-800 truncate">
					{item.label}
				</span>

				{/* Score, Badges, and Lock icon */}
				<div className="flex items-center ml-auto pr-4 flex-shrink-0">
					{item.score !== null && (
						<input
							type="number"
							className={`w-16 text-center border rounded-md px-1 py-0.5 text-gray-700 font-medium text-sm sm:text-base mr-2 ${
								item.isLocked
									? "bg-gray-100 cursor-not-allowed"
									: "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
							}`}
							value={item.score}
							onChange={(e) => {
								e.stopPropagation(); // Prevent toggling expansion
								const newScore = parseInt(e.target.value, 10);
								onItemChange(
									item.id,
									"score",
									isNaN(newScore) ? null : newScore
								);
							}}
							readOnly={item.isLocked}
						/>
					)}

					{item.isLocked ? (
						<IoMdLock size={18} className="text-black" />
					) : (
						<TiLockOpen size={18} className="text-black" />
					)}
				</div>
			</div>

			{/* Render children container with animation */}
			<div
				ref={contentRef}
				className="overflow-hidden transition-all duration-300 ease-in-out"
				style={{maxHeight: maxHeight}} // Apply maxHeight from state
			>
				{/* Always render the children's content, let maxHeight handle visibility */}
				{item.children && item.children.length > 0 && (
					<div>
						{item.children.map((child) => (
							<CourseItem
								key={child.id}
								item={child}
								level={level + 1}
								onItemChange={onItemChange}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default QuestionSettingsV2;
