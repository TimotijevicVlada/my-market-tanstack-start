import { Tiptap, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { useController, useFormContext } from 'react-hook-form'
import { Placeholder } from '@tiptap/extensions'
import { Link } from '@tiptap/extension-link'
import Emoji from '@tiptap/extension-emoji'
import { FileText } from 'lucide-react'
import { MenuBar } from './MenuBar'
import type { ProductFormSchema } from '../../zod-schema'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/custom/Button'

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
        undoRedo: {
          depth: 20,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Emoji,
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

  const descriptionTemplate = `<h3>Ključne karakteristike</h3>
<p>U ovoj sekciji možete opisati ključne karakteristike proizvoda.</p><br />
<h3>Materijal / sastav</h3>
<p>U ovoj sekciji možete opisati materijal / sastav proizvoda.</p><br />
<h3>Dimenzije / veličina</h3>
<p>U ovoj sekciji možete opisati dimenzije / veličinu proizvoda.</p><br />
<h3>Održavanje</h3>
<p>U ovoj sekciji možete opisati održavanje proizvoda.</p><br />
<h3>Isporuka i povrat</h3>
<p>U ovoj sekciji možete opisati isporuku i povrat proizvoda.</p>
`

  const handleAddTemplate = () => {
    editor.chain().focus().setContent(descriptionTemplate).run()
  }

  return (
    <div className="rich-text-editor-description">
      <div className="flex items-end justify-between mb-2">
        <Label className="mb-2">Opis proizvoda</Label>
        <Button variant="outline" type="button" onClick={handleAddTemplate}>
          <FileText className="size-4" /> Dodaj šablon
        </Button>
      </div>
      <Tiptap instance={editor}>
        <MenuBar editor={editor} />
        <Tiptap.Content />
      </Tiptap>
    </div>
  )
}
