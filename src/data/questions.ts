import {Question} from "../types";

export const initialQuestions: Question[] = [
	{
		id: "1",
		difficulty: 1,
		problemType: "Multiple choice",
		title: "제 11 회 Listening Test (고3)",
		category: "English > 영역별 학습 / 고3 > Listening",
		questionType: "inference",
		emailExcerpt: `From: Laura Kim <br> To: James Torres <br> Subject: Delay in Shipment <br> Dear James, I wanted to inform you that the shipment originally scheduled to arrive this Friday will be delayed due to unforeseen customs inspections. We are working closely with the shipping partner and expect the delivery to be completed next Wednesday. Please let your team know. Best regards, Laura`,
		questionText:
			"Why is James likely to infer that his team needs to change the shipping partner?",
		answerChoices: [
			"① His team needs to change the shipping partner",
			"② His team is responsible for customs clearance",
			"③ His team was expecting the shipment this Friday",
			"④ His team must cancel the shipment",
		],
		correctAnswer: "③ His team was expecting the shipment this Friday",
		explanation:
			"Laura asked James to let his team know about the delay. Since the shipment was originally planned for Friday, we can infer that the team was expecting it then.",
	},
	{
		id: "2",
		difficulty: 1,
		problemType: "Multiple choice",
		title: "제 11 회 Listening Test (고3)",
		category: "English > 영역별 학습 / G3 > Listening",
		questionType: "comprehension",
		emailExcerpt: `Subject: Meeting Reminder<br>Hi team, Just a friendly reminder about our meeting scheduled for tomorrow at 10 AM in Conference Room 3. Please come prepared to discuss the Q3 budget. See you there!`,
		questionText: "What is the main purpose of this email?",
		answerChoices: [
			"① To schedule a new meeting",
			"② To remind about an upcoming meeting",
			"③ To discuss Q3 financial results",
			"④ To book Conference Room 3",
		],
		correctAnswer: "② To remind about an upcoming meeting",
		explanation:
			"The email explicitly states 'Just a friendly reminder about our meeting scheduled for tomorrow'.",
	},
	{
		id: "3",
		difficulty: 1,
		problemType: "Fill in the blank",
		title: "제 11 회 Listening Test (고3)",
		category: "English > 영역별 학습 / G3 > Listening",
		questionType: "grammar",
		questionText: "The cat sat ___ the mat.",
		answerChoices: ["① on", "② in", "③ at", "④ by"],
		correctAnswer: "① on",
		explanation:
			"The preposition 'on' is used to indicate a position on a surface.",
	},
	{
		id: "4",
		difficulty: 1,
		problemType: "Objective",
		title: "제 11 회 Listening Test (고3)",
		category: "English > 영역별 학습 / G3 > Listening",
		questionType: "prediction",
		questionText:
			"Choose the correct article to complete the sentence: 'She adopted ___ cat from the shelter.'",
		answerChoices: ["① a", "② an", "③ the", "④ (no article)"],
		correctAnswer: "③ the",
		explanation:
			"The correct article is 'the' because 'cat' is a specific noun.",
	},
	{
		id: "5",
		difficulty: 1,
		problemType: "Arranging",
		title: "제 11 회 Listening Test (고3)",
		category: "English > 영역별 학습 / G3 > Listening",
		questionType: "sequencing",
		questionText:
			"Arrange the following steps to make a cup of tea: A. Pour hot water. B. Add tea bag. C. Drink. D. Add milk and sugar.",
		answerChoices: [
			"① B, A, D, C",
			"② A, B, C, D",
			"③ B, D, A, C",
			"④ C, D, A, B",
		],
		correctAnswer: "① B, A, D, C",
		explanation:
			"The logical order to make tea is to first add the tea bag, then hot water, then milk and sugar, and finally drink.",
	},
	{
		id: "6",
		difficulty: 1,
		problemType: "Multiple choice",
		title: "제 11 회 Listening Test (고3)",
		category: "English > 영역별 학습 / G3 > Listening",
		questionType: "inference",
		emailExcerpt: `Subject: Project Update<br>Team, The deadline for Phase 1 has been moved to next Friday. We need to accelerate our efforts.`,
		questionText: "What can be inferred about the project's progress?",
		answerChoices: [
			"① It's ahead of schedule",
			"② It's behind schedule",
			"③ It's on schedule",
			"④ The project is canceled",
		],
		correctAnswer: "② It's behind schedule",
		explanation:
			"The phrase 'accelerate our efforts' suggests that the project is behind its original schedule.",
	},
	{
		id: "7",
		difficulty: 1,
		problemType: "Fill in the blank",
		title: "제 11 회 Listening Test (고3)",
		category: "English > 영역별 학습 / G3 > Listening",
		questionType: "vocabulary",
		questionText: "She has a very ___ personality, always cheering others up.",
		answerChoices: ["① gloomy", "② vibrant", "③ shy", "④ dull"],
		correctAnswer: "② vibrant",
		explanation:
			"The word 'vibrant' best describes a personality that is always cheering others up.",
	},
	{
		id: "8",
		difficulty: 1,
		problemType: "Objective",
		title: "제 11 회 Listening Test (고3)",
		category: "English > 영역별 학습 / G3 > Listening",
		questionType: "grammar",
		questionText: "Neither John ___ Mary was at the party.",
		answerChoices: ["① or", "② nor", "③ and", "④ but"],
		correctAnswer: "② nor",
		explanation:
			"'Neither' is always followed by 'nor' in correlative conjunctions.",
	},
	{
		id: "9",
		difficulty: 1,
		problemType: "Objective",
		title: "제 11 회 Listening Test (고3)",
		category: "English > 영역별 학습 / G3 > Listening",
		questionType: "reading_comprehension",
		emailExcerpt: `Subject: New Policy<br>All employees are required to review the updated remote work policy by Friday.`,
		questionText: "What action is required by employees?",
		answerChoices: [
			"① Attend a meeting about the policy",
			"② Sign a new contract",
			"③ Review the updated policy",
			"④ Submit a remote work request",
		],
		correctAnswer: "③ Review the updated policy",
		explanation:
			"The email clearly states 'All employees are required to review the updated remote work policy'.",
	},
];
