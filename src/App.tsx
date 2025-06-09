import { useState } from "react";
import QuestionSettings from "./components/QuestionSettings";
import SubjectSelector from "./components/SubjectSelector";
import TestSettings from "./components/TestSettings";

// Main App Component
function App() {
  const [maxNumQuestions, setMaxNumQuestions] = useState(100);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row  border-t border-gray-200">
          {/* Left Panel: Question Settings */}
          <div className="w-full lg:w-2/3   ">
            <SubjectSelector
              maxNumQuestions={maxNumQuestions}
              setMaxNumQuestions={setMaxNumQuestions}
            />
            <QuestionSettings maxNumQuestions={maxNumQuestions} />
          </div>

          {/* Right Panel: Test Settings */}
          <div className="w-full lg:w-1/3 pl-0 ">
            <TestSettings />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
