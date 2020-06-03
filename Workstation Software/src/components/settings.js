import React from 'react';
import './settings.css';

class Settings extends React.Component {
  render() {
    return (
      <div className="settings">
          <h2>Settings</h2>
          <div>
            <label for="comport">COMPORT:</label>
            <input id="comport" type="number"></input>
          </div>
          <div>
            <label for="refresh">Refresh Time (ms):</label>
            <input id="refresh" type="number"></input>
          </div>
          <div>
            <label for="maxload">Max Load Time (ms):</label>
            <input id="maxload" type="number"></input>
          </div>
      </div>
    )
  }
}

export default Settings;