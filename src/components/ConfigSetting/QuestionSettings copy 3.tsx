import React, { useRef, useState } from "react";
import { FaSquare, FaCheckSquare, FaMinusSquare } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import TreeView from "react-accessible-treeview";
import cx from "classnames";
import "./styles.css";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from "@heroui/react";
import { TiLockClosed, TiLockOpen } from "react-icons/ti";

// Define a type for tree node elements
interface TreeNodeElement {
  name: string;
  id: string;
  parent: string | null;
  children: string[];
  isLocked?: boolean;
  value: number; // luôn là number
  errorCount?: number;
  isBranch?: boolean;
  isChecked: boolean; // REQUIRED boolean
}

// initialData: set isChecked: true for all nodes directly
const initialData: TreeNodeElement[] = [
  {
    name: "ROOT",
    id: "-1",
    parent: null,
    children: ["0", "100"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "TOEIC",
    id: "0",
    parent: "-1",
    children: ["1", "10", "20"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Listening",
    id: "1",
    parent: "0",
    children: ["2", "8"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Part: Conversations",
    id: "2",
    parent: "1",
    children: ["3"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Topic: Office communication",
    id: "3",
    parent: "2",
    children: ["4"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Context: Meeting rescheduling",
    id: "4",
    parent: "3",
    children: ["5", "6"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Question types: What is the man's problem? (inference)",
    id: "5",
    parent: "4",
    children: [],
    isLocked: false,
    value: 0,
    errorCount: 4,
    isChecked: true,
  },
  {
    name: "Question types: What will the woman likely do next? (prediction)",
    id: "6",
    parent: "4",
    children: [],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Part: Short Talks",
    id: "8",
    parent: "1",
    children: [],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Reading",
    id: "10",
    parent: "0",
    children: ["11"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Part: Reading Comprehension",
    id: "11",
    parent: "10",
    children: ["12", "13"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Emails",
    id: "12",
    parent: "11",
    children: [],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Topic: Advertisements",
    id: "13",
    parent: "11",
    children: [],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Grammar",
    id: "20",
    parent: "0",
    children: ["21"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Part: Short Talks",
    id: "21",
    parent: "20",
    children: [],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  // IELTS root
  {
    name: "IELTS",
    id: "100",
    parent: "-1",
    children: ["101", "102"],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Listening",
    id: "101",
    parent: "100",
    children: [],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
  {
    name: "Reading",
    id: "102",
    parent: "100",
    children: [],
    isLocked: false,
    value: 0,
    isChecked: true,
  },
];

// Hàm phân phối giá trị đệ quy
function distributeValueRecursively(
  data: TreeNodeElement[],
  nodeId: string,
  value: number
): TreeNodeElement[] {
  // Tìm node hiện tại
  const node = data.find((n) => n.id === nodeId);
  if (!node) return data;
  // Nếu không có children thì chỉ set value
  if (!node.children || node.children.length === 0) {
    return data.map((n) => (n.id === nodeId ? { ...n, value } : n));
  }
  // Nếu có children, phân phối value cho children
  // 1. Lấy các node con
  const children = node.children.map((cid) => data.find((n) => n.id === cid)!);
  // 2. Tính tổng các node con bị lock
  const lockedChildren = children.filter((c) => c.isLocked);
  const unlockedChildren = children.filter((c) => !c.isLocked);
  const lockedSum = lockedChildren.reduce((sum, c) => sum + (c.value ?? 0), 0);
  // 3. Phần còn lại chia đều cho các node chưa lock
  const remain = Math.max(0, value - lockedSum);
  const base =
    unlockedChildren.length > 0
      ? Math.floor(remain / unlockedChildren.length)
      : 0;
  let remainder =
    unlockedChildren.length > 0 ? remain % unlockedChildren.length : 0;
  // 4. Gán value cho từng node con
  let newData = data.map((n) => {
    if (lockedChildren.find((c) => c.id === n.id)) {
      // Node bị lock giữ nguyên value
      return n;
    }
    if (unlockedChildren.find((c) => c.id === n.id)) {
      // Node chưa lock nhận base + 1 nếu còn dư
      const v = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      return { ...n, value: v };
    }
    return n;
  });
  // 5. Đệ quy cho từng node con
  for (const child of children) {
    const childValue = newData.find((n) => n.id === child.id)?.value ?? 0;
    newData = distributeValueRecursively(newData, child.id, childValue);
  }
  // 6. Set value cho node hiện tại
  newData = newData.map((n) => (n.id === nodeId ? { ...n, value } : n));
  return newData;
}

// Utility to ensure isChecked is always boolean
function ensureIsCheckedBoolean(nodes: TreeNodeElement[]): TreeNodeElement[] {
  return nodes.map((n) => ({
    ...n,
    isChecked: typeof n.isChecked === "boolean" ? n.isChecked : false,
  }));
}

// Hàm phân phối giá trị chỉ cho các node được checked
function distributeCheckedValues(
  data: TreeNodeElement[],
  nodeId: string,
  value: number
): TreeNodeElement[] {
  const node = data.find((n) => n.id === nodeId);
  if (!node) return ensureIsCheckedBoolean(data);
  if (!node.children || node.children.length === 0) {
    return ensureIsCheckedBoolean(
      data.map((n) => (n.id === nodeId ? { ...n, value } : n))
    );
  }
  const children = node.children.map((cid) => data.find((n) => n.id === cid)!);
  const checkedChildren = children.filter((c) => c.isChecked === true);
  const lockedChecked = checkedChildren.filter((c) => c.isLocked);
  const unlockedChecked = checkedChildren.filter((c) => !c.isLocked);
  const lockedSum = lockedChecked.reduce((sum, c) => sum + (c.value ?? 0), 0);
  const remain = Math.max(0, value - lockedSum);
  const base =
    unlockedChecked.length > 0
      ? Math.floor(remain / unlockedChecked.length)
      : 0;
  let remainder =
    unlockedChecked.length > 0 ? remain % unlockedChecked.length : 0;
  let newData = data.map((n) => {
    if (lockedChecked.find((c) => c.id === n.id)) {
      return n;
    }
    if (unlockedChecked.find((c) => c.id === n.id)) {
      const v = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      return { ...n, value: v };
    }
    if (
      children.find((c) => c.id === n.id) &&
      !checkedChildren.find((c) => c.id === n.id)
    ) {
      return { ...n, value: 0 };
    }
    return n;
  });
  // Đệ quy cho từng node con
  for (const child of children) {
    const childValue = newData.find((n) => n.id === child.id)?.value ?? 0;
    newData = distributeCheckedValues(newData, child.id, childValue);
  }
  newData = newData.map((n) => (n.id === nodeId ? { ...n, value } : n));
  return ensureIsCheckedBoolean(newData);
}

// Recursively set isChecked for node and all descendants
function setCheckedRecursive(
  data: TreeNodeElement[],
  nodeId: string,
  checked: boolean
): TreeNodeElement[] {
  const node = data.find((n) => n.id === nodeId);
  if (!node) return data;
  let newData = data.map((n) =>
    n.id === nodeId ? { ...n, isChecked: checked } : n
  );
  if (node.children && node.children.length > 0) {
    for (const cid of node.children) {
      newData = setCheckedRecursive(newData, cid, checked);
    }
  }
  return newData;
}

// Cập nhật trạng thái isChecked cho cha nếu tất cả con đều unchecked
function propagateUncheckUpwards(
  data: TreeNodeElement[],
  nodeId: string
): TreeNodeElement[] {
  const node = data.find((n) => n.id === nodeId);
  if (!node || !node.parent) return data;
  const parent = data.find((n) => n.id === node.parent);
  if (!parent) return data;
  const siblings = parent.children.map(
    (cid) => data.find((n) => n.id === cid)!
  );
  // Nếu tất cả con đều unchecked thì cha cũng unchecked
  if (siblings.every((n) => !n.isChecked)) {
    let newData = data.map((n) =>
      n.id === parent.id ? { ...n, isChecked: false } : n
    );
    // propagate tiếp lên ancestor
    return propagateUncheckUpwards(newData, parent.id);
  }
  return data;
}

function QuestionSettings({
  maxNumQuestions = 100,
}: {
  maxNumQuestions?: number;
}) {
  const loadedAlertElement = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<TreeNodeElement[]>(initialData);
  const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState<
    TreeNodeElement[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // State để lưu nodeId bị lỗi tổng
  const [warningNodeIds, setWarningNodeIds] = useState<string[]>([]);
  // Thay vì chỉ lưu lastChangedId, lưu mảng lastChangedIds
  const [lastChangedIds, setLastChangedIds] = useState<string[]>([]);

  // Phân phối giá trị khi mount hoặc maxNumQuestions thay đổi
  React.useEffect(() => {
    const root = data.find((n) => n.parent === null);
    if (!root) return;
    let newData = data.map((n) => ({ ...n, value: 0, isChecked: true }));
    newData = distributeCheckedValues(newData, root.id, maxNumQuestions);
    setData(newData);
  }, [maxNumQuestions]);

  // Fix: onLoadData signature and id type
  const onLoadData = async (props: { element: any }) => {
    // Cast element to TreeNodeElement for custom properties
    const element = props.element as TreeNodeElement;
    if (element.children.length > 0) return;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setData((value) => {
      // Add new children with string id and isChecked: true
      const newChildren = [
        {
          name: `Child Node ${value.length}`,
          children: [],
          id: `${value.length}`,
          parent: element.id,
          isBranch: true,
          value: 0,
          isChecked: true,
        },
        {
          name: "Another child Node",
          children: [],
          id: `${value.length + 1}`,
          parent: element.id,
          isBranch: true,
          value: 0,
          isChecked: true,
        },
      ];
      // Update parent's children as string[]
      return value
        .map((node) =>
          node.id === element.id
            ? {
                ...node,
                children: [...node.children, ...newChildren.map((c) => c.id)],
              }
            : node
        )
        .concat(newChildren);
    });
  };

  // Fix: wrappedOnLoadData signature
  const wrappedOnLoadData = async (props: { element: any }) => {
    const element = props.element as TreeNodeElement;
    const nodeHasNoChildData = element.children.length === 0;
    const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find(
      (e) => e.id === element.id
    );
    await onLoadData(props);
    if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {
      const el = loadedAlertElement.current;
      setNodesAlreadyLoaded([...nodesAlreadyLoaded, element]);
      if (el) el.innerHTML = `${element.name} loaded`;
      setTimeout(() => {
        if (el) el.innerHTML = "";
      }, 5000);
    }
  };

  // Fix: onNodeSelect signature and cast
  const handleNodeSelect = (props: { element: any; isSelected: boolean }) => {
    const element = props.element as TreeNodeElement;
    setSelectedIds((prev) => {
      if (props.isSelected) {
        return [...prev, element.id];
      } else {
        return prev.filter((id) => id !== element.id);
      }
    });
  };

  // Hàm kiểm tra các node có tổng con không đúng
  function getInvalidSumNodeIds(
    data: TreeNodeElement[],
    maxNumQuestions: number
  ): string[] {
    const invalidIds: string[] = [];
    // 1. Kiểm tra tổng các node con của root
    const root = data.find((n) => n.parent === null);
    if (root) {
      const rootChildren = data.filter((n) => n.parent === root.id);
      const sum = rootChildren.reduce((acc, n) => acc + (n.value ?? 0), 0);
      if (sum !== maxNumQuestions) {
        rootChildren.forEach((n) => invalidIds.push(n.id));
      }
    }
    // 2. Kiểm tra tổng các node con của từng node (nếu có children)
    data.forEach((node) => {
      if (node.children && node.children.length > 0) {
        const children = node.children
          .map((cid) => data.find((n) => n.id === cid))
          .filter(Boolean) as TreeNodeElement[];
        const sum = children.reduce((acc, n) => acc + (n.value ?? 0), 0);
        if (sum !== node.value) {
          children.forEach((n) => invalidIds.push(n.id));
        }
      }
    });
    return invalidIds;
  }

  // Hàm kiểm tra node con của node khác
  const isDescendant = (
    data: TreeNodeElement[],
    ancestorId: string | null,
    nodeId: string
  ): boolean => {
    if (!ancestorId) return false;
    if (ancestorId === nodeId) return true;
    const node = data.find((n) => n.id === nodeId);
    if (!node || !node.parent) return false;
    return isDescendant(data, ancestorId, node.parent);
  };

  // Xử lý onChange checkbox: khi check/uncheck sẽ update isChecked và redistribute lại value
  const handleCheckChange = (nodeId: string, checked: boolean) => {
    setData((prev) => {
      let newData = setCheckedRecursive(prev, nodeId, checked);
      // Always keep root checked
      newData = newData.map((n) =>
        n.parent === null ? { ...n, isChecked: true } : n
      );
      // propagate trạng thái lên cha nếu uncheck
      if (!checked) {
        newData = propagateUncheckUpwards(newData, nodeId);
      }
      const root = newData.find((n) => n.parent === null);
      if (!root) return newData;
      newData = distributeCheckedValues(newData, root.id, maxNumQuestions);
      return newData;
    });
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
              getNodeProps,
              level,
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
              const node = data.find((n) => n.id === element.id)!;
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
                        node.isChecked ? "text-primary" : "text-white"
                      }`}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleCheckChange(node.id, !node.isChecked);
                      }}
                      variant={
                        node.isChecked
                          ? node.children &&
                            node.children.length > 0 &&
                            node.children.some((cid) => {
                              const child = data.find((n) => n.id === cid);
                              return child && !child.isChecked;
                            })
                            ? "some"
                            : "all"
                          : "none"
                      }
                    />
                    <span className="name">
                      {element.name}-{element.id}
                    </span>
                  </div>
                  <div className="flex items-center ml-auto flex-shrink-0 relative">
                    <div className="flex items-center gap-2">
                      {/* <Tooltip
                          content={
                            <div className="max-w-lg">
                              Currently, there are only {item.numQuestion}{" "}
                              questions available in the selected chapter.
                              <br />
                              You may consider selecting additional chapters,
                              reducing the number of questions, or creating your
                              own questions in the "Edit Details" step.
                            </div>
                          }
                        >
                          <FaCircleInfo size={18} className="text-red-500" />
                        </Tooltip> */}
                      {(() => {
                        const node = element as unknown as TreeNodeElement;
                        const showError =
                          warningNodeIds.includes(node.id) &&
                          lastChangedIds.includes(node.id);
                        return (
                          <>
                            <input
                              type="number"
                              className={`w-16 text-center  border-1 focus:outline-none rounded-md px-1 h-10 text-gray-700 font-medium text-sm mr-2 ${
                                node.isLocked
                                  ? "bg-gray-100 cursor-not-allowed"
                                  : "bg-white  border-gray-300 "
                              }`}
                              value={node.value ?? ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                let newValue =
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value);
                                if (typeof maxNumQuestions === "number") {
                                  newValue = Math.max(
                                    0,
                                    Math.min(newValue, maxNumQuestions)
                                  );
                                }
                                setData((prev) => {
                                  const newData = distributeValueRecursively(
                                    prev,
                                    node.id,
                                    newValue
                                  );
                                  const invalidIds = getInvalidSumNodeIds(
                                    newData,
                                    maxNumQuestions
                                  );
                                  setWarningNodeIds(invalidIds);
                                  setLastChangedIds((prevIds) => {
                                    // Nếu node này gây warning, thêm vào lastChangedIds (nếu chưa có)
                                    let next = prevIds;
                                    if (invalidIds.includes(node.id)) {
                                      if (!prevIds.includes(node.id))
                                        next = [...prevIds, node.id];
                                    } else {
                                      // Nếu node này không còn warning, loại khỏi mảng
                                      next = prevIds.filter(
                                        (id) => id !== node.id
                                      );
                                    }
                                    // Nếu các node trong prevIds không còn warning thì loại khỏi luôn
                                    next = next.filter((id) =>
                                      invalidIds.includes(id)
                                    );
                                    return next;
                                  });
                                  return newData;
                                });
                              }}
                              readOnly={node.isLocked}
                            />
                            {showError && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-100 border border-red-400 text-xs font-semibold text-red-700 ml-1 gap-1"
                                style={{
                                  minWidth: 28,
                                  justifyContent: "center",
                                }}
                              >
                                <span
                                  className="font-bold text-base text-red-700"
                                  style={{ lineHeight: 1 }}
                                >
                                  {node.value}
                                </span>
                                <FaCircleInfo
                                  size={14}
                                  className="text-red-500"
                                />
                              </span>
                            )}
                            {node.isLocked ? (
                              <span
                                className="ml-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setData((prev) =>
                                    prev.map((item) =>
                                      item.id === node.id
                                        ? { ...item, isLocked: false }
                                        : item
                                    )
                                  );
                                }}
                              >
                                <TiLockClosed
                                  size={18}
                                  className="text-black"
                                />
                              </span>
                            ) : (
                              <span
                                className="ml-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setData((prev) =>
                                    prev.map((item) =>
                                      item.id === node.id
                                        ? { ...item, isLocked: true }
                                        : item
                                    )
                                  );
                                }}
                              >
                                <TiLockOpen size={18} className="text-black" />
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
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
