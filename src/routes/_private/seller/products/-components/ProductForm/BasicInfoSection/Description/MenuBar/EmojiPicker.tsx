import { useMemo, useState } from 'react'
import { Search, Smile } from 'lucide-react'
import { emojis } from '@tiptap/extension-emoji'
import type { Editor } from '@tiptap/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Toggle } from '@/components/ui/toggle'
import { Input } from '@/components/ui/input'

interface EmojiPickerProps {
  editor: Editor
}

// Check if emoji is a letter/alphabet emoji that should be excluded
const isLetterEmoji = (emoji: (typeof emojis)[number]) => {
  const name = emoji.name.toLowerCase()

  // Exclude regional indicator symbols (used for flags, but appear as letters)
  if (name.startsWith('regional_indicator')) return true

  // Exclude emojis with "letter" in their tags
  if (emoji.tags.some((tag) => tag.toLowerCase().includes('letter')))
    return true

  // Exclude specific letter-related emoji names
  const letterPatterns = [
    /^[a-z]$/, // single letter names
    /^capital_/, // capital letter emojis
    /^small_/, // small letter emojis
    /_letter_/, // contains letter in name
    /^keycap_/, // keycap numbers/letters
    /^input_latin/, // input latin symbols
    /^squared_/, // squared letters like 🅰️
    /^negative_squared/, // negative squared letters
  ]

  return letterPatterns.some((pattern) => pattern.test(name))
}

export const EmojiPicker = ({ editor }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Group emojis by their group property (excluding letter emojis)
  const groupedEmojis = useMemo(() => {
    const groups: Record<string, typeof emojis> = {}

    emojis
      .filter((emoji) => !isLetterEmoji(emoji))
      .forEach((emoji) => {
        const groupName = emoji.group ?? 'Other'
        groups[groupName] = groups[groupName] ?? []
        groups[groupName].push(emoji)
      })

    return groups
  }, [])

  // Filter emojis based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedEmojis
    }

    const query = searchQuery.toLowerCase()
    const filtered: Record<string, typeof emojis> = {}

    Object.entries(groupedEmojis).forEach(([groupName, groupEmojis]) => {
      const matchingEmojis = groupEmojis.filter(
        (emoji) =>
          emoji.name.toLowerCase().includes(query) ||
          emoji.shortcodes.some((sc) => sc.toLowerCase().includes(query)) ||
          emoji.tags.some((tag) => tag.toLowerCase().includes(query)),
      )

      if (matchingEmojis.length > 0) {
        filtered[groupName] = matchingEmojis
      }
    })

    return filtered
  }, [groupedEmojis, searchQuery])

  const handleEmojiClick = (emojiName: string) => {
    editor.chain().focus().setEmoji(emojiName).run()
    setSearchQuery('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Toggle pressed={editor.isActive('emoji')}>
          <Smile className="size-4" />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-2"
        align="start"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement
          if (target.closest('.rich-text-editor-description .tiptap')) {
            e.preventDefault()
          }
        }}
      >
        <div className="space-y-2">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Pretraži emotikone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8"
            />
          </div>

          {/* Emoji grid */}
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(filteredGroups).length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-4">
                Nema emotikona
              </p>
            ) : (
              Object.entries(filteredGroups).map(([groupName, groupEmojis]) => (
                <div key={groupName} className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1 px-1">
                    {groupName}
                  </p>
                  <div className="grid grid-cols-8 gap-0.5">
                    {groupEmojis.map((emoji) => (
                      <button
                        key={emoji.name}
                        type="button"
                        onClick={() => handleEmojiClick(emoji.name)}
                        className="size-8 flex items-center justify-center rounded hover:bg-accent transition-colors text-lg"
                        title={`:${emoji.shortcodes[0]}:`}
                      >
                        {emoji.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
