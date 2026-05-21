# Feature Planning

A living document tracking planned and in-progress features.

---

## AuthGuard for quizRouter.post

Short description

- Protect `POST /quiz` with an AuthGuard so only authenticated users can create saved quizzes. The guard should follow the existing `quiz_login` httpOnly cookie flow, verify the JWT, and attach the authenticated user to the request so `createdBy` can be derived from auth instead of trusting the client body.

Acceptance criteria

- `POST /quiz` returns `401` when the `quiz_login` cookie is missing, invalid, or expired.
- A valid cookie allows the request to continue and makes the authenticated user available to the quiz route or controller.
- The quiz creation flow no longer relies on the client to provide `createdBy` as an arbitrary body field.
- The guard reuses the same JWT secret and verification behavior as the existing `/me` flow.
- Existing non-auth quiz routes remain unchanged unless they need shared middleware support.

Files to change

- [src/routes/quizRouter.ts](src/routes/quizRouter.ts)
- [src/controllers/meController.ts](src/controllers/meController.ts) or a new shared auth helper/middleware module
- [src/routes/meRouter.ts](src/routes/meRouter.ts) if token verification is refactored into a shared helper
- [src/controllers/quizController.ts](src/controllers/quizController.ts) if `createdBy` needs to come from authenticated context
- [src/tests/quizRouter.test.ts](src/tests/quizRouter.test.ts) or a new auth/route test file

Proposed API contract

- Endpoint: `POST /quiz`
- Auth: cookie-based, `quiz_login=<JWT>` must be sent with the request
- Body example:

```json
{
  "questions": [12, 34, 56]
}
```

- Example request:

```http
POST /quiz
Cookie: quiz_login=eyJhbGciOi...
Content-Type: application/json

{ "questions": [12, 34, 56] }
```

- Success response example:

```json
{
  "message": "Quiz saved successfully",
  "quiz": {
    "id": "665f...",
    "questions": [12, 34, 56],
    "createdBy": "user@example.com",
    "amountOfSaves": 0
  }
}
```

- Failure response examples:

```json
{ "message": "Not authenticated" }
```

```json
{ "message": "Invalid or expired session" }
```

Step-by-step implementation

1. Extract JWT verification into a shared helper or middleware so `/me` and `/quiz` use the same token validation path.
2. Add an `AuthGuard` middleware for `POST /quiz` that checks `req.cookies.quiz_login`, verifies the token, and returns `401` on missing/invalid credentials.
3. Attach the decoded payload to `req.user` or a similar request field so downstream code can identify the creator.
4. Update `quizRouter.post` to require the guard before the handler and remove the need to read `createdBy` from `req.body`.
5. Update quiz creation logic to read `createdBy` from the authenticated payload and fail fast if the payload does not contain the expected user identifier.
6. Keep the existing question normalization and validation behavior intact so auth changes do not alter quiz content validation.
7. Add route tests for the three key cases: no cookie, invalid cookie, and valid cookie creating a quiz successfully.
8. If the request type is extended with `req.user`, add the minimal TypeScript declaration needed so the route compiles cleanly.

Testing / verification

- Automated: call `POST /quiz` without a cookie and confirm `401`.
- Automated: call `POST /quiz` with an invalid or tampered `quiz_login` cookie and confirm `401`.
- Automated: call `POST /quiz` with a valid cookie and a valid `questions` array and confirm the quiz is created with the authenticated user as `createdBy`.
- Manual: log in through the existing `/login` flow, reuse the cookie in a request to `POST /quiz`, and verify the route accepts it.
- Manual: confirm `/me` still reports the same authenticated payload after the shared auth logic refactor.

Suggested reviewers

- Backend owner familiar with the current cookie/JWT session flow.
- Whoever owns the quiz persistence logic, since the `createdBy` source changes from client-supplied data to auth-derived data.

Rough effort estimate

- Small to medium, roughly 2–4 hours including route wiring and tests.

Notes / decisions

- The guard should be route-scoped on `POST /quiz` rather than globally applied to the router, so read-only quiz endpoints stay public unless a later requirement changes that.
- If the decoded token payload does not contain the exact creator field needed by quiz persistence, derive it once in the shared helper rather than duplicating token-shape logic in the router.

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
