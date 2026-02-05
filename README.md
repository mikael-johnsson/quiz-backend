# Backend for quiz database

## Overview

This is the Back End Appliction for a Quiz App project under construction.

The mission of the Full Stack App is to let users generate quizzes based on a chosen set of filters (themes, difficulty levels, etc.). Perfect for when your party, couples’ dinner, or road trip needs an event — and it needs it now! No more hours (or days!) spent frying your brain trying to come up with a quiz that strikes the perfect balance between being relatable and fun.

As of now, you can try the API of the App. There are about 30 questions in the database for development purposes.

The Front End App is also under construction. Link to the Front End GitHub can be found [here](https://github.com/mikael-johnsson/quiz-frontend).

## API Call

The api call should be made to https://quiz-backend-one-alpha.vercel.app/api/questions

[Link](https://quiz-backend-one-alpha.vercel.app/api/questions)

To filter by theme, add _/?theme=value_

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

To filter by difficulty level, also add _&difficulty=value_

for example: https://quiz-backend-one-alpha.vercel.app/api/questions/?theme=sverige&difficulty=easy

[Link](https://quiz-backend-one-alpha.vercel.app/api/questions/?theme=sverige&difficulty=easy)

Available difficulty levels are _easy_, _medium_ and _hard_.

It is also possible to only filter by difficulty level. In that case, use the same principle as for theme:

_/?difficulty=easy_

## Database

The database is located on MongoDB.

### Schemas

The api call returns this object:

```
{
    "totalResults": number of questions in result,
    "questions": an array of question objects,
    "statusCode": number, hopefully, 200.
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
