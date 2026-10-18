# Sources

*Reference: the research behind the code-reviewer plugin.*

1. **Google Engineering Practices: The Standard of Code Review** -
   https://google.github.io/eng-practices/review/reviewer/standard.html -
   the "improves code health" standard, principles, conflict resolution.
2. **Google: What to Look For in a Code Review** -
   https://google.github.io/eng-practices/review/reviewer/looking-for.html -
   design, functionality, complexity, tests, naming, comments, docs,
   every line, context, good things.
3. **Google: Navigating a CL in Review** -
   https://google.github.io/eng-practices/review/reviewer/navigate.html -
   broad view, core first, post design problems immediately.
4. **Google: Speed of Code Reviews** -
   https://google.github.io/eng-practices/review/reviewer/speed.html -
   one business day, fast responses over fast completion, LGTM with
   comments.
5. **Google: How to Write Code Review Comments** -
   https://google.github.io/eng-practices/review/reviewer/comments.html -
   courtesy, explain why, severity labels, praise.
6. **Google: Handling Pushback in Code Reviews** -
   https://google.github.io/eng-practices/review/reviewer/pushback.html -
   who is right, "clean it up later", escalation.
7. **SmartBear: Best Practices for Peer Code Review** (Cisco study) -
   https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/ -
   200-400 lines, under 500 lines per hour, 60-90 minute sessions,
   checklists, culture.
8. **Conventional Comments** - https://conventionalcomments.org/ -
   comment format, labels, decorations.
9. **OWASP Code Review Guide v2** -
   https://wiki.owasp.org/images/5/53/OWASP_Code_Review_Guide_v2.pdf -
   preparation, threat context, risk-based review, source-to-sink,
   checklist by control, pre- vs post-commit review.
10. **OWASP Code Review Guide v2 table of contents** -
    https://wiki.owasp.org/index.php/OWASP_Code_Review_V2_Table_of_Contents -
    technical controls and vulnerability categories.
11. **OWASP Top 10 (2025)**, summarised by Qualys -
    https://blog.qualys.com/qualys-insights/2026/06/15/what-changed-in-owasp-top-10-2025-and-recommendations-for-each-category -
    the A01-A10 categories used to name security findings.
12. **Bacchelli and Bird, Expectations, Outcomes, and Challenges of Modern
    Code Review** (ICSE 2013), summary by DX -
    https://getdx.com/research/outcomes-and-challenges-of-code-review/ -
    defects vs knowledge transfer; understanding as the main challenge.
13. **Sadowski et al., Modern Code Review: A Case Study at Google**
    (ICSE SEIP 2018) -
    https://research.google/pubs/modern-code-review-a-case-study-at-google/ -
    motivations and practice across nine million reviewed changes.
14. **Michaela Greiler, How code reviews work at Microsoft** -
    https://www.freecodecamp.org/news/how-code-reviews-work-at-microsoft-4ebdea0cd0c0/ -
    review frequency, process, bots for style, screenshots for UI.
15. **GitLab Code Review Guidelines** -
    https://docs.gitlab.com/development/code_review/ -
    reviewer vs maintainer, non-blocking comments, summary note,
    "right vs right now", domain reviewers.
16. **Chromium Code Reviews** -
    https://chromium.googlesource.com/chromium/src/+/4fa27c5c19dad/docs/code_reviews.md -
    owners, 24-hour actionable response, dividing work among reviewers.
17. **Michael Lynch, How to Do Code Reviews Like a Human** -
    https://mtlynch.io/human-code-reviews-1/ -
    tone, avoiding "you", requests not commands, limiting comments per
    round.
18. **Dropbox Engineering Career Framework** (IC1 and IC3 software
    engineer) - https://dropbox.github.io/dbx-career-framework/ic3_software_engineer.html -
    how review expectations grow with level.
19. **O*NET 15-1251.00 Computer Programmers** -
    https://www.onetonline.org/link/summary/15-1131.00 -
    review and correction tasks in the occupation.
20. **SFIA 9: Quality assurance (QUAS)** -
    https://sfia-online.org/en/skillcode/9/QUAS -
    levels of review and assessment responsibility.
21. **Diataxis** (start page, compass, tutorials, how-to guides,
    reference, explanation) - https://diataxis.fr/ - the docs pass and
    this plugin's own docs.
22. **The team's Diataxis guide** (project document,
    `documentation/diataxis-guide.md`) - section 6 review checklist folded
    into `docs-review`.
23. **The team's code review checklist** (project document,
    `code-review/review-checklist.md`) - severity scheme, output rules,
    and the checklist in `skills/review-pr/checklist.md`.
