// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 'review-profile',
  description: 'Build or refresh a project\'s review notes (a reference page in the project\'s docs) by surveying stack, commands, architecture, project rules (license, docs framework, commits, merge method), security model, budgets and past review findings in parallel; ships the page in one docs PR. args: { repo?: "<owner/repo or path; default: current repo>", page?: "<docs path; default: what the project profile names>" }',
  phases: [
    { title: 'Survey', detail: 'one agent per section of the notes, read-only' },
    { title: 'Plan docs', detail: 'compass: confirm the page kinds this work produces' },
    { title: 'Do docs', detail: 'one agent writes the notes page and the index link' },
    { title: 'Check docs', detail: 'one Diataxis kind per touched page; each command names its CI job' },
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
  ['Commands', 'build, lint, format, type-check, test, strict or sanitizer builds, run the app. Map each documented command to the CI job that runs it, from the CI config and recent runs, and record what passes and which commands no job runs'],
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
const check = await agent(`Follow the docs-review skill, sections 2-3, on ${JSON.stringify(done.pages_touched)} in ${repo}: one Diataxis kind per page (the notes are reference: no instructions, no why), title and opening line, linked from the index, and every command listed names the CI job that runs it.`, { schema: CHECK, phase: 'Check docs', label: 'check', independent: true })

return {
  status: check && check.ok ? 'done' : 'needs-fixes',
  pages: done.pages_touched, pr: done.pr_url || '', doc_conflicts: conflicts,
  explanation_owed: plan.pages.filter(p => p.kind === 'explanation'),
  check: check || { ok: false, problems: ['docs check returned no result'] },
}
})(RUN.agent, RUN.phase, RUN.log)]); return RUN.finish(RUN_OUT)
