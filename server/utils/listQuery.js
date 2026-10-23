const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const listValues = (value) =>
  typeof value === "string"
    ? value.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

const positiveInteger = (value) =>
  typeof value === "string" && /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value))
    ? Number(value)
    : null;

const parsePagination = ({ page, limit }) => {
  if (page === undefined && limit === undefined) return null;
  const parsedPage = positiveInteger(page ?? "1");
  const parsedLimit = positiveInteger(limit ?? "40");
  if (!parsedPage || !parsedLimit || parsedLimit > 100) {
    throw new Error("page and limit must be positive integers; limit cannot exceed 100");
  }
  return { page: parsedPage, limit: parsedLimit };
};

const nameFilter = (value) => {
  const term = typeof value === "string" ? value.trim().slice(0, 100) : "";
  return term ? { $regex: escapeRegex(term), $options: "i" } : undefined;
};

module.exports = { listValues, parsePagination, nameFilter };
