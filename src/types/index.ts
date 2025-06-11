export type Question = {
	id: string;
	difficulty: number;
	problemType: string;
	title: string;
	category: string;
	questionType?: string;
	emailExcerpt?: string;
	questionText?: string;
	answerChoices?: string[];
	correctAnswer?: string;
	explanation?: string;
};
