import { Question } from '../../types';

interface ProblemCardOverlayProps {
  problem: Question;
}

const ProblemCardOverlay = ({ problem }: ProblemCardOverlayProps) => {
  return (
    <div className="border border-gray-200 rounded-lg shadow-lg bg-white opacity-90 w-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-400 mx-auto"
          >
            <path
              fillRule="evenodd"
              d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM10.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold text-gray-800">{problem.id}</span>
          <span className="text-sm text-gray-500">
            Question types: ({problem.questionType})
          </span>
        </div>
      </div>
      <div className="p-3">
        {problem.emailExcerpt && (
          <div
            className="mb-2 text-sm text-gray-700 whitespace-normal"
            dangerouslySetInnerHTML={{ __html: problem.emailExcerpt }}
          />
        )}
        <p className="text-gray-900 font-medium whitespace-normal">
          Question: {problem.questionText}
        </p>
      </div>
    </div>
  );
};

export default ProblemCardOverlay;
