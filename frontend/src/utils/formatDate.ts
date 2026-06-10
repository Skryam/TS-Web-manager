export const formatDate = (dbDate: number | string): string => {
  if (!dbDate) return '';
  console.log(dbDate)
  const date = new Date(dbDate);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}