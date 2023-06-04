import { useEffect, useState } from "react";
import {
  modeLongBreak,
  modePomodoro,
  modeSortBreak,
  runningStateFinished,
  runningStateInit,
  runningStatePaused,
  runningStateRunning,
} from "../constants";

export function useTimer(pomodoroMins) {
  const oneMin = 60 * 1000;

  const [now, setNow] = useState(Date.now());
  const [timeState, setTimeState] = useState({
    id: 0,
    runningState: runningStateInit,
    pauseTime: now,
    endTime: now + pomodoroMins * oneMin,
  });

  function reloadPomodoro(loadedSettings) {
    setTimeState((s) => {
      if (s.runningState === runningStateInit) {
        const now = setDateNow();
        return {
          id: 0,
          runningState: runningStatePaused,
          pauseTime: now,
          endTime: now + loadedSettings.pomodoro * oneMin,
        };
      } else {
        return s;
      }
    });
  }

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

  function setDateNow() {
    const dateNow = Date.now();
    setNow(dateNow);
    return dateNow;
  }

  function getTimeFromMode(mode, settings) {
    switch (mode) {
      case modePomodoro:
        return settings.pomodoro * oneMin;
      case modeSortBreak:
        return settings.shortBreak * oneMin;
      case modeLongBreak:
        return settings.longBreak * oneMin;
    }
  }

  function start() {
    setTimeState((s) => {
      if (
        s.runningState === runningStatePaused ||
        s.runningState === runningStateInit
      ) {
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

  function stop() {
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

  function reset(mode, runningState, settings) {
    const dateNow = setDateNow();
    setTimeState((s) => ({
      id: s.id + 1,
      runningState: runningState,
      pauseTime: runningState === runningStatePaused ? dateNow : 0,
      endTime: dateNow + getTimeFromMode(mode, settings),
    }));
  }

  return { now, timeState, reloadPomodoro, start, stop, reset };
}
