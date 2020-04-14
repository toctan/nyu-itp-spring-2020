import React from "react";

import FoursquareSuggest from "./FoursquareSuggest";
import AudioForm from "./AudioForm";

export default function AudioUpload() {
  return (
    <AudioForm title="Upload an audio" extraInputs={<FoursquareSuggest />} />
  );
}
