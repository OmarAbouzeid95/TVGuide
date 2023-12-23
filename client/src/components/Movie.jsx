import React from "react"
import moreInfo from "../media/more-info.png"
import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { modeContext } from "../contexts/contexts";

export default function Movie(props){
    const [style, setStyle] = React.useState("hide");
    const [imgStyle, setImgStyle] = React.useState("");
    const [windowSize, setWindowSize] = React.useState(window.innerWidth);
    const { mode } = useContext(modeContext);
    const navigate = useNavigate();

    window.addEventListener("resize", () => {
        setWindowSize(window.innerWidth)
    })

    let title = ''
    if (props.title.length > 22){
        title = props.title.substr(0,19) + '...'
    }
    else {
        title = props.title
    }
    return (
        <div className = "movie-container" onClick = {() => navigate(`/show-details/${mode}/${props.title}/${props.id}`, {
            state: {
                title: props.title,
                poster: props.poster,
                description: props.description,
                id: props.id,
                genres: props.genres,
                rating: props.rating,
                date: props.date
            }
        })} 
            onMouseEnter={() => {
                setImgStyle("hovered")
                setStyle("show-more-details")
            }} 
            onMouseLeave = {() => {
                setImgStyle("")
                setStyle("hide")
            }}>
            <div className="poster-container">
                <img className={`movie-poster ${imgStyle}`} src={props.poster} alt="movie poster"></img>
            </div>
            <h4 className="movie-title">{title}</h4>
            {windowSize > 500 && <img className={style} src={moreInfo} alt="more information"></img>}
        </div>
    )
}