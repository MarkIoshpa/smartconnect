import React from 'react';
import './Navigation.css';
import logo from './logo.PNG';




function Nav() {
  return (
    <div className="navbar">
    <img src={logo} alt="Smart connect" height="30" width="50"></img>
    <div className="subnav">
      <button className="subnavbtn">System View</button>
      <div className="subnav-content">
        <a href="#company">Tree</a>
        <a href="#eam">List</a>
      </div>
    </div>
    <a href="./statistics.js">Statistics</a>
    <a href="#contact">History</a>
  </div>
  
  )
}

export default Nav;