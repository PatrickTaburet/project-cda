import React from 'react';
import { useState } from 'react';
import styles from "/assets/styles/Navbar.module.css?module";
import MyButton from './MyButton';
import Modale from './Modale'
import modStyles from "/assets/styles/Modale.module.css?module";



export default function ({props}) {

  // adding the states 
  const [isActive, setIsActive] = useState(false);
  //add the active class
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };
  //clean up function to remove the active class
  const removeActive = () => {
    setIsActive(false)
  }
   

  // Modale functions 

    const [ModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!ModalOpen);
    }
    
    const handleButtonClick = () => {
      setModalOpen(!ModalOpen);
    }
  // Display buttons depend on the login status
    
    const loginButtons = props.user ? (<div className={`${styles.rightSide}`}>
    <MyButton to="logout">Log out</MyButton>
    <MyButton handleClick={()=> toggleModal()} >Profile</MyButton>
    </div>) : 
    ( <div className={`${styles.rightSide}`}>
    <MyButton to="login">Login</MyButton>
    <MyButton to="register">Sign in</MyButton>
    </div>);

    return (
      <div className="App">
        <header className="App-header">
          <nav className={`${styles.navbar}`}>
            <div className={`${styles.leftSide}`}>
              {/* logo */}
              <a href='home' className={`${styles.logo}`}>LOGO</a>
              <ul className={`${styles.navMenu} ${isActive ? styles.active : ''}`}>
                <li onClick={removeActive}>
                  <a href='#home' className={`${styles.navLink}`}>Gallery</a>
                </li>
                <li onClick={removeActive}>
                  <a href='#home' className={`${styles.navLink}`}>Create</a>
                </li>
                <li onClick={removeActive}>
                  <a href='#home' className={`${styles.navLink}`}>Community</a>
                </li>
              </ul>
            </div>
            {/* Navbar buttons, different depending on the roles & user adress, link  to profile modale  */}
              {loginButtons}
            <div className={`${styles.hamburger} ${isActive ? styles.active : ''}`}  onClick={toggleActiveClass}>
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
              <span className={`${styles.bar}`}></span>
            </div>
          </nav>
        </header>

        {/* Profile Modale */}

        {ModalOpen && <Modale  //Display the modale  if ModaleOpen = true
          username = {props.username}
          email = {props.email}
          role = {props.role}
          userImg= {props.userImg}
          onClose = {handleButtonClick}
        >
            <div className={`${modStyles.modaleImgBox}`}>
                <img src={props.userImg} alt={props.username} className={`${modStyles.modaleImg}`}/>
            </div>
            <hr />
            <div className={`${modStyles.modaleRow}`}>
                Pseudo : {props.username}
            </div>
            <hr />
            <div className={`${modStyles.modaleRow}`}>
                Email : {props.email}
            </div> 
            <hr />
            <div className={`${modStyles.modaleRow}`}>
                Role : {props.role}
            </div>
            <hr />
            <div className={`${modStyles.modaleRow}`}>
                <MyButton myStyle="marginButton" to="">Edit Profile</MyButton>
                <MyButton myStyle="marginButton" to="">My Artworks</MyButton>
            </div>
            <div className={`${modStyles.modaleRowButtons}`}>
                <MyButton myStyle="whiteButton" to="">Ask for Artist Role</MyButton>
                <MyButton myStyle="whiteButton" to="">Artist Dashboard</MyButton>
            </div>
        </Modale>}
      </div>
    );
  }

  