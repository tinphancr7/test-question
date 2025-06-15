import { useState } from "react";
import QuestionSettings from "./QuestionSettings";
import SubjectSelector from "./SubjectSelector";
import TestSettings from "./TestSettings";

interface ConfigSettingProps {
  onNextStep: () => void;
}

const ConfigSetting = ({ onNextStep }: ConfigSettingProps) => {
  const [maxNumQuestions, setMaxNumQuestions] = useState(100);
  const [activeTab, setActiveTab] = useState("Subject");

  const tabs = [
    { name: "Subject", content: "Content for Subject tab" },
    { name: "Exam Type", content: "Content for Exam Type tab" },
    {
      name: "Past Exams by School",
      content: "Content for Past Exams by School tab",
    },
    { name: "Upload Past Exam", content: "Content for Upload Past Exam tab" },
  ];
  return (
    <div className="min-h-screen w-full bg-gray-100 px-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-2 py-4 space-x-2 sm:space-x-4">
          {tabs.map((tab) => (
            <div key={tab.name} className="flex-1">
              <button
                className={`w-full h-10  rounded-lg
                  transition-all duration-300 ease-in-out transform
                  ${
                    activeTab === tab.name
                      ? "bg-[#F5F7FA]  font-medium shadow-md "
                      : "bg-transparent"
                  }`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.name}
              </button>
            </div>
          ))}
        </div>
        <div className="flex  flex-row  border-t border-gray-200">
          <div className="w-2/3">
            <SubjectSelector
              maxNumQuestions={maxNumQuestions}
              setMaxNumQuestions={setMaxNumQuestions}
            />
            <QuestionSettings maxNumQuestions={maxNumQuestions} />
          </div>
          <div className=" w-1/3 ">
            <TestSettings
              onNextStep={onNextStep}
              maxNumQuestions={maxNumQuestions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigSetting;
