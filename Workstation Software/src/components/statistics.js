import React from 'react';
import './tree.css';
import Tree from 'react-vertical-tree'
import Information  from './infoArduino';

var { getAllBoardConfiguration, isReady } = window.require('./src/workstation-communication.js')

class statistics extends React.Component{
  constructor(props){
    super(props)
    this.getTime= this.getTime.bind(this)
    this.getConfiguration = this.getConfiguration.bind(this)
    this.checkLoad=this.checkLoad.bind(this)
    this.addChildren = this.addChildren.bind(this)
    this.handleInfoReturn = this.handleInfoReturn.bind(this)
    this.color='green'
    this.state ={ 
      display : null,
      loaded : false,
      checkpart :0,
      Data:[],
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
      getAllBoardConfiguration().then( data => {
        let tmp = []
        this.addChildren([data[0]], tmp)
        this.setState({Data: tmp, loaded: true})
      })
    })
  }

   addChildren(data, dest) {
    data.forEach( child => {
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

  checkLoad(item){
    if(this.state.checkpart===0){
      this.color='red'
      this.setState({checkpart:1})
    }
    if(this.state.checkpart===1){
      this.color='green'
    }
    if(item==='Master microcontroller')
      return<h4>try</h4>
  
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
    else
      console.log('try')
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
          <div>{this.checkLoad()}</div>
          <Tree data={this.state.Data} direction
            render={ item =>(
              <div>
              {this.state.loadTimes[item.id]==null&&
              <div style={{color:'black'}}>{`${item.name}`}</div>}

              {this.state.loadTimes[item.id]!=null&&(this.state.loadTimes[item.id]/200<0.51) &&
              <div style={{color:'green'}}>{`${item.name}`}</div>}


              {this.state.loadTimes[item.id]!=null&&(this.state.loadTimes[item.id]/200>0.51) &&(this.state.loadTimes[item.id]/200<0.76) &&
              <div style={{color:'yellow'}}>{`${item.name}`}</div>}

              {this.state.loadTimes[item.id]!=null&&(this.state.loadTimes[item.id]/200>0.75) &&
              <div style={{color:'red'}}>{`${item.name}`}</div>}
            
            
              </div> 
            )
    
            }

          
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

export default statistics;


   
    

  
