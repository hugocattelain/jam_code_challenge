import React from 'react';
import Slider from '@material-ui/core/Slider';

export default function TimeBar(props) {
  return (
    <Slider
      value={(props.currentTime / props.duration) * 100}
      onChange={props.setTime}
    />
  );
}
