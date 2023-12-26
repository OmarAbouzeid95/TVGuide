import { React, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../contexts/contexts'
import Loader from './Loader'

export default function SignIn(){
    
    const [userInfo, setUserInfo] = useState({email: '', password: ''});
    const [signInStatus, setSignInStatus] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const navigation = useNavigate();

    const { setUserData } = useContext(userContext);

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
                setUserData(data)
                setShowLoader(false)
                setTimeout(() => {
                    navigation('/')
                }, 2000)
                setSignInStatus('success')
            }
        })
    }

    return (
        <div className="form-box">
            {showLoader && <Loader />}
            <form className="form">
                <p>Sign in with your email.</p>
                {((signInStatus !== '') && (signInStatus !== 'success')) && <p className="signIn-failed">Incorrect username or password.</p>}
                {(signInStatus === 'success') && <p className="signIn-successful">Successfully Signed in!</p>}
                <div className="form-container">
                        <input type="email" className="input" required placeholder="Email" onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}></input>
                        <hr className="custom-hr"/>
                        <input type="password" className="input" required placeholder="Password" onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}></input>
                        <hr className="custom-hr"/>
                </div>
                <button onClick={(e) => {
                    e.preventDefault()
                    signIn()
                    }}>Sign in</button>
            </form>
                <p className="form-account-msg">Don't have an account? <Link to={'/signup'}>Sign up</Link></p>
    </div>
    )
}