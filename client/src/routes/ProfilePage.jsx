import { Outlet } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faShieldHalved, faComment, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { userContext } from '../contexts/contexts';

import { deleteUser } from '../functions/userFunctions';
import { toast } from 'react-toastify';



const ProfilePage = () => {

    const { userData, setUserData } = useContext(userContext);
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
        } else {
            toast.error('Something went wrong!', toastOptions);
        }
    };

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
                <h2>{userData?.firstName} {userData?.lastName}</h2>
                <Link className="profile-link" to={'/profile/account-details'}><FontAwesomeIcon icon={faUser} className="profile-link-icon"/>Account Details</Link>
                <Link className="profile-link" to={'/profile/privacy'}><FontAwesomeIcon icon={faShieldHalved} className="profile-link-icon"/>Privacy Policy</Link>
                <Link className="profile-link" to={'/profile/user-reviews'}><FontAwesomeIcon icon={faComment} className="profile-link-icon"/>Your Reviews</Link>
                <button className="profile-link" onClick={handleDelete}><FontAwesomeIcon icon={faTrash} className="profile-link-icon"/>Delete Account</button>
                <button className="profile-link" onClick={() => handleSignOut('Signed Out')}><FontAwesomeIcon icon={faRightFromBracket} className="profile-link-icon"/>Sign Out</button>
            </div>
            <Outlet />
        </div>
    );
}

export default ProfilePage;