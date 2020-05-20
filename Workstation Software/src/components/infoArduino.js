import React from 'react';
import './button.css'

class Information  extends React.Component{
  constructor(props){
    super(props)
    this.info =this.info.bind(this)
    this.load =this.load.bind(this)
    this.addDevice =this.addDevice.bind(this)
    this.nullchildren=this.nullchildren.bind(this)
    this.nulldevices=this.nulldevices.bind(this)
    this.children=this.children.bind(this)
    this.devices=this.devices.bind(this)
    this.getSensorData = this.getSensorData.bind(this)
    this.setActuatorData = this.setActuatorData.bind(this)
    this.onSpanClick=this.onSpanClick.bind(this)
    this.onWindowClick=this.onWindowClick.bind(this)
    this.getData = false
    this.state = { 
      output : [],
      allInfo: {
        id: this.props.display.id,
        MaxSlaveAddress: this.props.display.maxSlaveAddress,
        desc: this.props.display.desc,
        devices: this.props.display.devices,
        children: this.props.display.children
      },
      part:0
    }
  }

  componentDidMount() {
    this.info()
    this.getData = true
    this.getSensorData()
  }

  componentWillUnmount() {
    this.getData = false
  }

  devices(item,i){
    let deviceDesc
    switch(this.state.allInfo.devices[i].type) {
      case 1:
        deviceDesc = 'Digital Sensor'
        break
      case 2:
        deviceDesc = 'Digital Actuator'
        break
      case 3:
        deviceDesc = 'Analog Sensor'
        break
      case 4:
        deviceDesc = 'Analog Actuator'
        break
      default:
        deviceDesc = "None"
    }
    return(
      <div key={`device${i}`}>
        <h4 >Device ID: {this.state.allInfo.devices[i].id}</h4>
        <h4 >Device Type: {deviceDesc}</h4>
        { 
          (this.state.allInfo.devices[i].type === 1 || this.state.allInfo.devices[i].type === 3) &&
          <h4>Device Output: {this.state.output[i]}</h4>
          
        }
        { 
          (this.state.allInfo.devices[i].type === 2) &&
          <div>
            <h4>Device Status: {this.state.output[i] === 0 ? "OFF" : "ON"}</h4>
            <button onClick={() => this.setActuatorData(this.state.allInfo.devices[i].id, this.state.output[i] === 0 ? 1 : 0)}>Toggle</button>
          </div>
        }
        {
          (this.state.allInfo.devices[i].type === 4) && 
          <div>
            <h4>Device Output: {this.state.output[i]}</h4>
            <button onClick={() => this.setActuatorData(this.state.allInfo.devices[i].id, 0)}>Toggle</button>
          </div>
        }
        <br></br>
      </div>
    )
  }  

  async getSensorData() {
    while(this.getData) {
      let data = await this.props.display.getSensorData()
      this.setState({output: data.array})
    }
  }

  setActuatorData(address, value) {
    this.props.display.setActuatorData(address, value).then(data=> this.setState({sensor: data}))
    if(this.input === 0)
      this.input = 1
    else
      this.input = 0
  }

  children(item,i)
  { 
      return(
        <h4 key={i}>{this.state.allInfo.children[i].desc}</h4> 
    )       
  }

  info(){
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick =  () => this.onSpanClick(modal)
    window.onclick = (event) => this.onWindowClick(event, modal)
  }

  nullchildren(){
    
    if(this.state.allInfo.children.length<1)
  return <h4>Doesn't have children</h4>
    
  }

  nulldevices(){
    if(this.state.allInfo.devices.length<1)
    return <h4>Doesn't have devices</h4>

  }
  load(){
    this.props.display.getSensorData().then(data =>
        this.state.part=data.time)

      if(this.state.part/200<0.51)
        return<h4 style={{color: 'green'}}> load: {(this.state.part/200*100).toFixed(2)}%</h4>

      if(this.state.part/200>0.50&&this.state.part/200<0.76)
        return<h4 style={{color: 'yellow'}}> load: {(this.state.part/200*100).toFixed(2)}%</h4>

      return<h4 style={{color: 'red'}}> load: {(this.state.part/200*100).toFixed(2)}%</h4>
  }
 

  onSpanClick(modal){
    this.getData = false
    modal.style.display = "none";
    this.props.handleInfoReturn()
  }

  onWindowClick(event, modal){
    if (event.target === modal) {
      this.getData = false
      modal.style.display = "none";
      this.props.handleInfoReturn()
  }
  }

  addDevice()
  {
    return(
    <div>
    <h4>name:</h4>
    <input type="text" name="lastname"></input>
    <input type="submit" value="add"></input>
  

    </div>
    )

  }
  
  render() {
  return (
    <div>
      <div>
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close">&times;</span>
            <h2><p>Microcontroller information (id: {this.state.allInfo.id})</p></h2>
            <h4>Description : {this.state.allInfo.desc}</h4>
            <h4>Devices: </h4>
            <div style={{marginLeft: '100px'}}>{(this.nulldevices())}</div>
            <div style={{marginLeft: '100px'}}>{this.state.allInfo.devices.map(this.devices)}</div>
            <button style={{marginLeft: '100px'}} onClick={this.addDevice()}><b>+</b></button>
            <h4>Children:</h4>
            <div style={{marginLeft: '100px'}}>{(this.nullchildren())}</div>
            <div style={{marginLeft: '100px'}}>{this.state.allInfo.children.map(this.children)}</div>
            
            <div>{this.load()}</div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}


export default Information ;
