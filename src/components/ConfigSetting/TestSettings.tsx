import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {FaClock, FaInfoCircle} from "react-icons/fa";
import {IoMdSettings} from "react-icons/io";
import {MdOutlinePercent} from "react-icons/md";
import {RiArrowRightSLine} from "react-icons/ri";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

import {Button, Switch} from "@heroui/react";

import CustomRadioGroup from "../form/custom-radio-group";
import CustomSelect from "../form/custom-select";
import InputField from "../form/input-field";
import QuestionTypeSelector from "./QuestionTypeSelector";
import SingleFileUpload from "./SingleFileUpload";

interface TestSettingsProps {
	onNextStep: () => void;
	maxNumQuestions: number;
}

const testSettingsSchema = yup.object({
	name: yup.string().required("Test name is required"),
	author: yup.string().required("Author name is required"),
	price: yup
		.string()
		.required("Price is required")
		.test(
			"is-number",
			"Price must be a number",
			(value) => !isNaN(Number(value))
		)
		.test("min", "Price cannot be negative", (value) => Number(value) >= 0),
	status: yup.string().required("Status is required"),
	specialCategory: yup.string().required("Special category is required"),
	passRate: yup
		.string()
		.required("Pass rate is required")
		.test(
			"is-number",
			"Pass rate must be a number",
			(value) => !isNaN(Number(value))
		)
		.test(
			"min",
			"Pass rate cannot be less than 0",
			(value) => Number(value) >= 0
		)
		.test(
			"max",
			"Pass rate cannot be more than 100",
			(value) => Number(value) <= 100
		),
	duration: yup
		.string()
		.required("Duration is required")
		.matches(
			/^([0-9]{2}):([0-5][0-9]):([0-5][0-9])$/,
			"Duration must be in hh:mm:ss format"
		),
}) as yup.ObjectSchema<TestSettingsFormValues>;

interface TestSettingsFormValues {
	name: string;
	author: string;
	price: string;
	status: string;
	specialCategory: string;
	passRate: string;
	duration: string;
}

const defaultValues: TestSettingsFormValues = {
	name: "",
	author: "",
	price: "",
	status: "private",
	specialCategory: "junior",
	passRate: "",
	duration: "",
};

const TestSettings = ({onNextStep, maxNumQuestions}: TestSettingsProps) => {
	const [selectedDifficulty, setSelectedDifficulty] = useState(1);

	const {
		control,
		handleSubmit,
		formState: {errors},
	} = useForm<TestSettingsFormValues>({
		defaultValues,
		mode: "onChange",
		resolver: yupResolver(testSettingsSchema),
	});

	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
	const handleThumbnailChange = (file: File | null) => {
		setThumbnail(file);
		setThumbnailPreview(file ? URL.createObjectURL(file) : null);
	};

	const onSubmit = handleSubmit((data) => {
		console.log("Form submitted with data:", data);
		onNextStep();
	});

	return (
		<form onSubmit={onSubmit} className="bg-white  shadow-md overflow-hidden">
			<div className="p-4 sm:p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
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

				<SingleFileUpload
					label="Thumbnail image"
					value={thumbnail}
					previewUrl={thumbnailPreview}
					onChange={handleThumbnailChange}
					required
				/>

				<div className="col-span-2 ">
					<div className="flex items-center justify-between mb-2">
						<label className="block  text-sm font-bold">
							Test level (dificulty)
						</label>
						<div className="flex items-center justify-center gap-2">
							<IoMdSettings />
							<span>Difficult setting</span>
						</div>
					</div>
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

				<div className="col-span-2 ">
					<div className="flex items-center justify-between mb-2">
						<label className="block  text-sm font-bold">Question type</label>
						<div className="flex items-center justify-center gap-2">
							<IoMdSettings />
							<span> Question type setting</span>
						</div>
					</div>
					<QuestionTypeSelector maxNumQuestions={maxNumQuestions} />
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
				<Button
					type="button"
					className="h-11 w-[134px] font-medium"
					radius="sm"
					variant="bordered"
					color="primary"
				>
					Cancel
				</Button>

				<Button
					type="submit"
					className="h-11 flex-1 font-medium"
					radius="sm"
					color="primary"
				>
					Next step
					<RiArrowRightSLine size={18} />
				</Button>
			</div>
		</form>
	);
};

export default TestSettings;
