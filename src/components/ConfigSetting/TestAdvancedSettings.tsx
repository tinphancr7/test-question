import React, { useMemo, useState, useCallback } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Switch } from "@heroui/react";
import QuestionTypeSelector from "./QuestionTypeSelector";

interface TestAdvancedSettingsProps {
  selectedDifficulty: number;
  setSelectedDifficulty: (difficulty: number) => void;
  maxNumQuestions: number;
}

// Constants
const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5] as const;

// Reusable components
const SectionHeader: React.FC<{
  title: string;
  settingLabel: string;
  icon?: React.ReactNode;
}> = ({ title, settingLabel, icon = <IoMdSettings /> }) => (
  <div className="flex items-center justify-between mb-2">
    <label className="block text-sm font-bold">{title}</label>
    <div className="flex items-center gap-2 text-gray-600 text-sm">
      {icon}
      <span>{settingLabel}</span>
    </div>
  </div>
);

const InfoTooltip: React.FC<{ className?: string }> = ({
  className = "text-gray-500",
}) => <FaInfoCircle className={className} aria-label="Information" />;

const TestAdvancedSettings: React.FC<TestAdvancedSettingsProps> = ({
  selectedDifficulty,
  setSelectedDifficulty,
  maxNumQuestions,
}) => {
  // State for AI scoring and additional options
  const [isAIScoringEnabled, setIsAIScoringEnabled] = useState(true);
  const [excludeDuplicates, setExcludeDuplicates] = useState(false);

  // Memoized difficulty buttons to prevent unnecessary re-renders
  const difficultyButtons = useMemo(
    () =>
      DIFFICULTY_LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          className={`flex-1 px-4 py-2 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
            selectedDifficulty === level
              ? "bg-yellow-100 border-yellow-400 text-yellow-800 shadow-sm"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
          onClick={() => setSelectedDifficulty(level)}
          aria-pressed={selectedDifficulty === level}
          aria-label={`Set difficulty level to ${level}`}
        >
          {level}
        </button>
      )),
    [selectedDifficulty, setSelectedDifficulty]
  );

  // Callback handlers for better performance
  const handleAIScoringToggle = useCallback((selected: boolean) => {
    setIsAIScoringEnabled(selected);
  }, []);

  const handleExcludeDuplicatesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setExcludeDuplicates(e.target.checked);
    },
    []
  );

  return (
    <div className="col-span-2 space-y-4">
      {/* Difficulty Level Section */}
      <section>
        <SectionHeader
          title="Test level (difficulty)"
          settingLabel="Difficulty setting"
        />
        <div
          className="flex flex-wrap items-center gap-2"
          role="radiogroup"
          aria-label="Select difficulty level"
        >
          {difficultyButtons}
        </div>
      </section>

      {/* Question Type Section */}
      <section>
        <SectionHeader
          title="Question type"
          settingLabel="Question type setting"
        />
        <QuestionTypeSelector maxNumQuestions={maxNumQuestions} />
      </section>

      {/* AI Scoring Section */}
      <section>
        <div className="flex items-center gap-3 border border-gray-200 py-3 px-4 rounded-lg bg-gray-50">
          <Switch
            size="sm"
            isSelected={isAIScoringEnabled}
            onValueChange={handleAIScoringToggle}
            color="primary"
            aria-label="Toggle AI scoring"
          >
            {isAIScoringEnabled ? "ON" : "OFF"} AI Scoring
          </Switch>
          <InfoTooltip />
        </div>
      </section>

      {/* Additional Options Section */}
      <section>
        <h3 className="block text-sm font-bold mb-3">Additional options</h3>
        <div className="flex items-center gap-3 border border-gray-200 py-3 px-4 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="excludeDuplicate"
              checked={excludeDuplicates}
              onChange={handleExcludeDuplicatesChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor="excludeDuplicate"
              className="text-gray-700 text-sm cursor-pointer select-none"
            >
              Exclude existing launch problems
            </label>
          </div>
          <InfoTooltip />
        </div>
      </section>
    </div>
  );
};

export default TestAdvancedSettings;
