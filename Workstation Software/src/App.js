import React from 'react';
import './App.css';
import "./tiles.css";
import Homepage from './components/homepage'
import TreeArduino from './components/tree';
import ListArduino from './components/list';
import Nav from './components/Navigation';
import History from './components/History';
import AdminMapBuilder from "./admin/map-builder";
import Settings from "./components/settings"
import consts from './consts';
import errorDetector from "./components/errorDetector";
import { configVariables } from "./configVariables"
var { getAllBoardConfiguration, isReady } = window.require('./src/workstation-communication.js');
var errorDetect=new errorDetector();

class App extends React.Component{
  constructor(props) {
    super(props)
    this.renderSelectedPage = this.renderSelectedPage.bind(this)
    this.getTime=this.getTime.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.state = {
      data:[],
      page: consts.PAGE_HOMEPAGE,
      notification:[],
      loaded: false,
      loadTimes:{}
    }
  }

  componentDidMount() {
    setInterval(()=> {
      if(isReady()) {
        this.getConfiguration();
        this.getTime(this.state.data[0])
        this.setState({notification: errorDetect.notification})
        }
      }
    ,configVariables.refreshTime);
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  getConfiguration() {
    this.setState({loaded:true}, () => {
      getAllBoardConfiguration().then(async data => {
        await errorDetect.setLive(data)
        let tmp = [];
        this.addChildren([data[0]], tmp);
        this.setState({data: tmp, loaded: true})
      }
      )
    })
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

  addChildren(data, dest) {
    data.forEach(child => {
      let tmp = {};
      if(child == null) return
      tmp.id = child.id;
      tmp.name = child.desc;
      tmp.microcontroller = child;
      tmp.parent = null;
      tmp.children = [];

      this.addChildren(child.children, tmp.children);
      dest.push(tmp)
    })
  }


  renderSelectedPage() {
    switch (this.state.page) {
      case consts.PAGE_HOMEPAGE:
        return <Homepage handleChangePage = {this.handleChangePage} />

      case consts.PAGE_SYSTEM_VIEW_TREE:
        return <TreeArduino data={this.state.data} loadTimes={this.state.loadTimes} />

      case consts.PAGE_SYSTEM_VIEW_LIST:
        return <ListArduino data={this.state.data} />

      case consts.PAGE_HISTORY:
        return <History rows={this.state.notification} />

      case consts.PAGE_PLANNER:
        return <AdminMapBuilder />

      case consts.PAGE_SETTINGS:
        return <Settings />

      default:
        break;
    }
  }

  handleChangePage(newPage) {
    this.setState({page : newPage});
  }

  render() {
    return (
      <div className="Screen">
        <Nav currentPage = {this.state.page} handleChangePage = {this.handleChangePage}/>
        <div className="Page">
          { this.renderSelectedPage() }
        </div>
      </div>
    );
  }

}

export default App;
