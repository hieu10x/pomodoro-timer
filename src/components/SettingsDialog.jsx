import { PropTypes } from "prop-types";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

function SettingsDialog({ open, settings, onSave, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open && !dialogRef.current.open) {
      dialogRef.current.showModal();
    } else if (!open && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [open]);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      ...settings,
    },
  });

  const closeDialog = () => {
    dialogRef.current.close();
  };

  const handleOk = (data) => {
    if (onSave) {
      onSave(data);
    }
    closeDialog();
  };

  const handleCancel = () => {
    reset(settings);
    closeDialog();
  };

  return (
    <dialog
      onClick={(e) => {
        e.stopPropagation();
        handleCancel();
      }}
      onClose={onClose}
      className="w-full max-w-sm rounded-lg p-0 backdrop:backdrop-blur-lg"
      ref={dialogRef}
    >
      <div
        className="h-full min-h-fit w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-center text-2xl font-bold">Settings</h1>
        <form method="dialog" onSubmit={handleSubmit(handleOk)}>
          <div className="mt-4 grid grid-cols-3 items-baseline gap-x-4 gap-y-2">
            <label
              htmlFor="pomodoro"
              className="col-span-2 text-lg text-slate-500"
            >
              Pomodoro (mins)
            </label>
            <input
              className="w-16 px-2 py-1 text-lg"
              id="pomodoro"
              type="number"
              name="pomodoro"
              min={1}
              {...register("pomodoro", { min: 1, required: true })}
            />
            <label
              htmlFor="shortBreak"
              className="col-span-2 text-lg text-slate-500"
            >
              Short break (mins)
            </label>
            <input
              className="w-16 px-2 py-1 text-lg"
              id="shortBreak"
              type="number"
              min={1}
              {...register("shortBreak", { min: 1, required: true })}
            />
            <label
              htmlFor="longBreak"
              className="col-span-2 text-lg text-slate-500"
            >
              Long break (mins)
            </label>
            <input
              className="w-16 px-2 py-1 text-lg"
              id="longBreak"
              type="number"
              min={1}
              {...register("longBreak", { min: 1, required: true })}
            />
          </div>
          <fieldset className="mt-2 flex flex-wrap justify-between rounded-lg border border-blue-100 px-6 py-2">
            <legend className="px-1 text-lg text-slate-500">Alarm sound</legend>
            <div>
              <input
                id="dingdong"
                type="radio"
                value="dingdong"
                className="relative top-0.5 h-4 w-4"
                {...register("alarmSound")}
              />{" "}
              <label htmlFor="dingdong" className="text-lg text-slate-500">
                Ding dong
              </label>
            </div>
            <div>
              <input
                id="alarmclock"
                type="radio"
                value="alarmclock"
                className="relative top-0.5 h-4 w-4"
                {...register("alarmSound")}
              />{" "}
              <label htmlFor="alarmclock" className="text-lg text-slate-500">
                Alarm clock
              </label>
            </div>
          </fieldset>
          <div className="mt-6 flex justify-center gap-x-2">
            <button
              type="submit"
              className="w-24 rounded-md bg-blue-500 px-4 py-2 text-lg text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:ring-offset-blue-50 active:bg-blue-700"
            >
              OK
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className="w-24 rounded-md border border-slate-300 bg-white px-4 py-2 text-lg text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-slate-50 active:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

SettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,

  settings: PropTypes.shape({
    pomodoro: PropTypes.number.isRequired,
    shortBreak: PropTypes.number.isRequired,
    longBreak: PropTypes.number.isRequired,
    alarmSound: PropTypes.string.isRequired,
  }),

  onSave: PropTypes.func,

  onClose: PropTypes.func,
};

export default SettingsDialog;
