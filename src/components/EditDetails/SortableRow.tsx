// src/components/SortableRow.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { MdDragIndicator } from 'react-icons/md';
import type { Question } from '../../types';

interface SortableRowProps {
  question: Question;
  index: number;
}

const SortableRow = ({ question, index }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging ? '#e0e7ff' : '',
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="hover:bg-gray-50"
      {...attributes}
      {...listeners}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {question.difficulty}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {question.problemType}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div>{question.title}</div>
        <div className="text-xs text-gray-500">{question.category}</div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-center cursor-move">
        <MdDragIndicator size={18} className="cursor-move" />
      </td>
    </tr>
  );
};

export default SortableRow;
