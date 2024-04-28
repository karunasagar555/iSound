import React, { useMemo, useState } from "react";

interface TimelineMarksProps {
  time: number;
}

const TimelineMarks: React.FC<TimelineMarksProps> = ({ time }) => {
  const [intervals, setIntervals] = useState(6);
  const markings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      if (i == 0) {
        arr.push(
          <span key={i * 2} className="text-xs flex-1 opacity-45">
            0s
          </span>
        );
      } else if (i % 5 === 0) {
        arr.push(
          <div key={i * 2} className="text-center flex flex-col items-start flex-1">
            <span  className="text-xs -translate-x-1/2 opacity-45">
              {(i * (time / 30)).toFixed(0)}s
            </span>{" "}
            <span className="text-xs flex-1 border-l opacity-30"></span>
          </div>
        );
      } else {
        arr.push(
          <span
            key={i * 2}
            className="text-xs flex-1 border-l opacity-15"
          ></span>
        );
      }
    }
    return arr;
  }, [time, intervals]);
  return (
    <div key={"timelineMarks"} className="flex h-full cursor-default select-none text-systembgLight-100 py-1">
      {markings}
    </div>
  );
};

export default TimelineMarks;
