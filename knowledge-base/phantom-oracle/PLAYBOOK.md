# PHANTOM ORACLE — Domain Expert Knowledge Base

## How the Best Domain Analysts Work

Source: Practices from McKinsey domain experts, Business Analysts at Deloitte, Domain-Driven Design (Eric Evans), and enterprise consulting methodologies.

---

## 1. Domain-Driven Design (DDD) — Eric Evans

The gold standard for understanding complex domains:

### Ubiquitous Language
- Create a shared vocabulary between client and development teams
- Every term has ONE definition, agreed by everyone
- Document in a glossary that all teams reference

```
Example (Aviation MRO):
  "Work Order" = A formal instruction to perform maintenance on a specific aircraft component
  "MEL" = Minimum Equipment List — the list of items that can be inoperative while aircraft still flies
  "AOG" = Aircraft On Ground — plane cannot fly, highest priority
```

### Bounded Contexts
- Large domains have sub-domains. Identify them.
- Each sub-domain has its own rules and vocabulary
- Map the relationships between contexts

```
Example (E-commerce):
  [Catalog] — products, categories, search
  [Orders]  — cart, checkout, payment
  [Shipping] — logistics, tracking, delivery
  [Support]  — tickets, returns, refunds

  Catalog → Orders (product info flows)
  Orders → Shipping (order triggers shipment)
  Shipping → Support (delivery issues)
```

### Aggregates
- Group related entities that change together
- Each aggregate has a root entity
- Rules: modify aggregates through the root only

## 2. Event Storming (Alberto Brandolini)

The fastest way to map a domain in production consulting:

```
Step 1: Identify DOMAIN EVENTS (past tense, orange sticky)
  "Order Placed", "Payment Received", "Item Shipped"

Step 2: Identify COMMANDS that trigger events (blue sticky)
  "Place Order", "Process Payment", "Ship Item"

Step 3: Identify ACTORS who issue commands (yellow sticky)
  "Customer", "Payment Gateway", "Warehouse Staff"

Step 4: Identify POLICIES (business rules, purple sticky)
  "If payment fails, retry 3 times then cancel"
  "If item out of stock, notify customer within 1 hour"

Step 5: Identify EXTERNAL SYSTEMS (pink sticky)
  "Stripe", "FedEx API", "Inventory Database"

Output: A complete map of how the business actually works.
```

## 3. Requirements Elicitation Techniques (IIBA/BABOK)

### The 5 Whys (Toyota Production System)
Ask "why" 5 times to find the root need:
```
Client: "We need a dashboard"
Why? "To monitor our sensors"
Why? "To catch equipment failures early"
Why? "Because unplanned downtime costs $50K/hour"
Why? "Because we have no predictive capability"
Why? "Because sensor data sits in silos nobody connects"

ROOT NEED: Not a dashboard — a predictive maintenance system
           that connects siloed sensor data.
```

### MoSCoW Prioritization
```
Must Have   — System doesn't work without this
Should Have — Important but can work around temporarily
Could Have  — Nice enhancement, not critical
Won't Have  — Explicitly out of scope (prevents scope creep)
```

### User Story Mapping (Jeff Patton)
```
BACKBONE (high-level activities):
  Discover → Diagnose → Assign → Fix → Verify

WALKING SKELETON (minimum for each):
  Search fault → Show diagnosis → Create work order → Mark done → Run test

FLESH (details added per release):
  R1: Basic fault search, simple work orders
  R2: AI diagnosis, auto-assignment
  R3: Predictive alerts, parts forecasting
```

## 4. Business Process Modeling (BPMN 2.0)

Standard notation for mapping workflows:

```
Events:    (○) Start   (◉) End   (◎) Intermediate
Tasks:     [Rectangle] — a unit of work
Gateways:  <Diamond> — decision point
  ◇ Exclusive (XOR): one path
  ◆ Parallel (AND): all paths
  ○ Inclusive (OR): one or more paths
Flows:     → Sequence   ⇢ Message   ··> Association
```

### How to Document a Workflow
```
1. Identify the trigger (what starts this process?)
2. Map the happy path (everything goes right)
3. Map exception paths (what can go wrong at each step?)
4. Identify decision points (who decides? based on what?)
5. Identify handoffs (where does work move between people/systems?)
6. Identify time constraints (SLAs, deadlines)
7. Identify data requirements (what info is needed at each step?)
```

## 5. Domain Validation Framework

Every output from any team must be validated against domain truth:

```
VALIDATION CHECKLIST:
[ ] Uses correct domain terminology (ubiquitous language)
[ ] Follows documented business rules
[ ] Handles all identified edge cases
[ ] Respects regulatory/compliance requirements
[ ] Data formats match industry standards
[ ] Workflow matches documented process maps
[ ] Calculations use correct formulas/units
[ ] Error messages are domain-appropriate
```

## 6. Industry Research Protocol

When analyzing a new domain:

```
1. INDUSTRY OVERVIEW
   - Market size and growth
   - Key players and competitors
   - Regulatory landscape
   - Technology adoption maturity

2. PAIN POINTS
   - What problems exist today?
   - What are current solutions?
   - Where do they fall short?
   - What's the cost of these problems?

3. KEY WORKFLOWS
   - Core business processes
   - Who does what, when, how
   - Where are the bottlenecks?
   - What's manual that could be automated?

4. DATA LANDSCAPE
   - What data exists?
   - Where is it stored?
   - What format?
   - What's missing?

5. STAKEHOLDERS
   - Who uses the system?
   - Who benefits?
   - Who decides?
   - Who pays?
```

## 7. Knowledge Base Structure

For each project, PHANTOM ORACLE creates:

```
/knowledge-base/
  /glossary.md           — Every domain term defined
  /business-rules.md     — Every rule, constraint, formula
  /workflows/             — Process maps for each workflow
  /stakeholders.md       — User personas and roles
  /data-dictionary.md    — Every data entity, field, type, constraint
  /compliance.md         — Regulatory requirements
  /edge-cases.md         — Known edge cases and how to handle them
  /industry-context.md   — Market context and competitive landscape
```

## 8. Handoff Quality Standard

Before handing off to THUNDER HELM:

```
HANDOFF CHECKLIST:
[ ] Glossary has 20+ domain terms defined
[ ] At least 5 business rules documented with examples
[ ] At least 3 workflows mapped end-to-end
[ ] All stakeholder roles identified
[ ] Data entities identified and described
[ ] Edge cases documented (at least 10)
[ ] Regulatory requirements listed (if applicable)
[ ] Client has reviewed and confirmed accuracy
```
