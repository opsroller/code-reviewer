// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'review-profile',
  description: 'Build or refresh a project\'s review notes (a reference page in the project\'s docs) by surveying stack, commands, architecture, project rules (license, docs framework, commits, merge method), security model, budgets and past review findings in parallel; ships the page in one docs PR. args: { repo?: "<owner/repo or path; default: current repo>", page?: "<docs path; default: what the project profile names>" }',
  phases: [
    { title: 'Survey', detail: 'one agent per section of the notes, read-only' },
    { title: 'Plan docs', detail: 'compass: confirm the page kinds this work produces' },
    { title: 'Do docs', detail: 'one agent writes the notes page and the index link' },
    { title: 'Check docs', detail: 'one Diataxis kind per touched page; commands really run' },
  ],
}

const repo = (args && args.repo) || 'the current repository'
const page = (args && args.page) || 'the review notes path named in the project profile (if none, docs/reference/review-notes.md)'

const DOCS_FRAGMENT = 'Classify every user-visible change in this work with the Diataxis compass (action/cognition x study/work). For each, update or add exactly one page of that kind under docs/<kind>/, keep each page to one kind, title it by the project pattern, and link to the related pages of the other kinds. Report pages touched and any change you left undocumented and why.'

const SECTION = { type: 'object', properties: {
  section: { type: 'string' }, lines: { type: 'array', items: { type: 'string' } },
  doc_conflicts: { type: 'array', items: { type: 'string' } }, why_questions: { type: 'array', items: { type: 'string' } } },
  required: ['section', 'lines'] }
const PLAN = { type: 'object', properties: { pages: { type: 'array', items: { type: 'object', properties: {
  path: { type: 'string' }, kind: { type: 'string', enum: ['tutorial', 'how-to', 'reference', 'explanation'] }, action: { type: 'string' } },
  required: ['path', 'kind'] } } }, required: ['pages'] }
const DONE = { type: 'object', properties: { pages_touched: { type: 'array', items: { type: 'string' } },
  pr_url: { type: 'string' }, undocumented: { type: 'string' } }, required: ['pages_touched'] }
const CHECK = { type: 'object', properties: { ok: { type: 'boolean' }, problems: { type: 'array', items: { type: 'string' } } }, required: ['ok'] }

const SECTIONS = [
  ['Stack', 'languages, frameworks and versions; style guides and where they live'],
  ['Commands', 'build, lint, format, type-check, test, strict or sanitizer builds, run the app. Run each documented command on a clean checkout and record what actually works'],
  ['Architecture', 'layers and modules, forbidden dependencies, contracts between areas, owners per area'],
  ['Project rules', 'license and the header or SPDX convention for new files and manifests; documentation framework (e.g. Diataxis) and docs layout; commit convention; merge method; PR size limit; required checks; owned paths per role'],
  ['Security model', 'trust boundaries, sensitive data, auth model, dependency and disclosure policy'],
  ['Budgets', 'frame time, response time, memory, size, load time; determinism and platform rules'],
  ['Pitfalls', 'findings repeated across recent merged PR reviews, and stack traps the docs warn about; each with a one-line check'],
  ['Specialists', 'which areas need which reviewer (security, migrations, accessibility, localization)'],
]

phase('Survey')
const found = await parallel(SECTIONS.map(([name, what]) => () =>
  agent(`You are the code-reviewer. Follow the onboarding rule, then the review-profile skill, steps 1-3, for ${repo}, section "${name}" only: ${what}. Read-only: do not edit files. Return reference lines (describe, state rules flatly, no instructions or why), conflicts between docs and the tree, and any "why" questions to ask the owner.`, { schema: SECTION, phase: 'Survey', label: `survey:${name}` })))
const sections = found.map((r, i) => r || { section: SECTIONS[i][0], lines: [], doc_conflicts: [`survey of ${SECTIONS[i][0]} returned no result; section left unverified`] })
const conflicts = sections.flatMap(s => s.doc_conflicts || [])
const whys = sections.flatMap(s => s.why_questions || [])

phase('Plan docs')
const plan = await agent(`Plan the documentation for this work on ${repo}: "${DOCS_FRAGMENT}" The work is the review notes at ${page}. Confirm its kind (reference), whether the reference index needs a link, and whether the why-questions below call for an explanation page the owner should write. Why-questions: ${JSON.stringify(whys)}`, { schema: PLAN, phase: 'Plan docs', label: 'plan' })
if (!plan) return 'planning failed: no docs plan; nothing written'

phase('Do docs')
const done = await agent(`Follow the review-profile skill, steps 4-6, in ${repo}. Write ${page} as one reference page from these sections (keep their order; open with one line saying it is reference for reviewers; tables and lists; link out to the style guide and docs guide instead of copying them). Add its link to the reference index. You are the only agent editing these files. Ship it as one docs PR following the project's commit convention. Sections: ${JSON.stringify(sections)}\nPlan: ${JSON.stringify(plan.pages)}\nDocs that disagree with the tree (list them in the PR body as follow-ups; do not fix other roles' docs): ${JSON.stringify(conflicts)}`, { schema: DONE, phase: 'Do docs', label: 'write' })
if (!done) return { status: 'blocked', error: 'writer returned no result', sections }

phase('Check docs')
const check = await agent(`Follow the docs-review skill, sections 2-3, on ${JSON.stringify(done.pages_touched)} in ${repo}: one Diataxis kind per page (the notes are reference: no instructions, no why), title and opening line, linked from the index, and every command listed was really run.`, { schema: CHECK, phase: 'Check docs', label: 'check' })

return {
  status: check && check.ok ? 'done' : 'needs-fixes',
  pages: done.pages_touched, pr: done.pr_url || '', doc_conflicts: conflicts,
  explanation_owed: plan.pages.filter(p => p.kind === 'explanation'),
  check: check || { ok: false, problems: ['docs check returned no result'] },
}
