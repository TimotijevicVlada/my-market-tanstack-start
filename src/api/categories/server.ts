import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'

export const getCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db.query.categories.findMany({
    orderBy: (category, { desc }) => [desc(category.createdAt)],
  })
})
