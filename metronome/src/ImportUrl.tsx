import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NpButton } from './components/NpButton'
import { NpNavigation } from './components/NpNavigation'
import { createShortId } from './ImportText'
import { Song, TimeSignature } from './types'
import { NpLayout } from './components/NpLayout'

function ImportUrl() {
  // read query param named songs that is a string
  const [songs, setSongs] = useState<Song[]>([])
  const [error, setError] = useState<string>()
  const [readOk, setReadOk] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const queryString = window.location.search
      const ssongs = new URLSearchParams(queryString).get('songs')
      if (!ssongs) {
        return
      }
      const lines = decodeURIComponent(ssongs).split('\n')
      const readSongs: Song[] = []

      for (const line of lines) {
        const parts = line.split('|')
        const rawTs = parts.length === 3 ? parseInt(parts[2]) : 4
        const timeSignature = ([2, 3, 4].includes(rawTs) ? rawTs : 4) as TimeSignature
        readSongs.push({
          id: createShortId(readSongs),
          name: parts[0],
          tempo: parseInt(parts[1]),
          timeSignature,
        })
      }

      setSongs(readSongs)
      setReadOk(true)
    } catch (e) {
      const error = e as Error
      console.error(e)
      setError(error.message)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const useAndGoHome = () => {
    try {
      const state = localStorage.getItem('state') || '{}'
      const newState = JSON.parse(state)
      newState['songs'] = songs
      localStorage.setItem('state', JSON.stringify(newState))
      navigate('/')
    } catch (e) {
      const error = e as Error
      setError(error.message)
    }
  }

  return (
    <NpLayout>
      <NpNavigation title='Import Url' />
      <div className='flex flex-col gap-4 max-w-full sm:max-w-sm lg:max-w-md px-2'>
        {error && (
          <div className='bg-red-300 w-full p-8 flex justify-between'>
            <div>{error}</div>
            <button onClick={() => setError('')}>X</button>
          </div>
        )}

        <h3 className='mt-8'>Read Songs from Transfer url</h3>

        <p className='text-sm'>
          If you have a transfer url, copy paste it to the browser location to see what songs and tempos it contains.
        </p>

        <h3 className='mt-6'>Current Transfer Url</h3>

        <p
          style={{ overflowWrap: 'break-word' }}
          className='w-full bg-slate-50 p-2 max-h-[30vh] overflow-y-scroll text-xs whitespace-break-spaces'
        >
          {window.location.search || 'No transfer url'}
        </p>

        <div className='flex flex-col gap-2'>
          {readOk && (
            <div className='bg-white shadow-sm rounded w-full p-8 flex justify-between flex-col gap-5 max-w-full'>
              <div className='flex items-center gap-4 align-self-center self-center'>
                <RoundThumbUpIcon />
                Read OK
              </div>
              <NpButton className='w-auto py-2 px-8 self-center' onClick={useAndGoHome}>
                Use Songs
              </NpButton>
            </div>
          )}

          <h3 className='mt-6'>Transferred Songs</h3>
          <div className='flex flex-col gap-1 items-start text-xs max-w-full mx-2'>
            {!songs || (songs.length === 0 && <p>No songs</p>)}
            {songs?.map((song) => (
              <div key={song.id} className='flex w-full text-xs justify-between gap-2'>
                <div className='flex-grow'>{song.name}</div>
                <div>{song.tempo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NpLayout>
  )
}

const RoundThumbUpIcon = ({ className }: { className?: string }) => (
  <svg
    version='1.1'
    id='Capa_1'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 50 50'
    className={className || 'w-20 h-20'}
  >
    <circle style={{ fill: '#25AE88' }} cx='25' cy='25' r='25' />
    <polyline
      style={{
        fill: 'none',
        stroke: 'white',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: 10,
      }}
      points='
	38,15 22,33 12,25 '
    />
  </svg>
)

export default ImportUrl
