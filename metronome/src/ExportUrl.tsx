import { compatto } from "compatto";
import { dictionary } from "compatto/dictionary";
import * as jsurl2 from "jsurl2";
import { useEffect, useRef, useState } from "react";
import { NpButton } from "./components/NpButton";
import { NpNavigation } from "./components/NpNavigation";
import { Song } from "./types";

function ExportUrl() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string>();
  const [transferUrl, setTransferUrl] = useState<string>();
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      try {
        const state = JSON.parse(localStorage.getItem("state") || "{}");
        setSongs(state.songs || []);
        loaded.current = true;
        createTransferUrl();
      } catch (e) {
        const error = e as Error;
        setError(error.message);
      }
    }
  }, []);

  function toHex(buffer: Uint8Array) {
    return Array.prototype.map.call(buffer, (x) => x.toString(16).padStart(2, "0")).join("");
  }
  const createTransferUrl = () => {
    const cleanedSongs = songs.map((song) => {
      return song.name + "|" + song.tempo;
    });
    const encodedUrl = encodeURIComponent(cleanedSongs.join("\n"));
    const transferSongs = jsurl2.stringify(cleanedSongs);
    const { compress } = compatto({ dictionary });
    const compressedUrl = compress(transferSongs);
    const uint8Array = new Uint8Array(compressedUrl);
    const hexString = toHex(uint8Array);

    console.log(transferSongs.length, compressedUrl.length, hexString.length);
    setTransferUrl(`${window.location.origin}/transfer?songs=${encodedUrl}`);
  };

  const copyTransferUrlToClipBoard = () => {
    navigator.clipboard.writeText(transferUrl ?? "");
  };

  return (
    <div className="flex flex-col items-center mt-16 mb-10 ">
      <NpNavigation title="Songs" />

      <div className="flex flex-col gap-4 max-w-sm w-full">
        {error && (
          <div className="bg-red-300 w-full p-8 flex justify-between">
            <div>{error}</div>
            <NpButton onClick={() => setError("")}>X</NpButton>
          </div>
        )}

        {songs.length === 0
          && (
            <div className="flex flex-col">
              <p>
                No songs to export
              </p>
            </div>
          )}
        {songs.length > 0 && (
          <>
            <div className="flex flex-col gap-5 bg-gray-200 p-5 my-10">
              <NpButton onClick={createTransferUrl}>Create a Transfer Url</NpButton>

              {!transferUrl && "No transfer url created yet"}
              {transferUrl && (
                <>
                  <p>Transfer Url Length: {transferUrl.length}</p>
                  <NpButton className="align-self-end" onClick={copyTransferUrlToClipBoard}>
                    Copy to clipboard
                  </NpButton>

                  <p
                    style={{ overflowWrap: "break-word" }}
                    className=" bg-slate-50 p-2 max-h-[30vh] overflow-y-scroll text-xs whitespace-break-spaces"
                  >
                    {transferUrl}
                  </p>
                </>
              )}
            </div>
            <h3>Transfer url contains {songs.length} songs with tempo.</h3>
          </>
        )}
      </div>
      {songs.map((song) => (
        <div
          className="flex w-full max-w-sm text-xs justify-start gap-1 items-center cursor-pointer"
          key={song.id}
        >
          <div className="flex-grow ">{song.name}</div>
          <div className="text-xs sm:text-sm  flex flex-col gap-0 items-center">
            <div className="text-gray-400">Tempo</div>
            <div className="text-sm sm:text-lg">{song.tempo}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExportUrl;
