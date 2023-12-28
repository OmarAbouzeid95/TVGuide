
function Loader({style}) {
    return ( 
        <div>
            <div className="loaderWrapper" style={style}>
                <div className="spinner">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
}

export default Loader;
