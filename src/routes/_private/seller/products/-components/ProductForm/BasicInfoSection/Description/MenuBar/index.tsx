import { Fragment } from 'react'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Undo2,
} from 'lucide-react'
import { EmojiPicker } from './EmojiPicker'
import type { Editor } from '@tiptap/react'
import { Button } from '@/components/custom/Button'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'

interface MenuBarProps {
  editor: Editor | undefined
}

export const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) return null

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      preesed: editor.isActive('heading', { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      preesed: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      preesed: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      preesed: editor.isActive('bold'),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      preesed: editor.isActive('italic'),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      preesed: editor.isActive('strike'),
      hasSeparator: true,
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      preesed: editor.isActive({ textAlign: 'left' }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      preesed: editor.isActive({ textAlign: 'center' }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      preesed: editor.isActive({ textAlign: 'right' }),
    },
    {
      icon: <AlignJustify className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign('justify').run(),
      preesed: editor.isActive({ textAlign: 'justify' }),
      hasSeparator: true,
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      preesed: editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      preesed: editor.isActive('orderedList'),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      preesed: editor.isActive('highlight'),
    },
    {
      icon: <Link2 className="size-4" />,
      onClick: () => {
        if (editor.isActive('link')) {
          editor.chain().focus().unsetLink().run()
        } else {
          const { from, to } = editor.state.selection
          const selectedText = editor.state.doc.textBetween(from, to)
          editor.chain().focus().setLink({ href: selectedText }).run()
        }
      },
      preesed: editor.isActive('link'),
      hasSeparator: true,
    },
  ]

  return (
    <div className="border rounded-md p-1 mb-1 flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => editor.commands.undo()}
      >
        <Undo2 className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => editor.commands.redo()}
      >
        <Redo2 className="size-4" />
      </Button>
      <div className="py-1.5">
        <Separator orientation="vertical" />
      </div>
      {Options.map((option, index) => (
        <Fragment key={index}>
          <Toggle pressed={option.preesed} onPressedChange={option.onClick}>
            {option.icon}
          </Toggle>
          {option.hasSeparator && (
            <div className="py-1.5">
              <Separator orientation="vertical" />
            </div>
          )}
        </Fragment>
      ))}
      <EmojiPicker editor={editor} />
    </div>
  )
}
