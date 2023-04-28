import { SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import dingDongSound from "./audio/elevator-ding.mp3";
import alarmClockSound from "./audio/oversimplified-alarm-clock.mp3";
import Button from "./components/Button";
import ModeSelect from "./components/ModeSelect";
import SettingsDialog from "./components/SettingsDialog/SettingsDialog";
import TimeView from "./components/TimeView";

function App() {
  const oneMin = 60 * 1000;
  const defPomodoroMins = 25;
  const defShortBreakMins = 5;
  const defLongBreakMins = 10;
  const defAlarmSound = "alarmclock";

  const [settings, setSettings] = useState({
    pomodoro: defPomodoroMins,
    shortBreak: defShortBreakMins,
    longBreak: defLongBreakMins,
    alarmSound: defAlarmSound,
  });

  const [mode, setMode] = useState(0);
  const runningStateRunning = 0;
  const runningStatePaused = 1;
  const runningStateFinished = 2;
  const [now, setNow] = useState(Date.now());
  const [timeState, setTimeState] = useState({
    id: 0,
    runningState: runningStatePaused,
    pauseTime: now,
    endTime: now + settings.pomodoro * oneMin,
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  function setDateNow() {
    const dateNow = Date.now();
    setNow(dateNow);
    return dateNow;
  }

  function handleStart() {
    setTimeState((s) => {
      if (s.runningState === runningStatePaused) {
        const dateNow = setDateNow();
        const pausePeriod = dateNow - s.pauseTime;
        return {
          ...s,
          pauseTime: 0,
          runningState: runningStateRunning,
          endTime: s.endTime + pausePeriod,
        };
      } else {
        return s;
      }
    });
  }

  function handleStop() {
    setTimeState((s) => {
      if (s.runningState === runningStateRunning) {
        const dateNow = setDateNow();
        return {
          ...s,
          runningState: runningStatePaused,
          pauseTime: dateNow,
        };
      } else {
        return s;
      }
    });
  }

  function reset(mode, runningState) {
    const dateNow = setDateNow();
    setTimeState((s) => ({
      id: s.id + 1,
      runningState: runningState,
      pauseTime: runningState === runningStatePaused ? dateNow : 0,
      endTime: dateNow + getTimeFromMode(mode, settings),
    }));
  }

  function handleReset() {
    reset(mode, runningStatePaused);
  }

  function handleModeSelect(mode) {
    setMode(mode);
    reset(mode, runningStateRunning);
  }

  function getTimeFromMode(mode, settings) {
    switch (mode) {
      case 0:
        return settings.pomodoro * oneMin;
      case 1:
        return settings.shortBreak * oneMin;
      case 2:
        return settings.longBreak * oneMin;
    }
  }

  function getAlarmSound(soundName) {
    switch (soundName) {
      case "alarmclock":
        return alarmClockSound;
      case "dingdong":
        return dingDongSound;
      default:
        return dingDongSound;
    }
  }

  function handleSaveSettings(newSettings) {
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  }

  useEffect(() => {
    // disable context menu
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    // load settings from localStorage
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));

      // Fresh loaded only: initialize the first timer if it's not started
      setTimeState((s) => {
        const oneMin = 60 * 1000;
        if (
          s.id === 0 &&
          s.runningState === runningStatePaused &&
          s.pauseTime > 0 &&
          s.endTime - s.pauseTime === defPomodoroMins * oneMin
        ) {
          const now = setDateNow();
          return {
            id: 0,
            runningState: runningStatePaused,
            pauseTime: now,
            endTime: now + JSON.parse(savedSettings).pomodoro * oneMin,
          };
        } else {
          return s;
        }
      });
    }
  }, []);

  useEffect(() => {
    if (timeState.runningState === runningStateRunning) {
      const interval = setInterval(() => {
        const dateNow = setDateNow();
        setTimeState((s) => {
          if (s.runningState === runningStateRunning) {
            if (s.endTime <= dateNow) {
              return {
                ...s,
                runningState: runningStateFinished,
                endTime: dateNow,
              };
            }
          }
          return s;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeState.runningState, timeState.id, timeState.endTime]);

  useEffect(() => {
    const audio = document.querySelector("#audio");
    if (timeState.runningState === runningStateFinished) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [timeState.runningState]);

  return (
    <>
      <button onClick={() => setDialogOpen(true)}>
        <SettingsIcon className="absolute right-4 top-4" />
      </button>
      <SettingsDialog
        open={dialogOpen}
        settings={settings}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveSettings}
      />
      <div className="flex flex-col items-center">
        <h1 className="my-8 text-3xl font-bold">Pomodoro Timer</h1>
        <ModeSelect mode={mode} onModeSelect={handleModeSelect} />
        <TimeView seconds={(timeState.endTime - now) / 1000} />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            className="bg-green-500 text-white ring-green-700"
            onClick={handleStart}
          >
            Start
          </Button>
          <Button
            className="bg-red-500 text-white ring-red-700"
            onClick={handleStop}
          >
            Stop
          </Button>
          <Button
            className={
              "bg-zinc-200 ring-zinc-500" +
              (timeState.runningState === runningStateFinished
                ? " animate-pulse-rapid"
                : "")
            }
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
      <audio
        src={getAlarmSound(settings.alarmSound)}
        id="audio"
        autoPlay={false}
      ></audio>
    </>
  );
}

export default App;
