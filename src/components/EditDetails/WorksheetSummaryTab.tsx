import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableRow from './SortableRow';

import { Question } from '../../types';
import TableRowOverlay from './TableRowOverlay';

interface WorksheetSummaryTabProps {
  selectedQuestions: Question[];
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  onDragCancel: () => void;
  sensors: any;
  activeQuestion?: Question | null;
}

const WorksheetSummaryTab = ({
  selectedQuestions,
  activeQuestion,
  onDragStart,
  onDragEnd,
  onDragCancel,
  sensors,
}: WorksheetSummaryTabProps) => {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Difficulty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Problem type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <SortableContext
            items={selectedQuestions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {selectedQuestions.map((question, index) => (
              <SortableRow
                key={question.id}
                question={question}
                index={index}
              />
            ))}
          </SortableContext>
        </tbody>
      </table>

      <DragOverlay>
        {activeQuestion ? <TableRowOverlay question={activeQuestion} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WorksheetSummaryTab;
