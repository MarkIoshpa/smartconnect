import React from 'react';
import './App.css';
import TreeArduino from './components/tree';
import ListArduino from './components/list';
import Nav from './components/Navigation';
import Statistics from './components/statistics'
import History from './components/History'
import consts from './consts';
import errorDetector from "./components/errorDetector";
var { getAllBoardConfiguration, isReady } = window.require('./src/workstation-communication.js');
var errorDetect=new errorDetector();

class App extends React.Component{
  constructor(props) {
    super(props)
    this.renderSelectedPage = this.renderSelectedPage.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.state = {
      data:[],
      page: consts.PAGE_SYSTEM_VIEW_TREE,
      notification:[],
      loaded: false
    }
  }

  componentDidMount() {
    setInterval(()=> {
      if(isReady()) {
        this.getConfiguration();
        this.setState({notification: errorDetect.notification})
        }
      }
    ,4000);
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

  addChildren(data, dest) {
    data.forEach(child => {
      let tmp = {};
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
      case consts.PAGE_SYSTEM_VIEW_TREE:
        return <TreeArduino data={this.state.data} />

      case consts.PAGE_SYSTEM_VIEW_LIST:
        return <ListArduino data={this.state.data} />

      case consts.PAGE_STATISTICS:
        return <Statistics data={this.state.data} />

      case consts.PAGE_HISTORY:
        return <History rows={this.state.notification} />

      case consts.PAGE_PLANNER:
        return // add Planner

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
