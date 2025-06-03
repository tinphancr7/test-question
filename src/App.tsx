import Header from "./components/Header";
import QuestionSettingsV2 from "./components/QuestionSettingsv2";
import QuestionSettings from "./components/QuestionSettings";
import TestSettings from "./components/TestSettings";

// Main App Component
function App() {
	return (
		<div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans">
			<div className="max-w-[80%] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
				<div className="flex flex-col lg:flex-row  border-t border-gray-200">
					{/* Left Panel: Question Settings */}
					<div className="w-full lg:w-2/3  border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 mb-6 lg:mb-0">
						{/* Header Section */}
						<Header />
						<QuestionSettings />
						{/* <QuestionSettingsV2 /> */}
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
