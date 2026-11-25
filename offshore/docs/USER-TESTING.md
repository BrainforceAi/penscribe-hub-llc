# Testing the document flow with real applicants (about 45 minutes)

Recruit **5 people** who match your applicants (a mix of first-timers and experienced). Ask them to use their phone. Do not help or explain. Watch where they hesitate.

## Tasks (read aloud, one at a time)
1. "You want to work as a [driller / ROV pilot / cook]. Find out which documents you need."
2. "Tell the site which ones you already have."
3. "Decide what you would like us to help with, and add it to your cart."
4. "Go to checkout. What happens next, in your own words?"

## Ask afterwards
- What did the site ask you to do, in your own words?
- Was anything confusing or unclear? Which words?
- Was the price what you expected? Was it clear what you pay us and what you pay others?
- What would stop you from buying today?

## What to look for
- Anyone who stalls on step 1 or 2 (too many items, unclear role).
- Anyone who unticks must-haves (unclear why they matter).
- Anyone who opens "Other options" (the first suggestion was wrong for them).
- Anyone who says "I'm not buying the whole section" or misreads the total.

## Numbers to watch after launch
Open any page with `?debug=funnel` for this device's counts, and connect Google Analytics or Plausible to see all visitors:
`doc_role_selected` → `doc_checklist_done` → `doc_plan_viewed` → `doc_added_to_cart` → `checkout_viewed` → `order_submitted`.
A big drop between two steps shows exactly where to simplify next.
