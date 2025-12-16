import React from "react";
import ReactDOM from "react-dom";
//Css module
import classes from "./ErrorModal.module.css";

const ErrorOverlay = ({ setShowError }) => {
  return (
    <div
      onClick={() => setShowError(false)}
      className={classes["error-overlay"]}
    ></div>
  );
};

const ErrorComponent = ({ errors, setShowError }) => {
  return (
    <div className={classes["error-modal"]}>
      <div>
        <h3>Errors Validate!</h3>
        {errors.map((error) => {
          return <p key={error.msg}>{error.msg}</p>;
        })}
        <p onClick={() => setShowError(false)} className={classes.close}>
          Close
        </p>
      </div>
    </div>
  );
};

const ErrorModal = ({ errors, setShowError }) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <ErrorOverlay setShowError={setShowError} />,
        document.getElementById("error-overlay")
      )}
      {ReactDOM.createPortal(
        <ErrorComponent errors={errors} setShowError={setShowError} />,
        document.getElementById("error-modal")
      )}
    </React.Fragment>
  );
};

export default ErrorModal;
