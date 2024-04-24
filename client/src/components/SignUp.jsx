import { useState, useContext } from "react";
import Loader from "./Loader";
import { userContext } from "../contexts/contexts";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp(props) {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repassword: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    generalMsg: "",
    firstNameMsg: "",
    lastNameMsg: "",
    emailMsg: "",
    passwordMsg: "",
    repasswordMsg: "",
  });
  const [showLoader, setShowLoader] = useState(false);
  const { setUserData } = useContext(userContext);
  const navigate = useNavigate();
  const location = useLocation();

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

  function signUp() {
    /**
     * some validations for the signup
     */
    setShowLoader(true);

    const errorStatus = {
      firstNameMsg: "",
      lastNameMsg: "",
      emailMsg: "",
      passwordMsg: "",
      repasswordMsg: "",
    };

    let invalidInputs = false;

    const isAlpha = (str) => /^[a-zA-Z]*$/.test(str);
    const isPassword = (str) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        str
      );
    if (!isAlpha(userInfo.firstName) || userInfo.firstName.trim(" ") === "") {
      errorStatus.firstNameMsg = "Enter a valid first name";
      invalidInputs = true;
    }

    if (!isAlpha(userInfo.lastName) || userInfo.lastName.trim(" ") === "") {
      errorStatus.lastNameMsg = "Enter a valid last name";
      invalidInputs = true;
    }

    if (
      userInfo.email.indexOf("@") === -1 ||
      userInfo.email.indexOf(".") === -1
    ) {
      errorStatus.emailMsg = "Enter a valid email address";
      invalidInputs = true;
    }

    if (userInfo.password.trim() === "" || !isPassword(userInfo.password)) {
      errorStatus.passwordMsg =
        "Password needs to include minimum eight characters, one uppercase letter, one lowercase letter, one number, and one special character";
      invalidInputs = true;
    }

    if (userInfo.password !== userInfo.repassword) {
      errorStatus.repasswordMsg = "Passwords don't match";
      invalidInputs = true;
    }

    if (userInfo.repassword.trim() === "") {
      errorStatus.repasswordMsg = "Re-enter the previous password";
      invalidInputs = true;
    }

    if (invalidInputs) {
      setErrorMessage(errorStatus);
      setShowLoader(false);
      return;
    }

    /**
     * Check if email already exists in the DB
     */
    fetch(`${process.env.REACT_APP_SERVER_URL}/user/${userInfo.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data === null) {
          /**
           * Create new user by POST request
           */
          let { firstName, lastName, email, password } = userInfo;
          firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
          lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
          email = email.toLowerCase();
          fetch(`${process.env.REACT_APP_SERVER_URL}/signUp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstName, lastName, email, password }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.result === "success") {
                setUserData(data.user);
                sessionStorage.setItem("loggedUser", JSON.stringify(data.user));
                toast.success(`Welcome, ${data.user.firstName}`, {
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
              } else {
                errorStatus.generalMsg = "Failed to sign up";
              }
            });
        } else {
          errorStatus.emailMsg = "This email is already in use";
        }
        setErrorMessage(errorStatus);
        setShowLoader(false);
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
        <h3>Create a free account with your email</h3>
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
              First name
            </label>
            <input
              type="text"
              className="input"
              required
              onChange={(e) =>
                setUserInfo({ ...userInfo, firstName: e.target.value })
              }
              style={errorMessage.firstNameMsg !== "" ? errorStyle : {}}
            />
            {errorMessage.firstNameMsg !== "" && (
              <p style={errorMsgStyle}>{errorMessage.firstNameMsg}</p>
            )}
          </div>
          <div className="form-input-container">
            <label className="input-label">Last name</label>
            <input
              type="text"
              className="input"
              required
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastName: e.target.value })
              }
              style={errorMessage.lastNameMsg !== "" ? errorStyle : {}}
            />
            {errorMessage.lastNameMsg !== "" && (
              <p style={errorMsgStyle}>{errorMessage.lastNameMsg}</p>
            )}
          </div>
          <div className="form-input-container">
            <label className="input-label">Email</label>
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
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
              style={errorMessage.passwordMsg !== "" ? errorStyle : {}}
            />
            {errorMessage.passwordMsg !== "" && (
              <p style={errorMsgStyle}>{errorMessage.passwordMsg}</p>
            )}
          </div>
          <div className="form-input-container">
            <label className="input-label">Re-enter password</label>
            <input
              type="password"
              className="input"
              required
              onChange={(e) =>
                setUserInfo({ ...userInfo, repassword: e.target.value })
              }
              style={errorMessage.repasswordMsg !== "" ? errorStyle : {}}
            />
            {errorMessage.repasswordMsg !== "" && (
              <p style={errorMsgStyle}>{errorMessage.repasswordMsg}</p>
            )}
          </div>
        </div>
        <button
          disabled={showLoader}
          onClick={(e) => {
            e.preventDefault();
            signUp();
          }}>
          {showLoader ? <Loader size="20" /> : "Sign up"}
        </button>
      </form>
      <p className="form-account-msg">
        Already have an account? <Link to={"/signin"}>Sign in</Link>
      </p>
    </div>
  );
}
