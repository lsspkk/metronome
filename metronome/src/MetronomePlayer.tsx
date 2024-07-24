import { useEffect, useRef, useState } from "react";
import { NpButton } from "./components/NpButton";
import { PlayIcon } from "./Icons";
import { StopIcon } from "./Icons";

export const MetronomePlayer = ({ defaultTempo = 120 }: { defaultTempo: number }) => {
  const [tempo, setTempo] = useState<number>(defaultTempo);
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

  const onSetTempo = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    let timeoutId: number;
    if (playing) {
      timeoutId = setTimeout(() => {
        setVisualNumber(visualNumber + 1);
      }, 60000 / tempo);
    }
    return () => clearTimeout(timeoutId);
  }, [playing, tempo, visualNumber]);

  return (
    <div className="flex flex-col gap-4 flex-grow items-center">
      <div className="flex w-full justify-start gap-2">
        <NpButton className="text-lg py-0 w-8" onClick={onIncrease}>
          +
        </NpButton>
        <NpButton className="text-lg py-0 w-8" onClick={onDecrease}>
          -
        </NpButton>
        <input
          id="tempo-range"
          className="ml-2 flex-grow w-full"
          step={1}
          type="range"
          min={0}
          max={200}
          defaultValue={tempo}
          onInput={onSetTempo}
        />
        <div>{tempo}</div>
      </div>
      <button
        className={`flex flex-col items-center w-[50vh] h-[50vh] max-w-[90vw] max-h-[90vw] justify-center text-xl py-10 border-8 rounded-3xl bg-indigo-200`}
        onClick={togglePlaying}
      >
        <div className="-mt-[2vh] rounded-xl text-indigo-900 flex gap-0 sm:gap-2">
          <PlayIcon
            className={`-mr-2 w-20 h-20 sm:w-40 sm:h-40 p-3 pt-2 md:p-6 md:pt-5 ${playing ? "opacity-50" : ""}`}
          />
          <StopIcon className={`-ml-2 w-20 h-20 sm:w-40 sm:h-40 ${playing ? "" : "opacity-50"}`} />
        </div>
        <div className="flex flex-col mt-2 sm:mt-2">
          <div
            className={`text-[10em] font-bold py-12 sm:py-[4vh] md:py-[4vh] ${
              visualNumber % timeSignature === 0 ? "text-indigo-900" : "text-indigo-400"
            }`}
          >
            {(visualNumber % timeSignature) + 1}
          </div>
        </div>
      </button>
      <div className="flex max-w-[90vw] w-[50vh] p-2 gap-2 justify-stretch h-20 items-stretch">
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
          className="bg-cyan-400"
        />
        <TimeSignatureButton
          timeSignature={4}
          onClick={() => setTimeSignature(4)}
          isSelected={timeSignature === 4}
          className="bg-cyan-500"
        />
      </div>
    </div>
  );
};

export const TimeSignatureButton = ({
  timeSignature,
  isSelected,
  className,
  ...props
}: {
  timeSignature: 2 | 3 | 4;
  isSelected: boolean;
  className: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`${className} flex-grow border-8 rounded-xl text-lg ${
      isSelected ? "opacity-100 border-sky-800" : "opacity-50 border-sky-300"
    }`}
    {...props}
  >
    {timeSignature}/4
  </button>
);
