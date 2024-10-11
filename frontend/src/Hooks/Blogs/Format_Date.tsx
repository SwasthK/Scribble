export const UseFormatDate = (date: string) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return { formattedDate };
};
