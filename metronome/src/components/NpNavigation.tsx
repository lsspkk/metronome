import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NpButton } from './NpButton'
import { CaretUpIcon, CaretDownIcon } from '../Icons'

export type MenuItem = {
  name: string
  path: string
  icon?: React.ReactNode
  selected?: boolean
}

export const NpNavigation = ({
  title,
  children,
  defaultOpen,
  menuItems,
}: {
  title: string
  children?: React.ReactNode
  defaultOpen?: boolean
  menuItems: MenuItem[]
}) => {
  const [open, setOpen] = useState(defaultOpen)
  const navigate = useNavigate()

  return (
    <div>
      <div className='flex flex-col gap-1 w-full bg-gray-100 p-4 rounded border'>
        <h3 className='font-bold text-left flex-grow'>{title}</h3>
        <NpButton
          className='opacity-50 py-0 px-2'
          onClick={() => {
            setOpen(!open)
          }}
        >
          {open ? <CaretUpIcon className='w-2 h-5 py-1' /> : <CaretDownIcon className='w-2 h-5 py-[2px]' />}
        </NpButton>
      </div>

      {open && (
        <div className='flex flex-col gap-2 w-full items-stretch border-t-2 mt-2 sm:mt-3 pt-2 sm:pt-4'>
          {menuItems?.map(({ name, path, icon, selected }) => (
            <div className='flex items-center gap-2' key={name}>
              <NpButton onClick={() => navigate(path)} className='flex-grow'>
                {icon}
                {name}
              </NpButton>
              {selected && <div className='w-2 h-2 bg-green-500 rounded-full' />}
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}
