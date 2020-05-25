import React from 'react';
import './App.css';
import TreeArduino from './components/tree';
import Nav from './components/Navigation';
import Statistics from './components/statistics'
import consts from './consts';

class App extends React.Component{
  constructor(props) {
    super(props)
    this.renderSelectedPage = this.renderSelectedPage.bind(this)
    this.handleChangePage = this.handleChangePage.bind(this)
    this.state = {
      page: consts.PAGE_SYSTEM_VIEW_TREE
    }
  }

  renderSelectedPage() {
    switch (this.state.page) {
      case consts.PAGE_SYSTEM_VIEW_TREE:
        return <TreeArduino />

      case consts.PAGE_SYSTEM_VIEW_LIST:
        return // add list view component here

      case consts.PAGE_STATISTICS:
        return <Statistics />

      case consts.PAGE_HISTORY:
        return // add history component here

      default:
        break;
    }
  }

  handleChangePage(newPage) {
    this.setState({page : newPage});
  }

  render() {
    return (
      <div className="App">
        <Nav currentPage = {this.state.page} handleChangePage = {this.handleChangePage}/>
        { this.renderSelectedPage() }
      </div>
    );
  }

}

export default App;
