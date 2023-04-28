import { PropTypes } from "prop-types";
import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import NumField from "./NumField";
import RadioButton from "./RadioButton";

function SettingsDialog({ open, settings, onSave, onClose }) {
  const dialogRef = useRef(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: settings,
  });

  useEffect(() => {
    if (open && !dialogRef.current.open) {
      reset(settings);
      dialogRef.current.showModal();
    } else if (!open && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [open, settings, reset]);

  const closeDialog = () => {
    dialogRef.current.close();
  };

  const handleOk = (data) => {
    onSave?.(data);
    closeDialog();
  };

  const handleCancel = () => {
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
        <FormProvider register={register} reset={reset}>
          <form method="dialog" onSubmit={handleSubmit(handleOk)}>
            <div className="mt-4 grid grid-cols-3 items-baseline gap-x-4 gap-y-2">
              <NumField label="Pomodoro (mins)" name="pomodoro" />
              <NumField label="Short break (mins)" name="shortBreak" />
              <NumField label="Long break (mins)" name="longBreak" />
            </div>
            <fieldset className="mt-2 flex flex-wrap justify-between rounded-lg border border-blue-100 px-6 py-2">
              <legend className="px-1 text-lg text-slate-500">
                Alarm sound
              </legend>
              <RadioButton
                label="Ding dong"
                name="dingdong"
                varName="alarmSound"
              />
              <RadioButton
                label="Alarm clock"
                name="alarmclock"
                varName="alarmSound"
              />
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
        </FormProvider>
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
