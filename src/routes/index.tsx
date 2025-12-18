import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { getCategories } from '@/api/categories/server'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => await getCategories(),
})

export function App() {
  const categories = useLoaderData({ from: '/' })

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <section className="flex  gap-4 pt-10 h-full w-5xl">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col items-center gap-2 ">
            <div className="bg-secondary rounded-full h-20 w-20" />
            <h2 className="text-sm font-bold">{category.name}</h2>
          </div>
        ))}
      </section>
    </div>
  )
}
