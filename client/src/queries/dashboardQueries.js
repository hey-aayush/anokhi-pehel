export const dashboardKeys = {
  all: ["dashboardOverview"],
  date: (date) => ["dashboardOverview", date],
};

export const invalidateDashboardOverview = (client) => {
  // Cancel an older read before it can put pre-write data back in the cache.
  void client.cancelQueries({ queryKey: dashboardKeys.all });
  return client.invalidateQueries({ queryKey: dashboardKeys.all });
};

export const invalidateForSuccessfulWrite = (client, config) => {
  const method = config?.method?.toLowerCase();
  if (!["post", "put", "patch", "delete"].includes(method)) return;

  const path = new URL(config.url, "http://localhost").pathname;
  const affectsDashboard =
    (method === "post" && ["/submitAttendance", "/topicCovered", "/addStudent"].some((route) => path.endsWith(route))) ||
    (method === "put" && path.endsWith("/updateStudent")) ||
    (["put", "delete"].includes(method) && /\/(promoteStudent|updateStudentStatus|deleteStudents)\/[^/]+$/.test(path));

  if (affectsDashboard) void invalidateDashboardOverview(client);
};
