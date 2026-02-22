import { ArrowUpDownIcon, CheckCheck, XIcon } from 'lucide-react'
import { Route } from '../..'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/custom/Button'
import { Tooltip } from '@/components/custom/Tooltip'
import { ButtonGroup } from '@/components/ui/button-group'

interface MainSortModeButtonProps {
  mainCategoriesSortMode: boolean
  setMainCategoriesSortMode: Dispatch<SetStateAction<boolean>>
  setMainCategoriesSaveRequested: Dispatch<SetStateAction<boolean>>
  totalRows: number
  DEFAULT_LIMIT: number
}

export const MainSortModeButton = ({
  mainCategoriesSortMode,
  setMainCategoriesSortMode,
  setMainCategoriesSaveRequested,
  totalRows,
  DEFAULT_LIMIT,
}: MainSortModeButtonProps) => {
  const navigate = Route.useNavigate()

  if (mainCategoriesSortMode) {
    return (
      <ButtonGroup>
        <Tooltip title="Sačuvaj redosled kategorija">
          <Button
            variant="default"
            onClick={() => setMainCategoriesSaveRequested(true)}
          >
            <CheckCheck />
            Sačuvaj redosled
          </Button>
        </Tooltip>
        <Tooltip title="Poništi redosled kategorija">
          <Button
            variant="outline"
            onClick={() => {
              setMainCategoriesSortMode(false)
              navigate({
                to: '/admin/categories',
                search: (prev) => ({
                  ...prev,
                  page: 1,
                  limit: DEFAULT_LIMIT,
                }),
              })
            }}
          >
            <XIcon />
            Poništi
          </Button>
        </Tooltip>
      </ButtonGroup>
    )
  }

  return (
    <Tooltip title="Sortiraj kategorije">
      <Button
        variant="outline"
        onClick={() => {
          setMainCategoriesSortMode(true)
          const onePageLimit = totalRows
          navigate({
            to: '/admin/categories',
            search: (prev) => ({
              ...prev,
              page: 1,
              limit: onePageLimit,
            }),
          })
        }}
      >
        <ArrowUpDownIcon /> Sortiraj kategorije
      </Button>
    </Tooltip>
  )
}
