export const getImageUrl = (url: string | undefined | null) => {
  if (!url) return undefined
  return `${import.meta.env.VITE_R2_PUBLIC_BASE_URL}${url}`
}
