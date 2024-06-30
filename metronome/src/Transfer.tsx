import * as jsurl2 from "jsurl2";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Song } from "./Home";
import { NpButton } from "./NpButton";

function Transfer() {
  // read query param named songs that is a string
  const [searchParams] = useSearchParams();
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState();
  const [readOk, setReadOk] = useState(false);
  const navigate = useNavigate();

  const transferUrl = searchParams.get("songs");
  const readTransferUrl = () => {
    try {
      const readSongs = jsurl2.parse(transferUrl, true) as Song[];

      setSongs(readSongs);
      setReadOk(true);
    } catch (e) {
      setError(e.message);
    }
  };

  const useAndGoHome = () => {
    try {
      const state = localStorage.getItem("state") || "{}";
      const newState = JSON.parse(state);
      newState.songs = songs;
      localStorage.setItem("state", JSON.stringify(newState));
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen max-h-screen justify-between bg-gray-300">
      <div className="flex flex-col gap-4 sm:w-10/12 md:w-9/12 lg:w-6/12">
        {error && (
          <div className="bg-red-300 w-full p-8 flex justify-between">
            <div>{error}</div>
            <button onClick={() => setError("")}>X</button>
          </div>
        )}
        <h3 className="mt-6">Read Songs from Transfer url</h3>

        <div className="flex flex-col gap-2">
          {!transferUrl && "No transfer url created yet"}
          {transferUrl
            && <input type="text" disabled value={transferUrl} />}

          <NpButton onClick={readTransferUrl}>Read</NpButton>

          {readOk && (
            <div className="bg-white shadow-sm rounded w-full p-8 flex justify-between flex-col gap-5">
              <div className="flex items-center gap-4 align-self-center self-center">
                <RoundThumbUpIcon />
                Read OK
              </div>
              <NpButton className="w-auto py-2 px-8 self-center" onClick={useAndGoHome}>Use Songs</NpButton>
            </div>
          )}

          <h3 className="mt-6">Transferred Songs</h3>
          <div className="flex flex-col gap-1 items-start text-xs">
            {songs.map(song => (
              <div key={song.id} className="flex w-full text-xs justify-between gap-2">
                <div className="flex-grow">{song.name}</div>
                <div>{song.tempo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const RoundThumbUpIcon = ({ className }: { className?: string }) => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 50 50"
    xml:space="preserve"
    className={className || "w-20 h-20"}
  >
    <circle style={{ fill: "#25AE88" }} cx="25" cy="25" r="25" />
    <polyline
      style={{
        fill: "none",
        stroke: "white",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 10,
      }}
      points="
	38,15 22,33 12,25 "
    />
  </svg>
);

export default Transfer;
