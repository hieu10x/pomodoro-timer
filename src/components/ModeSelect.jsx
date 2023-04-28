import PropTypes from "prop-types";

function ModeSelect({ mode, onModeSelect }) {
  return (
    <ul className="flex flex-col justify-stretch sm:flex-row">
      {["Pomodoro", "Short\u00A0Break", "Long\u00A0Break"].map(
        (content, idx) => (
          <li key={idx} className="group">
            <button
              className={
                (mode === idx ? "bg-sky-800" : "bg-sky-500") +
                " group-first:border-t-1 w-full border border-t-0 border-sky-300 px-8 py-4 font-semibold text-white hover:shadow-lg active:bg-sky-800 active:text-white group-first:rounded-t-xl group-last:rounded-b-xl sm:border-l-0 sm:py-2 sm:group-first:rounded-s-full sm:group-first:border-l sm:group-last:rounded-e-full"
              }
              onClick={() => onModeSelect(idx)}
            >
              {content}
            </button>
          </li>
        )
      )}
    </ul>
  );
}

ModeSelect.propTypes = {
  mode: PropTypes.number,
  onModeSelect: PropTypes.func,
};

export default ModeSelect;
