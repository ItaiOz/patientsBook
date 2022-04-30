import classes from "./DeleteRecord.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react/cjs/react.development";
import Button from "./UI/Button";
import Form from "./UI/Form";
import React from "react";
import ErrorModal from "./UI/ErrorModal";
import useHttp from "../hooks/use-http";

const monthNums = [
  0,
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const UpdateRecord = (props) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedLoinc, setSelectedLoinc] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState();
  const [results, setResults] = useState({});
  const { isLoading, sendRequest: deletePatientRequest } = useHttp();

  const setRequestedResults = (patientObj) => {
    if (patientObj.modifiedCount === 0) {
      setError({
        title: "No results",
        message: "No records were eligible for update",
      });
      return;
    }
    window.location.reload(false);
  };

  const patientsNames = props.names.map((patientName) => (
    <option key={Math.random()}>{patientName}</option>
  ));

  const loincList = props.loincList.map((loinc) => <option>{loinc}</option>);

  const patientChangeHandler = (event) => {
    setSelectedPatient(event.target.value);
  };

  const loincChangeHandler = (event) => {
    setSelectedLoinc(event.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!date) {
      setError({
        title: "Empty input",
        message: "One or more fields are empty",
      });
      return;
    }

    const tempObj = {
      name: !selectedPatient ? props.names[0] : selectedPatient,
      date: date,
      loinc: !selectedLoinc ? props.loincList[0] : selectedLoinc,
    };

    deleteValue(tempObj);
  };

  const deleteValue = (patientObj) =>
    deletePatientRequest(
      {
        url: "http://localhost:3001/patients/delete",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientObj),
      },
      setRequestedResults
    );

  const dateChangeHandler = (date) => {
    date = date.toString();
    const parts = date.split(" ");
    let month = monthNums.indexOf(parts[1]);
    month = month < 10 ? String(month).padStart(2, 0) : month;
    setDate(parts[3] + "-" + month + "-" + parts[2]);
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <React.Fragment>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      <Form
        instructions="Fill up the details to delete patient's record (deletes one line only)"
        results={results}
      >
        <div className={classes.retrieve__control}>
          <select onChange={patientChangeHandler}>{patientsNames}</select>
        </div>

        <div className={classes.retrieve__control}>
          <select onChange={loincChangeHandler} value={selectedLoinc}>
            {loincList}
          </select>
        </div>

        <div className={classes.retrieve__control}>
          <DatePicker
            placeholderText="Date"
            value={date}
            onChange={dateChangeHandler}
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <Button type="submit" content="Delete" onClick={submitHandler} />
      </Form>
    </React.Fragment>
  );
};

export default UpdateRecord;
