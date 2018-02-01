import React, { Component } from 'react';
import './App.css';
import config from './config.json'
import TimeAgo from 'timeago-react';
import Sound from 'react-sound';

class MessUp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      fuckup: false,
      date: '',
      first: true,
      playing: Sound.status.STOPPED
    }
  }

  componentDidMount() {

    var promise = new Promise((resolve, revoke) => {
      fetch('https://app.asana.com/api/1.0/tasks?completed_since=now&project=' + config.project, {
        headers: {
          'Authorization': 'Bearer ' + config.key
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({data: responseJson.data})
        console.log(responseJson.data);
        if (responseJson.data.length > 0) {
          console.log('hi');
          this.setState({fuckup: true});
          this.props.changeStyle();
        }
        else
          this.setState({fuckup: false});
        fetch('http://10.0.0.117:3001/tasks')
          .then((response) => response.json())
          .then((responseJson) => {
              console.log(responseJson[0].date);
              this.setState({date: new Date(responseJson[0].date)});
        })
        .then(() => {
        this.getTasks();
         setInterval(this.getTasks.bind(this), 2000);

    })
      })
    })
    
  }

  getTasks() {
    var promise = new Promise((resolve, revoke) => {
      fetch('https://app.asana.com/api/1.0/tasks?completed_since=now&project=' + config.project, {
        headers: {
          'Authorization': 'Bearer ' + config.key
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        var date = new Date(Date.now());
        if (responseJson.data.length > this.state.data.length && responseJson.data.length !== 0) {
          console.log(responseJson);

              this.setState({date});
              fetch('http://10.0.0.117:3001/tasks', {
                method: 'POST',
                headers : {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body:JSON.stringify({date: date.toString()})
            }).then((res) => res.json())
            .then((data) =>  console.log(data))
            .catch((err)=>console.log(err))
          this.setState({data: responseJson.data});
          if (this.state.fuckup === false) {

            this.props.changeStyle();
            this.setState({fuckup: true});
            this.setState({playing: Sound.status.PLAYING})
            
          }
        } else{
          if (responseJson.data.length === 0 && responseJson.data.length !== this.state.data.length) {

          this.setState({data: responseJson.data});
            this.props.changeStyle();
            this.setState({fuckup: false});
            this.setState({playing: Sound.status.STOPPED})
          }
        }
      });
    })


  }

  render() {
      return (
        <div>
          <p>last fuck up was</p>
          <Sound url={require('./silent.mp3')} playStatus={this.state.playing}/>
          <TimeAgo datetime={this.state.date} />
        </div>
      )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: "Happy",
      face: ":)"
    };
  }

  changeStyle() {
    if (this.state.style === "Happy") {
      this.setState({style: "Sad"});
      this.setState({face: ":("});
    }
    else {
      this.setState({style: "Happy"});
      this.setState({face: ":)"});
    }
  }

  onPlaying() {
    console.log('playing');
  }

  render() {
    return (
      <div className={this.state.style}>
        <MessUp className="WhiteText" changeStyle={this.changeStyle.bind(this)}/>
        <p className="WhiteText">{this.state.face}</p>
      </div>
    );
  }
}

export default App;
