import { useEffect, useRef, useState } from "react";
import TreeMenu from "./TreeMenu";
import type { TreeMenuItem } from "./TreeMenu";

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
      {renderItem(
        item,
        level,
        isExpanded,
        toggleExpand,
        onItemChange,
        isLast,
        level > 0
      )}
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

export default TreeMenuNode;
