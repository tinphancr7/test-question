import {useState} from "react";
import ConfigSetting from "./components/ConfigSetting";
import EditDetails from "./components/EditDetails";

const steps = ["Select Subject & Configuration Settings", "Edit details"];
const App = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const handleNextStep = async () => {
		setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
	};
	const handlePrevStep = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};
	return (
		<div className="">
			{currentStep === 0 ? (
				<ConfigSetting onNextStep={handleNextStep} />
			) : (
				<EditDetails onPrevStep={handlePrevStep} />
			)}
		</div>
	);
};

export default App;
