import React from 'react';
import { configVariables } from '../configVariables'
import './settings.css';

class Settings extends React.Component {
  constructor(props){
    super(props)
    this.handleChangeSetting = this.handleChangeSetting.bind(this)
    this.state = {
      comport: configVariables.comport.substring(3),
      refreshTime: configVariables.refreshTime,
      maxLoadTime: configVariables.maxLoadTime,
      acceptableLoad: configVariables.acceptableLoad
    }
  }

  handleChangeSetting(value, name) {
    configVariables[name] = value;
    localStorage.setItem(name,JSON.stringify(value))
    this.setState({[name]: value})
  }

  render() {
    return (
      <div className="settings">
          <h2>Settings</h2>
          <div>
            <label htmlFor="comport">COMPORT:</label>
            <input 
              id="comport" 
              type="number" 
              defaultValue={this.state.comport} 
              onChange={(evt) => this.handleChangeSetting("COM" + evt.target.value, "comport")}
            >
            </input>
          </div>
          <div>
            <label htmlFor="refresh">Refresh Time (ms):</label>
            <input 
              id="refresh" 
              type="number" 
              defaultValue={this.state.refreshTime} 
              onChange={(evt) => this.handleChangeSetting(evt.target.value, "refreshTime")}
            >
            </input>
          </div>
          <div>
            <label htmlFor="maxload">Max Load Time (ms):</label>
            <input 
              id="maxload" 
              type="number" 
              defaultValue={this.state.maxLoadTime}
              onChange={(evt) => this.handleChangeSetting(evt.target.value, "maxLoadTime")}
            >
            </input>
          </div>
          <div>
            <label htmlFor="acceptableLoad">Acceptable Load (%):</label>
            <input 
              id="acceptableLoad" 
              type="number"
              min="0"
              max="100"
              defaultValue={this.state.acceptableLoad*100}
              onChange={(evt) => this.handleChangeSetting(evt.target.value/100, "acceptableLoad")}
            >
            </input>
          </div>
      </div>
    )
  }
}

export default Settings;