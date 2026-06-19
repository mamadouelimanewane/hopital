# Test Results — cnra-suite

Date: 2026-06-16

## Root workspace (vitest run from C:\gravity\cnra-suite)

Vitest v4.1.9

| Module      | Test File                        | Status  |
|-------------|----------------------------------|---------|
| mediawatch  | mediawatch/lib/utils.test.ts     | PASSED  |
| mediabase   | mediabase/lib/utils.test.ts      | PASSED  |
| antideep    | antideep/lib/utils.test.ts       | PASSED  |
| edumedia    | edumedia/lib/utils.test.ts       | PASSED  |
| citoyen     | citoyen/lib/utils.test.ts        | PASSED  |

**Test Files: 5 passed (5)**
**Tests: 43 passed (43)**

---

## electrowatch (vitest run from C:\gravity\cnra-suite\electrowatch)

Vitest v4.1.9

| Module       | Test File                              | Status  |
|--------------|----------------------------------------|---------|
| electrowatch | src/lib/utils.test.ts                  | PASSED  |

**Test Files: 1 passed (1)**
**Tests: 21 passed (21)**

---

## Grand Total

- **Test Files:** 6 passed
- **Tests:** 64 passed
- **Failed:** 0

## Configuration

- Root `vitest.config.ts` updated with explicit `include` patterns for 5 sub-modules
- Root `package.json` scripts: `test`, `test:watch`, `test:coverage` added
- `electrowatch/vitest.config.ts` created (standalone config with jsdom + path alias)
- `electrowatch/vitest.setup.ts` created (`@testing-library/jest-dom`)
- `electrowatch/package.json` scripts: `test`, `test:watch`, `test:coverage` added
