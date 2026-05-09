# Automated Tests

I chose to use **Vitest** for unit testing, as it integrates perfectly with the Vite/React setup used for the frontend. The tests specifically focus on the `auditEngine.ts` to ensure the financial math and logic rules are mathematically sound and defensible.

## How to Run the Tests
1. Navigate to the frontend directory: `cd client`
2. Run the test suite: `npm run test`

## Test Coverage (`client/src/utils/auditEngine.test.ts`)

1. **`calculates correct savings for ChatGPT Team seat mismatch`**
   * **Covers:** Rule 1. Ensures that if a user selects the ChatGPT Team plan but only inputs 1 seat, the engine successfully recommends downgrading to Plus and calculates exactly $30 in savings.
2. **`recommends switching to API credits for high Anthropic API spend`**
   * **Covers:** Rule 2. Checks that any retail API spend over $200 triggers the Credex "Switch" recommendation and accurately calculates the 20% estimated credit savings.
3. **`suggests Cursor Pro for coding use cases lacking a dedicated IDE`**
   * **Covers:** Rule 3. Verifies that if the primary use case is "coding" and they are using ChatGPT Plus (but no Cursor/Copilot), the engine suggests reallocating that spend to a dedicated AI coding tool.
4. **`flags when a user pays above standard retail pricing`**
   * **Covers:** Default fallback rule. If a user inputs a monthly spend of $50 for a single $20/mo seat, the test ensures the engine catches the $30 overspend and recommends an immediate billing audit.
5. **`returns $0 savings and "keep" action for an already optimized stack`**
   * **Covers:** Honest auditing. Ensures that if a user's inputs perfectly match optimal retail pricing for their team size, the engine does not manufacture fake savings and flags `isHighSavings` as false.