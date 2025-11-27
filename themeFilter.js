const themeFilter = (questions, query) => {
  let filteredQuestions = [];
  questions.forEach((q) => {
    if (q.themes.includes(query.theme)) {
      filteredQuestions.push(q);
    }
  });
  return filteredQuestions;
};
module.exports = themeFilter;
