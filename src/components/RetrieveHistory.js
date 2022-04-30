import classes from "./RetrieveHistory.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react/cjs/react.development";
import Input from "./UI/Input";
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

const RetrieveHistory = (props) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [untilDate, setUntilDate] = useState("");
  const [untilTime, setUntilTime] = useState("");
  const [error, setError] = useState();
  const [results, setResults] = useState({});

  const { isLoading, sendRequest: sendTaskRequest } = useHttp();

  const setRequestedResults = (patientObj) => {
    if (patientObj.length === 0) {
      setError({
        title: "No results",
        message: "No records were found for your search",
      });
    }
    setResults(patientObj);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const tempFrom = fromDate.split("-");
    const tempUntil = untilDate.split("-");

    //Empty fields validation
    if (!fromDate || !untilDate) {
      setError({
        title: "Empty input",
        message: "Date field must not be empty",
      });
      return;
    }

    //Validating first date is not later than second date
    for (const i in (tempFrom, tempUntil)) {
      if (tempFrom[i] < tempUntil[i]) break;
      if (tempFrom[i] > tempUntil[i]) {
        setError({
          title: "Invalid Input",
          message: "Ending date cannot be before starting date",
        });
        return;
      }
    }
    //Validation if greater hour
    if (fromDate === untilDate && fromTime > untilTime) {
      setError({
        title: "Invalid Input",
        message: "Ending hour cannot be before starting hour",
      });
      return;
    }

    const tempObj = {
      name: !selectedPatient ? props.names[0] : selectedPatient,
      fromDate: fromDate,
      fromTime: !fromTime ? "00:00" : fromTime,
      untilDate: untilDate,
      untilTime: !untilTime ? "23:59" : untilTime,
    };

    findHistoryHandler(tempObj);
  };

  const findHistoryHandler = async (patientObj) => {
    sendTaskRequest(
      {
        url: "http://localhost:3001/patients/history",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientObj),
      },
      setRequestedResults
    );
  };

  const patientsNames = props.names.map((patientName) => (
    <option key={Math.random()}>{patientName}</option>
  ));

  const patientChangeHandler = (event) => {
    setSelectedPatient(event.target.value);
  };

  const fromDateChangeHandler = (date) => {
    date = date.toString();
    const parts = date.split(" ");
    const month = monthNums.indexOf(parts[1]);
    setFromDate(parts[3] + "-" + month + "-" + parts[2]);
  };

  const untilDateChangeHandler = (date) => {
    date = date.toString();
    const parts = date.split(" ");
    const month = monthNums.indexOf(parts[1]);
    setUntilDate(parts[3] + "-" + month + "-" + parts[2]);
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
        instructions="Fill up the date ranges to get all examinations for selected patient"
        results={results}
      >
        <div className={classes.retrieve__control}>
          <select onChange={patientChangeHandler}>{patientsNames}</select>
        </div>

        <div className={classes.retrieve__timepoint}>
          <div className={classes.retrieve__control}>
            <DatePicker
              placeholderText="From Date"
              value={fromDate}
              onChange={fromDateChangeHandler}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <Input
            type="time"
            placeholder="Time"
            value={fromTime}
            required={true}
            onChange={(e) => {
              setFromTime(e.target.value);
            }}
          />
        </div>
        <div className={classes.retrieve__timepoint}>
          <div className={classes.retrieve__control}>
            <DatePicker
              placeholderText="Until Date"
              value={untilDate}
              onChange={untilDateChangeHandler}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <Input
            type="time"
            placeholder="Time"
            value={untilTime}
            required={true}
            onChange={(e) => {
              setUntilTime(e.target.value);
            }}
          />
        </div>
        <Button type="submit" content="Get Data" onClick={submitHandler} />
      </Form>
    </React.Fragment>
  );
};

export default RetrieveHistory;
