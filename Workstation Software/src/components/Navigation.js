import React from 'react';
import './Navigation.css';
import logo from '../assets/logo.png';
import close from '../assets/close-window.png';
import minimize from '../assets/minimize-window.png';
import maximize from '../assets/maximize-window.png';
import consts from '../consts';
const { BrowserWindow } = window.require('electron').remote;
var maximized = false;

class Nav extends React.Component {
  render() {
    return (
      <div className="navbar">
        <div className="draggable"></div>
        <div className="menu">
          <div className="logo">
            <img onClick={() => this.props.handleChangePage(consts.PAGE_HOMEPAGE)} src={logo} alt="Smart connect" height="45" width="45"></img>
            <h1 onClick={() => this.props.handleChangePage(consts.PAGE_HOMEPAGE)}>Smart Connect</h1>
          </div>
          <div className="dropdown">
            <button className="dropbtn">System View</button>
            <ul className="dropdown-content">
              <li onClick={() => this.props.handleChangePage(consts.PAGE_SYSTEM_VIEW_TREE)}>Tree</li>
              <li onClick={() => this.props.handleChangePage(consts.PAGE_SYSTEM_VIEW_LIST)}>List</li>
            </ul>
          </div> 

          <button onClick={() => this.props.handleChangePage(consts.PAGE_HISTORY)}>History</button>
          <button onClick={() => this.props.handleChangePage(consts.PAGE_PLANNER)}>Planner</button>
          <button onClick={() => this.props.handleChangePage(consts.PAGE_SETTINGS)}>Settings</button>
        </div>

        <div className="window-nav">
          <button id="close-btn" onClick={() => BrowserWindow.getFocusedWindow().close()} style={{backgroundImage: "url(" + close + ")"}}/>
          <button id="max-btn" 
            onClick={() => {
              if(maximized) {
                BrowserWindow.getFocusedWindow().unmaximize()
                maximized = false
              }
              else {
                BrowserWindow.getFocusedWindow().maximize()
                maximized = true
              }
            }} 
            style={{backgroundImage: "url(" + maximize + ")"}}/>
          <button id="min-btn" onClick={() => BrowserWindow.getFocusedWindow().minimize()} style={{backgroundImage: "url(" + minimize + ")"}}/>
        </div>
      </div>
    )
  }
}

export default Nav;