import { Song } from '../types'

export const loadState = () => {
  const state = localStorage.getItem('state') || '{}'
  const newState = JSON.parse(state)
  const fixedSongs = newState.songs?.map((song: Song) => ({
    ...song,
    timeSignature: song.timeSignature ?? 4,
  }))
  newState.songs = fixedSongs || []
  return newState
}

export const saveStateChanges = (changes: Partial<ReturnType<typeof loadState>>) => {
  const state = loadState()
  const newState = { ...state, ...changes }
  localStorage.setItem('state', JSON.stringify(newState))
}
