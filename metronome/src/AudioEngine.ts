import { SOUNDS } from './MetronomePlayer'

export default class AudioEngine {
  private audioContext?: AudioContext
  private soundBuffers: { id: string; buffer: AudioBuffer }[] = []
  private soundIndex = 0

  private _volume: number = 1.0

  constructor(audioContext: AudioContext, volume: number = 1.0) {
    this.volume = volume
    this.audioContext = audioContext

    this.soundBuffers.push({ id: SOUNDS[0].id, buffer: this.audioContext.createBuffer(1, 1, 22050) })
    this.loadSound(SOUNDS[1].url, this.audioContext).then((buffer) =>
      this.soundBuffers.push({ id: SOUNDS[1].id, buffer })
    )
    this.loadSound(SOUNDS[2].url, this.audioContext).then((buffer) =>
      this.soundBuffers.push({ id: SOUNDS[2].id, buffer })
    )
  }

  private async loadSound(url: string, audioContext: AudioContext) {
    const response = await fetch(window.location.origin + url)
    const arrayBuffer = await response.arrayBuffer()
    return audioContext.decodeAudioData(arrayBuffer)
  }

  public playSound() {
    if (!this.audioContext) return

    if (this.soundIndex < 1 || this.soundIndex > 2) {
      return
    }

    const source = this.audioContext.createBufferSource()
    source.buffer = this.soundBuffers[this.soundIndex].buffer
    source.connect(this.audioContext.destination)
    source.start()
  }

  public setSound(soundId: string) {
    this.soundIndex = this.soundBuffers.findIndex((s) => s.id === soundId) || 0
  }

  set volume(value: number) {
    this._volume = value
  }

  get volume() {
    return this._volume
  }
}
