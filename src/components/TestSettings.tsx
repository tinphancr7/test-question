import { useState, useRef } from "react";
import { BiLock, BiPencil } from "react-icons/bi";
import { BsUnlock } from "react-icons/bs";
import InputField from "./form/input-field";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomRadioGroup from "./form/custom-radio-group";
import CustomSelect from "./form/custom-select";
import SingleFileUpload from "./SingleFileUpload";
import { IoMdSettings } from "react-icons/io";
import { TiLockClosed, TiLockOpen } from "react-icons/ti";
import { FaClock, FaInfoCircle } from "react-icons/fa";
import { MdOutlinePercent } from "react-icons/md";

// Define types for question types
const questionTypeKeys = [
  "multipleChoice",
  "subjective",
  "objective",
  "arrangement",
  "fillInTheBlank",
  "questionGroup",
] as const;
type QuestionTypeKey = (typeof questionTypeKeys)[number];
type QuestionTypes = Record<
  QuestionTypeKey,
  { isLocked: boolean; isChecked: boolean; count: number }
>;

const TestSettings = () => {
  // State to manage the selected difficulty level, defaulting to 1 as per the image
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  // State to manage question types, their enabled status, and count
  const [questionTypes, setQuestionTypes] = useState<QuestionTypes>({
    multipleChoice: { isLocked: false, isChecked: false, count: 25 },
    subjective: { isLocked: false, isChecked: false, count: 25 },
    objective: { isLocked: false, isChecked: false, count: 25 },
    arrangement: { isLocked: false, isChecked: false, count: 25 }, // Enabled and count 25 based on image
    fillInTheBlank: { isLocked: false, isChecked: false, count: 0 },
    questionGroup: { isLocked: false, isChecked: false, count: 0 },
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for toggling the enabled status of a question type
  const handleQuestionTypeLock = (type: QuestionTypeKey) => {
    setQuestionTypes((prev) => ({
      ...prev,
      [type]: { ...prev[type], isLocked: !prev[type].isLocked },
    }));
  };

  const handleQuestionTypeCheck = (type: QuestionTypeKey) => {
    setQuestionTypes((prev) => ({
      ...prev,
      [type]: { ...prev[type], isChecked: !prev[type].isChecked },
    }));
  };

  // Handler for changing the count of questions for a specific type
  const handleQuestionCountChange = (type: QuestionTypeKey, value: string) => {
    setQuestionTypes((prev) => ({
      ...prev,
      [type]: { ...prev[type], count: parseInt(value) || 0 }, // Ensure count is a number
    }));
  };

  const defaultValues = {
    name: "",
    author: "",
    price: "",
    status: "private", // Default to private
    specialCategory: "junior",
    passRate: "",
    duration: "",
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    mode: "onChange",

    // resolver: yupResolver(categorySchema),
  });

  const onSubmit = handleSubmit((data) => {});

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  const handleThumbnailChange = (file: File | null) => {
    setThumbnail(file);
    setThumbnailPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className=" bg-gray-100 min-h-screen ">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Name Input */}
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <InputField
                {...field}
                isRequired
                label="Test name"
                placeholder="Enter the test name"
                isInvalid={!!errors?.name}
                errorMessage={errors?.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="author"
            render={({ field }) => (
              <InputField
                {...field}
                isRequired
                label="Author name"
                placeholder="Enter the author name"
                isInvalid={!!errors?.author}
                errorMessage={errors?.author?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <InputField
                {...field}
                type="number"
                isRequired
                label="Original price (won)"
                placeholder="Enter the original price"
                isInvalid={!!errors?.price}
                errorMessage={errors?.price?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <CustomRadioGroup
                {...field}
                label="Test status"
                isRequired
                items={[
                  { label: "Private", value: "private" },
                  { label: "Public", value: "public" },
                ]}
              />
            )}
          />
          <Controller
            control={control}
            name="specialCategory"
            render={({ field }) => (
              <div className="col-span-2">
                <CustomSelect
                  label="Special category"
                  {...field}
                  isRequired
                  selectedKeys={[field.value]}
                  items={[
                    { label: "Junior high school", value: "junior" },
                    { label: "High school", value: "high" },
                  ]}
                  placeholder="--- select ---"
                  isInvalid={!!errors?.specialCategory}
                  errorMessage={errors?.specialCategory?.message}
                />
              </div>
            )}
          />

          {/* Thumbnail Image Upload Area */}

          <SingleFileUpload
            label="Thumbnail image"
            value={thumbnail}
            previewUrl={thumbnailPreview}
            onChange={handleThumbnailChange}
            required
          />

          {/* Test Level (Difficulty) Section */}
          <div className="col-span-2 ">
            <div className="flex items-center justify-between mb-2">
              <label className="block  text-sm font-bold">
                Test level (dificulty)
              </label>
              {/* "OFF AI Learning" checkbox */}
              <div className="flex items-center justify-center gap-2">
                <IoMdSettings />
                <span>Difficult setting</span>
              </div>
            </div>
            {/* Difficulty level buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  className={`flex-1 px-4 py-2 border rounded-md text-sm ${
                    selectedDifficulty === level
                      ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedDifficulty(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Question Type Section */}
          <div className="col-span-2 ">
            <div className="flex items-center justify-between mb-2">
              <label className="block  text-sm font-bold">Question type</label>
              {/* "OFF AI Learning" checkbox */}
              <div className="flex items-center justify-center gap-2">
                <IoMdSettings />
                <span> Question type setting</span>
              </div>
            </div>

            {/* Grid for question type cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {questionTypeKeys.map((type) => (
                <div
                  key={type}
                  className="relative  rounded-xl border border-yellow-400 p-4 shadow-sm"
                >
                  {/* Checkbox */}
                  <div className="flex justify-center mb-2">
                    <input
                      type="checkbox"
                      checked={questionTypes[type].isChecked}
                      onChange={() => handleQuestionTypeCheck(type)}
                      className="form-checkbox h-5 w-5 text-yellow-500 bg-yellow-400 border-yellow-400 rounded"
                      readOnly
                      disabled={questionTypes[type].isLocked}
                    />
                  </div>

                  {/* Label */}
                  <div className="text-center capitalize  text-sm mb-2 text-nowrap">
                    {type.replace(/([A-Z])/g, " $1").trim()}
                  </div>

                  {/* Number input and lock */}
                  <div className="flex justify-center items-center gap-1">
                    <input
                      type="number"
                      value={questionTypes[type].count}
                      onChange={(e) =>
                        handleQuestionCountChange(type, e.target.value)
                      }
                      disabled={questionTypes[type].isLocked}
                      min={0}
                      className="w-14 text-center px-1 py-0.5 border rounded focus:outline-none disabled:bg-gray-100"
                    />
                    <button onClick={() => handleQuestionTypeLock(type)}>
                      {questionTypes[type].isLocked ? (
                        <TiLockClosed size={18} className="text-black" />
                      ) : (
                        <TiLockOpen size={18} className="text-black" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options Section */}
          <div className="col-span-2 ">
            <label className="block  text-sm font-bold mb-2">
              Additional options
            </label>
            <div className="flex items-center gap-2 border py-2.5 px-4 rounded">
              <input
                type="checkbox"
                id="excludeDuplicate"
                className=" h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="excludeDuplicate"
                className="text-gray-700 text-sm"
              >
                Excluding existing launch problems
              </label>
              <FaInfoCircle className="text-gray-500 " />
            </div>
          </div>

          <Controller
            control={control}
            name="passRate"
            render={({ field }) => (
              <InputField
                {...field}
                isRequired
                label="Pass rate"
                type="number"
                endContent={
                  <span className="text-gray-500">
                    <MdOutlinePercent />
                  </span>
                }
                placeholder="50"
                isInvalid={!!errors?.passRate}
                errorMessage={errors?.passRate?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="duration"
            render={({ field }) => (
              <InputField
                {...field}
                isRequired
                endContent={
                  <span className="text-gray-500">
                    <FaClock />
                  </span>
                }
                label="Duration"
                placeholder="hh:mm:ss"
                isInvalid={!!errors?.duration}
                errorMessage={errors?.duration?.message}
              />
            )}
          />
        </div>
        {/* Action Buttons (Cancel and Next Step) */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 flex items-center">
            Next step
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestSettings;
