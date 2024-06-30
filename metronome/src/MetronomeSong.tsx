import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Song } from "./Home";
import { MetronomePlayer } from "./MetronomePlayer";
import { NpButton } from "./NpButton";

function MetronomeSong() {
  const id = useParams().id;
  const [songs, setSongs] = useState<Song[]>([]);
  const loaded = useRef(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded.current) {
      try {
        const state = JSON.parse(localStorage.getItem("state") || "{}");
        setSongs(state.songs || []);
        loaded.current = true;
      } catch (e) {
        setError(e.message);
      }
    }
  }, []);

  const song = songs.find(s => s.id === id);

  return (
    <div className="flex flex-col items-center min-h-screen max-h-screen justify-between bg-gray-300">
      <div className="flex flex-col gap-4 sm:w-10/12 md:w-9/12 lg:w-6/12">
        {error && (
          <div className="bg-red-300 w-full p-8 flex justify-between">
            <div>{error}</div>
            <button onClick={() => setError("")}>X</button>
          </div>
        )}
        <div className="flex w-full justify-between mt-2">
          <h1>Song Metronome</h1>
          <NpButton onClick={() => navigate("/")}>Back</NpButton>
        </div>
        {!song && <p>Song not found</p>}
        {song
          && (
            <div className="flex flex-col w-full gap-4 justify-start">
              <div className="flex w-full text-xs" key={song.id}>
                <div className="flex-grow">{song.name}</div>
                <p>Song Tempo: {song.tempo}</p>
              </div>

              <MetronomePlayer song={song} />
            </div>
          )}
      </div>
    </div>
  );
}

export default MetronomeSong;
