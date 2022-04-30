import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import PatientsList from "./components/PatientsList";
import RetrieveValue from "./components/RetrieveValue";
import RetrieveHistory from "./components/RetrieveHistory";
import UpdateRecord from "./components/UpdateRecord";
import DeleteRecord from "./components/DeleteRecord";
import Button from "./components/UI/Button";
import useHttp from "./hooks/use-http";

var TAB;
(function (TAB) {
    TAB[TAB["FIRST"] = 0] = "FIRST";
    TAB[TAB["SECOND"] = 1] = "SECOND";
    TAB[TAB["THIRD"] = 2] = "THIRD";
    TAB[TAB["FORTH"] = 3] = "FORTH";
})(TAB || (TAB = {}));

function App() {
  const [tab, setTab] = useState(TAB.FIRST);
  const [patients, setPatients] = useState([]);
  const [loincList, setLoincList] = useState([]);
  const [names, setNames] = useState([]);
  const { isLoading, sendRequest: fetchPatients } = useHttp();

  useEffect(() => {
    const transformPatients = (patientsObj) => {
      const loadedPatients = [];

      for (const key in patientsObj)
        loadedPatients.push({
          id: patientsObj[key]._id,
          FullName: patientsObj[key].fullName,
          loincNum: patientsObj[key].loinc,
          Value: patientsObj[key].value,
          Unit: patientsObj[key].unit !== "none" ? patientsObj[key].unit : " ",
          transactionDate: patientsObj[key].transactionDate,
          transactionTime: patientsObj[key].transactionTime,
        });

      setPatients(loadedPatients);

      const loadedLoinc = new Set();
      loadedPatients.map((loinc) => {
        loadedLoinc.add(loinc.loincNum);
      });
      setLoincList(Array.from(loadedLoinc));

      const loadedNames = new Set();
      loadedPatients.map((patient) => {
        loadedNames.add(patient.FullName);
      });
      //Creating set to filter duplicated names
      setNames(Array.from(loadedNames));
    };

    fetchPatients({ url: "http://localhost:3001/patients" }, transformPatients);
  }, [fetchPatients]);

  let content = <p>Found no patients data</p>;

  if (patients.length > 0) content = <PatientsList patients={patients} />;

  // if (error) content = <p>{error}</p>;

  if (isLoading) content = <p>Loading...</p>;

  return (
    <React.Fragment>
      <Header></Header>
      <main>
        <div className="buttons__main">
          <Button type="button" content={"Retrieve Data"} onClick={() => setTab(TAB.FIRST)} />
          <Button type="button" content={"Retrieve History"} onClick={() => setTab(TAB.SECOND)} />
          <Button type="button" content={"Update record"} onClick={() => setTab(TAB.THIRD)} />
          <Button type="button" content={"Delete record"} onClick={() => setTab(TAB.FORTH)} />
        </div>
        {tab === TAB.FIRST && <RetrieveValue names={names} loincList={loincList} />}
        {tab === TAB.SECOND && <UpdateRecord names={names} loincList={loincList} />}
        {tab === TAB.THIRD && <RetrieveHistory names={names} />}
        {tab ===TAB.FORTH && <DeleteRecord names={names} loincList={loincList} />}
      </main>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
