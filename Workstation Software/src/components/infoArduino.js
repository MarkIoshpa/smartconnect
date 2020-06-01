import React from 'react';
import Popup from "reactjs-popup";
import './info.css'
import icon from '../assets/icon.png'
import sensor from '../assets/sensor.png'
import actuator from '../assets/actuator.png'

class Information  extends React.Component{
  constructor(props){
    super(props)
    this.typeInput = React.createRef();
    this.addressInput = React.createRef();
    this.info =this.info.bind(this)
    this.load =this.load.bind(this)
    this.addDevice =this.addDevice.bind(this)
    this.upSensor =this.upSensor.bind(this)
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
      <div className="device" key={`device${i}`}>
        {
          (this.state.allInfo.devices[i].type === 1 || this.state.allInfo.devices[i].type === 3) &&
          <div className="device-icon" style={{backgroundImage: "url(" + sensor + ")"}}></div>
        }
        {
          (this.state.allInfo.devices[i].type === 2 || this.state.allInfo.devices[i].type === 4) &&
          <div className="device-icon" style={{backgroundImage: "url(" + actuator + ")"}}></div>
        }
        <h4 >Device ID: <span>{this.state.allInfo.devices[i].id}</span></h4>
        <h4 >Device Type: <span>{deviceDesc}</span></h4>
        { 
          (this.state.allInfo.devices[i].type === 1 || this.state.allInfo.devices[i].type === 3) &&
          <div>
            <h4>Device Output: <span>{this.state.output[i]}</span></h4>
            <button className="delete" onClick={()=>this.props.display.setDevice({address:i,type:0,pinmode:0})}><b>🗑️</b></button>
          </div>
        }
        { 
          (this.state.allInfo.devices[i].type === 2) &&
          <div>
            <h4>Device Status: {this.state.output[i] === 0 ? "OFF" : "ON"}</h4>
            <button onClick={() => this.setActuatorData(this.state.allInfo.devices[i].id, this.state.output[i] === 0 ? 1 : 0)}>Toggle</button>
            <button className="delete" onClick={()=>this.props.display.setDevice({address:i,type:0,pinmode:0})}><b>🗑️</b></button>
          </div>
        }
        {
          (this.state.allInfo.devices[i].type === 4) && 
          <div>
            <h4>Device Output: {this.state.output[i]}</h4>
            <button onClick={() => this.setActuatorData(this.state.allInfo.devices[i].id, 0)}>Toggle</button>
            <button className="delete" onClick={()=>this.props.display.setDevice({address:i,type:0,pinmode:0})}><b>🗑️</b></button>
          </div>
        }
        <br></br>
      </div>
    )
  }  

  getSensorData() {
    setInterval(async ()=> {
      let data = await this.props.display.getSensorData()
      this.setState({output: data.array})
      }
    ,1000);
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
    this.props.display.getSensorData().then(data =>this.setState({part:data.time}))

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

  addDevice(){
    return(
      <div>
      <h5>Add :</h5>
      <form name="addSensor">
        address: <input type="text" ref={this.addressInput}></input> 
        <br></br>
        <br></br>
        <select ref={this.typeInput}>
            <option value="Digital Sensor">Digital Sensor</option>
            <option value="Digital Actuator">Digital Actuator</option>
            <option value="Analog Sensor">Digital Actuator</option>
            <option value="Analog Actuator">Digital Actuator</option>
        </select>
        <br></br>
        <br></br>
        <input type="submit" style={{color:'red'}}  value="✔" onClick={this.upSensor} />
      </form>
      </div>
    )
  }

  upSensor(e){
    e.preventDefault()
    var TypeAddress = {
      "None": 0,
      "Digital Sensor": 1,
      "Digital Actuator" : 2,
      "Analog Sensor" :3,
      "Analog Actuator" :4
    };
    this.props.display.setDevice({
      address:parseInt(this.addressInput.current.value),
      type:TypeAddress[this.typeInput.current.value],
      pinmode:1}
    )
  }
  
  render() {
  return (
    <div>
      <div>
        <div id="myModal" className="modal">
          <div className="modal-content">
          <span className="close">&times;</span>
            <div className="info-icon" style={{backgroundImage: "url(" + icon + ")"}}></div>
            <h2><p>Microcontroller information (id: {this.state.allInfo.id})</p></h2>
            <h4>Description : {this.state.allInfo.desc}</h4>
            <h4>Devices: </h4>
            <div style={{marginLeft: '100px'}}>{(this.nulldevices())}</div>
            <div style={{marginLeft: '100px'}}>{this.state.allInfo.devices.map(this.devices)}</div>
            <Popup trigger={<button>+</button>} position="right center">
            <div>{this.addDevice()}</div>
            </Popup>
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
