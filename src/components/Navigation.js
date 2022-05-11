import {  useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { IconButton, Badge } from '@material-ui/core';
import "../styles/Navigation.scss";
import { Link, useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/icon.png";
import profileIcon from "../assets/profileIcon.png";
import toggleIcon from "../assets/toggleIcon.png";
import { useAuthContext } from '../contexts/AuthContext'
import { ShoppingCart } from '@material-ui/icons';
import MobileNavigation from "./MobileNavigation";


function Navigation({totalItems}) {
  const { logout, currentUser } = useAuthContext()
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const signout = async () => {
    await logout()
    navigate("/")
  }


  return (
      <> 
   <nav  className={
    offsetY > 10 ? "visible customNav fixed-top" : "customNav fixed-top"
  }> 

  <div className="leftNav"> 

      <Navbar.Brand href="/" className="navBrand">
        <img
          src={logo}
          width="60"
          height="60"
          className="d-inline-block align-top"
          alt="Logo"
        />
        
      </Navbar.Brand>

      <div className="links">
<Nav>
  <NavLink className="navigationLink" to="/kategorier"> Kategorier </NavLink>
  <NavLink className="navigationLink" to="/search"> Sök </NavLink>
  <NavLink className="navigationLink" to="/produkter"> Handla </NavLink>
</Nav>
</div>
</div>
  

      <div className="endContainer"> 

      <div className="profileContainer"> 
      <NavDropdown title={
        <div className="profileIcon">
          <img src={profileIcon} height="26" width="26" alt="profile"/>
          
        </div>
      } id="basic-nav-dropdown">
        <p className="loggedInStatus"> {currentUser ? currentUser.displayName : "Du är inte inloggad"} </p>
        <NavDropdown.Item href={currentUser ? `/profil/${currentUser.uid}` : "/login"}>Min Profil</NavDropdown.Item>
        {currentUser ? <NavDropdown.Item href="/profil/orderhistorik">Orderhistorik</NavDropdown.Item> : ""}
        
          {currentUser ? "" :  <NavDropdown.Item href="/signup">Skapa Konto</NavDropdown.Item>}
          <NavDropdown.Divider />
          {currentUser ? <NavDropdown.Item onClick={signout}>Logga ut</NavDropdown.Item> :<NavDropdown.Item href="/login">Logga In</NavDropdown.Item>}
        </NavDropdown>
         </div>

      <IconButton className="shoppingContainer" component={Link} to="/cart" aria-label="Show cart items" color="inherit">
          <Badge badgeContent={totalItems} color="secondary">
            <ShoppingCart
             />
          </Badge>
        </IconButton>
         <img className="toggleMobileLinks" src={toggleIcon} height="32px" width="32px" onClick={() => setShowDropdown(true)} alt="hamburger icon"/>
         </div>
      </nav>
      {showDropdown &&
        <MobileNavigation setShowDropdown={setShowDropdown} />
       }
       </>
  );
}

export default Navigation;
