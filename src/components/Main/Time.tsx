import React, { useMemo } from "react";

type Props = {
  time: number;
};

const Time = ({ time }: Props) => {
  let s = useMemo(() => (Math.floor(time / 1000)%60).toString().padStart(2,'0'), [time]);
  let min = useMemo(() => Math.floor(time / 60000).toString().padStart(2,'0'), [time]);
  let ms = useMemo(() => Math.round((time % 1000) / 20).toString().padStart(2,'0'), [time]);
  return (
    <span className="p-1">{min}:{s}:{ms}</span>
  );
};

export default Time;
