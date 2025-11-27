const randomizeQuestions = (questions) => {
  let randomQuestions = [];
  console.log("randomizer running...");

  for (let i = 0; i < 5; i++) {
    const randomX = Math.floor(Math.random() * questions.length);
    randomQuestions.push(questions[randomX]);
    questions.splice(randomX, 1);
  }
  return randomQuestions;
};

module.exports = randomizeQuestions;
