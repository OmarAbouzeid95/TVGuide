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
                <Link className="mobile-nav-btn" to={`/popular/${mode}`} onClick={toggleNavShow}>Popular</Link>
                <Link className="mobile-nav-btn" to={`/top-rated/${mode}`} onClick={toggleNavShow}>Top Rated</Link>
                {(mode === 'movie') && <Link className="mobile-nav-btn" to={`/upcoming/${mode}`} onClick={toggleNavShow}>Upcoming</Link>}
                <Link className="mobile-nav-btn" to={'/trending'} onClick={toggleNavShow}>Trending</Link>
                <Link className="mobile-nav-btn" to={userData ? '/profile' : '/signin'} onClick={toggleNavShow}>{userData ? `Hi, ${userData.firstName}` : 'Sign In'}</Link>
                <button className="mobile-nav-btn" onClick = {()=> {
                    toggleMode()
                    toggleNavShow()
                }}>{mode === 'movie' ? "Explore TV" : "Explore Movies"}</button>
            </div>
        </div>)
        }else {
            setHeaderData(null)
        }
    },[width, navShow, props, text]);

    

    return (
        <div className ="header-container">
            <div className="header-nav">
                <div className="main-logo" onClick = {() => props.updateCurrentPage('homepage')}>
                    <img className="logo-img" src={logo} alt="website logo"></img>
                    <h2>TV Guide</h2>
                </div>
                <div className="header-nav-buttons">
                    <Link className="header-nav-button" to={`/popular/${mode}`}>Popular</Link>
                    <Link className="header-nav-button" to={`/top-rated/${mode}`}>Top Rated</Link>
                    {(mode === 'movie') && <Link className="header-nav-button" to={`/upcoming/${mode}`}>Upcoming</Link>}
                    <Link className="header-nav-button" to={'/trending'}>Trending</Link>
                    <button className="header-nav-button" onClick = {toggleMode}>{mode === 'movie' ? "Explore TV" : "Explore Movies"}</button>
                    <Link className="header-nav-button" to={userData ? '/profile' : '/signin'}>{userData ? `Hi, ${userData.firstName}` : 'Sign In'}</Link>
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