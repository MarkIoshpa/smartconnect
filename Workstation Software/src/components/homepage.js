import React from 'react';
import image from '../assets/homepage.png';
import consts from '../consts';
import './homepage.css';

class Homepage extends React.Component {
  render() {
    return (
      <div style={{backgroundImage: "url(" + image + ")"}} className="homepage">
          <section ></section>
          <h1>Smart Connect</h1>
          <div>
            <button onClick={() => this.props.handleChangePage(consts.PAGE_SYSTEM_VIEW_TREE)}>View Microcontrollers</button>
          </div>
      </div>
    )
  }
}

export default Homepage;