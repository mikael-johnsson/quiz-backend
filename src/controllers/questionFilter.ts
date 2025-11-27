import { Question } from "../types";

type Query = Record<string, any>;

const themeFilter = (question: Question, query: Query): boolean => {
  if (!query.theme) return true;
  return (question.themes || []).includes(query.theme);
};

const difficultyFilter = (question: Question, query: Query): boolean => {
  if (!query.difficulty) return true;
  return question.difficulty === query.difficulty;
};

const isApprovedFilter = (question: Question, query: Query): boolean => {
  if (query.isApproved === undefined) return true;
  if (typeof query.isApproved === "string") {
    const val = query.isApproved === "true";
    return question.isApproved === val;
  }
  return question.isApproved === query.isApproved;
};

const mainFilter = (questions: Question[], query: Query): Question[] => {
  return questions.filter(
    (question) =>
      themeFilter(question, query) &&
      difficultyFilter(question, query) &&
      isApprovedFilter(question, query)
  );
};

export default mainFilter;
