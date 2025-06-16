import React, {useCallback, useEffect, useState} from "react";
import {FaInfoCircle} from "react-icons/fa";
import {TiLockClosed, TiLockOpen} from "react-icons/ti";
import {
	questionTypeKeys,
	type QuestionTypeKey,
	type QuestionTypes,
} from "./questionTypeDefs";
import {FaCheck} from "react-icons/fa6";

interface QuestionTypeSelectorProps {
	maxNumQuestions: number;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
	maxNumQuestions,
}) => {
	const [questionTypes, setQuestionTypes] = useState<QuestionTypes>({
		multipleChoice: {isLocked: false, isChecked: true, count: 25},
		subjective: {isLocked: false, isChecked: true, count: 25},
		objective: {isLocked: false, isChecked: true, count: 25},
		arrangement: {isLocked: false, isChecked: true, count: 25},
		fillInTheBlank: {isLocked: false, isChecked: true, count: 0},
		questionGroup: {isLocked: false, isChecked: true, count: 0},
	});

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

	const redistributeCheckedEqually = useCallback((types: QuestionTypes) => {
		let checkedLockedSum = 0;
		questionTypeKeys.forEach((key) => {
			if (types[key].isChecked && types[key].isLocked)
				checkedLockedSum += types[key].count;
		});
		const checkedAndUnlockedKeys = questionTypeKeys.filter(
			(key) => types[key].isChecked && !types[key].isLocked
		);
		const totalCheckedAndUnlocked = checkedAndUnlockedKeys.length;
		const remaining = Math.max(0, maxNumQuestions - checkedLockedSum);
		const base =
			totalCheckedAndUnlocked > 0
				? Math.floor(remaining / totalCheckedAndUnlocked)
				: 0;
		let remainder =
			totalCheckedAndUnlocked > 0 ? remaining % totalCheckedAndUnlocked : 0;
		const newTypes: QuestionTypes = {...types};
		questionTypeKeys.forEach((key) => {
			if (types[key].isChecked && !types[key].isLocked) {
				const count = base + (remainder > 0 ? 1 : 0);
				if (remainder > 0) remainder--;
				newTypes[key] = {...types[key], count};
			}
			if (!types[key].isChecked) {
				newTypes[key] = {...types[key], count: 0};
			}
		});
		return newTypes;
	}, [maxNumQuestions]);

	useEffect(() => {
		setQuestionTypes((prev) => redistributeCheckedEqually(prev));
	}, [maxNumQuestions, redistributeCheckedEqually]);

	const handleQuestionTypeLock = (type: QuestionTypeKey) => {
		setQuestionTypes((prev) => ({
			...prev,
			[type]: {...prev[type], isLocked: !prev[type].isLocked},
		}));
	};

	const handleQuestionTypeCheck = (type: QuestionTypeKey) => {
		setQuestionTypes((prev) => {
			const updated = {
				...prev,
				[type]: {...prev[type], isChecked: !prev[type].isChecked},
			};
			const allUnchecked = questionTypeKeys.every(
				(key) => !updated[key].isChecked
			);
			if (allUnchecked) {
				setWarnings({
					multipleChoice: "At least one question type must be selected",
					subjective: "At least one question type must be selected",
					objective: "At least one question type must be selected",
					arrangement: "At least one question type must be selected",
					fillInTheBlank: "At least one question type must be selected",
					questionGroup: "At least one question type must be selected",
				});
			} else {
				setWarnings({
					multipleChoice: null,
					subjective: null,
					objective: null,
					arrangement: null,
					fillInTheBlank: null,
					questionGroup: null,
				});
			}
			return redistributeCheckedEqually(updated);
		});
	};

	const handleQuestionCountChange = (type: QuestionTypeKey, value: string) => {
		const newCount = parseInt(value, 10) || 0;
		const updated = {
			...questionTypes,
			[type]: {...questionTypes[type], count: newCount},
		};
		const total = questionTypeKeys
			.filter((key) => updated[key].isChecked)
			.reduce((sum, key) => sum + updated[key].count, 0);
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
			const newWarnings = {...warnings};
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

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
			{questionTypeKeys.map((type) => (
				<div
					key={type}
					className="relative rounded-xl border border-primary p-4 shadow-sm"
				>
					<div className="flex justify-center mb-2">
						<label className="flex items-center cursor-pointer relative">
							<input
								type="checkbox"
								checked={questionTypes[type].isChecked}
								onChange={() => handleQuestionTypeCheck(type)}
								className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
							/>
							<span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
								<FaCheck />
							</span>
						</label>
					</div>
					<div className="text-center capitalize text-sm mb-2 text-nowrap">
						{type.replace(/([A-Z])/g, " $1").trim()}
					</div>
					<div className="flex justify-center items-center gap-1">
						<input
							type="number"
							value={questionTypes[type].count}
							onChange={(e) => handleQuestionCountChange(type, e.target.value)}
							disabled={questionTypes[type].isLocked}
							min={0}
							className="w-14 text-center px-1 py-0.5 border rounded focus:outline-none disabled:bg-gray-100"
						/>
						{warnings[type] && (
							<span className="ml-1 flex items-center text-red-500 text-xs gap-1">
								<FaInfoCircle className="text-red-500" />
								{warnings[type]}
							</span>
						)}
						<button type="button" onClick={() => handleQuestionTypeLock(type)}>
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
	);
};

export default QuestionTypeSelector;
