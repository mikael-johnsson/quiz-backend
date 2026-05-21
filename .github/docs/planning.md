# Feature Planning

A living document tracking planned and in-progress features.

---

## Add question amount to QuizForm

Short description

- Add a numeric `amount` input to the quiz creation form so users can choose how many questions to generate. The value should be propagated through the existing URL query flow and forwarded to the backend. The frontend will default to 10 (recommended), the backend default is 20, and the allowed range is 1–50.

Acceptance criteria

- The `QuizForm` UI includes a numeric `amount` input with `min=1`, `max=50` and a sensible default (10 client-side).
- Submitting the form includes `amount` in the URL query string (e.g., `?amount=5&themes=...`).
- The server-side page reads `searchParams.amount`, normalizes it (parseInt, fallback to backend default 20 if omitted), clamps to 1–50, and passes it to the `Quiz` component.
- `getQuestions()` in `quizService` accepts an `amount` and includes it in the backend request URL when present.

Files to change

- [src/components/quizForm/quizForm.tsx](src/components/quizForm/quizForm.tsx)
- [src/app/page.tsx](src/app/page.tsx)
- [src/components/quiz/quiz.tsx](src/components/quiz/quiz.tsx)
- [src/services/quizService.tsx](src/services/quizService.tsx)

Proposed API contract (query param)

- Parameter: `amount` (integer)
- Location: URL query string
- Example request: `GET /?generate=true&themes=science&amount=5`
- Validation: integer, >=1, <=50. If absent, backend uses its default (20).

Step-by-step implementation

1. Add numeric input to `QuizForm` with `name="amount"`, `type="number"`, `min=1`, `max=50`, `defaultValue=10` and inline helper text.
2. Confirm `handleSubmit` keeps `FormData` usage so `amount` is appended to `URLSearchParams` automatically.
3. Update `app/page.tsx` to parse `searchParams.amount`, `parseInt`, fallback to backend default `20` when missing, and clamp to 1–50.
4. Pass `amount` as a prop to the `Quiz` component.
5. Update `Quiz` to accept `amount` and forward it to `getQuestions()`.
6. Modify `src/services/quizService.tsx` `getQuestions()` to accept optional `amount?: number` and append `&amount=${amount}` when provided.
7. Add small unit tests to assert `amount` is forwarded from `Quiz` to `quizService` (mock service).
8. Manual verification: run the app, submit with different `amount` values, and confirm backend receives `amount` correctly; test edge values (0, 999) are clamped.

Testing / Verification

- Unit: mock `getQuestions()` and verify it is called with the parsed/clamped `amount`.
- Manual: fill form with `amount=5`, submit, inspect network/backend logs to confirm `amount=5`.
- Edge cases: no `amount`, `amount=0`, and `amount=999` — ensure normalization/clamping.

Effort estimate: small — ~1–2 hours including basic tests.

Notes / decisions

- Client-side default: 10 (recommended UX choice). Backend default remains 20; server-side parsing will use backend default when `amount` is omitted to avoid unexpected behavior.
- Allowed max: 50 (agreed). Server must also enforce this limit.

## Saved quizzes backend

Short description

- Add a persistent `Quiz` model so a user can save a generated quiz on the backend. A saved quiz should store the questions that make up the quiz, who created it, and how many times it has been saved. The implementation should follow the existing Express route + controller + Mongoose model structure used by questions and users.

Acceptance criteria

- The backend has a `Quiz` model with at least `questions`, `createdBy`, `amountOfSaves`, and timestamps/created date.
- The backend can create a new saved quiz from a request body that includes a question list and creator information.
- The backend can fetch saved quizzes, either all quizzes or by id/creator, depending on the endpoint shape chosen.
- The backend can increment `amountOfSaves` when a quiz is saved again.
- Invalid payloads return a clear 400-level error instead of creating partial records.
- The new quiz endpoints are wired into the app and use `connectDB()` like the existing routes.

Files to change

- [src/models/types.ts](src/models/types.ts)
- [src/controllers/quizController.ts](src/controllers/quizController.ts) or the existing quiz controller surface if expanded there
- [src/routes/quizRouter.ts](src/routes/quizRouter.ts)
- [src/app.ts](src/app.ts)
- [src/tests/quizController.test.ts](src/tests/quizController.test.ts) or any new test file added for quiz model/controller behavior

Proposed API contract

- `POST /quiz`
- Request body example:

```json
{
  "questions": [123, 456, 789],
  "createdBy": "user@example.com"
}
```

- Success response example:

```json
{
  "message": "Quiz saved successfully",
  "quiz": {
    "id": "665f...",
    "questions": [123, 456, 789],
    "createdBy": "user@example.com",
    "amountOfSaves": 1,
    "createdWhen": "2026-05-21"
  }
}
```

- Suggested follow-up endpoints:
  - `GET /quiz` to list saved quizzes
  - `GET /quiz/:id` to load one saved quiz
  - `PATCH /quiz/:id/save` to increment `amountOfSaves`

Step-by-step implementation

1. Add a `Quiz` interface and a Mongoose schema in `src/models/types.ts` with `questions`, `createdBy`, `amountOfSaves`, and a created date field.
2. Store question ids only in `questions`, and let the backend fetch the corresponding question records when it needs to build, validate, or serve a saved quiz.
3. Add quiz controller functions for create, list, fetch-by-id, and save-count increment.
4. Update `src/routes/quizRouter.ts` to stop returning the placeholder response and instead call the new controller functions.
5. Add request validation in the route or controller so empty `questions` arrays and missing `createdBy` are rejected with a 400.
6. Wire the quiz router into `src/app.ts` if any route structure changes are needed, and keep `connectDB()` calls consistent with the other routers.
7. If quizzes should be tied to the logged-in user, decide whether `createdBy` should be an email, user id, or auth-derived value and make the controller enforce that contract.
8. Add tests for quiz creation, invalid payload handling, and save-count increment behavior.

Testing / verification

- Manual: POST a quiz payload through Postman or the frontend and confirm a document is written in MongoDB.
- Manual: call the increment/save endpoint twice and verify `amountOfSaves` increases.
- Manual: submit an invalid body such as `{ "questions": [] }` and confirm a 400 response.
- Automated: add controller/model tests for create and increment flows if the repo already has a test harness.

Suggested reviewers

- Backend owner familiar with the current Mongoose models and route conventions.
- Frontend owner if the saved-quiz payload will be consumed directly by the quiz builder UI.

Rough effort estimate

- Medium, roughly 3–6 hours depending on whether the quiz stores ids only or needs richer snapshots and auth integration.

Notes / decisions

- Keep the initial schema minimal and aligned with the existing codebase style: a small Mongoose model, thin route handlers, and business logic in a controller.
- If the frontend needs to reproduce a saved quiz exactly later, add snapshot fields in a second iteration instead of overloading the first schema.

Implementation status

- Status: in-progress — model, controller, and router implemented; tests pending.
- Implemented endpoints:
  - `POST /quiz` — create a saved quiz (validates question ids and `createdBy`).
  - `GET /quiz` — list quizzes; supports `?populate=true` and `?createdBy=...`.
  - `GET /quiz/:id` — fetch one quiz; supports `?populate=true`.
  - `PATCH /quiz/:id/save` — increments `amountOfSaves`.

Files changed

- `src/models/types.ts` — added `Quiz` schema and `QuizModel`.
- `src/controllers/quizController.ts` — added create/get/getById/increment functions with optional population.
- `src/routes/quizRouter.ts` — added route handlers wired to controllers and `connectDB()`.

Remaining tasks

- Add automated tests for controller and routes (see checklist). The tests should cover success and failure cases, `populate` behavior, and save-count incrementing.
- (Optional) Add snapshot support to persist question text if immutability is later required.
