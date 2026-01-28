import { Tiptap, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { useController, useFormContext } from 'react-hook-form'
import { Placeholder } from '@tiptap/extensions'
import { MenuBar } from './MenuBar'
import type { ProductFormSchema } from '../../zod-schema'
import { Label } from '@/components/ui/label'

export const RichTextEditorDescription = () => {
  const { control } = useFormContext<ProductFormSchema>()

  const { field } = useController({
    name: 'description',
    control,
  })

  const editor = useEditor({
    extensions: [
      Placeholder.configure({
        placeholder: 'Opišite vaš proizvod detaljno...',
      }),
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
    ],
    content: field.value,
    editorProps: {
      attributes: {
        class:
          'min-h-40 bg-input/50 dark:bg-input/30 p-3 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none rounded-md border border-border shadow-xs transition-colors md:text-sm',
      },
    },
    onUpdate: ({ editor: editorValue }) => {
      field.onChange(editorValue.getHTML())
    },
  })

  return (
    <div className="rich-text-editor-description">
      <Label className="mb-2">Opis proizvoda</Label>
      <Tiptap instance={editor}>
        <MenuBar editor={editor} />
        <Tiptap.Content />
      </Tiptap>
      <p className="text-xs text-muted-foreground mt-2">
        Podržava formatiranje teksta (bold, italic, liste...)
      </p>
    </div>
  )
}
