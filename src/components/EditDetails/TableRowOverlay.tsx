import { Question } from '../../types';

interface TableRowOverlayProps {
  question: Question;
}

const TableRowOverlay = ({ question }: TableRowOverlayProps) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 shadow-lg bg-white opacity-90">
      <tbody>
        <tr style={{ display: 'table-row' }}>
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
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button className="text-gray-500">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableRowOverlay;
