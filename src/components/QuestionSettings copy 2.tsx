import { useEffect, useState } from "react";
import { MdArrowRight } from "react-icons/md";
import type { TreeMenuItem } from "./TreeMenu";
import TreeMenu from "./TreeMenu";
import { TiLockClosed, TiLockOpen } from "react-icons/ti";
import { FaCircleInfo } from "react-icons/fa6";

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

const QuestionSettings = ({ maxNumQuestion = 100 }) => {
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
      // const timer = setTimeout(() => setLastChangedId(null), 3000);
      // return () => clearTimeout(timer);
    }
  }, [lastChangedId]);

  const updateItem = (
    id: string,
    key: string,
    value: any,
    currentData: TreeMenuItem[]
  ): TreeMenuItem[] => {
    return currentData.map((item) => {
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
    let showSumMismatchWarning = false;
    let showRootSumMismatchWarning = false;

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
        showRootSumMismatchWarning = totalSum !== maxNumQuestion;
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
        <MdArrowRight
          className={`transition-transform flex-shrink-0 w-6 h-6 duration-200 ${
            item.children?.length > 0 ? "" : "invisible"
          } ${isExpanded ? "rotate-90" : ""}`}
        />

        <div className="flex items-center flex-grow gap-1.5">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0"
            checked={item.isChecked}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              onItemChange(item.id, "isChecked", e.target.checked)
            }
          />
          <span className="flex-grow text-sm sm:text-base text-gray-800 truncate">
            {item.label}
          </span>
        </div>
        <div className="flex items-center ml-auto flex-shrink-0 relative">
          {item.numQuestion != null && (
            <div className="space-y-1">
              <input
                type="number"
                className={`w-16 text-center border rounded-md px-1 h-10 text-gray-700 font-medium text-sm sm:text-base mr-2 ${
                  item.isLocked
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
              {(showSumMismatchWarning || showRootSumMismatchWarning) && (
                // <div className="flex items-center justify-center gap-2 border border-red-500 bg-red-50 text-red-700 rounded-md px-3 py-1 text-sm font-medium">
                //   <span>{item.numQuestion ?? 0}</span>
                //   <div className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                //     i
                //   </div>
                // </div>
                <FaCircleInfo size={18} className="text-red-500" />
              )}
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
