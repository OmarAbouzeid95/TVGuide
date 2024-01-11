import { useState, useContext } from 'react'
import Loader from './Loader'
import { userContext } from '../contexts/contexts'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function SignUp(props){
    
    const [userInfo, setUserInfo] = useState({firstName: '', lastName: '', email: '', password: '', repassword: ''});
    const [signUpStatus, setSignUpStatus] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const { setUserData } = useContext(userContext);
    const navigate = useNavigate();
    const location = useLocation();

    const pathname = location?.state?.pathname;

    function signUp(){
        /**
         * some validations for the signup
         */
        setShowLoader(true)
        const isAlpha = str => /^[a-zA-Z]*$/.test(str);
        const isPassword = str => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(str)
        if (!isAlpha(userInfo.firstName) || userInfo.firstName.trim(' ') === ''){
            setSignUpStatus('Enter a valid First name')
            setShowLoader(false)
        }else if(!isAlpha(userInfo.lastName) || userInfo.lastName.trim(' ') === ''){
            setSignUpStatus('Enter a valid last name')  
            setShowLoader(false)
        }else if(userInfo.email.indexOf('@') === -1 || userInfo.email.indexOf('.') === -1){
            setSignUpStatus('Enter a valid email address')
            setShowLoader(false)
        }
        else if(!isPassword(userInfo.password)){
            setSignUpStatus(<span className="pw-rules">Password needs to match these rules: <br></br>
                           - Minimum eight characters <br></br>
                           - At least one uppercase letter <br></br>
                           - At least one lowercase letter <br></br>
                           - One number <br></br>
                           - One special character</span>)  
            setShowLoader(false)           
        }else if(userInfo.password !== userInfo.repassword){
            setSignUpStatus("Passwords don't match")
            setShowLoader(false)
        }else {
            /**
             * Check if email already exists in the DB
             */
            fetch(`${process.env.REACT_APP_SERVER_URL}/user/${userInfo.email}`)
            .then(res => res.json())
            .then(data => {
                if (data === null){
                    /**
                     * Create new user by POST request
                     */
                    const { firstName, lastName, email, password } = userInfo;
                    fetch(`${process.env.REACT_APP_SERVER_URL}/signUp`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ firstName, lastName, email, password })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.result === "success"){
                            setUserData(data.user);
                            setShowLoader(false);
                            if(pathname) {
                                navigate(pathname);
                            } else {
                                navigate('/');
                            }
                        }else {
                            setSignUpStatus('Failed to sign up.')
                            setShowLoader(false)
                        }
                    })
                }
                else {
                    setSignUpStatus('This email is already in use.')
                    setShowLoader(false)
                }
            })
            
        }
    }

    return (
        <div className="form-box">
            <form className="form">
                <h3>Create a free account with your email.</h3>
                {(signUpStatus !== 'failed') && <p className="signUp-failed">{signUpStatus}</p>}
                <div className="form-container">
                        <input type="text" className="input" required placeholder="First Name" onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}></input>
                        <hr className="custom-hr"/>
                        <input type="text" className="input" required placeholder="Last Name" onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}></input>
                        <hr className="custom-hr"/>
                        <input type="email" className="input" required placeholder="Email" onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}></input>
                        <hr className="custom-hr"/>
                        <input type="password" className="input" required placeholder="Password" onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}></input>
                        <hr className="custom-hr"/>
                        <input type="password" className="input" required placeholder="Re-enter Password" onChange={(e) => setUserInfo({...userInfo, repassword: e.target.value})}></input>
                        <hr className="custom-hr"/>
                </div>
                <button disabled={showLoader} onClick={(e) => {
                    e.preventDefault()
                    signUp()
                    }}>Sign up</button>
            </form>
            {showLoader && <Loader />}
            <p className="form-account-msg">Already have an account? <Link to={'/signin'}>Sign in</Link></p>
            
        </div> 
            )
        }
            
    
