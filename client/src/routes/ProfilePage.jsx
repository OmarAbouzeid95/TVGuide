import { Outlet } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faShieldHalved, faComment, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { userContext } from '../contexts/contexts';

import { deleteUser } from '../functions/userFunctions';
import { toast } from 'react-toastify';

import Modal from '../components/Modal';



const ProfilePage = () => {

    const { userData, setUserData } = useContext(userContext);
    const [ showModal, setShowModal ] = useState(false);
    const navigate = useNavigate();

    const toastOptions = {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        theme: 'dark'
    };
    
    const handleDelete = async () => {
        const deletedUser = await deleteUser(userData?.email);
        if(deletedUser?.deletedCount > 0) {
            handleSignOut('Account deleted');
        } else if(deletedUser?.denied) {
            toast.error('Can\'t delete an admin account', toastOptions);
            setShowModal(false);
        } 
        else {
            toast.error('Something went wrong!', toastOptions);
        }
    };

    const onCloseModal = () => setShowModal(false);

    const handleSignOut = (message) => {
        setUserData(null);
        sessionStorage.setItem('loggedUser', null);
        navigate('/');
        toast.success(message, {
            ...toastOptions,
            autoClose: 1500
        });
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-links-wrapper">
                {showModal && <Modal 
                    onClose={onCloseModal}
                    onSubmit={handleDelete}
                    submitMessage={'Delete'}
                    cancelMessage={'Cancel'}
                    title={'Account deletion confirmation'}
                    modalMessage={'Are you sure you want to permanently delete your account?'}
                />}
                <h2 className="profile-links-header">{userData?.firstName} {userData?.lastName}</h2>
                <Link className="profile-link" to={'/profile/account-details'}><FontAwesomeIcon icon={faUser} className="profile-link-icon"/>Account Details</Link>
                <Link className="profile-link" to={'/profile/privacy'}><FontAwesomeIcon icon={faShieldHalved} className="profile-link-icon"/>Privacy Policy</Link>
                <Link className="profile-link" to={'/profile/user-reviews'}><FontAwesomeIcon icon={faComment} className="profile-link-icon"/>Your Reviews</Link>
                <button className="profile-link-btn" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faTrash} className="profile-link-icon"/>Delete Account</button>
                <button className="profile-link-btn" onClick={() => handleSignOut('Signed Out')}><FontAwesomeIcon icon={faRightFromBracket} className="profile-link-icon"/>Sign Out</button>
            </div>
            <Outlet />
        </div>
    );
}

export default ProfilePage;