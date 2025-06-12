import {useState} from "react";
import QuestionSettings from "../QuestionSettings";
import SubjectSelector from "../SubjectSelector";
import TestSettings from "../TestSettings";

const ConfigSetting = ({onNextStep}) => {
	const [maxNumQuestions, setMaxNumQuestions] = useState(100);
	return (
		<div className="min-h-screen w-full bg-gray-100 p-6">
			<div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
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
