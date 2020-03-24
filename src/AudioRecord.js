import React from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import Button from "@material-ui/core/Button";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class AudioRecord extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
    };
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };


  stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        this.setState({ blobURL, isRecording: false });
        this.props.setFiles(blobURL)
      }).catch((e) => console.log(e));
  };

  componentDidMount() {
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <Button onClick={this.start} disabled={this.state.isRecording}>Record</Button>
          <Button onClick={this.stop} disabled={!this.state.isRecording}>Stop</Button>
          <audio src={this.state.blobURL} id= "aud" controls="controls" />
        </header>
      </div>
    );
  }
}

export default AudioRecord;