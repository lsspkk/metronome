import { compatto } from "compatto";
import { dictionary } from "compatto/dictionary";
import * as jsurl2 from "jsurl2";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NpButton } from "./components/NpButton";
import { NpNavigation } from "./components/NpNavigation";
import { calculateColor } from "./components/theme";
import { PlayIcon } from "./Icons";
import { MetronomePlayer } from "./MetronomePlayer";
import { Song } from "./types";
import { LineParseRule } from "./types";

function Songs() {
  const [textInput, setTextInput] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [lineParseRules, setLineParseRules] = useState<LineParseRule[]>([]);
  const [viewSongId, setViewSongId] = useState<string>();
  const loaded = useRef(false);
  const [error, setError] = useState<string>();
  const [transferUrl, setTransferUrl] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded.current) {
      try {
        const state = JSON.parse(localStorage.getItem("state") || "{}");
        setSongs(state.songs || []);
        setLineParseRules(state.lineParseRules || []);
        setTextInput(state.textInput || "");
        setViewSongId(state.viewSongId);
        loaded.current = true;
      } catch (e) {
        const error = e as Error;
        setError(error.message);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify({ songs, lineParseRules, viewSongId, textInput }));
  }, [songs, lineParseRules, viewSongId, textInput]);

  const toMetronmeRoute = (id: string) => {
    setViewSongId(id);
    navigate(`/metronome/song/${id}`);
  };

  function toHex(buffer: Uint8Array) {
    return Array.prototype.map.call(buffer, (x) => x.toString(16).padStart(2, "0")).join("");
  }
  const createTransferUrl = () => {
    const transferSongs = jsurl2.stringify(songs);
    const { compress } = compatto({ dictionary });
    const compressedUrl = compress(transferSongs);
    const uint8Array = new Uint8Array(compressedUrl);
    const hexString = toHex(uint8Array);

    console.log(transferSongs.length, compressedUrl.length, hexString.length);
    setTransferUrl(`${window.location.origin}/transfer?songs=${hexString}`);
  };

  const copyTransferUrlToClipBoard = () => {
    navigator.clipboard.writeText(transferUrl ?? "");
  };

  return (
    <div className="flex flex-col items-center mb-10 mt-2">
      <NpNavigation title="Songs" />

      <div className="flex flex-col gap-4 sm:mw-10/12 md:w-8/12 lg:w-6/12">
        {error && (
          <div className="bg-red-300 w-full p-8 flex justify-between">
            <div>{error}</div>
            <NpButton onClick={() => setError("")}>X</NpButton>
          </div>
        )}

        {songs.length === 0
          && (
            <div className="flex flex-col">
              <div className="bg-green-700 bg-opacity-30 p-2 sm:p-8">
                Import list of songs from text or transfer url.

                <MetronomePlayer defaultTempo={120} />
              </div>
            </div>
          )}
        {songs.map((song, index) => (
          <div
            className="flex w-full text-xs justify-start gap-2 items-center cursor-pointer"
            key={song.id}
            onClick={() => toMetronmeRoute(song.id)}
          >
            <div className="flex-grow sm:text-lg">{song.name}</div>
            <div className="text-xs sm:text-sm  flex flex-col gap-2 items-center">
              <div className="text-gray-400">Tempo</div>

              <div className="text-sm sm:text-lg">{song.tempo}</div>
            </div>
            <NpButton className="rounded-xl shadow opacity-70 pr-0" style={{ backgroundColor: calculateColor(index) }}>
              <PlayIcon className="w-8 h-8 sm:w-12 sm:h-12" />
            </NpButton>
          </div>
        ))}

        <div className="flex flex-col gap-5 bg-gray-200 p-5 my-10">
          <NpButton onClick={createTransferUrl}>Create a Transfer Url</NpButton>

          {!transferUrl && "No transfer url created yet"}
          {transferUrl && <input type="text" disabled value={transferUrl} />}

          <NpButton className="align-self-end" onClick={copyTransferUrlToClipBoard}>
            Copy
          </NpButton>
        </div>
      </div>
    </div>
  );
}

export default Songs;
