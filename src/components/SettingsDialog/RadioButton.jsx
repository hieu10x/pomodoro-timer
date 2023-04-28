import { PropTypes } from "prop-types";
import { useFormContext } from "react-hook-form";

function RadioButton({ label, name, varName }) {
  const { register } = useFormContext();
  return (
    <div>
      <input
        id={name}
        type="radio"
        value={name}
        className="relative top-0.5 h-4 w-4"
        {...register(varName)}
      />{" "}
      <label htmlFor={name} className="text-lg text-slate-500">
        {label}
      </label>
    </div>
  );
}

RadioButton.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  varName: PropTypes.string.isRequired,
};

export default RadioButton;
