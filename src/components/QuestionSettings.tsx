import { useEffect, useState } from "react";
import { MdArrowRight } from "react-icons/md";
import type { TreeMenuItem } from "./TreeMenu";
import TreeMenu from "./TreeMenu";

function allocateNumQuestions(
  data: TreeMenuItem[],
  parentNum: number | null
): TreeMenuItem[] {
  if (!data || data.length === 0 || parentNum == null) return data;
  const n = data.length;
  const base = Math.floor(parentNum / n);
  let remainder = parentNum % n;
  return data.map((item, idx) => {
    let thisNum = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;
    let children = item.children;
    if (children && children.length > 0) {
      children = allocateNumQuestions(children, thisNum);
      thisNum = children.reduce((sum, c) => sum + (c.numQuestion || 0), 0);
    }
    return { ...item, numQuestion: thisNum, children };
  });
}

const QuestionSettingsV2 = ({ maxNumQuestion = 100 }) => {
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

  const [courseData, setCourseData] = useState<TreeMenuItem[]>(
    allocateNumQuestions(initialCourseData as TreeMenuItem[], maxNumQuestion)
  );

  const [lastChangedId, setLastChangedId] = useState<string | null>(null);

  useEffect(() => {
    if (lastChangedId) {
      const timer = setTimeout(() => setLastChangedId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastChangedId]);

  const updateItem = (
    id: string,
    key: string,
    value: any,
    currentData: TreeMenuItem[],
    parentChecked?: boolean
  ): TreeMenuItem[] => {
    return currentData.map((item: TreeMenuItem) => {
      if (item.id === id) {
        let updatedItem = { ...item, [key]: value };
        if (key === "isChecked" && item.children) {
          updatedItem.children = updateItemForChildren(item.children, value);
        }
        return updatedItem;
      } else if (item.children) {
        const updatedChildren = updateItem(id, key, value, item.children);
        let isChecked = item.isChecked;
        if (key === "isChecked") {
          const allChecked = updatedChildren.every((child) => child.isChecked);
          const someChecked = updatedChildren.some((child) => child.isChecked);
          isChecked = allChecked ? true : someChecked ? false : false;
        }
        return { ...item, children: updatedChildren, isChecked };
      }
      return item;
    });
  };

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
    parentNumQuestion?: number
  ) => {
    // let showSumMismatchWarning = false;

    // if (
    //   item.numQuestion !== null &&
    //   item.numQuestion !== undefined &&
    //   lastChangedId !== null
    // ) {
    //   function findParentAndSiblings(
    //     nodes: TreeMenuItem[],
    //     childId: string
    //   ): { parent: TreeMenuItem | null; siblings: TreeMenuItem[] } | null {
    //     for (const node of nodes) {
    //       if (node.children && node.children.some((c) => c.id === childId)) {
    //         return { parent: node, siblings: node.children };
    //       } else if (node.children) {
    //         const found = findParentAndSiblings(node.children, childId);
    //         if (found) return found;
    //       }
    //     }
    //     return null;
    //   }

    //   const found = findParentAndSiblings(courseData, lastChangedId);
    //   if (
    //     found &&
    //     found.parent &&
    //     found.parent.numQuestion !== null &&
    //     found.parent.numQuestion !== undefined
    //   ) {
    //     const siblings = found.siblings;
    //     const parentNum = found.parent.numQuestion;
    //     const siblingsSum = siblings.reduce(
    //       (sum: number, c: TreeMenuItem) => sum + (c.numQuestion || 0),
    //       0
    //     );
    //     showSumMismatchWarning =
    //       siblings.some((s) => s.id === item.id) && siblingsSum !== parentNum;
    //   }
    // }
    let showSumMismatchWarning = false;

    // Show warning ONLY on the field the user just changed
    if (item.id === lastChangedId) {
      function findParentAndSiblings(
        nodes: TreeMenuItem[],
        childId: string
      ): { parent: TreeMenuItem | null; siblings: TreeMenuItem[] } | null {
        for (const node of nodes) {
          if (node.children && node.children.some((c) => c.id === childId)) {
            return { parent: node, siblings: node.children };
          } else if (node.children) {
            const found = findParentAndSiblings(node.children, childId);
            if (found) return found;
          }
        }
        return null;
      }

      const found = findParentAndSiblings(courseData, lastChangedId);
      if (
        found &&
        found.parent &&
        found.parent.numQuestion !== null &&
        found.parent.numQuestion !== undefined
      ) {
        const siblingsSum = found.siblings.reduce(
          (sum: number, c: TreeMenuItem) => sum + (c.numQuestion || 0),
          0
        );
        showSumMismatchWarning = siblingsSum !== found.parent.numQuestion;
      }
    }

    return (
      <div
        className={`flex items-center py-3 gap-4 pr-10 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
          level === 0 ? "bg-gray-50" : ""
        }`}
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
        onClick={toggleExpand}
      >
        {item.children && item.children.length > 0 && (
          <MdArrowRight
            className={`transition-transform flex-shrink-0 w-6 h-6 duration-200 ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        )}
        <div className="flex items-center  flex-grow gap-1.5">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
            checked={item.isChecked}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              onItemChange(item.id, "isChecked", e.target.checked);
            }}
          />
          <span className="flex-grow text-sm sm:text-base text-gray-800 truncate">
            {item.label}
          </span>
        </div>
        <div className="flex items-center ml-auto flex-shrink-0 relative">
          {item.numQuestion !== null && item.numQuestion !== undefined && (
            <div className="relative flex items-center">
              <input
                type="number"
                className={`w-16 text-center border rounded-md px-1 py-0.5 text-gray-700 font-medium text-sm sm:text-base mr-2 ${
                  item.isLocked
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                value={item.numQuestion}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  const newnumQuestion = parseInt(e.target.value, 10);
                  onItemChange(
                    item.id,
                    "numQuestion",
                    isNaN(newnumQuestion) ? null : newnumQuestion
                  );
                }}
                readOnly={item.isLocked}
              />
              {showSumMismatchWarning && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center px-2 py-0.5 rounded border border-red-400 bg-red-50 text-red-700 text-sm font-semibold ml-1 gap-1 animate-pulse z-10">
                  Sum ≠ parent
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold ml-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <circle cx="12" cy="16" r="1" />
                    </svg>
                  </span>
                </span>
              )}
            </div>
          )}
          {item.isLocked ? (
            <span className="ml-1">🔒</span>
          ) : (
            <span className="ml-1">🔓</span>
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

export default QuestionSettingsV2;
