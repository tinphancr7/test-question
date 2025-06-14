import React, {useState} from "react";
import {IoMdArrowDropright} from "react-icons/io";
import TreeView, {flattenTree} from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";

const folder = {
	name: "",
	children: [
		{
			name: "Fruits",
			children: [
				{name: "Avocados"},
				{name: "Bananas"},
				{name: "Berries"},
				{name: "Oranges"},
				{name: "Pears"},
			],
		},
		{
			name: "Drinks",
			children: [
				{name: "Apple Juice"},
				{name: "Chocolate"},
				{name: "Coffee"},
				{
					name: "Tea",
					children: [
						{name: "Black Tea"},
						{name: "Green Tea"},
						{name: "Red Tea"},
						{name: "Matcha"},
					],
				},
			],
		},
		{
			name: "Vegetables",
			children: [
				{name: "Beets"},
				{name: "Carrots"},
				{name: "Celery"},
				{name: "Lettuce"},
				{name: "Onions"},
			],
		},
	],
};

const data = flattenTree(folder);

// Inline CSS for the tree and nodes
const treeStyles = `
.tree {
  font-family: Arial, sans-serif;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
}
.tree-node {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 0;
  transition: background 0.2s;
}
.tree-node:focus {
  outline: 2px solid #0078d4;
  background: #e6f7ff;
}
.arrow {
  transition: transform 0.2s;
  margin-right: 8px;
  color: #888;
  font-size: 1.2em;
}
.arrow--open {
  transform: rotate(90deg);
}
.arrow--closed {
  transform: rotate(0deg);
}
.name {
  font-size: 1em;
  color: #333;
  margin-left: 4px;
}
.tree-node[aria-disabled="true"] {
  opacity: 0.5;
  pointer-events: none;
}
`;

function ControlledExpandedNode() {
	const [expandedIds, setExpandedIds] = useState<number[] | undefined>();

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			getAndSetIds();
		}
	};

	const getAndSetIds = () => {
		const input = document.querySelector<HTMLInputElement>("#txtIdsToExpand");
		if (!input) return;
		const ids = input.value
			.split(",")
			.filter((val: string) => !!val.trim())
			.map((x: string) => {
				if (isNaN(parseInt(x.trim()))) {
					return x;
				}
				return parseInt(x.trim());
			});
		setExpandedIds(ids as number[]);
	};

	return (
		<>
			<style>{treeStyles}</style>
			<div>
				<div>
					<label htmlFor="txtIdsToExpand">
						Comma-delimited list of branch node IDs to expand:
					</label>
					<input id="txtIdsToExpand" type="text" onKeyDown={onKeyDown} />
					<button onClick={() => getAndSetIds()}>Set</button>
				</div>
				<div className="text">
					<button onClick={() => setExpandedIds(undefined)}>
						Clear all expanded nodes
					</button>
				</div>
				<div className="checkbox">
					<TreeView
						data={data}
						aria-label="Controlled expanded node tree"
						expandedIds={expandedIds}
						defaultExpandedIds={[1]}
						nodeRenderer={({
							element,
							isBranch,
							isExpanded,
							isDisabled,
							getNodeProps,
							level,
							handleExpand,
						}) => {
							return (
								<div
									{...getNodeProps({onClick: handleExpand})}
									className="tree-node"
									style={{
										marginLeft: 40 * (level - 1),
										opacity: isDisabled ? 0.5 : 1,
									}}
								>
									{isBranch && <ArrowIcon isOpen={isExpanded} className="" />}
									<span className="name">
										{element.name}-{element.id}
									</span>
								</div>
							);
						}}
					/>
				</div>
			</div>
		</>
	);
}

interface ArrowIconProps {
	isOpen: boolean;
	className?: string;
}

const ArrowIcon = ({isOpen, className = ""}: ArrowIconProps) => {
	const baseClass = "arrow";
	const classes = cx(
		baseClass,
		{[`${baseClass}--closed`]: !isOpen},
		{[`${baseClass}--open`]: isOpen},
		className
	);
	return <IoMdArrowDropright className={classes} />;
};

export default ControlledExpandedNode;
