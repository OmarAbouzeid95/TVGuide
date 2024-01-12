import moreInfo from "../media/more-info.png"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { modeContext } from "../contexts/contexts";

export default function Movie(props){
    const [style, setStyle] = useState("hide");
    const [imgStyle, setImgStyle] = useState("");
    const [windowSize, setWindowSize] = useState(window.innerWidth);
    const { mode } = useContext(modeContext);
    const navigate = useNavigate();

    window.addEventListener("resize", () => {
        setWindowSize(window.innerWidth)
    })

    return (
        <div className = "movie-container" onClick = {() => 
            navigate(`/show-details/${mode}/${props.id}`)} 
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
            <h4 className="movie-title">{props.title}</h4>
            {windowSize > 500 && <img className={style} src={moreInfo} alt="more information"></img>}
        </div>
    )
}