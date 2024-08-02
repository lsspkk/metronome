import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NpButton } from './components/NpButton'
import { NpLayout } from './components/NpLayout'
import { NpNavigation } from './components/NpNavigation'
import { calculateColor } from './components/theme'
import { PlayIcon } from './Icons'
import { MetronomePlayer } from './MetronomePlayer'
import { Song, TimeSignature, timeSigToString } from './types'
import { useAudioStore } from './store/audioStore'
import { loadState, saveStateChanges } from './store/localStore'

function Songs() {
  const [songs, setSongs] = useState<Song[]>([])
  const loaded = useRef(false)
  const [error, setError] = useState<string>()
  const navigate = useNavigate()
  const initAudio = useAudioStore((state) => state.initAudio)

  useEffect(() => {
    if (!loaded.current) {
      try {
        const state = loadState()
        setSongs(state.songs || [])
        loaded.current = true
      } catch (e) {
        const error = e as Error
        setError(error.message)
      }
    }
  }, [])

  const toMetronmeRoute = (id: string) => {
    initAudio()
    navigate(`/metronome/song/${id}`)
  }

  const onChangeTimeSignature = (songId: string, timeSignature: TimeSignature) => {
    const newSongs = songs.map((song) => (song.id === songId ? { ...song, timeSignature } : song))
    setSongs(newSongs)
    saveStateChanges({ songs: newSongs })
  }

  return (
    <NpLayout>
      <NpNavigation title='Songs' />

      <div className='flex flex-col gap-4 sm:mw-10/12 md:w-8/12 lg:w-6/12'>
        {error && (
          <div className='bg-red-300 w-full p-8 flex justify-between'>
            <div>{error}</div>
            <NpButton onClick={() => setError('')}>X</NpButton>
          </div>
        )}

        {songs.length === 0 && (
          <div className='flex flex-col sm:w-10/12 md:w-9/12 lg:w-6/12 self-center gap-2 md:gap-4'>
            <div className='text-xs'>
              This metronome saves a list of songs or dances to browser's local storage. You can import a list of songs
              from text or transfer url.
            </div>
            <div className='text-gray-400'>Enjoy the simple metronome.</div>

            <MetronomePlayer defaultTempo={120} defaultPlaying={false} />
          </div>
        )}
        {songs.map((song, index) => (
          <div className='flex w-full text-xs justify-start gap-2 items-center cursor-pointer' key={song.id}>
            <button onClick={() => toMetronmeRoute(song.id)} className='flex-grow sm:text-lg text-left'>
              {song.name}
            </button>

            <div className='text-xs flex flex-row gap-2 items-center'>
              <TsRadioButton song={song} timeSignature={2} onChange={onChangeTimeSignature} />
              <TsRadioButton song={song} timeSignature={3} onChange={onChangeTimeSignature} />
              <TsRadioButton song={song} timeSignature={4} onChange={onChangeTimeSignature} />
            </div>

            <div className='text-xs   flex flex-col gap-0 items-center'>
              <div className='text-gray-400'>Tempo</div>

              <div className='text-sm sm:text-lg'>{song.tempo}</div>
            </div>
            <NpButton
              className='rounded-xl shadow opacity-70 pr-0'
              style={{ backgroundColor: calculateColor(index) }}
              onClick={() => toMetronmeRoute(song.id)}
            >
              <PlayIcon className='w-8 h-8 sm:w-12 sm:h-12' />
            </NpButton>
          </div>
        ))}
      </div>
    </NpLayout>
  )
}

const TsRadioButton = ({
  song,
  timeSignature,
  onChange,
}: {
  song: Song
  timeSignature: TimeSignature
  onChange: (songId: string, timeSignature: TimeSignature) => void
}) => {
  const bg = song.timeSignature === timeSignature ? 'bg-blue-400' : 'bg-sky-200'
  const hoverBg = song.timeSignature === timeSignature ? 'hover:bg-blue-400' : 'hover:bg-sky-400'
  const color = song.timeSignature === timeSignature ? 'text-white' : 'text-black'
  return (
    <NpButton
      className={`border border-sky-500 text-[0.7rem] rounded-full p-0 py-2 max-w-8 ${color} ${bg} ${hoverBg}`}
      onClick={() => onChange(song.id, timeSignature)}
    >
      <div className='-ml-[0.1rem]'>{timeSigToString(timeSignature)}</div>
    </NpButton>
  )
}

export default Songs
