import React, {useRef, useState} from "react";
import {FaSquare, FaCheckSquare, FaMinusSquare} from "react-icons/fa";
import {IoMdArrowDropright} from "react-icons/io";
import {AiOutlineLoading} from "react-icons/ai";
import TreeView from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";

// Define a type for tree node elements
interface TreeNodeElement {
	name: string;
	id: number;
	parent: number | null;
	children: number[];
	isLocked?: boolean;
	value?: number | null;
	errorCount?: number;
	isBranch?: boolean;
}

const initialData: TreeNodeElement[] = [
	{
		name: "ROOT",
		id: -1,
		parent: null,
		children: [0, 100],
		isLocked: false,
		value: null,
	},
	{
		name: "TOEIC",
		id: 0,
		parent: -1,
		children: [1, 10, 20],
		isLocked: true,
		value: 100,
	},
	{
		name: "Listening",
		id: 1,
		parent: 0,
		children: [2, 8],
		isLocked: true,
		value: 50,
	},
	{
		name: "Part: Conversations",
		id: 2,
		parent: 1,
		children: [3],
		isLocked: false,
		value: 7,
	},
	{
		name: "Topic: Office communication",
		id: 3,
		parent: 2,
		children: [4],
		isLocked: false,
		value: 7,
	},
	{
		name: "Context: Meeting rescheduling",
		id: 4,
		parent: 3,
		children: [5, 6],
		isLocked: true,
		value: 7,
	},
	{
		name: "Question types: What is the man's problem? (inference)",
		id: 5,
		parent: 4,
		children: [],
		isLocked: true,
		value: 4,
		errorCount: 4,
	},
	{
		name: "Question types: What will the woman likely do next? (prediction)",
		id: 6,
		parent: 4,
		children: [],
		isLocked: false,
		value: 3,
	},
	{
		name: "Part: Short Talks",
		id: 8,
		parent: 1,
		children: [],
		isLocked: true,
		value: 25,
	},
	{
		name: "Reading",
		id: 10,
		parent: 0,
		children: [11],
		isLocked: true,
		value: 50,
	},
	{
		name: "Part: Reading Comprehension",
		id: 11,
		parent: 10,
		children: [12, 13],
		isLocked: false,
		value: 50,
	},
	{
		name: "Emails",
		id: 12,
		parent: 11,
		children: [],
		isLocked: false,
		value: 25,
	},
	{
		name: "Topic: Advertisements",
		id: 13,
		parent: 11,
		children: [],
		isLocked: false,
		value: 25,
	},
	{
		name: "Grammar",
		id: 20,
		parent: 0,
		children: [21],
		isLocked: false,
		value: null,
	},
	{
		name: "Part: Short Talks",
		id: 21,
		parent: 20,
		children: [],
		isLocked: false,
		value: null,
	},
	// IELTS root
	{
		name: "IELTS",
		id: 100,
		parent: -1,
		children: [101, 102],
		isLocked: false,
		value: null,
	},
	{
		name: "Listening",
		id: 101,
		parent: 100,
		children: [],
		isLocked: false,
		value: null,
	},
	{
		name: "Reading",
		id: 102,
		parent: 100,
		children: [],
		isLocked: false,
		value: null,
	},
];

function MultiSelectCheckboxAsyncControlled() {
	const loadedAlertElement = useRef<HTMLDivElement | null>(null);
	const [data, setData] = useState<TreeNodeElement[]>(initialData);
	const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState<
		TreeNodeElement[]
	>([]);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [selectChildren, setSelectChildren] = useState(false);
	const [preserveSelection, setPreserveSelection] = useState(false);
	const [manuallySelectedNodes, setManuallySelectiedNodes] = useState<number[]>(
		[]
	);

	const updateTreeData = (
		list: TreeNodeElement[],
		id: number,
		children: TreeNodeElement[]
	): TreeNodeElement[] => {
		const data = list.map((node: TreeNodeElement) => {
			if (node.id === id) {
				node.children = children.map((el: TreeNodeElement) => el.id);
			}
			return node;
		});
		return data.concat(children);
	};

	const onLoadData = ({element}: {element: TreeNodeElement}): Promise<void> => {
		return new Promise<void>((resolve) => {
			if (element.children.length > 0) {
				resolve();
				return;
			}
			setTimeout(() => {
				setData((value) =>
					updateTreeData(value, element.id, [
						{
							name: `Child Node ${value.length}`,
							children: [],
							id: value.length,
							parent: element.id,
							isBranch: true,
						},
						{
							name: "Another child Node",
							children: [],
							id: value.length + 1,
							parent: element.id,
						},
					])
				);
				if (selectChildren) {
					if (preserveSelection) {
						setSelectedIds([
							...new Set([
								...manuallySelectedNodes,
								...selectedIds,
								data.length,
								data.length + 1,
							]),
						]);
					} else {
						setSelectedIds([data.length, data.length + 1]);
					}
				}
				resolve();
			}, 1000);
		});
	};

	const wrappedOnLoadData = async (props: {element: TreeNodeElement}) => {
		const nodeHasNoChildData = props.element.children.length === 0;
		const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find(
			(e) => e.id === props.element.id
		);

		await onLoadData(props);

		if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {
			const el = loadedAlertElement.current;
			setNodesAlreadyLoaded([...nodesAlreadyLoaded, props.element]);
			if (el) el.innerHTML = `${props.element.name} loaded`;
			setTimeout(() => {
				if (el) el.innerHTML = "";
			}, 5000);
		}
	};

	const handleNodeSelect = ({
		element,
		isSelected,
	}: {
		element: TreeNodeElement;
		isSelected: boolean;
	}) => {
		if (isSelected) {
			setManuallySelectiedNodes([...manuallySelectedNodes, element.id]);
		} else {
			setManuallySelectiedNodes(
				manuallySelectedNodes.filter((id) => id !== element.id)
			);
		}
	};

	return (
		<>
			<div>
				<div
					className="visually-hidden"
					ref={loadedAlertElement}
					role="alert"
					aria-live="polite"
				></div>
				<button onClick={() => setSelectChildren(!selectChildren)}>
					Select next loaded children - [{JSON.stringify(selectChildren)}]
				</button>
				<button
					onClick={() => setPreserveSelection(!preserveSelection)}
					style={{marginLeft: "16px"}}
				>
					Preserve current selection - [{JSON.stringify(preserveSelection)}]
				</button>
				<div className="checkbox">
					<TreeView
						data={data}
						aria-label="Checkbox tree"
						onLoadData={wrappedOnLoadData}
						onNodeSelect={handleNodeSelect}
						selectedIds={selectedIds}
						multiSelect
						propagateSelect
						togglableSelect
						propagateSelectUpwards
						nodeRenderer={({
							element,
							isBranch,
							isExpanded,
							isSelected,
							isHalfSelected,
							getNodeProps,
							level,
							handleSelect,
							handleExpand,
						}) => {
							const branchNode = (isExpanded, element) => {
								return isExpanded && element.children.length === 0 ? (
									<>
										<span
											role="alert"
											aria-live="assertive"
											className="visually-hidden"
										>
											loading {element.name}
										</span>
										<AiOutlineLoading
											aria-hidden={true}
											className="loading-icon"
										/>
									</>
								) : (
									<ArrowIcon isOpen={isExpanded} />
								);
							};
							return (
								<div
									{...getNodeProps({onClick: handleExpand})}
									style={{marginLeft: 40 * (level - 1)}}
									className="flex items-center px-2 py-1 "
								>
									{isBranch && branchNode(isExpanded, element)}
									<div className="flex items-center gap-2">
										<CheckBoxIcon
											className="checkbox-icon"
											onClick={(e) => {
												!isExpanded && handleExpand(e);
												handleSelect(e);
												e.stopPropagation();
											}}
											variant={
												isHalfSelected ? "some" : isSelected ? "all" : "none"
											}
										/>
										<span className="name">
											{element.name}-{element.id}
										</span>
									</div>
								</div>
							);
						}}
					/>
				</div>
			</div>
		</>
	);
}

const ArrowIcon = ({isOpen, className}) => {
	const baseClass = "arrow";
	const classes = cx(
		baseClass,
		{[`${baseClass}--closed`]: !isOpen},
		{[`${baseClass}--open`]: isOpen},
		className
	);
	return <IoMdArrowDropright className={classes} />;
};

const CheckBoxIcon = ({variant, ...rest}) => {
	switch (variant) {
		case "all":
			return <FaCheckSquare {...rest} />;
		case "none":
			return <FaSquare {...rest} />;
		case "some":
			return <FaMinusSquare {...rest} />;
		default:
			return null;
	}
};

export default MultiSelectCheckboxAsyncControlled;
