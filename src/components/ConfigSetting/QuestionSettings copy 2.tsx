import { useEffect, useState } from "react";
import { MdArrowRight } from "react-icons/md";

import { FaCircleInfo } from "react-icons/fa6";
import { TiLockClosed, TiLockOpen } from "react-icons/ti";
import { Tooltip } from "@heroui/react";
import type { TreeMenuItem } from "../ConfigSetting/TreeMenu";

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
    let { children } = item;
    if (children && children.length > 0) {
      children = allocateNumQuestions(children, thisNum);
      thisNum = children.reduce((sum, c) => sum + (c.numQuestion || 0), 0);
    }
    return { ...item, numQuestion: thisNum, children };
  });
}

// Hàm phân phối numQuestion đệ quy cho tree lồng nhau
function distributeNumQuestionsRecursively(
  data: TreeMenuItem[],
  nodeId: string,
  value: number | null
): TreeMenuItem[] {
  return data.map((item) => {
    if (item.id === nodeId) {
      // Nếu không có children thì chỉ set value
      if (!item.children || item.children.length === 0) {
        return { ...item, numQuestion: value };
      }
      // Nếu có children, phân phối value cho children
      const children = item.children;
      const lockedChildren = children.filter((c: TreeMenuItem) => c.isLocked);
      const unlockedChildren = children.filter(
        (c: TreeMenuItem) => !c.isLocked
      );
      const lockedSum = lockedChildren.reduce(
        (sum: number, c: TreeMenuItem) => sum + (c.numQuestion ?? 0),
        0
      );
      const remain = value !== null ? Math.max(0, value - lockedSum) : 0;
      const base =
        unlockedChildren.length > 0
          ? Math.floor(remain / unlockedChildren.length)
          : 0;
      let remainder =
        unlockedChildren.length > 0 ? remain % unlockedChildren.length : 0;
      // Gán value cho từng con
      const newChildren = children.map((child: TreeMenuItem) => {
        if (child.isLocked) return child;
        const v = base + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        return { ...child, numQuestion: v };
      });
      // Đệ quy cho từng con
      const distributedChildren = newChildren.map((child: TreeMenuItem) => {
        return distributeNumQuestionsRecursively(
          [child],
          child.id,
          child.numQuestion
        )[0];
      });
      return { ...item, numQuestion: value, children: distributedChildren };
    }
    // Đệ quy cho các node khác
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: distributeNumQuestionsRecursively(
          item.children,
          nodeId,
          value
        ),
      };
    }
    return item;
  });
}

const QuestionSettings = ({ maxNumQuestions = 100 }) => {
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
  // State để lưu các node đang warning
  const [warningNodeIds, setWarningNodeIds] = useState<string[]>([]);
  // State để lưu các node đã từng thay đổi và gây warning
  const [lastChangedIds, setLastChangedIds] = useState<string[]>([]);

  useEffect(() => {
    const allocatedData = allocateNumQuestions(
      initialCourseData,
      maxNumQuestions
    );
    setCourseData(allocatedData);
  }, [maxNumQuestions]);

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

  // UpdateItem and handleItemChange: thay any bằng kiểu phù hợp
  const updateItem = (
    id: string,
    key: keyof TreeMenuItem,
    value: string | number | boolean | null,
    currentData: TreeMenuItem[]
  ): TreeMenuItem[] => {
    return currentData.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [key]: value };
        if (key === "isChecked" && item.children) {
          // value phải là boolean
          updatedItem.children = updateItemForChildren(
            item.children,
            Boolean(value)
          );
        }
        return updatedItem;
      }
      if (item.children) {
        const updatedChildren = updateItem(id, key, value, item.children);
        let { isChecked } = item;
        if (key === "isChecked") {
          const allChecked = updatedChildren.every((child) => child.isChecked);
          updatedChildren.some((child) => child.isChecked);
          isChecked = !!allChecked;
        }
        return { ...item, children: updatedChildren, isChecked };
      }
      return item;
    });
  };

  // Helper: Check if a node is root (cần truyền data để dùng cho mọi thời điểm)
  function getInvalidSumNodeIds(
    data: TreeMenuItem[],
    maxNumQuestions: number
  ): string[] {
    const invalidIds: string[] = [];
    // 1. Kiểm tra tổng các node con của root
    const rootChildren = data;
    const sum = rootChildren.reduce(
      (acc: number, n: TreeMenuItem) => acc + (n.numQuestion ?? 0),
      0
    );
    if (sum !== maxNumQuestions) {
      rootChildren.forEach((n: TreeMenuItem) => invalidIds.push(n.id));
    }
    // 2. Kiểm tra tổng các node con của từng node (nếu có children)
    function traverse(nodes: TreeMenuItem[]) {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          const children = node.children;
          const sum = children.reduce(
            (acc: number, n: TreeMenuItem) => acc + (n.numQuestion ?? 0),
            0
          );
          if (sum !== node.numQuestion) {
            children.forEach((n: TreeMenuItem) => invalidIds.push(n.id));
          }
          traverse(children);
        }
      }
    }
    traverse(data);
    return invalidIds;
  }

  // Helper function to calculate total available questions from parent
  const getAvailableQuestionsFromParent = (
    nodeId: string, 
    data: TreeMenuItem[]
  ): number => {
    // Find parent of the node
    function findParent(nodes: TreeMenuItem[], targetId: string, parent: TreeMenuItem | null = null): TreeMenuItem | null {
      for (const node of nodes) {
        if (node.children) {
          for (const child of node.children) {
            if (child.id === targetId) {
              return node;
            }
          }
          const found = findParent(node.children, targetId, node);
          if (found) return found;
        }
      }
      return parent;
    }

    const parent = findParent(data, nodeId);
    return parent ? (parent.numQuestion || maxNumQuestions) : maxNumQuestions;
  };

  // Helper function to redistribute questions among siblings when one is checked/unchecked
  const redistributeAmongSiblings = (
    data: TreeMenuItem[],
    changedNodeId: string,
    isChecked: boolean
  ): TreeMenuItem[] => {
    function redistributeInLevel(nodes: TreeMenuItem[], parentNumQuestion: number): TreeMenuItem[] {
      const targetNode = nodes.find(n => n.id === changedNodeId);
      if (!targetNode) {
        // If target node is not in this level, recurse into children
        return nodes.map(node => ({
          ...node,
          children: node.children ? redistributeInLevel(node.children, node.numQuestion || 0) : node.children
        }));
      }

      // Found the target node, redistribute among siblings
      const checkedNodes = nodes.filter(n => n.isChecked || (n.id === changedNodeId && isChecked));
      const uncheckedNodes = nodes.filter(n => !n.isChecked && !(n.id === changedNodeId && isChecked));
      
      if (checkedNodes.length === 0) {
        // All unchecked, set all to 0
        return nodes.map(node => ({
          ...node,
          numQuestion: 0,
          children: node.children ? allocateNumQuestions(node.children, 0) : node.children
        }));
      }

      // Distribute parentNumQuestion among checked nodes
      const lockedNodes = checkedNodes.filter(n => n.isLocked);
      const unlockedNodes = checkedNodes.filter(n => !n.isLocked);
      
      const lockedSum = lockedNodes.reduce((sum, n) => sum + (n.numQuestion || 0), 0);
      const remainingForUnlocked = Math.max(0, parentNumQuestion - lockedSum);
      
      const basePerUnlocked = unlockedNodes.length > 0 ? Math.floor(remainingForUnlocked / unlockedNodes.length) : 0;
      let remainder = unlockedNodes.length > 0 ? remainingForUnlocked % unlockedNodes.length : 0;

      return nodes.map(node => {
        if (!node.isChecked && !(node.id === changedNodeId && isChecked)) {
          // Unchecked nodes get 0
          return {
            ...node,
            numQuestion: 0,
            children: node.children ? allocateNumQuestions(node.children, 0) : node.children
          };
        }
        
        if (node.isLocked) {
          // Locked nodes keep their value
          return {
            ...node,
            children: node.children ? allocateNumQuestions(node.children, node.numQuestion || 0) : node.children
          };
        }

        // Unlocked checked nodes get distributed value
        const newNumQuestion = basePerUnlocked + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;

        return {
          ...node,
          numQuestion: newNumQuestion,
          children: node.children ? allocateNumQuestions(node.children, newNumQuestion) : node.children
        };
      });
    }

    // Start redistribution from root level
    return redistributeInLevel(data, maxNumQuestions);
  };

  // Khi thay đổi số lượng câu hỏi, cập nhật warningNodeIds và lastChangedIds
  const handleItemChange = (id: string, key: string, value: unknown) => {
    let safeValue: string | number | boolean | null = null;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      safeValue = value;
    }
    setCourseData((prevData) => {
      let newData: TreeMenuItem[];
      
      if (key === "isChecked") {
        // Handle checkbox change with redistribution
        const updatedData = updateItem(
          id,
          key as keyof TreeMenuItem,
          safeValue,
          prevData
        );
        
        // Redistribute questions among siblings based on checked status
        newData = redistributeAmongSiblings(updatedData, id, Boolean(safeValue));
      } else if (key === "numQuestion") {
        // Nếu node có children, phân phối lại cho các con/cháu
        const node = findNodeById(prevData, id);
        if (node && node.children && node.children.length > 0) {
          newData = distributeNumQuestionsRecursively(
            prevData,
            id,
            typeof safeValue === "number" ? safeValue : null
          );
        } else {
          newData = updateItem(
            id,
            key as keyof TreeMenuItem,
            safeValue,
            prevData
          );
        }
      } else {
        newData = updateItem(
          id,
          key as keyof TreeMenuItem,
          safeValue,
          prevData
        );
      }
      
      const invalidIds = getInvalidSumNodeIds(newData, maxNumQuestions);
      setLastChangedIds((prevIds) => {
        let next = prevIds;
        if (invalidIds.includes(id)) {
          if (!prevIds.includes(id)) next = [...prevIds, id];
        } else {
          next = prevIds.filter((nid) => nid !== id);
        }
        next = next.filter((nid) => invalidIds.includes(nid));
        return next;
      });
      setWarningNodeIds(invalidIds);
      return newData;
    });
  };

  const renderTreeMenuItem = (
    item: TreeMenuItem,
    level: number,
    isExpanded: boolean,
    toggleExpand: () => void,
    onItemChange: (id: string, key: string, value: unknown) => void,
    isLastChild?: boolean
  ) => {
    // Chỉ show warning nếu node đã từng thay đổi và vẫn còn warning
    const showWarning =
      lastChangedIds.includes(item.id) && warningNodeIds.includes(item.id);

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
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
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
              {showWarning && (
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
                } ${showWarning ? "border-red-500 ring-red-500" : ""}`}
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

  // Helper: Tìm node theo id trong tree
  function findNodeById(
    nodes: TreeMenuItem[],
    id: string
  ): TreeMenuItem | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

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
