import { useEffect } from 'react'
import { Tiptap, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import Emoji from '@tiptap/extension-emoji'
import { Route } from '../../$productId'
import { Card, CardContent } from '@/components/ui/card'

const readOnlyExtensions = [
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
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      class: 'text-primary underline cursor-pointer',
    },
  }),
  Emoji,
]

export const Description = () => {
  const product = Route.useLoaderData()

  const description = product.description

  const editor = useEditor({
    extensions: readOnlyExtensions,
    content: description,
    editable: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed [&_.tiptap]:p-0 [&_.tiptap]:min-h-0',
      },
    },
  })

  useEffect(() => {
    const current = editor.getJSON()
    if (JSON.stringify(description) !== JSON.stringify(current)) {
      editor.commands.setContent(description)
    }
  }, [editor, description])

  return (
    <div className="mt-6">
      <Card className="border-border/50">
        <CardContent>
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Opis proizvoda
          </h2>
          <Tiptap instance={editor}>
            <Tiptap.Content />
          </Tiptap>
        </CardContent>
      </Card>
    </div>
  )
}
