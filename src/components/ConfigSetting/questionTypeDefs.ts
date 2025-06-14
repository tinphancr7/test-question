export const questionTypeKeys = [
	"multipleChoice",
	"subjective",
	"objective",
	"arrangement",
	"fillInTheBlank",
	"questionGroup",
] as const;
export type QuestionTypeKey = (typeof questionTypeKeys)[number];
export type QuestionTypes = Record<
	QuestionTypeKey,
	{isLocked: boolean; isChecked: boolean; count: number}
>;
