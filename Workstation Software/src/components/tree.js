import React from 'react';
import './tree.css';
import Tree, { withStyles } from 'react-vertical-tree'
import Information from './infoArduino';

const styles = {
  lines: {
    color: '#BC3D23',
    height: '75px',
  },
  node: {
    backgroundColor: '#6CB4C3',
  },
  text: {
    color: '#F0F0F0'
  }
}

const StyledTree = withStyles(styles)(Tree)

class TreeArduino extends React.Component{
  constructor(props){
    super(props)
    this.handleInfoReturn = this.handleInfoReturn.bind(this)
    this.state ={ 
      display : null,
      Data: []
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.Data) {
      return {
        Data: props.data,
      };
    }
    return null;
  }

  handleInfoReturn() {
    this.setState({display: null})
  }
  
  render() {
  return (
    <div className='system-view'>
      <section ></section>
      <h1>System View - Configuration Tree</h1>
      <div className='config-tree'>
        <StyledTree data={this.state.Data} direction
        onClick={ item => this.setState({display: item.microcontroller})}
        />
      </div>
      {
        this.state.display !== null &&
        <Information display = {this.state.display} handleInfoReturn = {this.handleInfoReturn}></Information>
      }
    </div>
  )}
}

export default TreeArduino;


   
    

  
