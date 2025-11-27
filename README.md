# Backend for quiz database

## API Call

The api call should be made to https://quiz-backend-one-alpha.vercel.app/api/questions

To sort by theme, add /?theme=value
for example: https://quiz-backend-one-alpha.vercel.app/api/questions/?theme=sverige

To sort by difficulty level, also add &difficulty=value
for example: https://quiz-backend-one-alpha.vercel.app/api/questions/?theme=sverige&difficulty=easy

Available difficulty levels are easy, medium and hard.

Also possible to only use difficulty level. In that case, use the same principle as for theme.
/?difficulty=easy

## "Database"

The database is, as of now, still hardcoded into the code base.

### Schemas

The api call returns this object:
{
totalResults: number of questions in result,
questions: an array of question objects,
statusCode: number, hopefully, 200.
}

The question object looks like this:
{
"question": "Vilket är världens högsta berg?",
"answer": "Mount Everest (mer än 8000m)",
"questionType": "singleAnswer",
"isApproved": true,
"themes": ["geografi", "asien"],
"difficulty": "hard",
"createdBy": "Micke",
"createdWhen": "November 20, 2025 09:24:00",
"id": 1
}
