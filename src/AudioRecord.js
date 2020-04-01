import React from "react";
import ReactWaves from "@dschoon/react-waves";
import Button from "@material-ui/core/Button";

export default class AudioRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      micRecord: false,
      micInstance: {},
      audio: "",
    };

    this.mediaRecorder = {};

    this.micCallback = this.micCallback.bind(this);
    this.handleStream = this.handleStream.bind(this);
    this.handleAudioOutput = this.handleAudioOutput.bind(this);
    this.startMic = this.startMic.bind(this);
    this.stopMic = this.stopMic.bind(this);
  }

  micCallback({ micInstance, stream }) {
    if (micInstance) {
      this.setState({ micInstance });
    } else if (stream) {
      this.handleStream(stream);
    }
  }

  handleStream(stream) {
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.start();

    this.mediaRecorder.addEventListener("dataavailable", (event) => {
      this.audioChunks = [];
      this.audioChunks.push(event.data);
    });
  }

  handleAudioOutput() {
    return new Promise((resolve) => {
      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        resolve({ audioBlob, audioUrl });
      });

      if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
        this.mediaRecorder.stop();
      }
    });
  }

  startMic() {
    if (!this.state.micInstance.active) {
      this.state.micInstance.start();
      this.setState({ micRecord: true });
    }
  }

  stopMic() {
    if (this.state.micInstance.active) {
      this.state.micInstance.stop();

      console.log("stopping");

      this.handleAudioOutput().then(({ audioBlob, audioUrl }) => {
        this.setState({ micRecord: false, audio: audioUrl });
        this.props.setFiles(audioBlob);
      });
    }
  }

  render() {
    return (
      <div className={"container example"}>
        <Button onClick={this.startMic} disabled={this.state.micRecord}>
          Record
        </Button>
        <Button onClick={this.stopMic} disabled={!this.state.micRecord}>
          Stop
        </Button>
        <ReactWaves
          className={"react-waves"}
          options={{
            barHeight: 4,
            barWidth: 2,
            cursorWidth: 0,
            height: 100,
            hideScrollbar: true,
            progressColor: "#EC407A",
            responsive: true,
            waveColor: "#D1D6DA",
          }}
          playing={this.state.micRecord}
          volume={1}
          zoom={1}
          micCallback={this.micCallback}
        />
        <audio
          src={this.state.audio}
          id="aud"
          controls="controls"
          style={{ width: 200 }}
        />
      </div>
    );
  }
}
