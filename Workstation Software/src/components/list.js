import React from 'react';
import './list.css';
import Information from './infoArduino';
import Tree from 'react-animated-tree'

const treeStyles = {
  fill: '#BC3D23',
}

class ListArduino extends React.Component{
  constructor(props){
    super(props)
    this.handleInfoReturn = this.handleInfoReturn.bind(this)
    this.buildList = this.buildList.bind(this)
    this.state ={ 
      display : null,
      Data:[] ,
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

  buildList(node, key='list') {
    return (
      <Tree 
        style={treeStyles} 
        key={key} 
        open 
        content={node.name}
        canHide 
        visible
        onClick={() => this.setState({display: node.microcontroller})}
      > 
        { node.children.map((child, i) => this.buildList(child, `${key} ${i}`))}
      </Tree>
    )
  }
  
  render() {
  return (
    <div className='list-view'>
      <section ></section>
      <h1>System View - Configuration List</h1>
      <div className='list-content'>
        {
          this.state.Data.length > 0 &&
          <div>{this.buildList(this.state.Data[0])}</div>
        }
      </div>
      {
        this.state.display !== null &&
        <Information display = {this.state.display} handleInfoReturn = {this.handleInfoReturn}></Information>
      }
    </div>
  )}
}

export default ListArduino;


   
    

  
