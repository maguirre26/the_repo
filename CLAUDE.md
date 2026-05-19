# Claude Instructions

## Git Workflow
- Always commit and push directly to the main branch
- Never create new branches unless explicitly asked
- Always commit after making any changes to files

## Repository Structure
- expenses/expenses.json → all expense records and budget data
- This is the ONLY expenses file. Never create other expense files.

## Behavior
- When adding expense records, always read expenses/expenses.json first, then append the new record
- Keep the JSON structure valid at all times
- Never create new folders or files unless explicitly asked
- When displaying movements (e.g. in a table), always show the description as-is — if the description is an emoji, display the emoji directly, not a text label
