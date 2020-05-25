
import React from 'react';
import './tree.css';
import Tree from 'react-vertical-tree'
import Information from './infoArduino';
import Statistics from './statistics';
import Nav from './Navigation';

var { getAllBoardConfiguration, isReady } = window.require('./src/workstation-communication.js')

class TreeArduino extends React.Component{
  constructor(props){
    super(props)
    this.getConfiguration = this.getConfiguration.bind(this)
    this.showstatistics=this.showstatistics.bind(this)
    this.addChildren = this.addChildren.bind(this)
    this.handleInfoReturn = this.handleInfoReturn.bind(this)
    this.state ={ 
      display : null,
      loaded : false,
      Data:[] ,
    }
  }

  componentDidMount() {
    this.timer = setInterval(()=> {
      if(isReady())
      {
        this.getConfiguration()
        clearInterval(this.timer)
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  getConfiguration() {
    this.setState({loaded:false}, () => {
      getAllBoardConfiguration().then(data => {
        let tmp = []
        this.addChildren([data[0]], tmp)
        this.setState({Data: tmp, loaded: true})
      })
    })
  }

  addChildren(data, dest) {
    data.forEach(child => {
      let tmp = {}
      tmp.id = child.id
      tmp.name = child.desc
      tmp.microcontroller = child
      tmp.parent = null
      tmp.children = []

      this.addChildren(child.children, tmp.children)
      dest.push(tmp)
    })
  }

  handleInfoReturn() {
    this.setState({display: null})
  }
  showstatistics()
  {
    
  }
  
  render() {
  return (
    <div>
      {
        this.state.loaded &&
        <div>
          <button style = {{position: 'absolute', left: '50px', 'bottom' : '50px'}} onClick={this.getConfiguration}>
            Refresh
          </button>
          <Tree data={this.state.Data} direction
          onClick={ item => this.setState({display: item.microcontroller})}
          />
        </div>
      }
      {
        !this.state.loaded &&
        <h1 style = {{position: 'absolute', left: '40%', top: '20%'}}>Loading ...</h1>
      }
      {
        this.state.display !== null &&
        <Information display = {this.state.display} handleInfoReturn = {this.handleInfoReturn}></Information>
      }
    </div>
    
  )}
}

export default TreeArduino;


   
    

  
