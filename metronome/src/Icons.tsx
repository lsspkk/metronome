export const PlayIcon = ({ size = 80 }: { size?: number} ) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
    <path d="M11.445 8.221 3.82 3.112A.5.5 0 0 0 3 3.5v9.775a.5.5 0 0 0 .82.39l7.624-5.109a.5.5 0 0 0 0-.782z" />
  </svg>
)

export const PauseIcon = ({ size = 80 }: { size?: number} ) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-pause" viewBox="0 0 16 16">
    <path d="M5 5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1zm5 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1z" />
  </svg>
)
export const StopIcon = ({ size = 80 }: { size?: number} ) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-stop" viewBox="0 0 16 16">
    <path d="M4.5 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-6z" />
  </svg>
)







export const CaretDownIcon = ({ size = 40 }: { size?: number} ) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-triangle-fill p-2 opacity-50" viewBox="0 0 16 16">
    <path d="M8 16l8-16H0l8 16z" className="shadow-sm"/>
    {/* add outline to previous path with shadow effect */}
    <path d="M8 16l8-16H0l8 16z" fill="none" className="opacity-20" stroke="currentColor" strokeWidth="1"/>

  </svg>
)

export const CaretUpIcon = ({ size = 40 }: { size?: number} ) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" className="bi bi-triangle-fill p-2 opacity-50" viewBox="0 0 16 16">
    <path d="M8 0l8 16H0L8 0z" className="shadow-sm"/>
    {/* add outline to previous path with shadow effect */}
    <path d="M8 0l8 16H0L8 0z" fill="none" className="opacity-20" stroke="currentColor" strokeWidth="1"/>
  </svg>
)