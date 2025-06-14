import {useEffect, useState} from "react";
import {MdArrowRight} from "react-icons/md";

import {FaCircleInfo} from "react-icons/fa6";
import {TiLockClosed, TiLockOpen} from "react-icons/ti";
import {Tooltip} from "@heroui/react";
import type {TreeMenuItem} from "../ConfigSetting/TreeMenu";

import TreeMenu from "../ConfigSetting/TreeMenu";

function allocateNumQuestions(
	data: TreeMenuItem[],
	parentNum: number | null
): TreeMenuItem[] {
	if (!data || data.length === 0 || parentNum == null) return data;
	const n = data.length;
	const base = Math.floor(parentNum / n);
	let remainder = parentNum % n;
	return data.map((item) => {
		let thisNum = base + (remainder > 0 ? 1 : 0);
		if (remainder > 0) remainder--;
		let {children} = item;
		if (children && children.length > 0) {
			children = allocateNumQuestions(children, thisNum);
			thisNum = children.reduce((sum, c) => sum + (c.numQuestion || 0), 0);
		}
		return {...item, numQuestion: thisNum, children};
	});
}

const QuestionSettings = ({maxNumQuestions = 100}) => {
	const initialCourseData = [
		{
			id: "toeic",
			label: "TOEIC",
			numQuestion: 50,
			isLocked: false,
			isChecked: false,
			children: [
				{
					id: "listening",
					label: "Listening",
					numQuestion: 25,
					isLocked: false,
					isChecked: false,
					children: [
						{
							id: "part-conversations",
							label: "Part : Conversations",
							numQuestion: 25,
							isLocked: false,
							isChecked: false,
							children: [
								{
									id: "topic-office-communication",
									label: "Topic : Office communication",
									numQuestion: 25,
									isLocked: false,
									isChecked: false,
									children: [
										{
											id: "context-meeting-rescheduling",
											label: "Context : Meeting rescheduling",
											numQuestion: 10,
											isLocked: true,
											isChecked: false,
										},
										{
											id: "question-types-inference",
											label:
												"Question types : What is the man's problem ? ( inference )",
											numQuestion: 40,
											isLocked: false,
											isChecked: false,
											hasRedBadge: true,
											redBadgeValue: "4 0",
										},
										{
											id: "question-types-prediction",
											label:
												"Question types : What will the woman likely do next ? ( prediction )",
											numQuestion: 8,
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
							numQuestion: 25,
							isLocked: false,
							isChecked: false,
						},
					],
				},
				{
					id: "reading",
					label: "Reading",
					numQuestion: 50,
					isLocked: false,
					isChecked: false,
					children: [
						{
							id: "part-reading-comprehension",
							label: "Part : Reading Comprehension",
							numQuestion: 50,
							isLocked: false,
							isChecked: false,
							children: [
								{
									id: "emails",
									label: "Emails",
									numQuestion: 25,
									isLocked: false,
									isChecked: false,
								},
								{
									id: "topic-advertisements",
									label: "Topic : Advertisements",
									numQuestion: 25,
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
					numQuestion: null,
					isLocked: false,
					isChecked: false,
				},
			],
		},
		{
			id: "ielts",
			label: "IELTS",
			numQuestion: null,
			isLocked: false,
			isChecked: false,
			children: [
				{
					id: "listening-ielts",
					label: "Listening",
					numQuestion: null,
					isLocked: false,
					isChecked: false,
				},
				{
					id: "reading-ielts",
					label: "Reading",
					numQuestion: null,
					isLocked: false,
					isChecked: false,
				},
				{
					id: "grammar-ielts",
					label: "Grammar",
					numQuestion: null,
					isLocked: false,
					isChecked: false,
				},
			],
		},
	];

	const [courseData, setCourseData] = useState<TreeMenuItem[]>([]);

	useEffect(() => {
		const allocatedData = allocateNumQuestions(
			initialCourseData,
			maxNumQuestions
		);
		setCourseData(allocatedData);
	}, [maxNumQuestions]);

	const [lastChangedId, setLastChangedId] = useState<string | null>(null);

	const updateItemForChildren = (
		children: TreeMenuItem[],
		checked: boolean
	): TreeMenuItem[] => {
		return children.map((child) => ({
			...child,
			isChecked: checked,
			children: child.children
				? updateItemForChildren(child.children, checked)
				: child.children,
		}));
	};

	const updateItem = (
		id: string,
		key: string,
		value: any,
		currentData: TreeMenuItem[]
	): TreeMenuItem[] => {
		return currentData.map((item) => {
			if (item.id === id) {
				const updatedItem = {...item, [key]: value};
				if (key === "isChecked" && item.children) {
					updatedItem.children = updateItemForChildren(item.children, value);
				}
				return updatedItem;
			}
			if (item.children) {
				const updatedChildren = updateItem(id, key, value, item.children);
				let {isChecked} = item;
				if (key === "isChecked") {
					const allChecked = updatedChildren.every((child) => child.isChecked);
					updatedChildren.some((child) => child.isChecked);
					isChecked = !!allChecked;
				}
				return {...item, children: updatedChildren, isChecked};
			}
			return item;
		});
	};

	const handleItemChange = (id: string, key: string, value: any) => {
		setLastChangedId(id);
		setCourseData((prevData) => updateItem(id, key, value, prevData));
	};

	const renderTreeMenuItem = (
		item: TreeMenuItem,
		level: number,
		isExpanded: boolean,
		toggleExpand: () => void,
		onItemChange: (id: string, key: string, value: any) => void,

		isLastChild?: boolean
	) => {
		let showSumMismatchWarning = false;
		let showRootSumMismatchWarning = false;

		if (item.id === lastChangedId) {
			function findParentAndSiblings(
				nodes: TreeMenuItem[],
				childId: string
			): {parent: TreeMenuItem | null; siblings: TreeMenuItem[]} | null {
				for (const node of nodes) {
					if (node.children && node.children.some((c) => c.id === childId)) {
						return {parent: node, siblings: node.children};
					}
					if (node.children) {
						const found = findParentAndSiblings(node.children, childId);
						if (found) return found;
					}
				}
				return null;
			}

			const found = findParentAndSiblings(courseData, lastChangedId);
			if (found && found.parent?.numQuestion != null) {
				const siblingsSum = found.siblings.reduce(
					(sum, c) => sum + (c.numQuestion || 0),
					0
				);
				showSumMismatchWarning = siblingsSum !== found.parent.numQuestion;
			}

			const isRootLevel = !courseData.some((node) =>
				node.children?.some((c) => c.id === item.id)
			);
			if (isRootLevel) {
				const totalSum = courseData.reduce(
					(sum, node) => sum + (node.numQuestion || 0),
					0
				);
				showRootSumMismatchWarning = totalSum !== maxNumQuestions;
			}
		}

		// Function to determine if we need vertical line for ancestor levels
		const getAncestorLines = (currentLevel: number, isLastAtLevel: boolean) => {
			const lines = [];

			// Draw vertical lines for all ancestor levels
			for (let i = 1; i <= currentLevel; i++) {
				const shouldDrawLine = i < currentLevel || !isLastAtLevel;
				lines.push(
					<div
						key={`vertical-${i}`}
						className="absolute border-l-2 border-dotted border-gray-400"
						style={{
							left: `${(i - 1) * 1.5 + 1.75}rem`,
							top: 0,
							bottom: shouldDrawLine ? 0 : "50%",
							width: "0px",
						}}
					/>
				);
			}

			return lines;
		};

		return (
			<div
				className={`relative flex items-center py-3 gap-4 pr-10 cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
					level === 0 ? "bg-gray-50 border-b" : ""
				}`}
				style={{paddingLeft: `${level * 1.5 + 1}rem`}}
				onClick={toggleExpand}
			>
				{/* Vertical dotted lines for all ancestor levels */}
				{level > 0 && getAncestorLines(level, isLastChild || false)}

				{/* Horizontal dotted connector */}
				{level > 0 && (
					<div
						className="absolute border-t-2 border-dotted border-gray-400"
						style={{
							left: `${(level - 1) * 1.5 + 1.75}rem`,
							top: "50%",
							width: "1.25rem",
							height: "0px",
						}}
					/>
				)}

				<MdArrowRight
					className={`transition-transform flex-shrink-0 w-6 h-6 duration-200 ${
						item.children && item.children.length > 0 ? "" : "invisible"
					} ${isExpanded ? "rotate-90" : ""}`}
				/>
				<div className="inline-flex items-center gap-1.5">
					<label
						onClick={(e) => e.stopPropagation()}
						className="flex items-center cursor-pointer relative"
					>
						<input
							type="checkbox"
							checked={item.isChecked}
							onChange={(e) =>
								onItemChange(item.id, "isChecked", e.target.checked)
							}
							className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-amber-600 checked:border-amber-600"
						/>
						<span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-3.5 w-3.5"
								viewBox="0 0 20 20"
								fill="currentColor"
								stroke="currentColor"
								strokeWidth="1"
							>
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						</span>
					</label>
					<span className="flex-grow text-sm sm:text-base text-gray-800 truncate">
						{item.label}
					</span>
				</div>

				<div className="flex items-center ml-auto flex-shrink-0 relative">
					{item.numQuestion != null && (
						<div className="flex items-center gap-2">
							{(showSumMismatchWarning || showRootSumMismatchWarning) && (
								<Tooltip
									content={
										<div className="max-w-lg">
											Currently, there are only {item.numQuestion} questions
											available in the selected chapter.
											<br />
											You may consider selecting additional chapters, reducing
											the number of questions, or creating your own questions in
											the "Edit Details" step.
										</div>
									}
								>
									<FaCircleInfo size={18} className="text-red-500" />
								</Tooltip>
							)}
							<input
								type="number"
								className={`w-16 text-center  border-1 focus:outline-none rounded-md px-1 h-10 text-gray-700 font-medium text-sm mr-2 ${
									item.isLocked
										? "bg-gray-100 cursor-not-allowed"
										: "bg-white  border-gray-300 "
								} ${
									showSumMismatchWarning || showRootSumMismatchWarning
										? "border-red-500 ring-red-500"
										: ""
								}`}
								value={item.numQuestion}
								onClick={(e) => e.stopPropagation()}
								onChange={(e) => {
									const newVal = parseInt(e.target.value, 10);
									onItemChange(
										item.id,
										"numQuestion",
										isNaN(newVal) ? null : newVal
									);
								}}
								readOnly={item.isLocked}
							/>
						</div>
					)}
					{item.isLocked ? (
						<span
							className="ml-1"
							onClick={(e) => {
								e.stopPropagation();
								onItemChange(item.id, "isLocked", !item.isLocked);
							}}
						>
							<TiLockClosed size={18} className="text-black" />
						</span>
					) : (
						<span
							className="ml-1"
							onClick={(e) => {
								e.stopPropagation();
								onItemChange(item.id, "isLocked", !item.isLocked);
							}}
						>
							<TiLockOpen size={18} className="text-black" />
						</span>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="font-inter flex justify-center items-start">
			<div className="w-full bg-white rounded-lg shadow-xl overflow-hidden">
				<TreeMenu
					data={courseData}
					onItemChange={handleItemChange}
					renderItem={renderTreeMenuItem}
				/>
			</div>
		</div>
	);
};

export default QuestionSettings;
