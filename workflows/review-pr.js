export const meta = {
  name: 'review-pr',
  description: 'Review a pull request in parallel passes, verify each finding, and draft labelled comments with a verdict',
  whenToUse: 'Full review of one PR or diff. args: { pr: "<owner/repo#N or branch or diff range>", notes: "<optional focus>" }',
  phases: [
    { title: 'Triage', detail: 'size, CI, approach gate' },
    { title: 'Passes', detail: 'one agent per review dimension' },
    { title: 'Verify', detail: 'try to refute each finding' },
    { title: 'Verdict', detail: 'Conventional Comments and summary' },
  ],
}

const target = (args && args.pr) || 'the current branch against the default branch'
const focus = (args && args.notes) ? `\nExtra focus from the requester: ${args.notes}` : ''

const TRIAGE = { type: 'object', properties: {
  proceed: { type: 'boolean' }, reason: { type: 'string' },
  changed_lines: { type: 'number' }, summary: { type: 'string' } },
  required: ['proceed', 'reason', 'summary'] }
const FINDINGS = { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: {
  file: { type: 'string' }, line: { type: 'number' },
  label: { type: 'string', enum: ['issue (blocking)', 'issue', 'suggestion', 'todo', 'question', 'nitpick', 'praise'] },
  subject: { type: 'string' }, why: { type: 'string' }, direction: { type: 'string' } },
  required: ['file', 'label', 'subject', 'why'] } } }, required: ['findings'] }
const VERDICT = { type: 'object', properties: { real: { type: 'boolean' }, note: { type: 'string' } }, required: ['real'] }

phase('Triage')
const t = await agent(`Use the code-reviewer triage-pr skill on ${target}. Read the project profile's review notes. Report whether a full review should proceed (valid problem, sound approach, reviewable size, CI green) and summarise the change in 3-5 lines.${focus}`, { schema: TRIAGE, label: 'triage' })
if (!t || !t.proceed) return { verdict: 'request changes or wait', triage: t }

const PASSES = [
  ['design', 'design and architecture: right layer, duplication, speculative code, contract changes'],
  ['correctness', 'correctness: edge cases, error handling, concurrency, resource release, compatibility. Build and run tests if you can'],
  ['tests', 'tests: coverage of new behaviour, determinism, meaningful assertions'],
  ['security', 'security, following the security-pass skill'],
  ['performance', 'performance, following the performance-pass skill and the project budgets'],
  ['readability', 'readability, consistency with surrounding code and project conventions, and docs'],
]

const results = await pipeline(PASSES,
  ([key, what]) => agent(`Review ${target} for ${what} only. Change summary: ${t.summary}\nUse the project profile's review notes. Skip anything linters enforce. Report findings as Conventional Comments fields; include praise when earned.${focus}`, { schema: FINDINGS, phase: 'Passes', label: `pass:${key}` }),
  r => parallel(((r && r.findings) || []).map(f => () =>
    (f.label === 'praise' || f.label === 'nitpick' || f.label === 'question')
      ? Promise.resolve(f)
      : agent(`Try to refute this review finding on ${target}. Read the code. Default to real=false if the claimed problem cannot happen on a realistic path.\n${JSON.stringify(f)}`, { schema: VERDICT, phase: 'Verify', label: `verify:${f.file}` })
          .then(v => (v && v.real) ? f : null))))

const kept = results.flat().filter(Boolean)
log(`${kept.length} findings survived verification`)

phase('Verdict')
return await agent(`Write the review for ${target} following the review-comments skill. Findings (already verified):\n${JSON.stringify(kept)}\nOutput: one comment per finding as "<label>: <subject>" plus why and direction, with file:line; then the verdict (approve / request changes / comment) and a summary of what was reviewed and how, what was not, and the blockers. Do not post anything; return the text.`, { label: 'verdict' })
