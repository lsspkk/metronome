import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NpButton } from './components/NpButton'
import { NpLayout } from './components/NpLayout'
import { NpNavigation } from './components/NpNavigation'
import { calculateColor } from './components/theme'
import { PlayIcon } from './Icons'
import { MetronomePlayer } from './MetronomePlayer'
import { Song } from './types'
import { LineParseRule } from './types'
import { useAudioStore } from './store/audioStore'

function Songs() {
  const [textInput, setTextInput] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [lineParseRules, setLineParseRules] = useState<LineParseRule[]>([])
  const [viewSongId, setViewSongId] = useState<string>()
  const loaded = useRef(false)
  const [error, setError] = useState<string>()
  const navigate = useNavigate()
  const initAudio = useAudioStore((state) => state.initAudio)

  useEffect(() => {
    if (!loaded.current) {
      try {
        const state = JSON.parse(localStorage.getItem('state') || '{}')
        setSongs(state.songs || [])
        setLineParseRules(state.lineParseRules || [])
        setTextInput(state.textInput || '')
        setViewSongId(state.viewSongId)
        loaded.current = true
      } catch (e) {
        const error = e as Error
        setError(error.message)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify({ songs, lineParseRules, viewSongId, textInput }))
  }, [songs, lineParseRules, viewSongId, textInput])

  const toMetronmeRoute = (id: string) => {
    setViewSongId(id)
    initAudio()
    navigate(`/metronome/song/${id}`)
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
          <div
            className='flex w-full text-xs justify-start gap-2 items-center cursor-pointer'
            key={song.id}
            onClick={() => toMetronmeRoute(song.id)}
          >
            <div className='flex-grow sm:text-lg'>{song.name}</div>
            <div className='text-xs sm:text-sm  flex flex-col gap-2 items-center'>
              <div className='text-gray-400'>Tempo</div>

              <div className='text-sm sm:text-lg'>{song.tempo}</div>
            </div>
            <NpButton className='rounded-xl shadow opacity-70 pr-0' style={{ backgroundColor: calculateColor(index) }}>
              <PlayIcon className='w-8 h-8 sm:w-12 sm:h-12' />
            </NpButton>
          </div>
        ))}
      </div>
    </NpLayout>
  )
}

export default Songs
