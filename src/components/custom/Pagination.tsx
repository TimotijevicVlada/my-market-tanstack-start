import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '../ui/button'
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  Pagination as ShadcnPagination,
} from '@/components/ui/pagination'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const generatePageNumbers = () => {
    const pages: Array<number | 'ellipsis'> = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      let startPage = Math.max(2, currentPage - halfVisible)
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible)

      // Adjust if we're near the start
      if (currentPage <= halfVisible + 1) {
        endPage = Math.min(maxVisiblePages, totalPages - 1)
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - halfVisible) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 1)
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis')
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    e.preventDefault()
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <ShadcnPagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            className={
              currentPage === 1 ? 'pointer-events-none opacity-50' : ''
            }
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) {
                onPageChange(currentPage - 1)
              }
            }}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => handlePageClick(page, e)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            className={
              currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
            }
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1)
              }
            }}
          >
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  )
}
