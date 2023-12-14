import React from "react"
import hamburgerIcon from "../media/hamburger-icon.png"
import closeIcon from "../media/close-icon.png"
import magnifyingGlass from "../media/magnifying-glass-solid.svg"
import logo from "../media/logo.png"

import { useContext, useState, useEffect } from 'react';
import { modeContext, userContext } from "../contexts/contexts";
import { Link } from "react-router-dom";

export default function Header(props){

    const [text, setText] = useState("")
    const [width, setWidth] = useState(window.innerWidth)
    const [headerData, setHeaderData] = useState(null)
    const [navShow, setNavShow] = useState(false)
    // contexts
    const { mode, setMode } = useContext(modeContext);
    const { userData } = useContext(userContext);

    // toggles mode between movie / tv
    const toggleMode = () => {
        setMode((mode === 'movie') ? 'tv' : 'movie');
    }

    useEffect(()=> {

        function toggleNavShow(){
            setNavShow(prevNavShow => !prevNavShow)
        }
        window.addEventListener("resize", ()=>{
            setWidth(window.innerWidth)})
        if(width < 700){
            setHeaderData(<div className="mobile-nav-icon">
            <div className="hamburger-icon"><img  src={hamburgerIcon} alt="hamburger-icon" onClick = {toggleNavShow}></img></div>
            <div className = {`mobile-nav ${navShow ? "mobile-nav-show" : "mobile-nav-hide"}`}>
                <button className="mobile-nav-btn" onClick = {()=> {
                    props.updateCurrentPage('popular')
                    toggleNavShow()
                }}>Popular</button>
                <button className="mobile-nav-btn" onClick = {()=> {
                    props.updateCurrentPage('topRated')
                    toggleNavShow()
                }}>Top Rated</button>
                {(mode === 'movie') && <button className="mobile-nav-btn" onClick = {()=> {
                    props.updateCurrentPage('upcoming')
                    toggleNavShow()
                }}>Upcoming</button>}
                {(mode === 'tv') && <button className="mobile-nav-btn" onClick = {()=> {
                    props.updateCurrentPage('trending')
                    toggleNavShow()
                }}>Trending</button>}
                <button className="mobile-nav-btn" onClick = {()=> {
                    toggleMode()
                    props.updateCurrentPage('homepage')
                    toggleNavShow()
                }}>{mode === 'movie' ? "TV" : "Movies"}</button>
            <button className="mobile-nav-btn" onClick={() => {
                (userData === null) ? props.updateCurrentPage('signIn') : props.updateCurrentPage('profile')
                toggleNavShow()
            }}>{(userData) ? `Hi, ${userData.firstName}` : "Sign in"}</button>
            </div>
        </div>)
        }else {
            setHeaderData(null)
        }
    },[width, navShow, props, text])

    

    return (
        <div className ="header-container">
            <div className="header-nav">
                <div className="main-logo" onClick = {() => props.updateCurrentPage('homepage')}>
                    <img className="logo-img" src={logo} alt="website logo"></img>
                    <h2>TV Guide</h2>
                </div>
                <div className="header-nav-buttons">
                    <Link className="header-nav-button" to={`${mode}/popular`}>Popular</Link>
                    <Link className="header-nav-button" to={`${mode}/top-rated`}>Top Rated</Link>
                    {(mode === 'movie')} && <Link className="header-nav-button" to={`${mode}/upcoming`}>Upcoming</Link>
                    {(mode === 'tv')} && <Link className="header-nav-button" to={`${mode}/trending`}>Trending</Link>
                    <button className="header-nav-button" onClick = {()=> {
                        toggleMode()
                        props.updateCurrentPage('homepage')
                    }}>{mode === 'movie' ? "TV" : "Movies"}</button>
                    <button className="header-nav-button" onClick={() => {(userData === null) ? props.updateCurrentPage('signIn') : props.updateCurrentPage('profile')}}>
                        {(userData) ? `Hi, ${userData.firstName}` : "Sign in"}
                    </button>
                </div>
                {headerData}
            </div>
            <div className="header-search-container">
                <div className="header-searchbar-container">
                    <input className="header-search-bar" type="text" onChange={(e) => setText(e.target.value)} value={text}
                        onKeyDown={(e) => { if(e.key === 'Enter'){
                            // searchMovies(text, mode) 
                            if (e.repeat)
                                return
                        }}}/>
                    <div className="searchbar-icons">
                        {text !== "" && <img className="clear-icon" src={closeIcon} alt="clear icon" onClick={() => setText("")}></img>}
                        <Link to={`search/${mode}/${text}`}><img className="search-icon" src={magnifyingGlass} alt="search icon"/></Link>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}