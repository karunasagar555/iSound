import React from "react";

interface TooltipProps {
  track: TrackType;
}

const Tooltip: React.FC<TooltipProps> = ({ track }) => {
  return (
    <div className="flex gap-2 transition-all z-[5] min-w-max absolute bottom-[120%] left-0  scale-0 rounded bg-systemGbgDark-100 p-1 text-xs  text-white group-hover:scale-100">
      <p>
        start time: <span className="text-systemTintDark-blue" >{Math.fround((track.startTime+track.startPoint) / 1000).toFixed(2)}s</span>
      </p>
      <p>
        end time: <span className="text-systemTintDark-blue" >{Math.fround((track.startTime+track.endPoint) / 1000).toFixed(2)}s</span>
      </p>
      <p>
        duration: <span className="text-systemTintDark-blue" >{Math.round(track.duration / 1000)}s</span>
      </p>
      <p className="">
        name: <span className="">{track.title}</span>
      </p>
      <div className="w-1 h-6 absolute bg-systembgDark-100 left-0 top-[50%] rounded-md translate-y-2"></div>
    </div>
  );
};

export default Tooltip;
