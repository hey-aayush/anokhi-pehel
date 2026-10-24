export const attendanceKeys = {
  all: ["attendanceTable"],
  month: (classId, month) => ["attendanceTable", classId, month],
};

export const invalidateAttendanceForSuccessfulWrite = (client, config) => {
  const method = config?.method?.toLowerCase();
  if (!["post", "put", "patch", "delete"].includes(method)) return;
  const path = new URL(config.url, "http://localhost").pathname;
  const affectsAttendance =
    (method === "post" && ["/submitAttendance", "/addStudent"].some((route) => path.endsWith(route))) ||
    (method === "put" && path.endsWith("/updateStudent")) ||
    (["put", "delete"].includes(method) && /\/(promoteStudent|updateStudentStatus|deleteStudents)\/[^/]+$/.test(path));

  if (affectsAttendance) {
    void client.cancelQueries({ queryKey: attendanceKeys.all });
    void client.invalidateQueries({ queryKey: attendanceKeys.all });
  }
};
