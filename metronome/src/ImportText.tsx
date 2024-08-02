import { useEffect, useRef, useState } from 'react'
import { NpButton } from './components/NpButton'
import { NpNavigation } from './components/NpNavigation'
import { LineParserAction, LineParseRule, Song, TimeSignature } from './types'
import { NpLayout } from './components/NpLayout'

export const createShortId = (songs: Song[]) => {
  let counter = 0
  while (counter < 1000) {
    const id = Math.random().toString(36).substring(2, 5)
    if (!songs.find((s) => s.id === id)) {
      return id
    }
    counter++
  }
  return Math.random().toString(36).substring(2, 7)
}

export function ImportText() {
  const [textInput, setTextInput] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [lineParseRules, setLineParseRules] = useState<LineParseRule[]>([])
  const [viewSongId, setViewSongId] = useState<string>()
  const loaded = useRef(false)
  const [error, setError] = useState<string>()

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

  const addRule = (action: LineParserAction, relativeLineNumber: number = lineParseRules.length + 1) => {
    setLineParseRules([...lineParseRules, { action, relativeLineNumber }])
  }

  const deleteRule = (index: number) => {
    setLineParseRules(lineParseRules.filter((_, i) => i !== index))
  }

  const parseTimeSignature = (line: string): TimeSignature => {
    const ts = parseInt(line)
    if ([2, 3, 4].includes(ts)) {
      return ts as TimeSignature
    }
    if (line === '2/4') {
      return 2
    }
    if (line === '3/4') {
      return 3
    }
    return 4
  }

  const loadSongs = () => {
    try {
      let lineIndex = 0
      let name = ''
      let tempo = 0
      const newSongs: Song[] = []
      const lineGroupSize = lineParseRules.length
      for (const line of textInput.split('\n')) {
        const ruleIndex = lineIndex % lineGroupSize
        const rule = lineParseRules[ruleIndex]
        let timeSignature: TimeSignature = 4
        if (!rule) {
          setError(`No rule for line ${lineIndex}`)
          return
        }
        if (rule.action === 'NAME') {
          name = line
        } else if (rule.action === 'TEMPO') {
          tempo = parseInt(line)
        } else if (rule.action === 'TIMESIGNATURE') {
          timeSignature = parseTimeSignature(line)
        } else if (rule.action === 'SKIP') {
          // Skip
        }
        lineIndex++
        if (lineIndex % lineGroupSize === 0) {
          newSongs.push({ id: createShortId(newSongs), name, tempo, timeSignature })
        }
      }
      setSongs(newSongs)
    } catch (e) {
      const error = e as Error
      setError(error.message)
    }
  }

  return (
    <NpLayout>
      <NpNavigation title='Import Songs from Text' />

      <div className='flex flex-col gap-4 sm:mw-10/12 md:w-8/12 lg:w-6/12'>
        {error && (
          <div className='bg-red-300 w-full p-8 flex justify-between'>
            <div>{error}</div>
            <NpButton onClick={() => setError('')}>X</NpButton>
          </div>
        )}

        <p>Copy paste text, add line rules and import</p>
        <div className='flex flex-col gap-8 items-start'>
          <textarea
            className='w-full border-2 border-gray-300 p-2'
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            cols={60}
            rows={10}
          />
          <NpButton onClick={loadSongs}>Import</NpButton>
        </div>
        <h3 className='mt-6'>Line Rules</h3>
        <div className='flex flex-row gap-4'>
          <NpButton onClick={() => addRule('NAME')}>Name</NpButton>
          <NpButton onClick={() => addRule('TEMPO')}>Tempo</NpButton>
          <NpButton onClick={() => addRule('TIMESIGNATURE')}>TimeSignature</NpButton>
          <NpButton onClick={() => addRule('SKIP')}>Skip</NpButton>
        </div>
        <div className='flex flex-col gap-2 text-xs'>
          {lineParseRules.map((rule, i) => (
            <div key={i} className='flex flex-row gap-4'>
              <div className='text-xs text-gray-500'>Line {i + 1}</div>
              <p className='flex-grow'>{rule.action}</p>
              <NpButton onClick={() => deleteRule(i)}>Delete</NpButton>
            </div>
          ))}
        </div>
      </div>
    </NpLayout>
  )
}
