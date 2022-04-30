import classes from "./RetrieveValue.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react/cjs/react.development";
import Input from "./UI/Input";
import Button from "./UI/Button";
import Form from "./UI/Form";
import ErrorModal from "./UI/ErrorModal";
import React from "react";
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

//Getting today's date if not date was entered
const currentDate = new Date()
  .toISOString()
  .replace(/T.*/, "")
  .split("-")
  .join("-");

const RetrieveValue = (props) => {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedLoinc, setSelectedLoinc] = useState("");
  const [customDate, setCustomDate] = useState(false);
  const [requestedDate, setRequestedDate] = useState(null);
  const [requestedTime, setRequestedTime] = useState(null);
  const [error, setError] = useState();
  const [results, setResults] = useState({});

  const { isLoading, sendRequest: sendTaskRequest } = useHttp();

  const setRequestedResults = (patientsObj) => {
    if (patientsObj.length === 0) {
      setError({
        title: "No results",
        message: "No records were found for your search",
      });
    }
    setResults(patientsObj);
  };

  const patientChangeHandler = (event) => {
    setSelectedPatient(event.target.value);
  };

  const onRadioChange = () => {
    setCustomDate(!customDate);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    async function setData() {
      if (requestedDate === null) setRequestedDate(currentDate);
    }
    setData();

    const tempObj = {
      name: selectedPatient === "" ? props.names[0] : selectedPatient,
      loincNum: selectedLoinc === "" ? props.loincList[0] : selectedLoinc,
      requestedTime: requestedTime == null ? "23:59" : requestedTime,
      requestedDate: customDate === true ? requestedDate : currentDate,
    };

    findPatientsHandler(tempObj);
  };

  const findPatientsHandler = async (patientObj) => {
    sendTaskRequest(
      {
        url: "http://localhost:3001/patients/value",
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
    <option>{patientName}</option>
  ));

  const loincList = props.loincList.map((loinc) => <option>{loinc}</option>);

  const loincChangeHandler = (event) => {
    setSelectedLoinc(event.target.value);
  };

  const requestedDateChangeHandler = (date) => {
    date = date.toString();
    let parts = date.split(" ");
    let month = monthNums.indexOf(parts[1]);
    month = month < 10 ? String(month).padStart(2, 0) : month;
    setRequestedDate(parts[3] + "-" + month + "-" + parts[2]);
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
        instructions="Fill up the details for the examination you would like to get for relevant transaction time. 
      For different transaction time, press the custom date button."
        results={results}
      >
        <div className={classes.retrieve__control}>
          <select onChange={patientChangeHandler} value={selectedPatient}>
            {patientsNames}
          </select>
        </div>
        <div className={classes.retrieve__control}>
          <select onChange={loincChangeHandler} value={selectedLoinc}>
            {loincList}
          </select>
        </div>
        <div className={classes.retrieve__control}>
          <label>
            <input
              type="radio"
              value={customDate}
              checked={customDate === false}
              onChange={onRadioChange}
            />
            Now
          </label>
          <label>
            <input
              type="radio"
              value={customDate}
              checked={customDate === true}
              onChange={onRadioChange}
            />
            Custom Date
          </label>
        </div>
        {customDate && [
          <div className={classes.retrieve__control}>
            <DatePicker
              placeholderText="Date"
              value={requestedDate}
              required
              onChange={requestedDateChangeHandler}
              dateFormat="dd/MM/yyyy"
            />
          </div>,
          <Input
            type="time"
            placeholder="Time"
            value={requestedTime}
            required={false}
            onChange={(e) => {
              setRequestedTime(e.target.value);
            }}
          />,
        ]}
        <Button type="submit" content="Get Data" onClick={submitHandler} />
      </Form>
    </React.Fragment>
  );
};

export default RetrieveValue;
