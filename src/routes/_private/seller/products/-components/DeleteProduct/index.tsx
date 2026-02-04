import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/api/products/types'
import { Button } from '@/components/custom/Button'
import { AlertDialog } from '@/components/custom/AlertDialog'
import { Tooltip } from '@/components/custom/Tooltip'
import { useDeleteProduct } from '@/api/products/queries'

interface DeleteProductProps {
  product: Product
}

export const DeleteProduct = ({ product }: DeleteProductProps) => {
  const { mutate: deleteProduct, isPending } = useDeleteProduct()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip title="Brisanje proizvoda">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsOpen(true)}
          loading={{ state: isPending, text: 'Brisanje...' }}
        >
          <Trash2Icon className="text-red-500" />
        </Button>
      </Tooltip>
      <AlertDialog
        open={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title="Potvrdite brisanje proizvoda"
        description={`Da li ste sigurni da želite da obrišete proizvod ${product.name.toUpperCase()}?`}
        onConfirm={() => deleteProduct({ data: { productId: product.id } })}
        onCancel={() => setIsOpen(false)}
        confirmText="Obrisi"
        loading={{
          state: isPending,
          text: 'Brisanje...',
        }}
      />
    </>
  )
}
