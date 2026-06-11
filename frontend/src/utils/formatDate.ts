export const formatDate = (dbDate: any): string => {
  if (!dbDate) return '';

  const tymestamp = Number (dbDate);
  const date = new Date(tymestamp);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
