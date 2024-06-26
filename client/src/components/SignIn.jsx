import { React, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userContext } from "../contexts/contexts";
import Loader from "./Loader";

import { toast } from "react-toastify";

export default function SignIn() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({
    generalMsg: "",
    emailMsg: "",
    passwordMsg: "",
  });
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { setUserData } = useContext(userContext);
  const pathname = location?.state?.pathname;

  const errorStyle = {
    border: "1px solid #da3f3f",
    borderRadius: "0.3em",
  };

  const errorMsgStyle = {
    color: "#da3f3f",
    fontSize: "0.9rem",
    paddingLeft: "5px",
    textAlign: "left",
    margin: "0.5em 0 0 0",
  };

  // eslint-disable-next-line no-unused-vars
  function signIn() {
    /**
     * POST request to make the password not visible in the URL
     * check the server to see if this user exists
     */
    setShowLoader(true);

    // validating email and password
    const errorStatus = {
      generalMsg: "",
      emailMsg: "",
      passwordMsg: "",
    };

    if (
      !userInfo.email.includes("@") ||
      !userInfo.email.includes(".") ||
      userInfo.email.length < 10
    ) {
      errorStatus.emailMsg = "Please enter a valid email address.";
    }
    if (userInfo.password.trim(" ").length === 0) {
      errorStatus.passwordMsg = "Please enter a password.";
    }

    if (errorStatus.passwordMsg !== "" || errorStatus.emailMsg !== "") {
      setErrorMessage(errorStatus);
      setShowLoader(false);
      return;
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          errorStatus.generalMsg = "Incorrect username or password.";
          setErrorMessage(errorStatus);
          setShowLoader(false);
        } else {
          // signed in successfully
          setUserData(data);
          sessionStorage.setItem("loggedUser", JSON.stringify(data));
          toast.success(`Welcome, ${data.firstName}`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2500,
            theme: "dark",
          });
          setShowLoader(false);
          if (pathname) {
            navigate(pathname);
          } else {
            navigate("/");
          }
        }
      })
      .catch((error) => {
        toast.error("Something went wrong", {
          autoClose: 2500,
          theme: "dark",
        });
        setShowLoader(false);
      });
  }

  return (
    <div className="form-box">
      <form className="form">
        <h3>Sign in with your email</h3>
        {errorMessage.generalMsg !== "" && (
          <p
            style={{
              ...errorMsgStyle,
              textAlign: "center",
              fontWeight: "bold",
            }}>
            {errorMessage.generalMsg}
          </p>
        )}
        <div className="form-container">
          <div className="form-input-container">
            <label className="input-label" style={{ marginTop: 0 }}>
              Email
            </label>
            <input
              type="email"
              className="input"
              required
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              style={errorMessage.emailMsg !== "" ? errorStyle : {}}
            />
            {errorMessage.emailMsg !== "" && (
              <p style={errorMsgStyle}>{errorMessage.emailMsg}</p>
            )}
          </div>

          <div className="form-input-container">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input"
              required
              style={errorMessage.passwordMsg !== "" ? errorStyle : {}}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
            {errorMessage.passwordMsg !== "" && (
              <p style={errorMsgStyle}>{errorMessage.passwordMsg}</p>
            )}
          </div>
        </div>
        <button
          disabled={showLoader}
          className="cta-button"
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}>
          {showLoader ? <Loader size="20" /> : "Sign in"}
        </button>
      </form>
      <p className="form-account-msg">
        Don't have an account?{" "}
        <Link to={"/signup"} state={{ pathname }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
