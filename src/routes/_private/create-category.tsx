import React from 'react'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Button } from '@/components/custom/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getCategories } from '@/api/categories/server'
import { useCreateCategory } from '@/api/categories/queries'

export const Route = createFileRoute('/_private/create-category')({
  component: RouteComponent,
  loader: async () => await getCategories(),
})

function RouteComponent() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const categories = useLoaderData({ from: '/_private/create-category' })

  const { mutate: createCategory, isPending } = useCreateCategory()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const parentId = formData.get('parentId') as string

    createCategory({
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
      },
    })
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <section className="pt-5 h-full w-5xl">
        <form className="flex flex-col gap-4 w-md" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold">Kreiraj kategoriju</h1>
          <input type="hidden" name="parentId" value={value} />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                type="button"
              >
                {value
                  ? categories.find(
                      (category: { id: string; name: string }) =>
                        category.id === value,
                    )?.name
                  : 'Select category...'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput
                  placeholder="Search category..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map(
                      (category: { id: string; name: string }) => (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={(currentValue) => {
                            const selectedCategory = categories.find(
                              (cat: { id: string; name: string }) =>
                                cat.name === currentValue,
                            )
                            setValue(
                              selectedCategory?.id === value
                                ? ''
                                : selectedCategory?.id || '',
                            )
                            setOpen(false)
                          }}
                        >
                          {category.name}
                          <Check
                            className={cn(
                              'ml-auto',
                              value === category.id
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ),
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Naziv kategorije"
              required
            />
          </div>
          <div>
            <Input
              type="text"
              name="slug"
              placeholder="Slug kategorije"
              required
            />
          </div>
          <div>
            <Textarea
              name="description"
              placeholder="Opis kategorije"
              className="h-40 resize-none"
              required
            />
          </div>
          <Button
            type="submit"
            loading={{
              state: isPending,
              text: 'Kreiranje kategorije...',
            }}
          >
            Kreiraj kategoriju
          </Button>
        </form>
      </section>
    </div>
  )
}
