import { SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import dingDongSound from "./audio/elevator-ding.mp3";
import alarmClockSound from "./audio/oversimplified-alarm-clock.mp3";
import Button from "./components/Button";
import ModeSelect from "./components/ModeSelect";
import SettingsDialog from "./components/SettingsDialog/SettingsDialog";
import TimeView from "./components/TimeView";
import {
  defAlarmSound,
  defLongBreakMins,
  defPomodoroMins,
  defShortBreakMins,
  runningStateFinished,
  runningStatePaused,
  runningStateRunning,
} from "./constants";
import { useTimer } from "./hooks/useTimer";

function App() {
  const [settings, setSettings] = useState({
    pomodoro: defPomodoroMins,
    shortBreak: defShortBreakMins,
    longBreak: defLongBreakMins,
    alarmSound: defAlarmSound,
  });
  const [needReloadingPomodoro, setNeedReloadingPomodoro] = useState(false);

  const [mode, setMode] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { now, timeState, reloadPomodoro, start, stop, reset } = useTimer(
    settings.pomodoro
  );

  function handleStart() {
    start();
  }

  function handleStop() {
    stop();
  }

  function handleReset() {
    reset(mode, runningStatePaused, settings);
  }

  function handleModeSelect(mode) {
    setMode(mode);
    reset(mode, runningStateRunning, settings);
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
      const loadedSettings = JSON.parse(savedSettings);
      setSettings(loadedSettings);
      setNeedReloadingPomodoro(true);
    }
  }, []);

  useEffect(() => {
    if (needReloadingPomodoro && settings) {
      setNeedReloadingPomodoro(false);
      reloadPomodoro(settings);
    }
  }, [needReloadingPomodoro, reloadPomodoro, settings]);

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
