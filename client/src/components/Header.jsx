import React from "react";
import hamburgerIcon from "../media/hamburger-icon.png";
import closeIcon from "../media/close-icon.png";
import magnifyingGlass from "../media/magnifying-glass-solid.svg";
import logo from "../media/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useContext, useState, useEffect, useCallback } from "react";
import { modeContext, userContext } from "../contexts/contexts";
import { Link, useNavigate } from "react-router-dom";

import Dropdown from "./Dropdown";
import {
  faFireFlameCurved,
  faStar,
  faArrowTrendUp,
  faListUl,
  faUser,
  faCalendarDays,
  faClapperboard,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [text, setText] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const [navShow, setNavShow] = useState(false);
  // contexts
  const { mode, setMode } = useContext(modeContext);
  const { userData } = useContext(userContext);

  const navigate = useNavigate();

  // toggles mode between movie / tv
  const toggleMode = () => {
    setMode(mode === "movie" ? "tv" : "movie");
  };

  const searchTextTerm = useCallback(
    (e) => {
      if (e.key === "Enter" && text.trim() !== "") {
        navigate(`search/${mode}/${text}`);
      }
    },
    [mode, text, navigate]
  );

  function toggleNavShow() {
    setNavShow((prevNavShow) => !prevNavShow);
  }

  useEffect(() => {
    const UpdateWidth = () => setWidth(window.innerWidth);
    window.addEventListener("resize", UpdateWidth);
    return () => {
      window.removeEventListener("resize", UpdateWidth);
    };
  }, []);

  return (
    <div className="header-container-wrapper">
      <div className="header-container">
        <div className="header-nav">
          <div className="header-nav-container">
            {width < 961 && (
              <div>
                {navShow && (
                  <div className="menu-overlay" onClick={toggleNavShow}></div>
                )}
                <div className="hamburger-icon">
                  <img
                    src={hamburgerIcon}
                    alt="hamburger-icon"
                    onClick={toggleNavShow}></img>
                </div>
                <div
                  className={`mobile-nav ${
                    navShow ? "mobile-nav-show" : "mobile-nav-hide"
                  }`}>
                  <Link
                    className="mobile-nav-btn"
                    to={`/popular/${mode}`}
                    onClick={toggleNavShow}>
                    <FontAwesomeIcon
                      icon={faFireFlameCurved}
                      size="lg"
                      className="mobile-nav-icon"
                    />
                    Popular
                  </Link>
                  <Link
                    className="mobile-nav-btn"
                    to={`/top-rated/${mode}`}
                    onClick={toggleNavShow}>
                    <FontAwesomeIcon
                      icon={faStar}
                      size="lg"
                      className="mobile-nav-icon"
                    />
                    Top Rated
                  </Link>
                  {mode === "movie" && (
                    <Link
                      className="mobile-nav-btn"
                      to={`/upcoming/${mode}`}
                      onClick={toggleNavShow}>
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        size="lg"
                        className="mobile-nav-icon"
                      />
                      Upcoming
                    </Link>
                  )}
                  <Link
                    className="mobile-nav-btn"
                    to={"/trending"}
                    onClick={toggleNavShow}>
                    <FontAwesomeIcon
                      icon={faArrowTrendUp}
                      size="lg"
                      className="mobile-nav-icon"
                    />
                    Trending
                  </Link>
                  <button
                    className="mobile-nav-btn"
                    onClick={() => {
                      toggleMode();
                      toggleNavShow();
                    }}>
                    <FontAwesomeIcon
                      icon={faClapperboard}
                      size="lg"
                      className="mobile-nav-icon"
                    />
                    {mode === "movie" ? "Explore TV" : "Explore Movies"}
                  </button>
                  <Link
                    className="mobile-nav-btn"
                    to={"/watchlist"}
                    onClick={toggleNavShow}>
                    <FontAwesomeIcon
                      icon={faListUl}
                      size="lg"
                      className="mobile-nav-icon"
                    />
                    Watchlist
                  </Link>
                  <Link
                    className="mobile-nav-btn"
                    to={userData ? "/profile/account-details" : "/signin"}
                    onClick={toggleNavShow}>
                    <FontAwesomeIcon
                      icon={faUser}
                      size="lg"
                      className="mobile-nav-icon"
                    />
                    {userData ? `Hi, ${userData.firstName}` : "Sign In"}
                  </Link>
                </div>
              </div>
            )}
            <Link className="main-logo-link" to={"/"}>
              <div className="main-logo">
                {width > 426 && (
                  <img className="logo-img" src={logo} alt="website logo"></img>
                )}
                <h2>WatchFlex</h2>
              </div>
            </Link>
          </div>
          <div className="header-search-nav-container">
            <div className="header-search-container">
              <div className="header-searchbar-container">
                <input
                  className="header-search-bar"
                  type="text"
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={searchTextTerm}
                  value={text}
                />
                <div className="searchbar-icons">
                  {text !== "" && (
                    <img
                      className="clear-icon"
                      src={closeIcon}
                      alt="clear icon"
                      onClick={() => setText("")}></img>
                  )}
                  <img
                    className="search-icon"
                    src={magnifyingGlass}
                    alt="search icon"
                    onClick={() => searchTextTerm({ key: "Enter" })}
                  />
                </div>
              </div>
            </div>
            <div className="header-nav-buttons">
              <Dropdown />
              <button className="header-nav-button" onClick={toggleMode}>
                {mode === "movie" ? "Explore TV" : "Explore Movies"}
              </button>
              <Link className="header-nav-button" to={"/watchlist"}>
                Watchlist
              </Link>
              <Link
                className="header-nav-button"
                to={userData ? "/profile/account-details" : "/signin"}>
                {userData ? `Hi, ${userData.firstName}` : "Sign In"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
