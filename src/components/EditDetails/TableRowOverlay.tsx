import type { Question } from "../../types";

interface TableRowOverlayProps {
  question: Question;
}

const TableRowOverlay = ({ question }: TableRowOverlayProps) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 shadow-lg bg-white opacity-90">
      <tbody>
        <tr style={{ display: "table-row" }}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {question.id}
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
        </tr>
      </tbody>
    </table>
  );
};

export default TableRowOverlay;
