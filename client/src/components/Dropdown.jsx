import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { modeContext } from '../contexts/contexts';

const Dropdown = () => {

  const { mode } = useContext(modeContext);   
  return (
    <div>
        <div className="sec-center"> 	
            <input className="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
            <label className="for-dropdown" htmlFor="dropdown">Browse<FontAwesomeIcon icon={faChevronDown} className="uil"/></label>
            <div className="section-dropdown"> 
                <Link className="dropdown-link" to={`/popular/${mode}`}>Popular</Link>
                <Link className="dropdown-link" to={`/top-rated/${mode}`}>Top Rated</Link>
                {(mode === 'movie') && <Link className="dropdown-link" to={`/upcoming/${mode}`}>Upcoming</Link>}
                <Link className="dropdown-link" to={'/trending'}>Trending</Link>
            </div>
        </div>
    </div>
  );
}

export default Dropdown;