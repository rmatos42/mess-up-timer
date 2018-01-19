import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TimeAgo from 'react-timeago';
import config from './config.json'

class MessUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      fuckup: false,
      date: ''
    }
  }

  componentDidMount() {
    var date = new Date(Date.now())
    this.setState({date});
    setInterval(this.getTasks.bind(this), 2000)
  }

  getTasks() {
    var tasklist = []
    var tasks = []

    var promise = new Promise((resolve, revoke) => {
      fetch('https://app.asana.com/api/1.0/tasks?completed_since=now&project=' + config.project, {
        headers: {
          'Authorization': 'Bearer ' + config.key
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.data.length > this.state.data.length && responseJson.data.length !== 0) {
          this.setState({data: responseJson.data});
          var date = new Date(Date.now());

          this.setState({date});
          if (this.state.fuckup === false) {
            
            this.props.changeStyle();
            this.setState({fuckup: true});
          }
        } else{
          if (responseJson.data.length === 0 && responseJson.data.length != this.state.data.length) {

          this.setState({data: responseJson.data});
            this.props.changeStyle();
            this.setState({fuckup: false});
          }
        }
      });
    })


  }

  // getTasks() {
  //   var fuckup = false;
  //   fetch('https://app.asana.com/api/1.0/projects/' + config.project + '/tasks', {
  //     headers: {
  //       'Authorization': 'Bearer ' + config.key
  //     }
  //   })
  //   .then ((response) => response.json())
  //   .then((json) => {
  //     var promises = []
  //     for (let task of json.data) {
  //       var promise = new Promise((resolve, reject) => {
  //         fetch('https://app.asana.com/api/1.0/tasks/' + task.id, {
  //           headers: {
  //             'Authorization': 'Bearer ' + config.key
  //           }
  //         })
  //         .then((response) => response.json())
  //         .then((json) => {
  //           if (json.data.completed === false) {
  //             fuckup = true;
  //           }
  //         })
  //         .then(() => resolve('success'));
  //       });
  //       promises.push(promise)
  //     }

  //     Promise.all(promises).then(() => {
  //       if (fuckup === true) {
  //         if (this.state.fuckup === false) {
  //           this.setState({fuckup});
  //           var date = new Date(Date.now());
  //           this.setState({date});
  //         }
  //       }
  //       else {
  //         this.setState({fuckup});
  //       }
  //     })
  //   });
  // }   

  render() {
    return (
      <TimeAgo date={this.state.date}/>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: "Happy"
    };
  }

  changeStyle() {
    if (this.state.style === "Happy") {
      this.setState({style: "Sad"});
    }
    else {
      this.setState({style: "Happy"});
    }
  }

  render() {
    return (
      <div className={this.state.style}>
        <MessUp changeStyle={this.changeStyle.bind(this)}/>
      </div>
    );
  }
}

export default App;
