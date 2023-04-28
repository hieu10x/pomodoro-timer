import PropTypes from "prop-types";

function Button({ children, onClick, className }) {
  return (
    <button
      className={
        "rounded-md px-8 py-2 text-lg font-semibold hover:shadow-lg active:ring-2 " +
        className
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
