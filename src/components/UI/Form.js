import classes from "./Form.module.css";
import Results from "./Results";

const Form = (props) => {
  return (
    <div className={classes.patient_data}>
      <h3>{props.instructions}</h3>
      <form onSubmit={props.submitHandler}>
        <div className={classes.retrieve__controls}>{props.children}</div>
      </form>
      <Results results={props.results} />
    </div>
  );
};

export default Form;
