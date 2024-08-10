export const getPaginationParams = (page = 1, limit = 10) => {
  const take = limit;
  const skip = (page - 1) * take;
  return { skip, take };
};

export const getPaginationMeta = (totalRecords, page, limit = 10) => {
  const totalPages = Math.ceil(totalRecords / limit);
  return {
    totalRecords,
    totalPages,
    currentPage: Number(page),
  };
};