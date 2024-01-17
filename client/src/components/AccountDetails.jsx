import { useState, useContext, useRef } from 'react';
import { userContext } from '../contexts/contexts';
import { updateUser } from '../functions/userFunctions';
import { toast } from 'react-toastify';

import Modal from './Modal';


const AccountDetails = () => {

    const [ showModal, setShowModal ] = useState(false);
    
    const modalContentRef = useRef({
        title: '',
        onSubmit: '',
        modalMessage: '',
    });
    const updateContentRef = useRef({
        property: '',
        currentValue: '',
        disableEdit: '',
    });
    const oldValueRef = useRef(null);
    const newValueRef = useRef(null);
    const [ errorMessage, setErrorMessage ] = useState();
    const { userData, setUserData } = useContext(userContext);

    const isAlpha = str => /^[a-zA-Z]*$/.test(str);
    const isPassword = str => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(str);

    const updateName = async (str, property) => {

        if(!isAlpha(str.current)) {
            setErrorMessage('Please enter a valid name');
            return;
        }else {
            const newName = str.current.charAt(0).toUpperCase() + str.current.slice(1);
            const updatedUser = await updateUser(userData.email, {[property]: newName});
            if(updatedUser.error) {
                toast.error('Something went wrong', {
                    theme: 'dark',
                    autoClose: 3000
                });
            }else {
                toast.success('Changes saved', {
                    theme: 'dark',
                    autoClose: 3000
                });
                setUserData(updatedUser);
                sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
                setShowModal(false);
                setErrorMessage('');
                return;
            }
        }
    };

    const updatePassword = async (oldPassword, newPassword) => {

        if(oldPassword.current !== userData.password) {
            setErrorMessage('Incorrect old password');
        } else if(!isPassword(newPassword.current)) {
            setErrorMessage(<div className="pw-rules">
                <div>
                    <p id="title">Password needs to match these rules: </p>
                    <p>- Minimum eight characters</p>
                    <p>- At least one uppercase letter</p>
                    <p>- At least one lowercase letter</p>
                    <p>- One number</p>
                    <p>- One special character</p>
                </div>
            </div>);
        } else {
            const updatedUser = await updateUser(userData.email, {password: newPassword.current});
            
            if(updatedUser.error) {
                toast.error('Something went wrong', {
                    theme: 'dark',
                    autoClose: 3000
                });
            }else {
                toast.success('Changes saved', {
                    theme: 'dark',
                    autoClose: 3000
                });
                setUserData(updatedUser);
                sessionStorage.setItem('loggedUser', JSON.stringify(updatedUser));
                setShowModal(false);
                setErrorMessage('');
                return;
            }
        }
    };

    const onClose = () => {
        setErrorMessage('');
        setShowModal(false);
    };

    const updateComponent = ({property, currentValue, disableEdit, errorMessage, type}) => {

        return (
            <div>
                <div className="error-message">{errorMessage}</div>
                <div className="input-container">
                    <label htmlFor={property}>Old {property}</label>
                    <div className="input-wrapper">
                        <input type={type} placeholder={currentValue} disabled={disableEdit} id={property} onChange={(e) => oldValueRef.current = e.target.value}/>
                    </div>
                </div>
                <div className="input-container">
                    <label htmlFor="new-value">New {property}</label>
                    <div className="input-wrapper">
                        <input type={type} id="new-value" onChange={(e) => newValueRef.current = e.target.value} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="profile-outlet">
            <div className="profile-outlet-content">
                {showModal && <Modal 
                    onClose={onClose}
                    onSubmit={modalContentRef.current.onSubmit}
                    title={modalContentRef.current.title}
                    modalMessage={modalContentRef.current.modalMessage}
                    component={updateComponent({...updateContentRef.current, errorMessage})}
                    submitMessage={'Save'}
                    cancelMessage={'Cancel'}
                />}
                <h3>Account Details</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="input-container">
                        <label htmlFor="firstName">First Name</label>
                        <div className="input-wrapper">
                            <input type="text" value={userData?.firstName} disabled={true} id="firstName" />
                            <button className="account-details-edit" onClick={() => {
                                modalContentRef.current = {
                                    title: 'Update Account Information',
                                    modalMessage: 'Change your first name',
                                    onSubmit: () => updateName(newValueRef, 'firstName')
                                };
                                updateContentRef.current = {
                                    property: 'First Name',
                                    currentValue: userData?.firstName,
                                    disableEdit: true,
                                    type: 'text'
                                };
                                setShowModal(true);
                            }}>Edit</button>
                        </div>
                    </div>
                    <div className="input-container">
                        <label htmlFor="lastName">Last Name</label>
                        <div className="input-wrapper">
                            <input type="text" value={userData?.lastName} disabled={true} id="lastName" />
                            <button className="account-details-edit" onClick={() => {
                                modalContentRef.current = {
                                    title: 'Update Account Information',
                                    modalMessage: 'Change your last name',
                                    onSubmit: () => updateName(newValueRef, 'lastName')
                                };
                                updateContentRef.current = {
                                    property: 'Last Name',
                                    currentValue: userData?.lastName,
                                    disableEdit: true,
                                    type: 'text'
                                };
                                setShowModal(true);
                            }}>Edit</button>
                        </div>
                    </div>
                    <div className="input-container">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrapper">
                            <input type="email" value={userData?.email} disabled={true} id="email" />
                        </div>
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <input type="password" value={userData?.password} disabled={true} id="password" />
                            <button className="account-details-edit" onClick={() => {
                                modalContentRef.current = {
                                    title: 'Update Account Information',
                                    modalMessage: 'Change your password',
                                    onSubmit: () => updatePassword(oldValueRef, newValueRef)
                                };
                                updateContentRef.current = {
                                    property: 'password',
                                    currentValue: undefined,
                                    disableEdit: false,
                                    type: 'password'
                                };
                                setShowModal(true);
                            }}>Edit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AccountDetails;