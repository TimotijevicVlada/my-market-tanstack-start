export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 50,
) => {
  if (!text) {
    return null
  }
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength) + '...'
}
