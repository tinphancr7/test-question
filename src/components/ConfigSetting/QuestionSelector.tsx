interface QuestionSelectorProps {
  maxNumQuestions: number;
  setMaxNumQuestions: (num: number) => void;
}

const QuestionSelector = ({
  maxNumQuestions,
  setMaxNumQuestions,
}: QuestionSelectorProps) => {
  return (
    <div className="flex  pl-4 pr-2 gap-2 py-3 items-center justify-between">
      <label
        htmlFor="numQuestions"
        className="block text-gray-700 text-sm font-medium mb-2"
      >
        Number of questions:{" "}
        <span className="font-normal text-gray-600">Maximum 150 questions</span>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        {[100, 75, 50, 25].map((num) => (
          <button
            key={num}
            className={`px-4 py-2 border rounded-md text-sm ${
              maxNumQuestions === num
                ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setMaxNumQuestions(num)}
            type="button"
          >
            {num}
          </button>
        ))}

        <div className="bg-gray-200 w-[1px] mx-1 h-8" />
        <input
          type="number"
          id="numQuestions"
          className="w-20 border rounded-md px-3 py-2 text-gray-800 focus:outline-none"
          value={maxNumQuestions}
          min={1}
          max={150}
          onChange={(e) => {
            let val = Number(e.target.value);
            if (val > 150) val = 150;
            if (val < 1) val = 1;
            setMaxNumQuestions(val);
          }}
        />
        <span className="text-sm">problem</span>
      </div>
    </div>
  );
};
export default QuestionSelector;
