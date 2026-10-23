export const statusLabels = {
  pending: "Pending",
  in_review: "In review",
  interviewed: "Interviewed",
  approved: "Approved",
  activated: "Activated",
};

export const qualifyingVoteCount = (approvals = []) =>
  approvals.filter((approval) => approval.countsTowardApproval).length;
