import { Star } from 'lucide-react'
import { categoriesColumns } from '../../-data'
import { StatusColumn } from '../StatusColumn'
import { EditCategory } from '../EditCategory'
import { DeleteCategory } from '../DeleteCategory'
import { Badge } from '@/components/ui/badge'
import { useGetSubCategories } from '@/api/categories/queries'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDate } from '@/utils/format-date'
import { truncateText } from '@/utils/truncate-text'

interface SubCategoriesProps {
  categoryId: string
}

export const SubCategories = ({ categoryId }: SubCategoriesProps) => {
  const { data: subcategories, refetch } = useGetSubCategories(categoryId)

  if (subcategories?.length === 0) {
    return (
      <TableRow className="bg-muted border-l-4 border-l-primary/30">
        <TableCell
          colSpan={categoriesColumns.length}
          className="font-medium text-md bg-transparent"
        >
          Nema podkategorija
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {subcategories?.map((subcategory, index) => (
        <TableRow
          key={subcategory.id}
          className="bg-muted !border-l-4 !border-l-primary/30"
        >
          {categoriesColumns.map(({ key }) => {
            if (key === 'order') {
              return (
                <TableCell key={key} className="bg-transparent pl-8">
                  {index + 1}
                </TableCell>
              )
            }
            if (key === 'isActive') {
              return (
                <TableCell key={key} className="bg-transparent pl-13">
                  <StatusColumn
                    category={{
                      ...subcategory,
                      parentName: '',
                    }}
                    refetchCategories={refetch}
                  />
                </TableCell>
              )
            }
            if (key === 'name') {
              return (
                <TableCell key={key} className="bg-transparent pl-8">
                  <div className="flex items-center gap-1">
                    {subcategory[key]}
                    {subcategory.featured && (
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    )}
                  </div>
                </TableCell>
              )
            }
            if (key === 'slug') {
              return (
                <TableCell key={key} className="bg-transparent">
                  <Badge variant="secondary" className="rounded-sm">
                    {subcategory[key]}
                  </Badge>
                </TableCell>
              )
            }
            if (key === 'parentName') {
              return (
                <TableCell key={key} className="bg-transparent">
                  /
                </TableCell>
              )
            }
            if (key === 'createdAt' || key === 'updatedAt') {
              return (
                <TableCell key={key} className="bg-transparent">
                  {formatDate(subcategory[key])}
                </TableCell>
              )
            }
            if (key === 'description') {
              return (
                <TableCell key={key} className="bg-transparent">
                  {truncateText(subcategory[key])}
                </TableCell>
              )
            }
            if (key === 'actions') {
              return (
                <TableCell
                  key={key}
                  className="bg-transparent sticky right-0 text-right"
                >
                  <div className="flex justify-end gap-1">
                    <EditCategory
                      category={{
                        ...subcategory,
                        parentName: '',
                      }}
                      onSuccess={refetch}
                    />
                    <DeleteCategory
                      category={{
                        ...subcategory,
                        parentName: '',
                      }}
                      onSuccess={refetch}
                    />
                  </div>
                </TableCell>
              )
            }

            return (
              <TableCell key={key} className="bg-transparent">
                {subcategory[key] ?? '/'}
              </TableCell>
            )
          })}
        </TableRow>
      ))}
    </>
  )
}
