import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/icon.png";
import closeicon from "../assets/closeicon.png";

const MobileNavigation = ({ setShowDropdown }) => {
    return (
        <div className="mobileDropdown">
            <div className="dropdownIcons">
                <img
                    src={closeicon}
                    onClick={() => setShowDropdown(false)}
                    className="closeIcon"
                    width="30"
                    height="30"
                    alt="Close"
                />

                <Link to="/">
                    <img
                        src={logo}
                        className="dropdownBrand"
                        width="40"
                        height="40"
                        alt="Logo"
                    />
                </Link>
            </div>

            <div className="dropdownLinks">
                <NavLink
                    onClick={() => setShowDropdown(false)}
                    to="/kategorier"
                >
                    Kategorier
                </NavLink>
                <NavLink onClick={() => setShowDropdown(false)} to="/search">
                    Sök
                </NavLink>
                <NavLink onClick={() => setShowDropdown(false)} to="/produkter">
                    Handla
                </NavLink>
            </div>
        </div>
    );
};

export default MobileNavigation;
