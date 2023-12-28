import { Link } from "react-router-dom";
import { useContext } from "react";
import { modeContext, userContext } from "../contexts/contexts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {

    const { mode } = useContext(modeContext); 
    const { userData } = useContext(userContext);

    return (
        <div className="footer-wrapper">
            <div className="footer-links-wrapper">
                <div>
                    <h3 className="footer-list-title">Explore</h3>
                    <ul> 
                        <li className="footer-link"><Link to={`/popular/${mode}`} >Popular</Link></li>
                        <li className="footer-link"><Link to={`/top-rated/${mode}`} >Top Rated</Link></li>
                        <li className="footer-link"><Link to={`/upcoming/movie`} >Upcoming</Link></li>
                        <li className="footer-link"><Link to={'/trending'} >Trending</Link></li>
                        <li className="footer-link"><Link to={userData ? '/profile' : '/signin'}>{userData ? `Hi, ${userData.firstName}` : 'Sign In'}</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-list-title">Company</h3>
                    <ul> 
                        <li className="footer-link"><Link to={`#`} >About</Link></li>
                        <li className="footer-link"><Link to={`#`} >Contact</Link></li>
                        <li className="footer-link"><Link to={`#`} >Careers</Link></li>
                        <li className="footer-link"><Link to={`#`} >Help Center</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="footer-list-title">Follow us</h3>
                    <ul className="social-links"> 
                        <li><Link className="footer-link" to={`https://www.instagram.com/omaradharn/`} target="_blank"><FontAwesomeIcon icon={faInstagram} size={'xl'}/></Link></li>
                        <li><Link className="footer-link" to={`https://www.linkedin.com/in/omarabouzeidali/`} target="_blank"><FontAwesomeIcon icon={faLinkedinIn} size={'xl'}/></Link></li>
                        <li><Link className="footer-link" to={`https://github.com/OmarAbouzeid95/TVGuide`} target="_blank"><FontAwesomeIcon icon={faGithub} size={'xl'}/></Link></li>
                    </ul>
                </div>
            </div>
            <p className="copy-right">© 2023 Tv Guide. All rights reserved</p>
        </div>  
    );
}

export default Footer;

