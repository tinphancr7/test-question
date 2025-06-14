// src/components/NewQuestionCard.tsx
import { Question } from '../../types';

interface NewQuestionCardProps {
  question: Question;
  index: number;
  onAddQuestion: (question: Question) => void;
}

const NewQuestionCard = ({
  question,
  index,
  onAddQuestion,
}: NewQuestionCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-800">{index + 1}</span>
          <span className="text-sm text-gray-500">
            Question types: {question.questionType} ({question.problemType})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-400 hover:text-red-600">
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
              className="lucide lucide-trash-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
          {/* Nút Add */}
          <button
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => onAddQuestion(question)}
          >
            Add
          </button>
        </div>
      </div>

      {question.emailExcerpt && (
        <div className="mb-3 p-3 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-normal">
          <h4 className="font-semibold mb-1">Email Text (Excerpt)</h4>
          <div dangerouslySetInnerHTML={{ __html: question.emailExcerpt }} />
        </div>
      )}
      <p className="text-gray-900 mb-3 font-medium whitespace-normal">
        Question: {question.questionText}
      </p>

      {question.answerChoices && question.answerChoices.length > 0 && (
        <div className="mb-3">
          <h5 className="font-semibold text-gray-800 text-sm mb-1">
            Answer Choices:
          </h5>
          <ul className="text-sm text-gray-700 space-y-1">
            {question.answerChoices.map((choice) => (
              <li key={choice}>{choice}</li>
            ))}
          </ul>
        </div>
      )}

      {question.correctAnswer && (
        <div className="mb-3">
          <span className="inline-flex items-center rounded-md bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Correct Answer
          </span>
          <p className="text-sm text-green-800 mt-1">
            {question.correctAnswer}
          </p>
        </div>
      )}

      {question.explanation && (
        <div>
          <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/10">
            Explanation
          </span>
          <p className="text-sm text-gray-700 mt-1">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default NewQuestionCard;
