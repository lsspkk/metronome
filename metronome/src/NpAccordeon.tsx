import { useState } from 'react'
import { CaretDownIcon, CaretUpIcon } from './Icons'
import { NpButton } from './NpButton'

export const NpAccordeon = ({
  title,
  children,
  defaultOpen,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className='flex flex-col gap-1 w-full bg-gray-100 p-4 rounded border'>
      <div className='flex justify-between' onClick={() => setOpen(!open)}>
        <h3 className='font-bold text-left flex-grow'>{title}</h3>
        <NpButton className='opacity-50 py-0 px-2' onClick={() => {}}>
          {open ? <CaretUpIcon className='w-2 h-5 py-1' /> : <CaretDownIcon className='w-2 h-5 py-[2px]' />}
        </NpButton>
      </div>

      {open && (
        <div className='flex flex-col gap-2 w-full items-stretch border-t-2 mt-2 sm:mt-3 pt-2 sm:pt-4'>{children}</div>
      )}
    </div>
  )
}
