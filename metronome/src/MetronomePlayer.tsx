import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { NpButton } from './components/NpButton'
import { DrumIcon, DuckIcon, PlayIcon } from './Icons'
import { StopIcon } from './Icons'
import { Sound } from './types'
import { useAudioStore } from './store/audioStore'

export const SOUNDS: Sound[] = [
  { id: 'NO_SOUND', name: 'No Sound', url: '' },
  { id: 'DRUMSTICK', name: 'DrumStick', url: '/drumstick.ogg' },
  { id: 'QUACK', name: 'Quack', url: '/quack.ogg' },
]

export const MetronomePlayer = ({
  defaultTempo = 120,
  defaultPlaying = true,
}: {
  defaultTempo: number
  defaultPlaying?: boolean
}) => {
  const [tempo, setTempo] = useState<number>(defaultTempo)
  const [playing, setPlaying] = useState<boolean>(defaultPlaying)
  const [visualNumber, setVisualNumber] = useState<number>(0)
  const [timeSignature, setTimeSignature] = useState<2 | 3 | 4>(4)
  const [sound, setSound] = useState<Sound>(SOUNDS[0])
  const loaded = useRef(false)
  const { engine, initAudio } = useAudioStore()

  useEffect(() => {
    if (!loaded.current) {
      try {
        const timeSignature = localStorage.getItem('timeSignature')
        if (timeSignature) {
          setTimeSignature(parseInt(timeSignature) as 2 | 3 | 4)
        }
        const soundId = localStorage.getItem('soundId') || 'NO_SOUND'
        setSound(SOUNDS.find((s) => s.id === soundId) || SOUNDS[0])
      } catch (e) {
        console.error(e)
      }
    }
  }, [])
  useEffect(() => {
    setTempo(defaultTempo)
  }, [defaultTempo])

  useEffect(() => {
    try {
      localStorage.setItem('timeSignature', timeSignature.toString())
    } catch (e) {
      console.error(e)
    }
  }, [timeSignature])

  useEffect(() => {
    try {
      localStorage.setItem('soundId', sound.id)
    } catch (e) {
      console.error(e)
    }
  }, [sound.id])

  const onSetTempo = (newTempo: number) => {
    setTempo(newTempo)
  }

  const togglePlaying = () => {
    if (playing) {
      setPlaying(false)
    } else {
      initAudio()
      setVisualNumber(0)
      setPlaying(true)
    }
  }

  useEffect(() => {
    let timeoutId: number
    if (playing) {
      timeoutId = setTimeout(() => {
        engine?.playSound()
        setVisualNumber(visualNumber + 1)
      }, 60000 / tempo)
    }
    return () => clearTimeout(timeoutId)
  }, [playing, tempo, visualNumber])

  return (
    <div className='flex flex-col gap-4 flex-grow items-center'>
      <div className='flex w-full justify-start gap-2'>
        <NpButton className='text-lg py-0 w-8' onClick={() => onSetTempo(tempo + 1)}>
          +
        </NpButton>
        <NpButton className='text-lg py-0 w-8' onClick={() => onSetTempo(tempo - 1)}>
          -
        </NpButton>
        <input
          id='tempo-range'
          className='ml-2 flex-grow w-full'
          step={1}
          type='range'
          min={30}
          max={313}
          defaultValue={tempo}
          onInput={(e: ChangeEvent<HTMLInputElement>) => onSetTempo(parseInt(e.target.value))}
        />
        <div>{tempo}</div>
      </div>
      <button
        className={`flex flex-col items-center w-[50vh] h-[50vh] 
          max-w-[90vw] max-h-[90vw] justify-center text-xl border-8 rounded-3xl bg-indigo-200
          transform active:scale-95 transition-transform duration-300
          `}
        onClick={togglePlaying}
      >
        <div className='-mt-18 md:-mt-20 rounded-xl text-indigo-900 flex gap-0 sm:gap-2'>
          <PlayIcon
            className={`-mr-2 sm:-mt-2 lg:-mt-4 w-20 h-20  sm:w-40 sm:h-40 max-w-[14vh] 
              p-3 pt-2 md:p-3 md:pt-5 ${playing ? 'opacity-50' : ''}
            `}
          />
          <StopIcon
            className={`-ml-2 sm:-mt-1 lg:-mt-2 w-20 h-20 sm:w-40 sm:h-40 max-w-[14vh] ${playing ? '' : 'opacity-50'}
          `}
          />
        </div>
        <div className='flex flex-col mt-2 sm:mt-2'>
          <div
            className={`text-[8em] sm:text-[12em] font-bold py-12 sm:pt-[4vh] md:pt-[4vh] 
              ${visualNumber % timeSignature === 0 ? 'text-indigo-900' : 'text-indigo-400'}`}
          >
            {(visualNumber % timeSignature) + 1}
          </div>
        </div>
      </button>
      <div className='flex max-w-[90vw] w-[50vh] p-2 gap-2 justify-stretch h-20 items-stretch'>
        <TimeSignatureButton
          timeSignature={2}
          onClick={() => setTimeSignature(2)}
          isSelected={timeSignature === 2}
          className='bg-cyan-300'
        />
        <TimeSignatureButton
          timeSignature={3}
          onClick={() => setTimeSignature(3)}
          isSelected={timeSignature === 3}
          className='bg-cyan-400'
        />
        <TimeSignatureButton
          timeSignature={4}
          onClick={() => setTimeSignature(4)}
          isSelected={timeSignature === 4}
          className='bg-cyan-500'
        />
      </div>
      <div className='flex max-w-[90vw] w-[50vh] p-2 gap-2 justify-stretch h-20 items-stretch'>
        <SoundSelectButton
          sound={SOUNDS[0]}
          isSelected={SOUNDS[0].id === sound.id}
          onClick={() => {
            setSound(SOUNDS[0])
            engine?.setSound(SOUNDS[0].id)
          }}
          className='bg-indigo-300 w-1/3'
        />
        <SoundSelectButton
          sound={SOUNDS[1]}
          isSelected={SOUNDS[1].id === sound.id}
          onClick={() => {
            setSound(SOUNDS[1])
            engine?.setSound(SOUNDS[1].id)
          }}
          className='bg-indigo-400 w-1/3'
          icon={<DrumIcon className='w-7 h-7' />}
        />
        <SoundSelectButton
          sound={SOUNDS[2]}
          isSelected={SOUNDS[2].id === sound.id}
          onClick={() => {
            setSound(SOUNDS[2])
            engine?.setSound(SOUNDS[2].id)
          }}
          className='bg-indigo-500 w-1/3'
          icon={<DuckIcon className='w-6 h-6' />}
        />
      </div>
    </div>
  )
}

export const TimeSignatureButton = ({
  timeSignature,
  isSelected,
  className,
  ...props
}: {
  timeSignature: 2 | 3 | 4
  isSelected: boolean
  className: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`${className} flex-grow border-8 rounded-xl text-lg ${
      isSelected ? 'opacity-100 border-sky-800' : 'opacity-50 border-sky-300'
    } transform active:scale-75 transition-transform duration-300
`}
    {...props}
  >
    {timeSignature}/4
  </button>
)

export const SoundSelectButton = ({
  sound,
  isSelected,
  className,
  icon,
  ...props
}: {
  sound: Sound
  isSelected: boolean
  className: string
  icon?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`${className} flex-grow border-8 rounded-xl text-lg ${
      isSelected ? 'opacity-100 border-indigo-800' : 'opacity-50 border-indigo-300'
    } transform active:scale-75 transition-transform duration-300
    flex justify-center gap-2 items-center
`}
    {...props}
  >
    {icon}
    {sound.name}
  </button>
)
