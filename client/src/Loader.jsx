
function Loader({message}) {
    return ( 
        <div className="popupContainer">
            <div className="loaderWrapper">
                <div className="spinner">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <p>{message}</p>
        </div>
    );
}

export default Loader;
