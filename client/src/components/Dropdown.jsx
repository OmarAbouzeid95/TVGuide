import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { useContext } from "react";
import { modeContext } from "../contexts/contexts";

// const Dropdown = () => {

// const { mode } = useContext(modeContext);
//   return (
//     <div>
//         <div className="sec-center">
//             <input className="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
//             <label className="for-dropdown" htmlFor="dropdown">Browse<FontAwesomeIcon icon={faChevronDown} className="uil"/></label>
//             <div className="section-dropdown">
// <Link className=" " to={`/popular/${mode}`}>Popular</Link>
// <Link className=" " to={`/top-rated/${mode}`}>Top Rated</Link>
// {(mode === 'movie') && <Link className=" " to={`/upcoming/${mode}`}>Upcoming</Link>}
// <Link className=" " to={'/trending'}>Trending</Link>
//             </div>
//         </div>
//     </div>
//   );
// }

// export default Dropdown;

import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { mode } = useContext(modeContext);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}>
        Browse
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{ marginLeft: "0.25em" }}
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem onClick={handleClose}>
          <Link className=" " to={`/popular/${mode}`}>
            Popular
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link className=" " to={`/top-rated/${mode}`}>
            Top Rated
          </Link>
        </MenuItem>
        {mode === "movie" && (
          <MenuItem onClick={handleClose}>
            {" "}
            <Link className=" " to={`/upcoming/${mode}`}>
              Upcoming
            </Link>
          </MenuItem>
        )}
        <MenuItem onClick={handleClose}>
          <Link className=" " to={"/trending"}>
            Trending
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
