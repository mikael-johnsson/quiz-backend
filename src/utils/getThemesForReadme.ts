import { questions } from "../app";

// get themes for readme
export const getThemes = () => {
  let themeArray: string[] = [];
  questions.forEach((question) => {
    question.themes?.forEach((theme) => {
      if (!themeArray.includes(theme)) {
        themeArray.push(theme);
      }
    });
  });
  console.log("This is the full themeArray", themeArray);
};
