// framework modules/ APIs
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/legacy/image";

// internal modules/ components / ui
import {
  HeaderSpline,
  PauseIcon,
  PlayIcon,
} from "../../../public/assets/svgIcons";
import TrackList from "./TrackList";
import Tooltip from "../ui/Tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Time from "./Time";
import TimelineMarks from "./TimelineMarks";
import Media from "./Media";
import { Button } from "../ui/button";
import { randomHexColor } from "@/util/helper";

// Types
interface IMainProps {}

const Main = (props: IMainProps) => {
  //----------------------------------------------$ states of the component(Timeline Track) i.e current time, play/pause, playback speed, tracks etc. $ --------------------------------//
  const [timeLineDuration, setTimeLineDuration] = useState(30000);
  const [intervalDuration, setIntervalDuration] = useState(100);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [timeLineTracks, setTimeLineTracks] = useState<TrackType[]>([]);
  const [intervalID, setintervalID] = useState<NodeJS.Timeout>();
  const [Gfiles, setGfiles] = useState<FileType[]>([]);

  //----------------------------------------------$ reference to the DOM Elements of(Timeline Track) i.e timeline container,  timeline thumb, track container, track, audio etc. $-----//
  const timeLineRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<Array<HTMLDivElement>>(new Array());
  const thumbRef = useRef<Array<HTMLDivElement>>(new Array());
  const audioRef = useRef<Array<HTMLAudioElement>>(new Array());

  // ---------------------------------------------$ TimeLine mutations(states:[play/pause , speed, timeLineTracks, time...]) $---------------------------------------------------------//

  /**
   * @function the following function toggles the play and pause state of the TimeLine Track.
   */
  const handlePlayPause = () => {
    setTime((old) => (old === timeLineDuration ? 0 : old));
    setPlaying((old) => !old);
  };

  /**
   * @function the following function toggles the playback Rate of the TimeLine Track.
   */
  const handleSpeed = () => {
    setSpeed((old) => (old == 1 ? 2 : 1));
  };

  /**
   * @description the following function adds a new track on the TimeLine.
   * @param param0 object containing the data of tracks i.e background color, title, duraton, source url
   */
  const addTrack = ({
    color,
    title,
    duration,
    source,
    startTime = 0,
    startPoint = 0,
    endPoint = duration,
  }: MinimalTrackType) => {
    const newTrack = {
      color,
      title,
      startTime: startTime,
      endTime: duration,
      duration,
      source,
      startPoint,
      endPoint,
    };
    let newTimeLineDuration = Math.max(
      timeLineDuration,
      Math.ceil((startTime + duration) / 30000) * 30000
    );
    // console.log(timeLineDuration,newTimeLineDuration);
    if (timeLineDuration !== newTimeLineDuration)
      changeTimelineDuration(newTimeLineDuration.toString());
    setTimeLineTracks((old) => [...old, newTrack]);
  };

  /**
   * @description the following function removes a track from the timeline.
   * @param index it is the index of the track which has to be removed.
   */
  const handleRemoveTrack = (index: number) => {
    let newTracks = timeLineTracks.filter((_, idx) => idx != index);
    setTimeLineTracks(newTracks);
  };

  const addDemoFiles = async (e: React.SyntheticEvent) => {
    const demotracks = (await import("@/data/tracks")).tracks.demoTracks;
    demotracks.forEach((dt, index) => {
      (function addDemoTrack() {
        setTimeout(() => {
          addTrack({
            color: randomHexColor(),
            title: dt.title,
            duration: dt.duration,
            source: dt.source,
            startTime: dt.startTime,
            startPoint: dt.startPoint,
            endPoint: dt.endPoint,
          });
        }, index * 200);
      })();
    });
  };

  const changeTimelineDuration = (value: string) => {
    setPlaying(false);
    setTimeLineDuration(parseInt(value));
  };
  // ----------------------------------------------------------------------- $ audio element handlers $ ------------------------------------------------------------------ //

  /**
   * @description update playback state of all the audioElements to pause.
   */
  const pauseAllTracks = (
    tracks: TrackType[],
    audioElementArr: HTMLAudioElement[]
  ) => {
    tracks.forEach((_, index) => {
      audioElementArr[index].pause();
    });
  };

  /**
   * @description update playBackRate of AudioElements with the given rate.
   */
  const updatePlaybackRate = (
    playbackRate: number,
    tracks: TrackType[],
    audioElementarr: HTMLAudioElement[]
  ) => {
    tracks.forEach((_, index) => {
      audioElementarr[index].playbackRate = playbackRate;
    });
  };

  /**
   * @description update currentTime and palyback state of audioTrack wrt to current time of timeLine.
   */
  const handleTrackscurrentTimeAndState = (
    time: number,
    state: boolean,
    tracks: TrackType[],
    audioElementArr: HTMLAudioElement[]
  ) => {
    let ctr: any[] = [];
    tracks.forEach((tt, index) => {
      if (
        tt.startTime + tt.startPoint <= time &&
        time <= tt.startTime + tt.endPoint
      ) {
        if (audioRef.current[index].paused) {
          audioElementArr[index].currentTime =
            (time - (tt.startTime + tt.startPoint) + tt.startPoint) / 1000;
          // console.log(tt.startPoint,audioElementArr[index].currentTime,(time - (tt.startTime + tt.startPoint)));
        }
        state ? (ctr[index] = true) : audioElementArr[index].pause();
      } else {
        audioElementArr[index].currentTime = tt.startPoint / 1000;
        audioElementArr[index].pause();
      }
    });
    // const cc = Date.now();
    ctr.forEach((flag, idx) => {
      flag && audioElementArr[idx].play();
    });
    // console.log("delay",Date.now()-cc, "ms");
  };

  // ----------------------------------------------------------------------- $ helper functions -------- ---------------------------------------------------------------- //

  /**
   * @description increases time by given amount.
   * @param amount {number} by which time will be increased in milliseconds.
   * @param constraint {number} limit of the timeline in milliseconds.
   */
  const updateTime = (amount: number, constraint: number) => {
    setTime((old) => {
      if (old >= constraint) {
        setPlaying(false);
        return constraint;
      } else {
        let newtime = old + amount;
        return newtime;
      }
    });
  };

  // calculate seconds and miliseconds using float representation of time.
  // let s = useMemo(() => Math.floor(time / 1000), [time]);
  // let ms = useMemo(() => Math.round((time % 1000) / 20), [time]);
  // let ts = useMemo(() => Math.floor(time / 1000), [timeLineDuration]);
  // let tms = useMemo(() => Math.floor((time % 1000) / 20), [timeLineDuration]);

  // -------------------------------------------------$ Timeline subscriptions(states:[speed,time,timeLineTracks...]) $--------------------------------------------------- //

  useEffect(() => {
    setTime(Math.min(timeLineDuration, time));
  }, [timeLineDuration]);
  /**
   * @summary sideEffect hook triggers the @callback when [speed,timeLineTracks...] is mutated.
   * @callback updatePlaybackRate
   */
  useEffect(() => {
    audioRef.current &&
      updatePlaybackRate(speed, timeLineTracks, audioRef.current);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [speed, timeLineTracks.length, audioRef.current.length]);

  /**
   * @summary The following hook triggers on changing states [playing,speed] of The component.
   * @callback wrt dependancies [playing,speed] It sets/clears an timeinterval for which the states[time] is updated,
   *           and updates the state of audio elements by play/pause;
   */
  useEffect(() => {
    clearInterval(intervalID);
    if (playing) {
      handleTrackscurrentTimeAndState(
        time,
        true,
        timeLineTracks,
        audioRef.current
      );
      const ID = setInterval(
        updateTime,
        intervalDuration,
        speed * intervalDuration,
        timeLineDuration
      );
      setintervalID(ID);
    } else {
      pauseAllTracks(timeLineTracks, audioRef.current);
    }
    return () => {
      clearInterval(intervalID);
    };
  }, [playing, speed]);

  /**
   * @summary sideEffect hook triggers the callback when dependance states [time] is changed.
   * @callback handleTrackscurrentTimeAndState wrt to states [playing].
   */
  useEffect(() => {
    if (playing) {
      handleTrackscurrentTimeAndState(
        time,
        true,
        timeLineTracks,
        audioRef.current
      );
    } else {
      // (case : when we drag thumb and timeline is paused. )
      handleTrackscurrentTimeAndState(
        time,
        false,
        timeLineTracks,
        audioRef.current
      );
    }
  }, [time]);

  useEffect(() => {
    if (time == 0) {
      setPlaying((playing) => !playing);
      setTimeout(() => {
        setPlaying((playing) => !playing);
      }, 0);
    }
  }, [playing]);

  // ---------------------------------------------------------------- $ event handlers $ ---------------------------------------------------------------------------------- //

  /**
   * @description the following function/eventHandler provides dragging and dropping for the tracks by calculating the distance from the track container left edge to the left edge of the track.
   * @param event React MouseDown event on any Track present in the TimeLine
   * @param index it is the index of the track on which the event is fired.
   */
  const handler = (event: React.MouseEvent, index: number) => {
    console.log("Drag pill");

    event.preventDefault(); // prevent selection start (browser action).

    let shiftX =
      event.clientX - event.currentTarget.getBoundingClientRect().left;
    // shiftY not needed, the thumb moves only horizontally.

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    function onMouseMove(e: MouseEvent) {
      let newLeft =
        e.clientX -
        shiftX -
        wrapperRef.current[index].getBoundingClientRect().left;

      // the pointer is out of slider => lock the thumb within the bounaries.
      if (newLeft < 0) {
        newLeft = 0;
      }
      let rightEdge =
        wrapperRef.current[index].offsetWidth -
        thumbRef.current[index].offsetWidth;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      // thumbRef.current[index].style.left = newLeft + "px";
      let newTimeLineTracks = timeLineTracks.map((tt, idx) => {
        if (idx == index) {
          tt.startTime =
            (newLeft / wrapperRef?.current[index].offsetWidth) *
            timeLineDuration;
          if (tt.startTime <= time && time <= tt.startTime + tt.duration) {
            audioRef.current[index].currentTime = (time - tt.startTime) / 1000;
          } else {
            audioRef.current[index].currentTime = 0;
            audioRef.current[index].pause();
          }
        }
        return tt;
      });
      setTimeLineTracks(newTimeLineTracks);
    }

    function onMouseUp() {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  const TouchPillhandler = (event : React.TouchEvent , index:number) => {
    console.log("Touch Pill");
    const touch = event.touches[0];
    const shiftX = touch.clientX - event.currentTarget.getBoundingClientRect().left;
    document.addEventListener("touchmove",onTouchmove);
    document.addEventListener("touchend",onTouchend);

    function onTouchmove(e: TouchEvent){
      const touch = e.touches[0];
      let newLeft = touch.clientX - shiftX - wrapperRef.current[index].getBoundingClientRect().left;

      if (newLeft < 0) {
        newLeft = 0;
      }
      let rightEdge =
        wrapperRef.current[index].offsetWidth -
        thumbRef.current[index].offsetWidth;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      let newTimeLineTracks = timeLineTracks.map((tt, idx) => {
        if (idx == index) {
          tt.startTime =
            (newLeft / wrapperRef?.current[index].offsetWidth) *
            timeLineDuration;
          if (tt.startTime <= time && time <= tt.startTime + tt.duration) {
            audioRef.current[index].currentTime = (time - tt.startTime) / 1000;
          } else {
            audioRef.current[index].currentTime = 0;
            audioRef.current[index].pause();
          }
        }
        return tt;
      });
      setTimeLineTracks(newTimeLineTracks);
    }

    function onTouchend(e: TouchEvent){
      document.removeEventListener("touchend",onTouchend);
      document.removeEventListener("touchmove",onTouchmove);
    }

  }
  /**
   * @description the following function/eventHandler provides dragging and dropping for the timeline thumb by calculating the distance from the TimeLine container left edge to the left edge of the thumb.
   * @param e React MouseDown event on the TimeLine thumb present in the TimeLine.
   */
  const TimerDragHandler = (e: React.MouseEvent) => {
    console.log("Drag timer");
    setPlaying(false);
    e.preventDefault();
    let shiftX = e.clientX - e.currentTarget.getBoundingClientRect().left;
    document.addEventListener("mousemove", onMouseMoveTimer);
    document.addEventListener("mouseup", onMouseUpTimer);

    function onMouseMoveTimer(event: MouseEvent) {
      if (timeLineRef.current && timeRef.current) {
        let newLeft =
          event.clientX -
          shiftX -
          timeLineRef.current?.getBoundingClientRect().left;
        if (newLeft < 0) {
          newLeft = 0;
        }

        let rightEdge =
          timeLineRef.current?.offsetWidth - timeRef.current?.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }

        let newTime =
          (newLeft / timeLineRef.current?.offsetWidth) * timeLineDuration;
        setTime(newTime);
      }
    }

    function onMouseUpTimer() {
      document.removeEventListener("mousemove", onMouseMoveTimer);
      document.removeEventListener("mouseup", onMouseUpTimer);
    }
  };

  const TouchTimerDragHandler = (e: React.TouchEvent) => {
    console.log("Touch timer");
    setPlaying(false);
    const touch = e.touches[0];
    let shiftX = touch.clientX - e.currentTarget.getBoundingClientRect().left;
    document.addEventListener("touchmove", onTouchMoveTimer);
    document.addEventListener("touchend", onTouchEndTimer);

    function onTouchMoveTimer(event: TouchEvent) {
      if (timeLineRef.current && timeRef.current) {
        const touch = event.touches[0];
        let newLeft =
          touch.clientX -
          shiftX -
          timeLineRef.current?.getBoundingClientRect().left;
        if (newLeft < 0) {
          newLeft = 0;
        }

        let rightEdge =
          timeLineRef.current?.offsetWidth - timeRef.current?.offsetWidth;
        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }

        let newTime =
          (newLeft / timeLineRef.current?.offsetWidth) * timeLineDuration;
        setTime(newTime);
      }
    }

    function onTouchEndTimer() {
      document.removeEventListener("touchmove", onTouchMoveTimer);
      document.removeEventListener("touchend", onTouchEndTimer);
    }
  };
  const startPointDragHandler = (e: React.MouseEvent, index: number) => {
    console.log("Drag startpoint");
    e.preventDefault();
    e.stopPropagation();
    setPlaying(false);
    let shiftX = e.clientX - e.currentTarget.getBoundingClientRect().left;
    document.addEventListener("mousemove", onMouseMoveTimer);
    document.addEventListener("mouseup", onMouseUpTimer);
    function onMouseMoveTimer(event: MouseEvent) {
      if (thumbRef.current) {
        let newLeft =
          event.clientX -
          shiftX -
          thumbRef.current[index].getBoundingClientRect().left;
        if (newLeft < 0) {
          newLeft = 0;
        }
        // console.log(newLeft);

        let newStartPoint =
          (newLeft / thumbRef.current[index].offsetWidth) *
          timeLineTracks[index].duration;
        if (newStartPoint > timeLineTracks[index].endPoint) {
          newStartPoint = timeLineTracks[index].endPoint;
        }

        let newTimeLineTracks = timeLineTracks.map((tt, idx) => {
          if (idx == index) {
            tt.startPoint = newStartPoint;
          }
          return tt;
        });
        setTimeLineTracks(newTimeLineTracks);
      }
    }

    function onMouseUpTimer() {
      document.removeEventListener("mousemove", onMouseMoveTimer);
      document.removeEventListener("mouseup", onMouseUpTimer);
    }
  };
  const TouchstartPointDragHandler = (e: React.TouchEvent, index: number) => {
    console.log("Touch start point");
    e.stopPropagation();
    setPlaying(false);
    const touch = e.touches[0]
    let shiftX = touch.clientX - e.currentTarget.getBoundingClientRect().left;
    document.addEventListener("touchmove", onTouchMoveTimer);
    document.addEventListener("touchend", onTouchendTimer);
    function onTouchMoveTimer(event: TouchEvent) {
      if (thumbRef.current) {
        const touch = event.touches[0];
        let newLeft =
          touch.clientX -
          shiftX -
          thumbRef.current[index].getBoundingClientRect().left;
        if (newLeft < 0) {
          newLeft = 0;
        }
        // console.log(newLeft);

        let newStartPoint =
          (newLeft / thumbRef.current[index].offsetWidth) *
          timeLineTracks[index].duration;
        if (newStartPoint > timeLineTracks[index].endPoint) {
          newStartPoint = timeLineTracks[index].endPoint;
        }

        let newTimeLineTracks = timeLineTracks.map((tt, idx) => {
          if (idx == index) {
            tt.startPoint = newStartPoint;
          }
          return tt;
        });
        setTimeLineTracks(newTimeLineTracks);
      }
    }

    function onTouchendTimer() {
      document.removeEventListener("touchmove", onTouchMoveTimer);
      document.removeEventListener("mouseup", onTouchendTimer);
    }
  };
  const endPointDragHandler = (e: React.MouseEvent, index: number) => {
    console.log("Drag endPoint");
    e.preventDefault();
    e.stopPropagation();
    setPlaying(false);
    let shiftX = e.clientX - e.currentTarget.getBoundingClientRect().left;
    document.addEventListener("mousemove", onMouseMoveTimer);
    document.addEventListener("mouseup", onMouseUpTimer);
    function onMouseMoveTimer(event: MouseEvent) {
      if (thumbRef.current) {
        let newLeft =
          event.clientX -
          shiftX -
          thumbRef.current[index].getBoundingClientRect().left;
        if (newLeft < 0) {
          newLeft = 0;
        }
        if (newLeft > thumbRef.current[index].offsetWidth) {
          newLeft = thumbRef.current[index].offsetWidth;
        }
        // console.log(newLeft);

        let newEndPoint =
          (newLeft / thumbRef.current[index].offsetWidth) *
          timeLineTracks[index].duration;
        if (newEndPoint < timeLineTracks[index].startPoint) {
          newEndPoint = timeLineTracks[index].endPoint;
        }

        let newTimeLineTracks = timeLineTracks.map((tt, idx) => {
          if (idx == index) {
            tt.endPoint = newEndPoint;
          }
          return tt;
        });
        setTimeLineTracks(newTimeLineTracks);
      }
    }

    function onMouseUpTimer() {
      document.removeEventListener("mousemove", onMouseMoveTimer);
      document.removeEventListener("mouseup", onMouseUpTimer);
    }
  };
  const TouchendPointDragHandler = (e: React.TouchEvent, index: number) => {
    console.log("Touch end point");
    e.stopPropagation();
    setPlaying(false);
    const touch = e.touches[0];
    let shiftX = touch.clientX - e.currentTarget.getBoundingClientRect().left;
    document.addEventListener("touchmove", onTouchMoveTimer);
    document.addEventListener("touchend", onTouchendTimer);
    function onTouchMoveTimer(event: TouchEvent) {
      if (thumbRef.current) {
        const touch = event.touches[0];
        let newLeft =
          touch.clientX -
          shiftX -
          thumbRef.current[index].getBoundingClientRect().left;
        if (newLeft < 0) {
          newLeft = 0;
        }
        if (newLeft > thumbRef.current[index].offsetWidth) {
          newLeft = thumbRef.current[index].offsetWidth;
        }
        // console.log(newLeft);

        let newEndPoint =
          (newLeft / thumbRef.current[index].offsetWidth) *
          timeLineTracks[index].duration;
        if (newEndPoint < timeLineTracks[index].startPoint) {
          newEndPoint = timeLineTracks[index].endPoint;
        }

        let newTimeLineTracks = timeLineTracks.map((tt, idx) => {
          if (idx == index) {
            tt.endPoint = newEndPoint;
          }
          return tt;
        });
        setTimeLineTracks(newTimeLineTracks);
      }
    }

    function onTouchendTimer() {
      document.removeEventListener("touchmove", onTouchMoveTimer);
      document.removeEventListener("touchend", onTouchendTimer);
    }
  };

  
  // -------------------------------------------------------------------------- $ jsx $ ----------------------------------------------------------------------------------- //
  return (
    <div className="min-h-screen overflow-clip bg-systembgDark-300">
      {/* header */}
      <header className="relative aspect-[1442/237] text-center text-xl flex justify-center items-center text-systembgLight-100">
        <HeaderSpline className="w-screen absolute h-auto" />
        ⌘iSound
      </header>
      {/* tracks */}
      <div className="flex mb-5 justify-around">
        <Button
          onClick={addDemoFiles}
          className="bg-[size:400%] bg-[linear-gradient(-45deg,#91a100,#0e5987,#61092b,#ce3000)]  animate-animate-gradient text-xs md:text-sm lg:text-base"
        >
          Demo
        </Button>
        <Sheet>
          <SheetTrigger className="text-xs md:text-sm lg:text-base text-systembgLight-300 bg-systembgDark-200 p-1 px-2 rounded-md w-fit">
            My Media
          </SheetTrigger>
          <SheetContent className="overflow-auto p-0 lg:max-w-screen-md">
            <Media addTrack={addTrack} GsetFiles={setGfiles} Gfiles={Gfiles} />
          </SheetContent>
        </Sheet>
      </div>
      <TrackList addTrack={addTrack} />
      {/* controls of the TimeLine i.e time, playback speed, play/pause button */}
      <div className="flex justify-between p-2 select-none items-center">
        <div className="text-xs md:text-sm lg:text-base flex-1 flex items-center text-systembgLight-200">
          <span className="">Time: </span> <Time time={time} /> /
          <Select
            value={timeLineDuration.toString()}
            onValueChange={changeTimelineDuration}
          >
            <SelectTrigger className="border-none p-0 text-xs md:text-sm lg:text-base h-fit w-fit focus:ring-0 hover:bg-systembgDark-100">
              <SelectValue>
                <Time time={timeLineDuration} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-systembgDark-200 text-systembgLight-100">
              <SelectItem
                disabled={
                  timeLineTracks.findIndex((tt) => tt.duration >= 30000) >= 0
                }
                value="30000"
              >
                30s
              </SelectItem>
              <SelectItem
                disabled={
                  timeLineTracks.findIndex((tt) => tt.duration >= Math.max(timeLineDuration - 30000,60000)) >= 0
                }
                value={`${Math.max(timeLineDuration - 30000,60000)}`}
              >
                {`${Math.max(timeLineDuration - 30000,60000)/60000}m`}
              </SelectItem>
              <SelectItem
                disabled={
                  timeLineTracks.findIndex((tt) => tt.duration >= timeLineDuration + 60000) >= 0
                }
                value={`${timeLineDuration + 60000}`}
              >
                {`${(timeLineDuration + 60000)/60000}m`}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 cursor-pointer">
          {!playing ? (
            <PlayIcon
              onClick={handlePlayPause}
              className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 transition-all duration-500 text-systembgLight-300 rounded-full bg-systembgDark-100 p-1"
            />
          ) : (
            <PauseIcon
              onClick={handlePlayPause}
              className="text-systembgLight-300 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-systembgDark-100 p-1 transition-all duration-500"
            />
          )}
        </div>
        <div
          onClick={handleSpeed}
          className="cursor-pointer select-none text-xs md:text-sm lg:text-base bg-systembgDark-200 hover:bg-systembgDark-100 rounded px-2 p-0.5 text-systembgLight-300"
        >
          {speed}x
        </div>
      </div>
      {/* TimeLine container */}
      <div
        ref={timeLineRef}
        className="w-100vw md:w-[calc(100vw-2rem)] overflow-y-clip overflow-x-visible flex flex-col gap-2 py-4 min-h-16 relative"
      >
        <div className="absolute w-[calc(100%+1px)] h-full border-r border-[#565656]">
          <TimelineMarks time={timeLineDuration / 1000} />
        </div>
        {/* TimeLine thumb */}
        <div
          ref={timeRef}
          onMouseDown={TimerDragHandler}
          draggable={true}
          onDragStart={() => false}
          onTouchStart={TouchTimerDragHandler}
          style={{ left: `${(time * 100) / timeLineDuration}%` }}
          className="transition-all touch-none duration-100 -translate-y-4 z-10 cursor-pointer absolute h-[calc(100%)] flex flex-col items-center"
        >
          <div className="absolute z-10 p-1 rounded-xl bg-systemTintLight-indigo text-xs text-systemGbgDark-300">
            <Time time={time} />
          </div>
          <div className="w-0.5 opacity-80 bg-systemTintLight-indigo h-full"></div>
        </div>
        {/* TimeLine Track container */}
        {timeLineTracks.map((track, index) => (
          <div
            key={index}
            ref={(element: HTMLDivElement) =>
              (wrapperRef.current[index] = element)
            }
            className={`${index % 2 == 0 ? "bg-systembgDark-200" : ""} py-2 ${
              index == 0 && "mt-10"
            }`}
          >
            {/* TimeLine tracks */}
            <div
              ref={(element: HTMLDivElement) =>
                (thumbRef.current[index] = element)
              }
              draggable={true}
              onMouseDown={(e: React.MouseEvent) => handler(e, index)}
              onTouchStart={(e: React.TouchEvent) => TouchPillhandler(e, index)}
              onDragStart={() => false}

              style={{
                width: `${(track.duration * 100) / timeLineDuration}%`,
                position: "relative",
                left: `${(track.startTime * 100) / timeLineDuration}%`,
                background: `linear-gradient(to right,#444,#444 ${
                  (track.startPoint * 100) / track.duration
                }%,${track.color} ${
                  (track.startPoint * 100) / track.duration
                }%,${track.color} ${
                  (track.endPoint * 100) / track.duration
                }%,#444 ${(track.endPoint * 100) / track.duration}%)`,
              }}
              className={`group touch-none relative flex items-center cursor-pointer rounded-md p-2 min-h-8 flex-1 text-center`}
            >
              <div
                draggable={true}
                onMouseDown={(e: React.MouseEvent) =>
                  startPointDragHandler(e, index)
                }
                onDragStart={() => false}
                onTouchStart={(e: React.TouchEvent) => TouchstartPointDragHandler(e,index)}
                style={{
                  left: `${(track.startPoint * 100) / track.duration}%`,
                }}
                className="absolute cursor-ew-resize h-full border-l-2 border-white"
              ></div>
              <div
                draggable={true}
                onMouseDown={(e: React.MouseEvent) =>
                  endPointDragHandler(e, index)
                }
                onTouchStart={(e:React.TouchEvent) => TouchendPointDragHandler(e,index)}
                onDragStart={() => false}
                style={{
                  left: `${(track.endPoint * 100) / track.duration}%`,
                }}
                className="absolute cursor-ew-resize h-full border-l-2 border-white"
              ></div>
              <div className="self-stretch p-0.5 rounded bg-systembgLight-100"></div>
              <p className="text-xs line-clamp-1 sm:text-sm w-full overflow-hidden text-ellipsis">
                {track.title}
              </p>
              <div className="self-stretch p-0.5 rounded bg-systembgLight-100"></div>
              <audio
                ref={(element: HTMLAudioElement) =>
                  (audioRef.current[index] = element)
                }
                src={track.source}
                preload="auto"
                controls
                className="hidden"
              ></audio>
              <Tooltip track={track} />
              <div
                onClick={(e) => handleRemoveTrack(index)}
                className="group-hover:block touch-none hidden absolute right-0 top-1/2 -translate-y-1/2 size-5 sm:size-6"
              >
                <Image
                  src="/assets/wrongIcon.svg"
                  objectFit="cover"
                  className="text-systembgDark-100"
                  layout="fill"
                  alt="x icon"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
