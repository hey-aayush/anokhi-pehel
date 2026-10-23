# Mentor application workflow migration

## Data changes

- Create a `mentorapplications` collection for applications and their status history. A submitted application is separate from a login account until activation.
- Add an optional `applicationId` field to `user` documents to link activated accounts to applications. Existing users remain valid without it. Reviewer eligibility comes from existing roles: Final Year Coordinator and Alumni votes count toward approval; Coordinator votes are supporting only.
- Keep the existing `/createUser`, `/getInactiveUsers`, and `/updateActiveStatus/:userId` contracts for existing accounts. New applications use the `/mentorApplications` workflow and cannot be activated through those old routes because they have no `user` document until the final step.

## Rollout

1. Deploy the server with the new collection and optional user fields before exposing the new review pages.
2. Confirm the existing `isAcceptingResponse` setting and SMTP configuration. The submission response always includes an application ID; mail delivery is reported separately.
3. Verify that reviewer roles are accurate. Three distinct active Final Year Coordinator or Alumni accounts must vote for approval. Coordinator votes are recorded but do not count toward the three.
4. Review any inactive accounts created by the previous public form manually. They are not automatically converted because the database cannot distinguish them reliably from deactivated mentors. Existing accounts remain under the legacy inactive mentor list.
5. Deploy the client routes and link the new applications list from Mentors.

## Rollback

The old account and authentication APIs remain unchanged. Hiding the new client links and disabling new submissions returns reviewers to the legacy mentor management flow. Retain the application records for audit; do not delete or convert them on rollback.
