import { useState, useContext } from 'react';
import { userContext } from '../contexts/contexts';


const AccountDetails = () => {

    const [ showModal, setShowModal ] = useState(false);
    const { userData, setUserData } = useContext(userContext);

    return (
        <div className="profile-outlet">
            <div className="profile-outlet-content">
                <h3>Account Details</h3>
                <form>
                    <div className="input-container">
                        <label htmlFor="firstName">First Name</label>
                        <div className="input-wrapper">
                            <input type="text" value={userData?.firstName} disabled={true} id="firstName" />
                            <button className="account-details-edit">Edit</button>
                        </div>
                    </div>
                    <div className="input-container">
                        <label htmlFor="lastName">Last Name</label>
                        <div className="input-wrapper">
                            <input type="text" value={userData?.lastName} disabled={true} id="lastName" />
                            <button className="account-details-edit">Edit</button>
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
                            <button className="account-details-edit">Edit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AccountDetails;