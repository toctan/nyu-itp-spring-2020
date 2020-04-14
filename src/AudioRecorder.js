import "videojs-record/dist/css/videojs.record.css";
import "videojs-record/dist/videojs.record.js";

import "recordrtc";
import "video.js/dist/video-js.css";
import "videojs-wavesurfer/dist/css/videojs.wavesurfer.css";
import "videojs-wavesurfer/dist/videojs.wavesurfer.js";
import "webrtc-adapter";

import { makeStyles } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import React from "react";

import MicrophonePlugin from "wavesurfer.js/dist/plugin/wavesurfer.microphone.js";
import videojs from "video.js";

const debug = process.env.NODE_ENV !== "production";
const defaultOptions = {
  controls: true,
  controlBar: {
    deviceButton: false,
    fullscreenToggle: false,
  },
  fluid: true,
  plugins: {
    wavesurfer: {
      waveColor: "#36393b",
      progressColor: "black",
      debug,
      cursorWidth: 0,
      interact: false,
      msDisplayMax: 10,
      hideScrollbar: true,
      plugins: [
        MicrophonePlugin.create({
          bufferSize: 4096,
          numberOfInputChannels: 1,
          numberOfOutputChannels: 1,
          constraints: {
            video: false,
            audio: true,
          },
        }),
      ],
    },
    record: {
      audio: true,
      video: false,
      maxLength: 10,
      debug,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#9FD6BA",
    borderRadius: theme.spacing(1),
  },
}));

export default function AudioRecorder({ file, setFile }) {
  const classes = useStyles();
  const audioRef = React.useRef(null);
  const [record, setRecord] = React.useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "audio/*",
    onDrop: React.useCallback(
      ([file]) => {
        setFile(file);
      },
      [setFile]
    ),
  });

  React.useEffect(() => {
    const player = videojs(audioRef.current, defaultOptions);
    player.one("ready", () => {
      player.record().getDevice();
    });

    player.on("deviceReady", () => {
      setRecord(player.record());
    });

    player.on("finishRecord", function() {
      setFile(player.recordedData);
    });

    player.on("error", (element, error) => {
      console.warn(error);
    });

    return () => {
      player.dispose();
    };
  }, [setFile]);

  React.useEffect(() => {
    if (!file) return;
    record.engine.recordedData = file;
    record.onRecordComplete();
  }, [file, record]);

  return (
    <div
      data-vjs-player
      {...getRootProps({
        onClick: (e) => {
          if (e.target.nodeName === "BUTTON") e.stopPropagation();
        },
      })}
    >
      <input {...getInputProps()} />
      <audio
        ref={audioRef}
        className={`video-js vjs-default-skin ${classes.container}`}
      ></audio>
    </div>
  );
}
