import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {FaClock, FaInfoCircle} from "react-icons/fa";
import {IoMdSettings} from "react-icons/io";
import {MdOutlinePercent} from "react-icons/md";
import {RiArrowRightSLine} from "react-icons/ri";
import {TiLockClosed, TiLockOpen} from "react-icons/ti";

import {Switch} from "@heroui/react";

import SingleFileUpload from "./SingleFileUpload";
import InputField from "../form/input-field";
import CustomRadioGroup from "../form/custom-radio-group";
import CustomSelect from "../form/custom-select";

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
	{isLocked: boolean; isChecked: boolean; count: number}
>;

interface TestSettingsProps {
	onNextStep: () => void;
	maxNumQuestions: number;
}

const TestSettings = ({onNextStep, maxNumQuestions}: TestSettingsProps) => {
	// State to manage the selected difficulty level, defaulting to 1 as per the image
	const [selectedDifficulty, setSelectedDifficulty] = useState(1);
	// State to manage question types, their enabled status, and count
	const [questionTypes, setQuestionTypes] = useState<QuestionTypes>({
		multipleChoice: {isLocked: false, isChecked: true, count: 25},
		subjective: {isLocked: false, isChecked: true, count: 25},
		objective: {isLocked: false, isChecked: true, count: 25},
		arrangement: {isLocked: false, isChecked: true, count: 25},
		fillInTheBlank: {isLocked: false, isChecked: true, count: 0},
		questionGroup: {isLocked: false, isChecked: true, count: 0},
	});

	// Redistribute counts so that the total of all checked (locked and unlocked) always equals maxNumQuestions
	const redistributeCheckedEqually = (types: QuestionTypes) => {
		// 1. Calculate the sum of checked & locked counts
		let checkedLockedSum = 0;
		(Object.keys(types) as QuestionTypeKey[]).forEach((key) => {
			if (types[key].isChecked && types[key].isLocked)
				checkedLockedSum += types[key].count;
		});

		// 2. Find checked & unlocked types
		const checkedAndUnlockedKeys = (
			Object.keys(types) as QuestionTypeKey[]
		).filter((key) => types[key].isChecked && !types[key].isLocked);
		const totalCheckedAndUnlocked = checkedAndUnlockedKeys.length;
		const remaining = Math.max(0, maxNumQuestions - checkedLockedSum);
		const base =
			totalCheckedAndUnlocked > 0
				? Math.floor(remaining / totalCheckedAndUnlocked)
				: 0;
		let remainder =
			totalCheckedAndUnlocked > 0 ? remaining % totalCheckedAndUnlocked : 0;

		const newTypes: QuestionTypes = {...types};
		(Object.keys(types) as QuestionTypeKey[]).forEach((key) => {
			if (types[key].isChecked && !types[key].isLocked) {
				const count = base + (remainder > 0 ? 1 : 0);
				if (remainder > 0) remainder--;
				newTypes[key] = {...types[key], count};
			}
			if (!types[key].isChecked) {
				newTypes[key] = {...types[key], count: 0};
			}
			// checked & locked: keep their count
		});
		return newTypes;
	};

	// On initial load, distribute equally among checked
	useEffect(() => {
		setQuestionTypes((prev) => redistributeCheckedEqually(prev));
	}, [maxNumQuestions]);

	// Handler for toggling the enabled status of a question type
	const handleQuestionTypeLock = (type: QuestionTypeKey) => {
		setQuestionTypes((prev) => ({
			...prev,
			[type]: {...prev[type], isLocked: !prev[type].isLocked},
		}));
	};

	// Handler for toggling the checked state and redistributing counts
	const handleQuestionTypeCheck = (type: QuestionTypeKey) => {
		setQuestionTypes((prev) => {
			const updated = {
				...prev,
				[type]: {...prev[type], isChecked: !prev[type].isChecked},
			};
			return redistributeCheckedEqually(updated);
		});
	};

	// State for warnings per type
	const [warnings, setWarnings] = useState<
		Record<QuestionTypeKey, string | null>
	>({
		multipleChoice: null,
		subjective: null,
		objective: null,
		arrangement: null,
		fillInTheBlank: null,
		questionGroup: null,
	});

	console.log("warnings", warnings);

	// Helper to get total count
	const getTotalCount = (types: QuestionTypes) =>
		Object.values(types).reduce((sum, t) => sum + t.count, 0);

	// Handler for changing the count of questions for a specific type
	const handleQuestionCountChange = (type: QuestionTypeKey, value: string) => {
		const newCount = parseInt(value, 10) || 0;
		const updated = {
			...questionTypes,
			[type]: {...questionTypes[type], count: newCount},
		};
		// Calculate total for checked types
		const total = Object.keys(updated)
			.filter((key) => updated[key as QuestionTypeKey].isChecked)
			.reduce((sum, key) => sum + updated[key as QuestionTypeKey].count, 0);

		// If valid, clear all warnings
		if (total === maxNumQuestions) {
			setWarnings({
				multipleChoice: null,
				subjective: null,
				objective: null,
				arrangement: null,
				fillInTheBlank: null,
				questionGroup: null,
			});
		} else {
			// Copy previous warnings
			const newWarnings = {...warnings};
			// Only update warning for the changed type
			if (total > maxNumQuestions) {
				newWarnings[type] = `Total exceeds max (${maxNumQuestions})`;
			} else if (total < maxNumQuestions) {
				newWarnings[type] = `Total is less than max (${maxNumQuestions})`;
			} else {
				newWarnings[type] = null;
			}
			setWarnings(newWarnings);
		}
		setQuestionTypes(updated);
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
		control,

		formState: {errors},
	} = useForm({
		defaultValues,
		mode: "onChange",

		// resolver: yupResolver(categorySchema),
	});

	// const onSubmit = handleSubmit((data) => {});
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
	const handleThumbnailChange = (file: File | null) => {
		setThumbnail(file);
		setThumbnailPreview(file ? URL.createObjectURL(file) : null);
	};

	return (
		<div className="bg-white  shadow-md overflow-hidden">
			<div className="p-4 sm:p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Test Name Input */}
				<Controller
					control={control}
					name="name"
					render={({field}) => (
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
					render={({field}) => (
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
					render={({field}) => (
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
					render={({field}) => (
						<CustomRadioGroup
							{...field}
							label="Test status"
							isRequired
							items={[
								{label: "Private", value: "private"},
								{label: "Public", value: "public"},
							]}
						/>
					)}
				/>
				<Controller
					control={control}
					name="specialCategory"
					render={({field}) => (
						<div className="col-span-2">
							<CustomSelect
								label="Special category"
								{...field}
								isRequired
								selectedKeys={[field.value]}
								items={[
									{label: "Junior high school", value: "junior"},
									{label: "High school", value: "high"},
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
								<div className="flex justify-center mb-2">
									<label className="flex items-center cursor-pointer relative">
										<input
											type="checkbox"
											checked={questionTypes[type].isChecked}
											onChange={() => handleQuestionTypeCheck(type)}
											className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-amber-600 checked:border-amber-600"
										/>
										<span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3.5 w-3.5"
												viewBox="0 0 20 20"
												fill="currentColor"
												stroke="currentColor"
												strokeWidth="1"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										</span>
									</label>
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
									{/* Show warning if this input is the cause */}
									{warnings[type] && (
										<span className="ml-1 flex items-center text-red-500 text-xs gap-1">
											<FaInfoCircle className="text-red-500" />
											{warnings[type]}
										</span>
									)}
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

				<div className="col-span-2  flex items-center gap-2 border py-2.5 px-4 rounded">
					<Switch size="sm" defaultSelected color="default">
						OFF AI Scoring
					</Switch>

					<FaInfoCircle className="text-gray-500 " />
				</div>
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
						<label htmlFor="excludeDuplicate" className="text-gray-700 text-sm">
							Excluding existing launch problems
						</label>
						<FaInfoCircle className="text-gray-500 " />
					</div>
				</div>

				<Controller
					control={control}
					name="passRate"
					render={({field}) => (
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
					render={({field}) => (
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
			<div className="p-4 border-gray-200 flex justify-between gap-4 items-center ">
				<button className="px-5 h-11 bg-white flex items-center justify-center gap-1 py-2 border text-[#FAAD14] border-[#FAAD14] rounded-md hover:bg-gray-50 w-[134px]">
					Cancel
				</button>
				<button
					onClick={onNextStep}
					className="px-5 flex-1 h-11 flex items-center justify-center gap-1 py-2 bg-[#FAAD14] text-white rounded-md "
				>
					Next step
					<RiArrowRightSLine size={18} />
				</button>
			</div>
		</div>
	);
};

export default TestSettings;
