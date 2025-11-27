// const themeFilter = (questions, query) => {
//   let filteredQuestions = [];
//   questions.forEach((q) => {
//     if (
//       q.themes.includes(query.theme) &&
//       q.difficultyLevel === query.difficulty
//     ) {
//       filteredQuestions.push(q);
//     }
//   });
//   return filteredQuestions;
// };

const themeFilter = (question, query) => {
  if (!query.theme) return true;
  return question.themes.includes(query.theme);
};

const difficultyFilter = (question, query) => {
  if (!query.difficulty) return true;
  return question.difficultyLevel === query.difficulty;
};

const mainFilter = (questions, query) => {
  return questions.filter(
    (question) =>
      themeFilter(question, query) && difficultyFilter(question, query)
  );
};

module.exports = mainFilter;
