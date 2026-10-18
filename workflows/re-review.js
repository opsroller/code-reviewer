// SPDX-License-Identifier: GPL-2.0-or-later
export const meta = {
  name: 're-review',
  description: 'Follow up a review round: check each open thread against the new commits, verify fixes, settle pushback, leave one review with the new verdict, and open a follow-up task for the owner if the PR already merged with findings open; ends with the documentation step. args: { pr: "<owner/repo#N>", post?: true to post and resolve threads (default: return the draft), sharedAccount?: true when reviewer and author post from one account }',
  phases: [
    { title: 'Collect', detail: 'open threads, new commits, merge state' },
    { title: 'Plan docs', detail: 'compass: doc kinds owed by the new commits' },
    { title: 'Check threads', detail: 'one agent per open thread (follow-up-review)' },
    { title: 'Review', detail: 'one review for the round, or the merged-PR follow-up' },
    { title: 'Do docs', detail: 'settled decisions and repeated findings into project docs' },
    { title: 'Check docs', detail: 'one Diataxis kind per touched page' },
  ],
}

const USAGE = 'usage: re-review { pr: "owner/repo#N", post?: boolean, sharedAccount?: boolean }'
if (!args || !args.pr) return USAGE
const target = args.pr
const post = args.post === true
const shared = args.sharedAccount === true

const DOCS_FRAGMENT = 'Classify every user-visible change in this work with the Diataxis compass (action/cognition x study/work). For each, update or add exactly one page of that kind under docs/<kind>/, keep each page to one kind, title it by the project pattern, and link to the related pages of the other kinds. Report pages touched and any change you left undocumented and why.'

const STATE = { type: 'object', properties: {
  merged: { type: 'boolean' }, base_moved: { type: 'boolean' },
  threads: { type: 'array', items: { type: 'object', properties: {
    id: { type: 'string' }, file: { type: 'string' }, line: { type: 'number' },
    severity: { type: 'string', enum: ['blocking', 'should-fix', 'optional', 'none'] },
    subject: { type: 'string' }, author_reply: { type: 'string' } }, required: ['id', 'severity', 'subject'] } },
  new_commits: { type: 'array', items: { type: 'string' } } },
  required: ['merged', 'threads'] }
const DOCS_PLAN = { type: 'object', properties: { owed: { type: 'array', items: { type: 'object', properties: {
  change: { type: 'string' }, kind: { type: 'string' }, present_in_pr: { type: 'boolean' } }, required: ['change', 'kind', 'present_in_pr'] } } }, required: ['owed'] }
const THREAD = { type: 'object', properties: {
  status: { type: 'string', enum: ['fixed', 'answered', 'declined-accepted', 'still-open', 'regressed'] },
  note: { type: 'string' }, decision_settled: { type: 'string' }, new_finding: { type: 'string' } },
  required: ['status'] }
const REVIEW = { type: 'object', properties: {
  verdict: { type: 'string', enum: ['approve', 'request-changes', 'comment', 'follow-up-opened'] },
  blocking_open: { type: 'number' }, summary: { type: 'string' }, follow_up: { type: 'string' },
  posted: { type: 'boolean' }, author_notified: { type: 'boolean' } }, required: ['verdict', 'blocking_open', 'summary'] }
const DOCS_DONE = { type: 'object', properties: { pages_touched: { type: 'array', items: { type: 'string' } },
  owed_by_author: { type: 'array', items: { type: 'string' } } }, required: ['pages_touched'] }
const DOCS_CHECK = { type: 'object', properties: { ok: { type: 'boolean' }, problems: { type: 'array', items: { type: 'string' } } }, required: ['ok'] }

phase('Collect')
const st = await agent(`You are the code-reviewer. Follow the onboarding rule, then the follow-up-review skill on ${target}. List every unresolved review thread from earlier rounds (with its team severity), the commits pushed since the last review, whether the PR has merged, and whether the base branch moved.`, { schema: STATE, label: 'collect' })
if (!st) return 'collect failed: could not read the PR state; nothing posted'
if (!st.threads.length && !(st.new_commits || []).length) return { verdict: 'nothing-to-do', note: 'no open threads and no new commits since the last review' }

phase('Plan docs')
const plan = await agent(`Follow docs-review section 1 on the commits since the last review of ${target}: ${JSON.stringify(st.new_commits || [])}. Apply this to the PR rather than writing docs yourself: "${DOCS_FRAGMENT}" Report each owed kind and whether the PR now contains it.`, { schema: DOCS_PLAN, phase: 'Plan docs', label: 'docs-plan' })
const missingDocs = ((plan && plan.owed) || []).filter(o => !o.present_in_pr)

const checked = await pipeline(st.threads,
  th => agent(`Follow the follow-up-review skill, "Re-review a round of fixes" and "Handle pushback", for this thread on ${target}. Review the fix, not the whole PR. Re-run the reproduction for blocking items. If the author declined, judge their argument on facts and principles. Report new findings only if the fix introduced them.${st.base_moved ? ' The base moved: re-check the change against the current base and other open PRs.' : ''}\n${JSON.stringify(th)}`, { schema: THREAD, phase: 'Check threads', label: `thread:${th.id}` })
    .then(r => Object.assign({}, th, r ? r : { status: 'still-open', note: 'thread check returned no result; treated as open, unverified', unverified: true })))

const open = checked.filter(c => c.status === 'still-open' || c.status === 'regressed')
const openBlocking = open.filter(c => c.severity === 'blocking')
log(`${checked.length} threads checked; ${open.length} open (${openBlocking.length} blocking)`)

phase('Review')
const review = await agent(`Write the single review for this round on ${target}, following the review-comments skill. Thread results: ${JSON.stringify(checked)}. Doc kinds owed but missing (each blocking): ${JSON.stringify(missingDocs)}.${st.merged ? ' The PR has ALREADY MERGED: do not leave findings only on it. Open a follow-up task for the owner listing every open finding (severity, file:line, failure, direction) with a link to the PR, tell the author and owner directly about any blocking item, and leave one PR comment saying where the follow-up lives. Verdict: follow-up-opened.' : ''}${shared ? ' Reviewer and author share one account: post a Comment review whose first line is "Passed" or "Changes needed".' : ''} ${post ? 'Post it, resolve the threads that are fixed or answered, and tell the author directly about any blocking item.' : 'Do not post or resolve anything; return the text.'}`, { schema: REVIEW, phase: 'Review', label: 'review' })
if (!review) return { status: 'blocked', error: 'review agent returned no result; nothing posted', open_items: open }

phase('Do docs')
const settled = checked.map(c => c.decision_settled).filter(Boolean)
const docs = await agent(`Follow the review-profile skill, "Keeping it current", and follow-up-review "Documentation this work owes" for ${target}. Add any finding repeated from an earlier review as a pitfall in the project's review notes (reference); one agent edits that page. For each decision settled in this round, list the explanation page the author owes (do not write it in their PR). Settled decisions: ${JSON.stringify(settled)}`, { schema: DOCS_DONE, phase: 'Do docs', label: 'docs' })

phase('Check docs')
const touched = (docs && docs.pages_touched) || []
const docsCheck = touched.length
  ? await agent(`Follow docs-review section 3 on ${JSON.stringify(touched)}: one Diataxis kind per page, title pattern, kind-and-audience opening line, linked from its index.`, { schema: DOCS_CHECK, phase: 'Check docs', label: 'docs-check' })
  : { ok: true, problems: [] }

return {
  status: review.blocking_open > 0 || openBlocking.length ? 'blocked' : 'clear',
  verdict: review.verdict, summary: review.summary, follow_up: review.follow_up || '',
  open_items: open, docs_owed_missing: missingDocs,
  docs: docs || 'docs step returned no result', docs_check: docsCheck || { ok: false, problems: ['docs check returned no result'] },
}
