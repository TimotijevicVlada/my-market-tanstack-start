import { useState } from 'react'
import { ArrowRightIcon, SearchIcon } from 'lucide-react'
import { ButtonGroup } from '../ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Button } from './Button'

interface TableSearchProps {
  onSearchClick: (searchValue: string) => void
}

export const TableSearch = ({ onSearchClick }: TableSearchProps) => {
  const [searchInputValue, setSearchInputValue] = useState('')

  return (
    <ButtonGroup className="w-[15rem]">
      <InputGroup>
        <InputGroupInput
          type="text"
          placeholder="Pretraga..."
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearchClick(searchInputValue)
            }
          }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <Button
        variant="outline"
        aria-label="Search"
        onClick={() => onSearchClick(searchInputValue)}
      >
        <ArrowRightIcon />
      </Button>
    </ButtonGroup>
  )
}
