---
name: plan-feature
description: This skill is used when creating a plan for implementing a feature
---

# Plan feature

## When to use

Use this skill when the user asks to create a detailed, actionable plan for implementing a feature in the GitHub Copilot Chat workspace.

## Instructions

- Always read the documentation in the `docs` folder to understand how the app looks and works before starting a plan.
- Match the app's existing code patterns and data flow when designing the plan.
- For backend features that depend on a frontend, ask about existing request patterns and their contracts.
- If no frontend request exists, propose a clear set of information needed (params, body, queries etc.)
- Include acceptance criteria and a minimal verification plan (how to test manually or with automated tests).
- List the specific files, components, and tests that need changes so a junior developer can implement them.
- Keep steps small, numbered, and actionable.
- When planning endpoints, give examples of what a request to it would look like.

## Output format

-- Add a `##` heading for the feature in `.github/docs/planning.md` using the feature name.

- Under the heading include:
  - Short description of the feature.
  - Acceptance criteria.
  - Files to change (paths).
  - Proposed API contract (if applicable) with request/response examples.
  - Step-by-step implementation list with small tasks.
  - Testing / verification steps and suggested reviewers.
  - Rough effort estimate (small / medium / large or hours).
- Ensure the plan's steps are small and actionable for a junior developer.
