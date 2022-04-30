import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      type={props.type}
      className={classes.form_button}
      onClick={props.onClick}
    >
      {props.content}
    </button>
  );
};

export default Button;
