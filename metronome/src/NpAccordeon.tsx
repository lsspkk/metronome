import { useState } from "react"
import { CaretDownIcon } from "./Icons"


export const NpAccordeon = (
  { title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean} 
) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col gap-2 w-full bg-gray-100 p-4 rounded border">
      <div className="flex justify-between" onClick={() => setOpen(!open)}>
        <h3 className="text-left flex-grow">{title}</h3>
        <div>{open ? "X" : <CaretDownIcon />}</div>
      </div>

      {open && (
        <div className="flex flex-col gap-2 w-full items-stretch">
          {children}
        </div>
      )}
    </div>
  )
}
