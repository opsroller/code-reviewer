*How-to guide, for reviewers checking the documentation in a PR.*

# How to check the docs in a pull request

This guide shows you how to run only the documentation pass on a PR:
docs present, true, and following Diataxis.

1. **Ask for the docs pass.**
   ```
   Use the code-reviewer agent to run the docs-review skill on PR #123.
   ```
2. **Check what the change owes.** The agent lists each user-visible
   change, its Diataxis kind (from the compass) and whether the PR
   contains that page. A missing page for a code, asset or behaviour
   change is 🔴 Blocking.
3. **Check the docs match the tree.** The agent reads the CI results
   for the commands the changed docs give. A failing command is 🔴; one
   no CI job runs is a finding asking for it in CI.
4. **Read the per-page checklist results.** For each touched page: one
   kind only, title pattern ("How to …", "About …"), reference structure,
   tutorial is run by CI, landing pages introduce and group.
5. **If the project has its own docs guide**, name it ("use
   docs/explanation/about-our-docs.md"); its checklist wins over the
   plugin's.
6. **Post the findings** in the round's single review (with the other
   passes), not as a separate review.

See the [docs-review skill reference](../reference/skill-docs-review.md).
