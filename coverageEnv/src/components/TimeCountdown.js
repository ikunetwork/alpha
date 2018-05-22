import React from 'react';
import Countdown from 'react-countdown-now';

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <span>00:00</span>;
  } else {
    // Render a countdown
    return (
      <span>
        {hours}:{minutes}:{seconds}
      </span>
    );
  }
};

const TimeCountdown = props => (
  <Countdown date={props.date * 1000} renderer={renderer} />
);

export default TimeCountdown;
