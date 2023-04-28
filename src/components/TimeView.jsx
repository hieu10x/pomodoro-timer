import PropTypes from "prop-types";

function TimeView({ seconds }) {
  const ceilSecs = Math.ceil(seconds);
  const displayText = `${Math.floor(ceilSecs / 60)
    .toString()
    .padStart(2, "0")}:${(ceilSecs % 60).toString().padStart(2, "0")}`;
  return <h1 className="my-6 text-8xl font-bold">{displayText}</h1>;
}

TimeView.propTypes = {
  seconds: PropTypes.number.isRequired,
};

export default TimeView;
