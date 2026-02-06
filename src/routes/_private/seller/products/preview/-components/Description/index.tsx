import { CheckCircle2 } from 'lucide-react'
import type { mockProduct } from '../../$productId'
import { Card, CardContent } from '@/components/ui/card'

interface DescriptionProps {
  product: typeof mockProduct
}

export const Description = ({ product }: DescriptionProps) => {
  return (
    <div className="mt-12">
      <Card className="border-border/50">
        <CardContent className="p-6 lg:p-8">
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            Opis proizvoda
          </h2>
          <RenderDescription content={product.description} />
        </CardContent>
      </Card>
    </div>
  )
}

function RenderDescription({ content }: { content: any }) {
  if (!content || !content.content) return null

  return (
    <div className="prose prose-invert max-w-none">
      {content.content.map((node: any, index: number) => {
        if (node.type === 'paragraph') {
          return (
            <p
              key={index}
              className="mb-4 text-muted-foreground leading-relaxed"
            >
              {node.content?.map((child: any) => child.text).join('')}
            </p>
          )
        }
        if (node.type === 'heading') {
          const level = node.attrs?.level || 3
          const text = node.content?.map((child: any) => child.text).join('')
          if (level === 3) {
            return (
              <h3
                key={index}
                className="mb-3 mt-6 text-lg font-semibold text-foreground"
              >
                {text}
              </h3>
            )
          }
          return (
            <h4 key={index} className="mb-2 mt-4 font-semibold text-foreground">
              {text}
            </h4>
          )
        }
        if (node.type === 'bulletList') {
          return (
            <ul key={index} className="mb-4 space-y-2">
              {node.content?.map((item: any, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <CheckCircle2 className="mt-1 size-4 flex-shrink-0 text-primary" />
                  <span>
                    {item.content?.[0]?.content
                      ?.map((child: any) => child.text)
                      .join('')}
                  </span>
                </li>
              ))}
            </ul>
          )
        }
        return null
      })}
    </div>
  )
}
