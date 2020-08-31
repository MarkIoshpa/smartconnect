import React from 'react';
import './tree.css';
import Tree, { withStyles } from 'react-vertical-tree'
import Information from './infoArduino';
import { configVariables } from "../configVariables"

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
    this.getTime= this.getTime.bind(this)
    this.scanTree= this.scanTree.bind(this)
    this.handleInfoReturn = this.handleInfoReturn.bind(this)
    this.findMinTime= this.findMinTime.bind(this)
    this.checkload= this.checkload.bind(this)
    this.state ={ 
      display : null,
      Data: [],
      loadTimes: {},
      minTime : 1000000,
      newNode :'null',
      NodeLoad:'null'
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => {
        if(this.state.Data.length>0)
          this.scanTree(this.state.Data[0])
      },
      10000
    );
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.Data) {
      return {
        Data: props.data,
        loadTimes : props.loadTimes

      };
    }
    return null;
  }

  handleInfoReturn() {
    this.setState({display: null})
  }

  getTime(item){
    if(item!=null)
    {
      item.microcontroller.getSensorData().then(data => {
        
        this.setState(prevState => ({
          loadTimes: {
            ...prevState.loadTimes,
            [item.id]: data.time
          }
        }))
      })
      item.children.forEach(child=>{this.getTime(child)})
    }
  }

  scanTree(node){
    if(this.state.loadTimes[node.id]/configVariables.maxLoadTime>configVariables.acceptableLoad)
    {
      this.setState({NodeLoad:node.name})
      this.checkload(node)
    } 
    node.children.map(child => this.scanTree(child))
  }

  findMinTime(node){
    var timeNow =this.state.loadTimes[node.id]
    if(node.name!=this.state.newNode&&timeNow<this.state.minTime&&this.state.loadTimes[node.id]/configVariables.maxLoadTime<configVariables.acceptableLoad)
      {
        this.setState({minTime:this.state.loadTimes[node.id]})
        this.setState({newNode:node.name})
      }
    
    node.children.map(child => this.findMinTime(child))
    return(
      this.state.newNode
    )
  }

  checkload(node){
    this.findMinTime(node)
    if(this.state.newNode!='null') 
      alert("Load is above acceptable threshold in "+this.state.NodeLoad+".\nIt is recommended to reduce its load by changing some of its devices to "+this.state.newNode)
    if(this.state.newNode=='null'&&!this.state.NodeLoad=='null')
      alert("It is recommended to add a new board to system to reduce load.")
  }
  
  render() {
  return (
    <div className='system-view'>
      <section ></section>
      <h1>System View - Configuration Tree</h1>
      <div className='config-tree'>
        <StyledTree data={this.state.Data} direction
        onClick={ item =>  this.setState({display: item.microcontroller})}
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
