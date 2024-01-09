import { React, useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { userContext } from '../contexts/contexts'
import Loader from './Loader'

export default function SignIn(){
    
    const [userInfo, setUserInfo] = useState({email: '', password: ''});
    const [signInStatus, setSignInStatus] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { setUserData } = useContext(userContext);
    const { pathname } = location.state;

    // eslint-disable-next-line no-unused-vars
    function signIn(){
        /**
         * POST request to make the password not visible in the URL 
         * check the server to see if this user exists
         */
        setShowLoader(true)
        fetch(`${process.env.REACT_APP_SERVER_URL}/signIn`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            if (!data) {
                setSignInStatus('failed')
                setShowLoader(false)
            } else {
                // signed in successfully
                setUserData(data);
                sessionStorage.setItem('loggedUser', JSON.stringify(data));
                setShowLoader(false);
                if(pathname) {
                    navigate(pathname);
                } else {
                    navigate('/');
                }
            }
        })
    }

    return (
        <div className="form-box">
            <form className="form">
                <h3>Sign in with your email.</h3>
                {(signInStatus === 'failed') && <p className="signIn-failed">Incorrect username or password.</p>}
                <div className="form-container">
                        <input type="email" className="input" required placeholder="Email" onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}></input>
                        <hr className="custom-hr"/>
                        <input type="password" className="input" required placeholder="Password" onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}></input>
                        <hr className="custom-hr"/>
                </div>
                <button disabled={showLoader} onClick={(e) => {
                    e.preventDefault()
                    signIn()
                    }}>Sign in</button>
            </form>
            {showLoader && <Loader />}
            <p className="form-account-msg">Don't have an account? <Link to={'/signup'} state={{ pathname }}>Sign up</Link></p>
    </div>
    );
}