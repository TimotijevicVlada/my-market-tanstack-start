export const formatDate = (date: Date | undefined | null) => {
  if (!date) {
    return '/'
  }

  return new Date(date).toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
