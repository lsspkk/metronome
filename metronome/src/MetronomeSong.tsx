import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NpButton } from './components/NpButton'
import { MetronomePlayer } from './MetronomePlayer'
import { Song, TimeSignature } from './types'
import { loadState, saveStateChanges } from './store/localStore'

function MetronomeSong() {
  const id = useParams().id
  const [songs, setSongs] = useState<Song[]>([])
  const loaded = useRef(false)
  const [error, setError] = useState<string>()
  const navigate = useNavigate()

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

  const saveTimeSignature = (songId: string, timeSignature: TimeSignature) => {
    const newSongs = songs.map((song) => (song.id === songId ? { ...song, timeSignature } : song))
    setSongs(newSongs)
    console.debug('newSongs', newSongs, song.id, timeSignature)
    saveStateChanges({ songs: newSongs })
  }

  const index = songs.findIndex((s) => s.id === id)
  const song = songs[index]

  return (
    <div className='flex flex-col items-center min-h-screen max-h-screen justify-between bg-gray-300'>
      <div className='flex flex-col gap-4 sm:w-10/12 md:w-9/12 lg:w-6/12'>
        {error && (
          <div className='bg-red-300 w-full p-8 flex justify-between'>
            <div>{error}</div>
            <button onClick={() => setError('')}>X</button>
          </div>
        )}
        <div className='flex w-full justify-between mt-2'>
          <h1>Song Metronome</h1>
          <div className='flex gap-2'>
            <NpButton onClick={() => navigate(`/metronome/song/${songs[index - 1]?.id || ''}`)} disabled={index === 0}>
              &lt;
            </NpButton>
            <div className='text-sm'>
              {index + 1} / {songs.length}
            </div>
            <NpButton
              onClick={() => navigate(`/metronome/song/${songs[index + 1]?.id || ''}`)}
              disabled={index === songs.length - 1}
            >
              &gt;
            </NpButton>
            <NpButton className='ml-4' onClick={() => navigate('/')}>
              Back
            </NpButton>
          </div>
        </div>
        {!song && <p>Song not found</p>}
        {song && (
          <div className='flex flex-col w-full gap-4 justify-start'>
            <div className='flex w-full text-xs sm:text-lg opacity-60' key={song.id}>
              <div className='flex-grow'>{song.name}</div>
              <p>Song Tempo: {song.tempo}</p>
            </div>

            <MetronomePlayer
              defaultTempo={song.tempo}
              defaultTimeSignature={song.timeSignature}
              saveTimeSignature={(ts: TimeSignature) => saveTimeSignature(song.id, ts)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MetronomeSong
