import { React, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { userContext } from "../contexts/contexts";
import Loader from "./Loader";

import { toast } from "react-toastify";

export default function SignIn() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [signInStatus, setSignInStatus] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { setUserData } = useContext(userContext);
  const pathname = location?.state?.pathname;

  // eslint-disable-next-line no-unused-vars
  function signIn() {
    /**
     * POST request to make the password not visible in the URL
     * check the server to see if this user exists
     */
    setShowLoader(true);
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
          setSignInStatus("failed");
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
        toast.warning("Something went wrong", {
          autoClose: 2500,
          theme: "dark",
        });
        setShowLoader(false);
      });
  }

  return (
    <div className="form-box">
      <form className="form">
        <h3>Sign in with your email.</h3>
        {signInStatus === "failed" && (
          <p className="signIn-failed">Incorrect username or password.</p>
        )}
        <div className="form-container">
          <div className="form-input-container">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input"
              required
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
          </div>
          {/* <hr className="custom-hr" /> */}
          <div className="form-input-container">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input"
              required
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
          </div>
          {/* <hr className="custom-hr" /> */}
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
