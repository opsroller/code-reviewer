// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'review-pr',
  description: 'Review one pull request end to end: triage, parallel review passes (including a Diataxis docs pass and a cross-PR pass), verification of every finding, one review with severity-labelled Conventional Comments and a verdict, then the review-notes documentation step. args: { pr: "<owner/repo#N, branch or diff range>", focus?: "<extra focus>", post?: true to post the review and notify the author (default: return the draft only), sharedAccount?: true when reviewer and author post from one account, notes?: "pr" (default: write repeated findings to the project review notes and open or update a docs PR) or "verdict" (edit nothing, open no PR: the pitfalls go in this round\'s review and the result) }',
  phases: [
    { title: 'Triage', detail: 'intent, size, CI, approach gate (triage-pr)' },
    { title: 'Plan docs', detail: 'compass: which doc kinds the PR owes' },
    { title: 'Passes', detail: 'one agent per review pass (review-pr, security-pass, performance-pass, docs-review)' },
    { title: 'Verify', detail: 'try to refute each finding; keep unverified ones marked' },
    { title: 'Review', detail: 'one review per round (review-comments)' },
    { title: 'Do docs', detail: 'repeated findings into the project review notes (review-profile); notes "verdict": into the review instead, before Review' },
    { title: 'Check docs', detail: 'one Diataxis kind per touched page' },
  ],
}

// --- run-modes v2 begin ---
const RUN = ((a, realAgent, realPhase, realLog) => {
  const opted = !!(a && typeof a === 'object' && a.run && typeof a.run === 'object')
  const c = opted ? a.run : {}
  const mode = c.mode === 'inline' ? 'inline' : 'agents'
  const results = c.results && typeof c.results === 'object' ? c.results : {}
  const reviewers = c.reviewers && typeof c.reviewers === 'object' ? c.reviewers : {}
  const only = Array.isArray(c.only) && c.only.length ? c.only.map(String) : null
  const from = c.from ? String(c.from) : null
  const titles = typeof meta !== 'undefined' && meta && Array.isArray(meta.phases) ? meta.phases.map((p) => p.title) : []
  const unknown = titles.length ? (from ? [from] : []).filter((t) => !titles.includes(t)) : []
  const error = c.mode && !['agents', 'inline'].includes(c.mode)
    ? `run.mode must be "agents" or "inline", got "${c.mode}"`
    : unknown.length ? `run.from names no phase: ${unknown.join(', ')}. Phases: ${titles.join(', ')}` : null
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)
  // An answer must carry every required key of its schema, as the runtime
  // enforces for agents; returns the missing keys, or null when it fits.
  const missing = (v, schema) => {
    if (v === null || v === undefined) return 'an answer'
    if (!schema || schema.type !== 'object') return null
    if (typeof v !== 'object' || Array.isArray(v)) return 'a JSON object'
    const gap = (schema.required || []).filter((k) => !has(v, k) || v[k] === undefined)
    return gap.length ? gap.join(', ') : null
  }
  const seen = {}
  const out = {}
  // Who answered each step marked independent: "subagent" when this run
  // spawned it, else the reviewer named in run.reviewers, else "self".
  const by = {}
  const who = (k) => (typeof reviewers[k] === 'string' && reviewers[k].trim() ? reviewers[k].trim() : 'self')
  const skipped = []
  const next = []
  const logs = []
  let current = ''
  let reached = !from
  let halting = false
  let release = () => {}
  const halted = new Promise((r) => { release = r })
  const picked = (ph, label) => reached && (!only || only.some((s) => s === ph || s === label || label.startsWith(s + ':')))
  const agent = (prompt, opts) => {
    const op = opts || {}
    const independent = op.independent === true
    const ph = op.phase || current
    const base = op.label || ph || 'agent'
    seen[base] = (seen[base] || 0) + 1
    const key = seen[base] > 1 ? `${base}#${seen[base]}` : base
    let note = null
    if (has(results, key)) {
      const gap = missing(results[key], op.schema)
      if (!gap) { out[key] = results[key]; if (independent) by[key] = who(key); return Promise.resolve(results[key]) }
      note = `answer missing ${gap}; answer this brief again`
    }
    if (!picked(ph, base)) { skipped.push(key); return Promise.resolve(null) }
    if (mode === 'agents') {
      const pass = Object.assign({}, op)
      delete pass.independent
      return realAgent(prompt, opts ? pass : opts).then((r) => {
        if (r !== null && r !== undefined) { out[key] = r; if (independent) by[key] = 'subagent' }
        return r
      })
    }
    const brief = { key, phase: ph, prompt, schema: op.schema || null }
    if (independent) brief.independent = true
    if (note) brief.note = note
    next.push(brief)
    if (!halting) {
      halting = true
      // Wait 200 microtask turns before pausing, so every sibling in a
      // parallel() or pipeline() fan-out queues its brief into this pause.
      ;(async () => { for (let i = 0; i < 200; i++) await null; release('__run_halted__') })()
    }
    return new Promise(() => {})
  }
  const phase = (t) => { current = t; if (from && t === from) reached = true; return realPhase(t) }
  const log = (m) => { logs.push(String(m)); return realLog(m) }
  const finish = (value) => {
    if (!opted) return value
    const self_reviewed = Object.keys(by).filter((k) => by[k] === 'self')
    if (value === '__run_halted__') {
      return {
        run: 'inline', status: 'next', next, results: out, reviewers: by, self_reviewed, skipped, logs,
        how: 'Do each brief in next, in order: follow its prompt in this session (it may tell you to edit files, commit or push), and shape your answer to its schema when one is given, with every required field. A brief marked independent reviews work this run produced, so do not answer it yourself: send its prompt to a reviewer with no part in the work (the project\'s code-reviewer role, a fresh session or a fresh subagent), use their answer, and name them in run.reviewers under its key; if you must answer it yourself, it is listed in self_reviewed and must be reported as self-reviewed. A brief with a note was answered before without the fields it names. Add each answer to results under its key, then run this workflow again with the same args, run.results set to the merged results and run.reviewers to the merged reviewers. Repeat until status is "done". To avoid pasting results back on every call, drive the run with engineering-practices tools/run-inline.mjs and a state file instead: it stores each answer and prints only the next briefs.',
      }
    }
    return { run: mode, status: 'done', result: value, results: out, reviewers: by, self_reviewed, skipped, logs }
  }
  return { agent, phase, log, finish, halted, error }
})(typeof args === 'undefined' ? undefined : args, agent, phase, log)
if (RUN.error) return RUN.error
const RUN_OUT = await Promise.race([RUN.halted, (async (agent, phase, log) => {
// --- run-modes v2 end (workflow body follows; close it with the tail line) ---

const USAGE = 'usage: review-pr { pr: "owner/repo#N | branch | base..head", focus?: string, post?: boolean, sharedAccount?: boolean, notes?: "pr" | "verdict" }'
if (!args || !args.pr) return USAGE

const target = args.pr
const focus = args.focus ? `\nExtra focus from the requester: ${args.focus}` : ''
const post = args.post === true
const shared = args.sharedAccount === true
const notes = args.notes === undefined ? 'pr' : args.notes
if (notes !== 'pr' && notes !== 'verdict') return `notes must be "pr" or "verdict", got "${notes}"`

const DOCS_FRAGMENT = 'Classify every user-visible change in this work with the Diataxis compass (action/cognition x study/work). For each, update or add exactly one page of that kind under docs/<kind>/, keep each page to one kind, title it by the project pattern, and link to the related pages of the other kinds. Report pages touched and any change you left undocumented and why.'

const TRIAGE = { type: 'object', properties: {
  decision: { type: 'string', enum: ['review', 'split', 'wait', 'stop', 'reassign'] },
  reason: { type: 'string' }, intent: { type: 'string' },
  reviewable_lines: { type: 'number' }, core_files: { type: 'array', items: { type: 'string' } },
  specialists_needed: { type: 'array', items: { type: 'string' } },
  draft_comment: { type: 'string' } },
  required: ['decision', 'reason', 'intent'] }

const DOCS_PLAN = { type: 'object', properties: {
  owed: { type: 'array', items: { type: 'object', properties: {
    change: { type: 'string' }, kind: { type: 'string', enum: ['tutorial', 'how-to', 'reference', 'explanation'] },
    present_in_pr: { type: 'boolean' }, page: { type: 'string' } }, required: ['change', 'kind', 'present_in_pr'] } } },
  required: ['owed'] }

const FINDING = { type: 'object', properties: {
  file: { type: 'string' }, line: { type: 'number' },
  severity: { type: 'string', enum: ['blocking', 'should-fix', 'optional', 'none'] },
  label: { type: 'string', enum: ['issue', 'todo', 'chore', 'suggestion', 'nitpick', 'thought', 'typo', 'question', 'note', 'praise'] },
  subject: { type: 'string' }, failure: { type: 'string' }, direction: { type: 'string' } },
  required: ['file', 'severity', 'label', 'subject'] }
const FINDINGS = { type: 'object', properties: { findings: { type: 'array', items: FINDING },
  checked: { type: 'string' }, not_checked: { type: 'string' } }, required: ['findings'] }
const VERIFY = { type: 'object', properties: { real: { type: 'boolean' }, reproduced: { type: 'boolean' }, note: { type: 'string' } }, required: ['real'] }
const REVIEW = { type: 'object', properties: {
  verdict: { type: 'string', enum: ['approve', 'request-changes', 'comment'] },
  blocking: { type: 'number' }, should_fix: { type: 'number' }, optional: { type: 'number' },
  summary: { type: 'string' }, comments: { type: 'array', items: { type: 'string' } },
  posted: { type: 'boolean' }, author_notified: { type: 'boolean' }, merged_already: { type: 'boolean' },
  follow_up: { type: 'string' } },
  required: ['verdict', 'blocking', 'summary'] }
const DOCS_DONE = { type: 'object', properties: {
  pages_touched: { type: 'array', items: { type: 'string' } }, undocumented: { type: 'string' } }, required: ['pages_touched'] }
const PITFALLS = { type: 'object', properties: {
  pitfalls: { type: 'array', items: { type: 'string' } }, owed_by_author: { type: 'array', items: { type: 'string' } } }, required: ['pitfalls'] }
const DOCS_CHECK = { type: 'object', properties: {
  ok: { type: 'boolean' }, problems: { type: 'array', items: { type: 'string' } } }, required: ['ok'] }

// Triage
phase('Triage')
const t = await agent(`You are the code-reviewer. Follow the onboarding rule, then the triage-pr skill on ${target}. Load the project's review notes (review-profile). Decide: review, split, wait, stop or reassign. Give the one-sentence intent, the reviewable line count (excluding generated, vendored and lockfiles), the core files, specialists needed, and for any decision other than review, the comment to post.${focus}`, { schema: TRIAGE, label: 'triage' })
if (!t) return 'triage failed: no result from the triage agent; nothing posted'
if (t.decision !== 'review') {
  return { verdict: t.decision === 'wait' ? 'comment' : 'request-changes', triage: t,
    note: 'Full review not started. Post the triage comment as the single review for this round (review-comments).' }
}

// Plan docs (compass)
phase('Plan docs')
const docsPlan = await agent(`Follow the docs-review skill, section 1, on ${target} (intent: ${t.intent}). Apply this to the PR rather than writing docs yourself: "${DOCS_FRAGMENT}" For each user-visible change, report the doc kind it owes and whether the PR already contains that page.`, { schema: DOCS_PLAN, phase: 'Plan docs', label: 'docs-plan' })
const owed = (docsPlan && docsPlan.owed) || []
const missingDocs = docsPlan ? owed.filter(o => !o.present_in_pr) : [{ change: 'docs plan did not run', kind: 'unverified', present_in_pr: false }]

// Passes
const PASSES = [
  ['design', 'the Design pass: right place, right time, right size, nothing speculative, contract changes intentional and announced'],
  ['correctness', 'the Correctness and Inputs passes from checklist.md: edge cases, bounded loops and retries, error paths, state, concurrency, errors never crossing language or library boundaries that cannot carry them, determinism where required. Build with the strictest cheap configuration (extra warnings, sanitizers, strict type checks), run the tests, and probe edge inputs (empty, zero, one, max, negative, malformed, repeated, out of order)'],
  ['tests', 'the Tests pass: new behaviour tested, a bug fix has a test that failed before it, tests deterministic and checking outcomes'],
  ['security', 'security, following the security-pass skill (context, source to sink, checklist by control, supply chain)'],
  ['performance', 'performance, following the performance-pass skill and the project budgets'],
  ['readability', 'readability and consistency: complexity, naming, comments explain why, matches surrounding code and the style guide'],
  ['build-cross-pr', 'Build, CI and Integration: CI on every shipped platform, warnings as errors for every target, linked libraries built with matching compile flags that affect ABI or error handling, generated files regenerated by tooling; then a cross-PR pass checking the change against the current base and every other open PR for broken CI jobs, contracts or assumptions once both land'],
  ['docs-hygiene', `documentation and hygiene, following the docs-review skill (sections 2-3) and the Docs and project hygiene section of checklist.md: run the documented commands on a clean checkout, Diataxis checklist on every touched page, new files and manifests carry the project license (never a template default), commit convention, merge method, owned paths. Doc kinds the PR owes but lacks (each is blocking): ${JSON.stringify(missingDocs)}`],
]

const verifyOne = f => {
  if (f.label === 'praise' || f.label === 'question' || f.label === 'note' || f.severity === 'optional' || f.severity === 'none') return Promise.resolve(f)
  return agent(`Try to refute this review finding on ${target}. Read the code around it and its callers; run the reproduction if you can. Answer real=false only if the problem cannot happen on a realistic path.\n${JSON.stringify(f)}`, { schema: VERIFY, phase: 'Verify', label: `verify:${f.file}:${f.line || 0}`, independent: true })
    .then(v => {
      if (!v) return Object.assign({}, f, { unverified: true })
      return v.real ? Object.assign({}, f, { reproduced: v.reproduced === true, verify_note: v.note || '' }) : null
    })
}

const results = await pipeline(PASSES,
  ([key, what]) => agent(`You are the code-reviewer reviewing ${target}. Intent: ${t.intent}. Core files: ${JSON.stringify(t.core_files || [])}. Follow the review-pr skill and its checklist.md for ${what} only. Use the project's review notes; skip anything linters and formatters enforce. Report each finding with the team severity (blocking, should-fix, optional, none) and a Conventional Comments label, a concrete failure (input -> wrong result) and a direction. Include praise when earned. Say what you checked and what you did not.${focus}`, { schema: FINDINGS, phase: 'Passes', label: `pass:${key}` })
    .then(r => r ? r : { findings: [], checked: '', not_checked: `pass ${key} returned no result` }),
  r => parallel((r.findings || []).map(f => () => verifyOne(f))).then(fs => ({ findings: fs.filter(Boolean), checked: r.checked || '', not_checked: r.not_checked || '' })))

const kept = results.flatMap(r => r.findings)
const coverage = results.map((r, i) => `${PASSES[i][0]}: checked ${r.checked || '?'}; not checked ${r.not_checked || 'nothing noted'}`)
log(`${kept.length} findings kept (${kept.filter(f => f.unverified).length} unverified)`)

const NOTES_FINDINGS = JSON.stringify(kept.map(f => ({ file: f.file, subject: f.subject, severity: f.severity })))

// notes "verdict": find the pitfalls before the review so they go in it; nothing is edited
let pitfalls = null
if (notes === 'verdict') {
  phase('Do docs')
  pitfalls = await agent(`Follow the review-profile skill, "Keeping it current". From these findings on ${target}, find any that match an earlier review's finding (search recent merged PR reviews) and write each as a pitfall line with a one-line check, in the shape of the project's review notes. Do not edit any file and do not open or update a pull request: return the lines, which go in this round's review. If a design decision was settled in this review, list it as an explanation page the author owes. Findings: ${NOTES_FINDINGS}`, { schema: PITFALLS, phase: 'Do docs', label: 'review-notes' })
}
const pitfallLines = (pitfalls && pitfalls.pitfalls) || []
const owedPages = (pitfalls && pitfalls.owed_by_author) || []
const inReview = pitfallLines.length || owedPages.length
  ? ` End the summary with a "Pitfalls for the review notes" section listing these lines for the owner of the review notes to add: ${JSON.stringify(pitfallLines)}${owedPages.length ? `, and the explanation pages the author owes: ${JSON.stringify(owedPages)}` : ''}.`
  : ''

// One review per round
phase('Review')
const review = await agent(`Write the single review for this round on ${target}, following the review-comments skill exactly. Findings (verified unless marked unverified; say so in those comments): ${JSON.stringify(kept)}\nCoverage per pass: ${JSON.stringify(coverage)}\nSpecialists needed: ${JSON.stringify(t.specialists_needed || [])}\nOne comment per finding: "<severity emoji> <label> [(decoration)]: <subject>", then the failure and the direction, at file:line. Then the summary (verdict line, counts, what's good, blocking items, checked, not checked) and the verdict.${inReview}${shared ? ' Reviewer and author share one account: post a Comment review whose first line is "Passed" or "Changes needed".' : ''} ${post ? 'Post it as one review with inline comments. If there is any blocking item, also tell the author directly through the project\'s channel. If the PR has already merged, do not leave findings only on it: open a follow-up task for the owner (follow-up-review) and report where.' : 'Do not post anything; return the text.'}`, { schema: REVIEW, phase: 'Review', label: 'review' })
if (!review) return { verdict: 'unknown', error: 'review agent returned no result; nothing posted', findings: kept }

// Do docs: the reviewer's own documentation (notes "pr" only)
let docsDone = { pages_touched: [] }
if (notes === 'pr') {
  phase('Do docs')
  docsDone = await agent(`Follow the review-profile skill, "Keeping it current". From these findings on ${target}, find any that match an earlier review's finding (search recent merged PR reviews) and add each as a pitfall line, with a one-line check, to the project's review notes reference page. One agent edits that page; open or update a small docs PR in the project for it if the project requires PRs for docs. If a design decision was settled in this review, list it as an explanation page the author owes. Findings: ${NOTES_FINDINGS}`, { schema: DOCS_DONE, phase: 'Do docs', label: 'review-notes' })
}

// Check docs
phase('Check docs')
const touched = (docsDone && docsDone.pages_touched) || []
const docsCheck = touched.length
  ? await agent(`Follow the docs-review skill, section 3, on these pages: ${JSON.stringify(touched)}. Each must be one Diataxis kind (review notes are reference: describe, no instructions or why), titled by the project pattern, opening with its kind-and-audience line, linked from the reference index.`, { schema: DOCS_CHECK, phase: 'Check docs', label: 'docs-check', independent: true })
  : { ok: true, problems: [] }

return {
  verdict: review.verdict, blocking: review.blocking, should_fix: review.should_fix, optional: review.optional,
  summary: review.summary, comments: review.comments || [], posted: review.posted === true,
  author_notified: review.author_notified === true, follow_up: review.follow_up || '',
  docs_owed_missing: missingDocs,
  review_notes: docsDone ? docsDone.pages_touched : 'review-notes step returned no result',
  ...(notes === 'verdict' ? { pitfalls: pitfalls ? pitfallLines : 'review-notes step returned no result', owed_by_author: owedPages } : {}),
  docs_check: docsCheck || { ok: false, problems: ['docs check returned no result'] },
}
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)
