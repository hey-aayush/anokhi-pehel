export const listKeys = {
  students: ["students"],
  studentPage: (params) => ["students", params],
  participants: ["participants"],
  participantPage: (params) => ["participants", params],
  events: ["events"],
};

export const invalidateList = (client, queryKey) => {
  void client.cancelQueries({ queryKey });
  return client.invalidateQueries({ queryKey });
};

export const invalidateListsForSuccessfulWrite = (client, config) => {
  const method = config?.method?.toLowerCase();
  if (!["post", "put", "patch", "delete"].includes(method)) return;
  const path = new URL(config.url, "http://localhost").pathname;

  if (
    (method === "post" && path.endsWith("/addStudent")) ||
    (method === "put" && path.endsWith("/updateStudent")) ||
    (["put", "delete"].includes(method) && /\/(promoteStudent|updateStudentStatus|deleteStudents)\/[^/]+$/.test(path))
  ) {
    void invalidateList(client, listKeys.students);
  }

  if (
    (method === "post" && path.endsWith("/addParticipants")) ||
    (method === "delete" && /\/deleteParticipants\/[^/]+$/.test(path))
  ) {
    void invalidateList(client, listKeys.participants);
  }

  if (
    (method === "post" && ["/addEvent", "/editEvent"].some((route) => path.endsWith(route))) ||
    (method === "delete" && path.endsWith("/deleteEvent"))
  ) {
    void invalidateList(client, listKeys.events);
  }
};
