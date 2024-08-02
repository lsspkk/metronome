export type TimeSignature = 2 | 3 | 4

export const timeSigToString = (ts: TimeSignature) => {
  switch (ts) {
    case 2:
      return '2/4'
    case 3:
      return '3/4'
    case 4:
      return '4/4'
  }
}

export type Song = {
  id: string
  name: string
  tempo: number
  timeSignature: TimeSignature
}
export type LineParseRule = {
  action: LineParserAction
  relativeLineNumber: number
}
export type State = {
  songs: Song[]
  lineParseRules: LineParseRule[]
  textInput: string
  viewSongId?: string
}
export type LineParserAction = 'NAME' | 'TEMPO' | 'TIMESIGNATURE' | 'SKIP'

export type Sound = {
  id: 'NO_SOUND' | 'DRUMSTICK' | 'QUACK'
  name: string
  url: string
}
