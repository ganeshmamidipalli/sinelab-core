# CRASH KINGS — QA Engineer Knowledge Base

## How the Best QA Engineers Break and Validate Software

Source: Practices from Google Testing Blog, Microsoft SDET, OWASP Testing Guide, and Netflix Chaos Engineering.

---

## 1. Test Pyramid

```
         /  E2E Tests  \        (10%) — Full user journeys
        / Integration    \      (20%) — API + DB + services together
       /   Unit Tests      \    (70%) — Individual functions/components

RULES:
  - More unit tests, fewer E2E tests
  - E2E tests for critical happy paths only
  - Integration tests for API contracts
  - Unit tests for all business logic
  - Every bug fix gets a regression test
```

## 2. Test Plan Template

```markdown
# Test Plan: [Feature/Project Name]

## 1. Scope
What is being tested? What is NOT being tested?

## 2. Test Strategy
| Test Type | Coverage | Tools |
|-----------|----------|-------|
| Unit | Business logic, utils | pytest / vitest |
| Integration | API endpoints, DB queries | pytest + httpx |
| E2E | Critical user flows | Playwright |
| Performance | API latency, load | k6 / locust |
| Security | OWASP Top 10 | Manual + automated |

## 3. Entry Criteria
What must be true before testing starts?
- [ ] Code deployed to staging
- [ ] Database seeded with test data
- [ ] All dependencies available

## 4. Test Cases
| ID | Category | Test Case | Steps | Expected Result | Priority |
|----|----------|-----------|-------|----------------|----------|
| TC-01 | Auth | Login with valid credentials | 1. POST /auth/login | 200 + JWT token | P0 |
| TC-02 | Auth | Login with wrong password | 1. POST /auth/login | 401 error | P0 |

## 5. Exit Criteria
- [ ] All P0 test cases pass
- [ ] All P1 test cases pass (or deferred with justification)
- [ ] No critical or high bugs open
- [ ] Code coverage > 80%
- [ ] Security scan clean

## 6. Go/No-Go Recommendation
[ ] GO — ready for production
[ ] NO-GO — reasons: ...
```

## 3. Testing Patterns

### API Testing
```python
# Test every endpoint for:
# 1. Happy path (valid input → expected output)
# 2. Validation (invalid input → proper error)
# 3. Authentication (no token → 401)
# 4. Authorization (wrong role → 403)
# 5. Not found (bad ID → 404)
# 6. Edge cases (empty strings, max length, special chars)

async def test_create_project_happy_path(client, ceo_token):
    response = await client.post("/api/projects", json={
        "name": "Test Project",
        "description": "A valid project"
    }, headers={"Authorization": f"Bearer {ceo_token}"})

    assert response.status_code == 201
    data = response.json()["data"]
    assert data["name"] == "Test Project"
    assert data["status"] == "intake"
    assert "id" in data

async def test_create_project_no_auth(client):
    response = await client.post("/api/projects", json={
        "name": "Test"
    })
    assert response.status_code == 401

async def test_create_project_empty_name(client, ceo_token):
    response = await client.post("/api/projects", json={
        "name": "",
        "description": "test"
    }, headers={"Authorization": f"Bearer {ceo_token}"})
    assert response.status_code == 422
```

### Frontend Testing
```typescript
// Component test (Vitest + Testing Library)
test('shows loading skeleton while fetching projects', () => {
  render(<ProjectList />)
  expect(screen.getByTestId('skeleton')).toBeInTheDocument()
})

test('renders project cards after fetch', async () => {
  render(<ProjectList />)
  await waitFor(() => {
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
  })
})

test('shows empty state when no projects', async () => {
  server.use(rest.get('/api/projects', (req, res, ctx) =>
    res(ctx.json({ data: [], total: 0 }))
  ))
  render(<ProjectList />)
  await waitFor(() => {
    expect(screen.getByText('No projects yet')).toBeInTheDocument()
  })
})

// E2E test (Playwright)
test('CEO can approve a project', async ({ page }) => {
  await page.goto('/dashboard')
  await page.click('[data-testid="pending-approval"]')
  await page.click('[data-testid="approve-btn"]')
  await expect(page.locator('[data-testid="project-status"]'))
    .toHaveText('Active')
})
```

## 4. Edge Case Checklist

### Input Edge Cases
```
STRINGS:
  - Empty string ""
  - Single character "a"
  - Maximum length (test boundary)
  - Unicode: "Héllo Wörld" "你好" "🔥"
  - Special chars: <script>alert('xss')</script>
  - SQL injection: ' OR 1=1 --
  - Very long string (10,000+ chars)
  - Whitespace only "   "
  - Null / undefined

NUMBERS:
  - Zero (0)
  - Negative (-1)
  - Maximum integer
  - Floating point (0.1 + 0.2)
  - NaN, Infinity

ARRAYS:
  - Empty array []
  - Single item [1]
  - Duplicate items [1, 1, 1]
  - Very large array (10,000+ items)

DATES:
  - Midnight (00:00:00)
  - End of day (23:59:59)
  - Leap year (Feb 29)
  - Timezone boundaries
  - Past dates, future dates
  - Invalid dates (Feb 30)
```

### System Edge Cases
```
CONCURRENCY:
  - Two users editing same resource simultaneously
  - Rapid duplicate requests (double-click submit)
  - Race conditions in async operations

NETWORK:
  - Request timeout
  - Connection drop mid-request
  - Slow network (high latency)
  - Large payload

STATE:
  - Session expired mid-operation
  - Browser back button after form submit
  - Multiple tabs with same session
  - Cache stale after update
```

## 5. Bug Report Template

```markdown
## Bug Report

**ID:** BUG-042
**Severity:** Critical | High | Medium | Low
**Found by:** [QA member name]
**Assigned to:** [Team]
**Project:** [Project name]

### Description
One sentence describing the bug.

### Steps to Reproduce
1. Go to /dashboard
2. Click "Create Project"
3. Enter name with 51 characters
4. Click Submit

### Expected Result
Error message: "Name must be 50 characters or less"

### Actual Result
500 Internal Server Error

### Environment
- Browser: Chrome 120
- API: staging (v1.2.0)
- OS: macOS

### Evidence
[Screenshot or API response]

### Root Cause (if known)
Missing input validation on project name length in API.

### Fix Suggestion
Add max_length=50 to ProjectCreate Pydantic model.
```

## 6. Security Testing (OWASP Top 10)

```
TEST FOR EACH:

1. INJECTION (SQL, NoSQL, Command)
   - Try SQL in every input field: ' OR '1'='1
   - Try command injection: ; ls -la
   - Verify parameterized queries used everywhere

2. BROKEN AUTHENTICATION
   - Brute force login (should rate limit)
   - Session fixation
   - Token in URL (should be in header)
   - Token expiry enforced

3. SENSITIVE DATA EXPOSURE
   - API returns passwords? (should never)
   - HTTPS enforced? (should be)
   - Error messages expose internals? (should not)
   - Sensitive data in logs? (should not)

4. BROKEN ACCESS CONTROL
   - Client accessing CEO endpoints? (should 403)
   - Client accessing other client's data? (should 403)
   - Modifying resource you don't own? (should 403)
   - Direct object reference: /api/projects/{other-id}

5. SECURITY MISCONFIGURATION
   - Default credentials active?
   - Debug mode in production?
   - Directory listing enabled?
   - Unnecessary HTTP methods allowed?

6. XSS (Cross-Site Scripting)
   - Inject <script> in every text field
   - Check if output is HTML-escaped
   - Test stored XSS (saved and displayed later)

7. INSECURE DESERIALIZATION
   - Tampered JWT tokens
   - Modified request bodies

8. COMPONENTS WITH VULNERABILITIES
   - npm audit / pip audit
   - Check CVE databases for dependencies

9. INSUFFICIENT LOGGING
   - Are login failures logged?
   - Are admin actions logged?
   - Can logs be tampered with?

10. SERVER-SIDE REQUEST FORGERY (SSRF)
    - Can user input trigger server-side requests to internal services?
```

## 7. Performance Testing

```
TOOLS: k6 (recommended, free, scriptable)

TESTS:
  Load Test    — Normal expected load for 10 minutes
  Stress Test  — 2x expected load, find breaking point
  Spike Test   — Sudden burst of traffic
  Soak Test    — Normal load for extended period (memory leaks)

TARGETS:
  API response time:  p95 < 500ms
  Page load time:     LCP < 2.5s
  WebSocket latency:  < 100ms
  Concurrent users:   100 (minimum viable)
  Error rate:         < 0.1% under normal load

SCRIPT EXAMPLE (k6):
  import http from 'k6/http'
  import { check } from 'k6'

  export const options = {
    vus: 50,           // 50 virtual users
    duration: '5m',    // for 5 minutes
  }

  export default function() {
    const res = http.get('https://api.sinelab.app/health')
    check(res, {
      'status is 200': (r) => r.status === 200,
      'response < 500ms': (r) => r.timings.duration < 500,
    })
  }
```

## 8. Go/No-Go Decision Framework

```
CRITERIA:

MUST PASS (any fail = NO-GO):
  [ ] All P0 test cases passing
  [ ] No critical bugs open
  [ ] No high-severity security findings
  [ ] Core user flows work end-to-end
  [ ] Data integrity verified

SHOULD PASS (fail = conditional GO):
  [ ] All P1 test cases passing
  [ ] Performance targets met
  [ ] Accessibility basics met
  [ ] Error handling covers known cases

NICE TO HAVE (fail = GO with notes):
  [ ] All P2 test cases passing
  [ ] Cross-browser testing complete
  [ ] Load testing complete

RECOMMENDATION FORMAT:
  "GO — All critical tests pass. 2 medium bugs deferred to next release.
   Performance within targets. Security scan clean."

  "NO-GO — Critical bug in auth flow (BUG-042). Payment endpoint
   returns 500 on edge case. Must fix before release."
```
