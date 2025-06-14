import React, { useRef, useState } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import TreeView from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";

// Define a type for tree node elements
interface TreeNodeElement {
  name: string;
  id: string;
  parent: string | null;
  children: string[];
  isLocked?: boolean;
  value?: number | null;
  errorCount?: number;
  isBranch?: boolean;
}

const initialData: TreeNodeElement[] = [
  {
    name: "ROOT",
    id: "-1",
    parent: null,
    children: ["0", "100"],
    isLocked: false,
    value: null,
  },
  {
    name: "TOEIC",
    id: "0",
    parent: "-1",
    children: ["1", "10", "20"],
    isLocked: true,
    value: 100,
  },
  {
    name: "Listening",
    id: "1",
    parent: "0",
    children: ["2", "8"],
    isLocked: true,
    value: 50,
  },
  {
    name: "Part: Conversations",
    id: "2",
    parent: "1",
    children: ["3"],
    isLocked: false,
    value: 7,
  },
  {
    name: "Topic: Office communication",
    id: "3",
    parent: "2",
    children: ["4"],
    isLocked: false,
    value: 7,
  },
  {
    name: "Context: Meeting rescheduling",
    id: "4",
    parent: "3",
    children: ["5", "6"],
    isLocked: true,
    value: 7,
  },
  {
    name: "Question types: What is the man's problem? (inference)",
    id: "5",
    parent: "4",
    children: [],
    isLocked: true,
    value: 4,
    errorCount: 4,
  },
  {
    name: "Question types: What will the woman likely do next? (prediction)",
    id: "6",
    parent: "4",
    children: [],
    isLocked: false,
    value: 3,
  },
  {
    name: "Part: Short Talks",
    id: "8",
    parent: "1",
    children: [],
    isLocked: true,
    value: 25,
  },
  {
    name: "Reading",
    id: "10",
    parent: "0",
    children: ["11"],
    isLocked: true,
    value: 50,
  },
  {
    name: "Part: Reading Comprehension",
    id: "11",
    parent: "10",
    children: ["12", "13"],
    isLocked: false,
    value: 50,
  },
  {
    name: "Emails",
    id: "12",
    parent: "11",
    children: [],
    isLocked: false,
    value: 25,
  },
  {
    name: "Topic: Advertisements",
    id: "13",
    parent: "11",
    children: [],
    isLocked: false,
    value: 25,
  },
  {
    name: "Grammar",
    id: "20",
    parent: "0",
    children: ["21"],
    isLocked: false,
    value: null,
  },
  {
    name: "Part: Short Talks",
    id: "21",
    parent: "20",
    children: [],
    isLocked: false,
    value: null,
  },
  // IELTS root
  {
    name: "IELTS",
    id: "100",
    parent: "-1",
    children: ["101", "102"],
    isLocked: false,
    value: null,
  },
  {
    name: "Listening",
    id: "101",
    parent: "100",
    children: [],
    isLocked: false,
    value: null,
  },
  {
    name: "Reading",
    id: "102",
    parent: "100",
    children: [],
    isLocked: false,
    value: null,
  },
];

function QuestionSettings() {
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

  const onLoadData = ({
    element,
  }: {
    element: TreeNodeElement;
  }): Promise<void> => {
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

  const wrappedOnLoadData = async (props: { element: TreeNodeElement }) => {
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

        <div className="checkbox">
          <TreeView
            data={data}
            aria-label="Checkbox tree"
            onLoadData={wrappedOnLoadData}
            onNodeSelect={handleNodeSelect}
            selectedIds={selectedIds}
            multiSelect
            togglableSelect
            propagateSelect
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
              // Determine if this node is the last child of its parent using data from state
              let isLastChild = false;
              const elementId = element.id;
              const parentId = element.parent;
              if (parentId !== null) {
                const parentNode = data.find(
                  (n: TreeNodeElement) => n.id === parentId
                );
                if (
                  parentNode &&
                  parentNode.children[parentNode.children.length - 1] ===
                    elementId
                ) {
                  isLastChild = true;
                }
              }
              // Calculate which ancestor levels need a vertical line
              const lines: React.ReactElement[] = [];
              let ancestorId = element.parent;
              let ancestorLevel = level - 1;
              let leftOffset = -16;
              while (
                ancestorId !== null &&
                ancestorId !== undefined &&
                ancestorLevel > 0
              ) {
                const ancestorNode = data.find(
                  (n: TreeNodeElement) => n.id === ancestorId
                );
                if (
                  ancestorNode &&
                  ancestorNode.parent !== null &&
                  ancestorNode.parent !== undefined
                ) {
                  const ancestorParent = data.find(
                    (n: TreeNodeElement) => n.id === ancestorNode.parent
                  );
                  const isAncestorLast =
                    ancestorParent &&
                    ancestorParent.children[
                      ancestorParent.children.length - 1
                    ] === ancestorNode.id;
                  if (!isAncestorLast) {
                    lines.push(
                      <span
                        key={ancestorLevel}
                        className="vertical-dots"
                        style={{
                          position: "absolute",
                          left: leftOffset,
                          top: 0,
                          height: "100%",
                          borderLeft: "2px dotted #d1b97f",
                          zIndex: 0,
                        }}
                        aria-hidden="true"
                      />
                    );
                  }
                }
                ancestorId = ancestorNode ? ancestorNode.parent : null;
                ancestorLevel--;
                leftOffset -= 40;
              }
              const branchNode = (
                isExpanded: boolean,
                element: {
                  name: string;
                  children: unknown[];
                }
              ) => {
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
                  {...getNodeProps({ onClick: handleExpand })}
                  style={{ marginLeft: 40 * (level - 1), position: "relative" }}
                  className="flex items-center px-2 h-14  "
                >
                  {/* Render ancestor vertical lines for seamless effect */}
                  {lines}
                  {/* Vertical dotted line for this node, seamless */}
                  {level > 1 && (
                    <span
                      className="vertical-dots"
                      style={{
                        position: "absolute",
                        left: -16,
                        top: 0,
                        height: isLastChild ? "50%" : "100%",
                        borderLeft: "2px dotted #d1b97f",
                        zIndex: 0,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  {isBranch && branchNode(isExpanded, element)}
                  <div className="flex items-center gap-2">
                    <CheckBoxIcon
                      className={`bg-white border rounded-sm w-5 h-5 ${
                        isHalfSelected || isSelected
                          ? "text-primary"
                          : "text-white"
                      }`}
                      onClick={(e: React.MouseEvent) => {
                        if (!isExpanded) handleExpand(e);
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

const ArrowIcon = ({
  isOpen,
  className,
}: {
  isOpen: boolean;
  className?: string;
}) => {
  const baseClass = "arrow";
  const classes = cx(
    baseClass,
    { [`${baseClass}--closed`]: !isOpen },
    { [`${baseClass}--open`]: isOpen },
    className
  );
  return <IoMdArrowDropright className={classes} />;
};

const CheckBoxIcon = ({
  variant,
  ...rest
}: { variant: "all" | "none" | "some" } & React.ComponentProps<
  typeof FaCheckSquare
>) => {
  switch (variant) {
    case "all":
      return <FaCheckSquare size={20} {...rest} />;
    case "none":
      return <FaSquare size={20} {...rest} />;
    case "some":
      return <FaMinusSquare size={20} {...rest} />;
    default:
      return null;
  }
};

export default QuestionSettings;
