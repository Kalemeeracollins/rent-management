export function pagination(query: { page?: string; limit?: string }) {
  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20) || 20));
  return { page, limit, offset: (page - 1) * limit };
}
export function pageMeta(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}
