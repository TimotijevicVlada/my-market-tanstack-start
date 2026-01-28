import { useState } from 'react'
import { Plus, Tag, X } from 'lucide-react'
import { useController, useFormContext } from 'react-hook-form'
import type { ProductFormSchema } from '../zod-schema'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/Button'
import { Badge } from '@/components/ui/badge'

export const TagsSection = () => {
  const { control } = useFormContext<ProductFormSchema>()

  const { field: tagsField } = useController({
    name: 'tags',
    control,
  })

  const [newTag, setNewTag] = useState('')

  const addTag = () => {
    tagsField.onChange([...tagsField.value, newTag])
    setNewTag('')
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Tagovi</CardTitle>
            <CardDescription>
              Dodajte tagove za lakše pretraživanje
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addTag())
            }
            placeholder="Unesite tag i pritisnite Enter"
            className="bg-input/50 transition-colors focus:bg-input"
          />
          <Button variant="outline" onClick={addTag} disabled={!newTag}>
            <Plus className="size-4" />
          </Button>
        </div>

        {tagsField.value.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tagsField.value.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1.5 px-3 py-1.5"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    tagsField.onChange(tagsField.value.filter((t) => t !== tag))
                  }
                  className="ml-1 rounded-full p-0.5 transition-colors hover:bg-foreground/10"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Još nema tagova. Dodajte tagove poput "organsko", "novo",
            "akcija"...
          </p>
        )}
      </CardContent>
    </Card>
  )
}
