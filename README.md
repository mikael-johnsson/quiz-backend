# Backend for quiz database

## API Call

The api call should be made to https://quiz-backend-one-alpha.vercel.app/api/questions

[Link](https://quiz-backend-one-alpha.vercel.app/api/questions)

To sort by theme, add _/?theme=value_

for example: https://quiz-backend-one-alpha.vercel.app/api/questions/?theme=sverige

[Link](https://quiz-backend-one-alpha.vercel.app/api/questions/?theme=sverige)

Themes available now:

```'geografi', 'asien',
'astronomi', 'rymden',
'sverige', 'historia',
'andra världskriget', 'kemi',
'element', 'språk',
'världen', 'kultur',
'europa', 'biologi',
'natur', 'litteratur',
'sport', 'fotboll',
'kändisar', 'politik',
'musik', 'film',
'fantasy', 'tv'
```

_Don't forget to replace whitespaces with %20 in the URL_

To sort by difficulty level, also add _&difficulty=value_

for example: https://quiz-backend-one-alpha.vercel.app/api/questions/?theme=sverige&difficulty=easy

[Link](https://quiz-backend-one-alpha.vercel.app/api/questions/?theme=sverige&difficulty=easy)

Available difficulty levels are _easy_, _medium_ and _hard_.

It is also possible to only use difficulty level. In that case, use the same principle as for theme:

_/?difficulty=easy_

## "Database"

The database is, as of now, still hardcoded into the code base.

### Schemas

The api call returns this object:

```
{
totalResults: number of questions in result,
questions: an array of question objects,
statusCode: number, hopefully, 200.
}
```

The question object looks like this:

```
{
"question": string,
"answer": string,
"questionType": string,
"isApproved": boolean,
"themes": string[],
"difficulty": string,
"createdBy": string,
"createdWhen": string,
"id": number
}
```
