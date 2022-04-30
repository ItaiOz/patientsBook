import classes from "./PatientsList.module.css";
import { Strings } from "../assets";

const TABLE_TITLES = [
  Strings.columnTitleTestName,
  Strings.columnTitleTestID,
  Strings.columnTitleValue,
  Strings.columnTitleTXTime,
];

const renderTableTitles = (titlesArray) => {
  return (
    <thead>
      <tr>
        {titlesArray.map((title) => (
          <th key={Math.random()}>{title}</th>
        ))}
      </tr>
    </thead>
  );
};

const renderTableRecords = (record) => {
  return (
    <tr key={record._id}>
      <td>
        <strong>{record.FullName}</strong>
      </td>
      <td>{record.loincNum}</td>
      <td>{Strings.tableValueFormated(record.Value, record.Unit)}</td>
      <td>
        {Strings.tableValueFormated(
          record.transactionDate,
          record.transactionTime
        )}
      </td>
    </tr>
  );
};

const PatientsList = (props) => {
  return (
    <div>
      <table className={classes["content-table"]}>
        {renderTableTitles(TABLE_TITLES)}
        <tbody>{props.patients.map(renderTableRecords)}</tbody>
      </table>
    </div>
  );
};

export default PatientsList;
