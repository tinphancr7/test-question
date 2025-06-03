import {useState} from "react";
import QuestionCategory from "./QuestionCategory";
import QuestionSubCategory from "./QuestionSubCategory";
import QuestionType from "./QuestionType";

const QuestionSettings = () => {
	return (
		<div>
			{/* Number of Questions */}

			{/* TOEIC Section */}
			<QuestionCategory
				title="TOEIC"
				initialQuestionCount={50}
				defaultExpanded={true}
			>
				{/* Sub-categories for TOEIC */}
				<QuestionSubCategory title="Listening" initialQuestionCount={50}>
					<QuestionType title="Part: Conversations" initialQuestionCount={25}>
						<QuestionType
							title="Topic: Office communication"
							initialQuestionCount={25}
						>
							<QuestionType
								title="Context: Meeting rescheduling"
								initialQuestionCount={10}
							/>
						</QuestionType>
						<QuestionType
							title="Question types: What is the man's problem? (inference)"
							initialQuestionCount={4}
						/>
						<QuestionType
							title="Question types: What will the woman likely do next? (prediction)"
							initialQuestionCount={8}
						/>
					</QuestionType>
					<QuestionType title="Part: Short Talks" initialQuestionCount={25} />
				</QuestionSubCategory>
				<QuestionSubCategory title="Reading" initialQuestionCount={50}>
					<QuestionType
						title="Part: Reading Comprehension"
						initialQuestionCount={50}
					>
						<QuestionType title="Emails" initialQuestionCount={25} />
						<QuestionType
							title="Topic: Advertisements"
							initialQuestionCount={25}
						/>
					</QuestionType>
				</QuestionSubCategory>
				<QuestionSubCategory title="Grammar" initialQuestionCount={0} />
			</QuestionCategory>

			{/* IELTS Section */}
			<QuestionCategory
				title="IELTS"
				initialQuestionCount={0}
				defaultExpanded={false}
			>
				{/* Sub-categories for IELTS */}
				<QuestionSubCategory title="Listening" initialQuestionCount={0} />
				<QuestionSubCategory title="Reading" initialQuestionCount={0} />
				<QuestionSubCategory title="Grammar" initialQuestionCount={0} />
			</QuestionCategory>
		</div>
	);
};

export default QuestionSettings;
