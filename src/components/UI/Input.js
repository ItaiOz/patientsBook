import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <div className={classes.retrieve__control}>
      <input
        type={props.type}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
        required
      />
    </div>
  );
};

export default Input;
