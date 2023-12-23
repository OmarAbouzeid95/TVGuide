import '../App.css';
import {useState} from "react";
import Header from '../components/Header';
import Loader from '../components/Loader'
// import Footer from '../components/Footer';

import { modeContext, userContext, entertainmentContext } from '../contexts/contexts';
import { Outlet } from 'react-router-dom';

function Root() {

  // contexts
  const [ mode, setMode ] = useState('movie');
  const [ userData, setUserData ] = useState();
  const [ entertainmentData, setEntertainmentData ] = useState({});

  return (
    <div className= "app-container">
      <userContext.Provider value={{ userData, setUserData }}>
        <entertainmentContext.Provider value={{ entertainmentData, setEntertainmentData }}>
          <modeContext.Provider value={{ mode, setMode }}>
            <Header />
            <Outlet />
            {/* <Footer /> */}
          </modeContext.Provider>
        </entertainmentContext.Provider>
      </userContext.Provider>
    </div>
  );


}

export default Root;
