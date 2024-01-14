
const Modal = ({title,
    onClose,
    onSubmit,
    modalMessage,
    cancelMessage,
    submitMessage,
    component
}) => {

    return (
        <div className="modal-wrapper">
            <div className="modal-content-wrapper">
                <div className="modal-content">
                    <h2 className="modal-title">{title}</h2>
                    <h4 className="modal-message">{modalMessage}</h4>
                    {component}
                    <div className="modal-btns-wrapper">
                        <button className="modal-btn modal-submit-btn" onClick={onSubmit}>
                            {submitMessage}
                        </button>
                        <button className="modal-btn modal-cancel-btn" onClick={onClose} style={{backgroundColor: '#f44336'}}>
                            {cancelMessage}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Modal;