import React from 'react';
import { tracks } from "@/data/tracks";
import Tooltip from '../ui/Tooltip';

interface TrackListProps {
   addTrack : (_:MinimalTrackType) => void;
}

const TrackList : React.FC<TrackListProps> = ( {addTrack} ) => {
  return (
    <div className="p-4 flex justify-evenly gap-4 overflow-x-clip bg-systembgDark-200">
    {tracks.tracks.map((track, index) => (
          <div
            onClick={() =>
              addTrack({
                color: track.color,
                title: track.title,
                duration: track.duration,
                source: track.source,
              })
            }
            key={index}
            style={{ backgroundColor: track.color }}
            className={`group text-xs md:text-sm lg:text-base hover:scale-110 transition-all cursor-pointer select-none max-w-80 rounded-md p-2 flex-1 text-center `}
          >
            {track.title}
            <Tooltip track={track}/>
          </div>
        ))}
    </div>
  )
}

export default TrackList;