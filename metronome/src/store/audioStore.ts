import { create } from 'zustand'
import AudioEngine from '../AudioEngine'

export type AudioStore = {
  engine?: AudioEngine
  initAudio: () => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  audioContext: undefined,
  engine: undefined,
  initAudio: () => {
    set((state) => {
      if (state.engine) {
        return {}
      }
      return { engine: new AudioEngine(new window.AudioContext()) }
    })
  },
}))
