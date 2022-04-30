// import classes from "./Results.module.css";
import classes from "./Results.module.css";
import { Strings } from "../../assets";

const Results = (props) => {
  const renderResults = (record) => {
    return (
      <tr>
        <td>
          <strong>{record.fullName}</strong>
        </td>
        <td>{record.loinc}</td>
        <td>
          {Strings.tableValueFormated(
            record.value,
            record.unit !== "none" ? record.unit : " "
          )}
        </td>
        <td>
          {Strings.tableValueFormated(
            record.transactionDate,
            record.transactionTime
          )}
        </td>
      </tr>
    );
  };

  if (Object.entries(props.results).length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Results are as follow:</h2>
      <table className={classes["content-table"]}>
        <tbody>{props.results.map(renderResults)}</tbody>
      </table>
    </div>
  );
};

export default Results;
