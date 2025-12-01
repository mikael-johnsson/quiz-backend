import { Request, Response } from "express";

export const landingPageController = (req: Request, res: Response) => {
  res.status(200).send(
    `<h1>Quiz Database</h1>
    <p>Skriv in någon av dessa URL:s för att testa API:et</p>
    <ul>
        <li><em>/api/questions</em> - för att se alla frågor</li>
        <li><em>/api/questions/'siffra'</em> - för att se enskild fråga (1-30)</li>
        <li>lägg till <em>theme='tema'</em> för att sortera på tema (ex: 'sverige', 'geografi', 'sport')</li>
        <li>lägg till <em>difficulty='svårighet'</em> för att sortera på svårighet ('easy', 'medium' eller 'hard')</li>
        <li>lägg till <em>isApproved='svar'</em> för att sortera på godkända frågor ('true' eller 'false')</li>
        <li>för att använda flera filter, använd '&' mellan filterna</li>
        <li>ex: <em>https://quiz-backend-one-alpha.vercel.app/api/questions/?theme=sport&difficulty=medium</em></li>
    </ul>
    `
  );
};
