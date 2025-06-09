import React, { useState, useRef, useEffect } from "react";

export interface TreeMenuItem {
  id: string;
  label: string;
  isChecked?: boolean;
  isLocked?: boolean;
  score?: number | null;
  children?: TreeMenuItem[];
  [key: string]: any;
}

interface TreeMenuProps {
  data: TreeMenuItem[];
  onItemChange: (id: string, key: string, value: any) => void;
  level?: number;
  renderItem?: (
    item: TreeMenuItem,
    level: number,
    isExpanded: boolean,
    toggleExpand: () => void,
    onItemChange: (id: string, key: string, value: any) => void,
    parentNumQuestion?: number,
    isLastChild?: boolean,
    hasParent?: boolean
  ) => React.ReactNode;
}

const DefaultTreeMenuItem = (
  item: TreeMenuItem,
  level: number,
  isExpanded: boolean,
  toggleExpand: () => void,
  onItemChange: (id: string, key: string, value: any) => void,
  parentNumQuestion?: number,
  isLastChild?: boolean,
  hasParent?: boolean
) => {
  return (
    <div
      className={`flex items-center py-3 pr-4 border-b cursor-pointer hover:bg-gray-50 transition-colors duration-150 ${
        level === 0 ? "bg-gray-50" : ""
      }`}
      style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
      onClick={toggleExpand}
    >
      <div className="flex-shrink-0 w-6">
        {item.children && item.children.length > 0 && (
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
              isExpanded ? "rotate-90" : ""
            }`}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-3 flex-shrink-0"
        checked={item.isChecked}
        onChange={(e) => {
          e.stopPropagation();
          onItemChange(item.id, "isChecked", e.target.checked);
        }}
      />
      <span className="flex-grow text-sm sm:text-base text-gray-800 truncate">
        {item.label}
      </span>
    </div>
  );
};

const TreeMenu: React.FC<TreeMenuProps> = ({
  data,
  onItemChange,
  level = 0,
  renderItem = DefaultTreeMenuItem,
}) => {
  return (
    <div>
      {data.map((item, idx) => (
        <TreeMenuNode
          key={item.id}
          item={item}
          level={level}
          onItemChange={onItemChange}
          renderItem={renderItem}
          isLast={idx === data.length - 1}
        />
      ))}
    </div>
  );
};

const TreeMenuNode: React.FC<{
  item: TreeMenuItem;
  level: number;
  onItemChange: (id: string, key: string, value: any) => void;
  renderItem: (
    item: TreeMenuItem,
    level: number,
    isExpanded: boolean,
    toggleExpand: () => void,
    onItemChange: (id: string, key: string, value: any) => void,
    parentNumQuestion?: number,
    isLastChild?: boolean,
    hasParent?: boolean
  ) => React.ReactNode;
  isLast?: boolean;
}> = ({ item, level, onItemChange, renderItem, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    // if (item.children && item.children.length > 0) {
    //   setIsExpanded((prev) => !prev);
    // }
  };

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let transitionEndHandler: (() => void) | null = null;
    if (isExpanded) {
      setMaxHeight(`${el.scrollHeight}px`);
      transitionEndHandler = () => {
        setMaxHeight("none");
        el.removeEventListener("transitionend", transitionEndHandler!);
      };
      el.addEventListener("transitionend", transitionEndHandler);
    } else {
      setMaxHeight(`${el.scrollHeight}px`);
      void el.offsetHeight;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMaxHeight("0px");
        });
      });
    }
    return () => {
      if (transitionEndHandler) {
        el.removeEventListener("transitionend", transitionEndHandler);
      }
    };
  }, [isExpanded]);

  return (
    <div>
      {renderItem(item, level, isExpanded, toggleExpand, onItemChange, undefined, isLast, level > 0)}
      <div
        ref={contentRef}
        className="overflow-hidden  transition-all duration-300 ease-in-out"
        style={{ maxHeight }}
      >
        {item.children && item.children.length > 0 && (
          <TreeMenu
            data={item.children}
            onItemChange={onItemChange}
            level={level + 1}
            renderItem={renderItem}
          />
        )}
      </div>
    </div>
  );
};

export default TreeMenu;
