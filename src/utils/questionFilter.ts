import { Query, Question } from "../types";

const themeFilter = (question: Question, query: Query): boolean => {
  if (!query.themes || query.themes.length === 0) return true;
  let themeExist: boolean = false;
  query.themes.forEach((theme) => {
    if (question.themes?.includes(theme)) themeExist = true;
  });

  return themeExist;
  return true;
};

const difficultyFilter = (question: Question, query: Query): boolean => {
  if (!query.difficulties || query.difficulties.length === 0) return true;
  let difficultyExist: boolean = false;
  query.difficulties?.forEach((level) => {
    if (question.difficulty?.includes(level)) difficultyExist = true;
  });

  return difficultyExist;
};

const isApprovedFilter = (question: Question, query: Query): boolean => {
  if (query.isApproved === undefined) return true;
  if (typeof query.isApproved === "string") {
    const val = query.isApproved === "true";
    return question.isApproved === val;
  }
  return question.isApproved === query.isApproved;
};

const mainFilter = (questions: Question[], stringQuery: Query): Question[] => {
  const query = makeAttributeArrays(stringQuery);
  console.log(query);

  return questions.filter(
    (question) =>
      themeFilter(question, query) &&
      difficultyFilter(question, query) &&
      isApprovedFilter(question, query)
  );
};

const makeAttributeArrays = (query: Query): Query => {
  let newQuery: Query = {};
  newQuery.themes = Array.isArray(query.themes)
    ? query.themes
    : query.themes
    ? [query.themes]
    : [];

  newQuery.difficulties = Array.isArray(query.difficulties)
    ? query.difficulties
    : query.difficulties
    ? [query.difficulties]
    : [];

  newQuery.isApproved = query.isApproved;

  return newQuery;
};

export default mainFilter;
