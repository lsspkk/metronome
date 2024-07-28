export type Song = {
  id: string;
  name: string;
  tempo: number;
};
export type LineParseRule = {
  action: LineParserAction;
  relativeLineNumber: number;
};
export type State = {
  songs: Song[];
  lineParseRules: LineParseRule[];
  textInput: string;
  viewSongId?: string;
};
export type LineParserAction = "NAME" | "TEMPO" | "SKIP";

export type Sound = {
  id: "NO_SOUND" | "DRUMSTICK" | "QUACK";
  name: string;
  url: string;
};
