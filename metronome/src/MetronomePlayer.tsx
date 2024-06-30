import { useEffect, useRef, useState } from "react";
import { Song } from "./Home";
import { PlayIcon } from "./Icons";
import { StopIcon } from "./Icons";
import { NpButton } from "./NpButton";

export const MetronomePlayer = ({ song }: { song: Song }) => {
  const [tempo, setTempo] = useState<number>(song.tempo ?? 60);
  const [playing, setPlaying] = useState<boolean>(true);
  const [visualNumber, setVisualNumber] = useState<number>(0);
  const [timeSignature, setTimeSignature] = useState<2 | 3 | 4>(4);
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      try {
        const timeSignature = localStorage.getItem("timeSignature");
        if (timeSignature) {
          setTimeSignature(parseInt(timeSignature) as 2 | 3 | 4);
        }
      } catch (e) {
        console.error(e);
      }
      loaded.current = true;
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("timeSignature", timeSignature.toString());
    } catch (e) {
      console.error(e);
    }
  }, [timeSignature]);

  const onIncrease = () => {
    setTempo(tempo + 1);
  };
  const onDecrease = () => {
    setTempo(tempo - 1);
  };

  const onSetTempo = (e: unknown) => {
    console.debug(e.nativeEvent.target.value);
    setTempo(parseInt(e.target.value));
  };

  const togglePlaying = () => {
    if (playing) {
      setPlaying(false);
    } else {
      setVisualNumber(0);
      setPlaying(true);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (playing) {
      timeoutId = setTimeout(() => {
        setVisualNumber(visualNumber + 1);
      }, 60000 / tempo);
    } else {
      clearTimeout(timeoutId);
    }
    return () => clearTimeout(timeoutId);
  }, [playing, tempo, visualNumber]);

  return (
    <div className="flex flex-col gap-4 flex-grow">
      <div className="flex w-full justify-start gap-2">
        <NpButton onClick={onIncrease}>+</NpButton>
        <NpButton onClick={onDecrease}>-</NpButton>
        <input
          id="tempo-range"
          className="ml-2 flex-grow w-full"
          step={1}
          type="range"
          min={0}
          max={200}
          defaultValue={song.tempo}
          onInput={onSetTempo}
        />
        <div>{tempo}</div>
      </div>
      <button
        className="flex flex-col items-center w-full text-2xl py-20 border rounded-lg bg-indigo-200"
        onClick={togglePlaying}
      >
        {playing ? <StopIcon /> : <PlayIcon />}
        <div className="flex flex-col gap-4 mt-20">
          <div
            className={`text-[10em] font-bold py-20 ${
              visualNumber % timeSignature === 0 ? "text-indigo-900" : "text-indigo-400"
            }`}
          >
            {visualNumber % timeSignature + 1}
          </div>
        </div>
      </button>
      <div className="flex w-full gap-2 justify-stretch h-20 items-stretch">
        <TimeSignatureButton
          timeSignature={2}
          onClick={() => setTimeSignature(2)}
          isSelected={timeSignature === 2}
          className="bg-cyan-300"
        />
        <TimeSignatureButton
          timeSignature={3}
          onClick={() => setTimeSignature(3)}
          isSelected={timeSignature === 3}
          className="bg-cyan-500"
        />
        <TimeSignatureButton
          timeSignature={4}
          onClick={() => setTimeSignature(4)}
          isSelected={timeSignature === 4}
          className="bg-cyan-700"
        />
      </div>
    </div>
  );
};

export const TimeSignatureButton = ({ timeSignature, isSelected, className, ...props }:
  & { timeSignature: 2 | 3 | 4; onClick: (timeSignature: 2 | 3 | 4) => void; isSelected: boolean; className: string }
  & React.HTMLProps<HTMLButtonElement>) => (
  <button
    className={`${className} flex-grow border-8 rounded-lg ${
      isSelected ? "opacity-100 border-sky-800" : "opacity-50 border-sky-300"
    }`}
    {...props}
  >
    {timeSignature}/4
  </button>
);
