import { PropTypes } from "prop-types";
import { useFormContext } from "react-hook-form";

function NumField({ label, name }) {
  const { register } = useFormContext();
  return (
    <>
      <label htmlFor={name} className="col-span-2 text-lg text-slate-500">
        {label}
      </label>
      <input
        className="w-16 px-2 py-1 text-lg"
        id={name}
        type="number"
        min={1}
        {...register(name, { valueAsNumber: true, min: 1, required: true })}
      />
    </>
  );
}

NumField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default NumField;
