
import React from 'react';
import './tree.css';
import Information from './infoArduino';
import Nav from './Navigation';
import Tree from 'react-animated-tree'

var { getAllBoardConfiguration, isReady } = window.require('./src/workstation-communication.js')

class ListSta extends React.Component{
  constructor(props){
    super(props)
    this.getTime= this.getTime.bind(this)
    this.getcolors= this.getcolors.bind(this)
    this.getConfiguration = this.getConfiguration.bind(this)
    this.addChildren = this.addChildren.bind(this)
    this.handleInfoReturn = this.handleInfoReturn.bind(this)
    this.buildList = this.buildList.bind(this)
    this.state ={ 
      display : null,
      loaded : false,
      Data:[] ,
      loadTimes: {}
    }
  }

  componentDidMount() {
    setInterval(()=>{
      this.getConfiguration()
      this.getTime(this.state.Data[0])
    },20000)
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

  buildList(node) {
    return ( 
    <Tree  style={this.getcolors(node)} open content={node.name}>
         {node.children.map(child => this.buildList(child))}</Tree>
    )}

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
        else
          console.log('try')
      }

      getcolors(node){
          {console.log(this.state.loadTimes[node.id])}
          if(this.state.loadTimes[node.id]!=null&&(this.state.loadTimes[node.id]/200<0.51))
          return {color:'green'}
          if((this.state.loadTimes[node.id]/200>0.51) &&(this.state.loadTimes[node.id]/200<0.76) )
          return {color:'yellow'}
          if(this.state.loadTimes[node.id]/200>0.75)
          return {color:'red'}

      }
  
  render() {
  return (
    <div>
      <Nav></Nav>
      {
        this.state.loaded &&
        <div>
          <button style = {{position: 'absolute', left: '50px', 'bottom' : '50px'}} onClick={this.getConfiguration}>
            Refresh
          </button>
          <div>{this.buildList(this.state.Data[0])}</div>
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

export default ListSta;


   
    

  
