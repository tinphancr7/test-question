import React from "react";
import TreeMenuNode from "./TreeMenuNode";

export interface TreeMenuItem {
  id: string;
  label: string;
  numQuestion: number | null;
  isLocked: boolean;
  isChecked: boolean;
  children?: TreeMenuItem[];
  hasRedBadge?: boolean;
  redBadgeValue?: string;
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
    isLastChild?: boolean,
    hasParent?: boolean
  ) => React.ReactNode;
}

const TreeMenu: React.FC<TreeMenuProps> = ({
  data,
  onItemChange,
  level = 0,
  renderItem,
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

export default TreeMenu;
