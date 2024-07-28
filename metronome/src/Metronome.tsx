import { useNavigate } from "react-router-dom";
import { NpButton } from "./components/NpButton";
import { MetronomePlayer } from "./MetronomePlayer";

function Metronome() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen max-h-screen justify-between bg-gray-300">
      <div className="flex flex-col gap-4 sm:w-10/12 md:w-9/12 lg:w-6/12">
        <div className="flex w-full justify-between mt-2">
          <h1>Metronome</h1>
          <div className="flex gap-2">
            <NpButton className="ml-4" onClick={() => navigate("/")}>
              Back
            </NpButton>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4 justify-start">
          <MetronomePlayer defaultTempo={120} />
        </div>
      </div>
    </div>
  );
}

export default Metronome;
