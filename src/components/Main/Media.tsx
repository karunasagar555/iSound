import React, { DragEvent, useEffect, useRef, useState } from "react";
import Time from "./Time";
import { randomHexColor } from "@/util/helper";
import { Spinner } from "../../../public/assets/svgIcons";

type Props = {
  Gfiles: Array<FileType>;
  addTrack: (arg: MinimalTrackType) => void;
  GsetFiles: (arg: FileType[]) => void;
};


const Media = ({ Gfiles, GsetFiles, addTrack }: Props) => {
  const [uploadStarted, setuploadStarted] = useState(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

  useEffect(() => {
    if (Gfiles) {
      setFiles([...Gfiles]);
    }
  }, []);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click(); // Trigger the file input click
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
    setuploadStarted(false);
  };

  const setUploading = (e: any) => {
    setuploadStarted(true);
  }
  const processFiles = (cfiles: FileList) => {
    if (cfiles.length > 0) {
      const cfile = cfiles[0];
      if (cfile.size > 10 * 1024 * 1024) {
        // 10MB max size
        setError("File size must not exceed 10MB");
        let timeout = setTimeout(() => {
          setError("");
          clearTimeout(timeout);
        }, 2000);
        return;
      }
      if (cfile.type !== "audio/mpeg") {
        setError("Only MP3 files are allowed");
        let timeout = setTimeout(() => {
          setError("");
          clearTimeout(timeout);
        }, 2000);
        return;
      }
      setError("");
      const audio = document.createElement("audio");
      const reader = new FileReader();
      reader.onload = function (e) {
        audio.src = e.target?.result as string;
        audio.addEventListener(
          "loadedmetadata",
          function () {
            // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
            var duration = audio.duration;
            const track = {
              color: randomHexColor(),
              title: cfile.name,
              startTime: 0,
              endTime: duration * 1000,
              duration: duration * 1000,
              source: URL.createObjectURL(cfile),
            };
            const newFiles = [...files, {file:cfile,track}];
            setFiles(newFiles);
            GsetFiles([...newFiles]);
          },
          false
        );
      };
      reader.readAsDataURL(cfile);
    }
  };

  const handleAddTrack = (index: number): void => {
    addTrack(files[index].track);
  };

  return (
    <div className="p-10 gap-4 min-h-screen bg-systembgDark-200">
      <div
        className={`mx-auto relative overflow-hidden mb-10 h-60 max-w-screen-md rounded-lg flex flex-col group justify-center text-center cursor-pointer bg-[size:400%] bg-[linear-gradient(-45deg,#91a100,#0e5987,#61092b,#ce3000)]  animate-animate-gradient`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          onClick={setUploading}
          disabled={uploadStarted}
          style={{ display: "none" }}
          accept=".mp3"
        />
        {uploadStarted && (
          <div className="z-10 rounded-lg overflow-hidden absolute inset-0 bg-gray-950 backdrop-blur-sm bg-opacity-40 flex justify-center items-center">
            <Spinner className="w-4 h-4 me-2 text-systemGrayDark-400 animate-spin fill-systembgDark-200" /><p className="text-systembgLight-300">Awaiting file selection</p>
          </div>
        )}
        {error && (
          <p className="text-white group-hover:scale-105 transition-all duration-500">
            {error}
          </p>
        )}
        {!error && (
          <p className="text-white text-sm lg:text-lg group-hover:scale-105 transition-all duration-500">
            DROP AUDIO FILES HERE
          </p>
        )}
        {!error && (
          <p className="text-white text-xs lg:text-sm group-hover:scale-105 transition-all duration-500">
            Accepts 0.5 to 10 MB and 1second to 5 minutes
          </p>
        )}
      </div>
      <section className="max-w-screen-md mx-auto flex flex-col gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            onClick={() => handleAddTrack(index)}
            className="hover:scale-105 transition-all duration-300 justify-between cursor-grab rounded-lg bg-systembgDark-100 p-2 text-sm text-white flex"
          >
            <p className="overflow-hidden text-ellipsis w-3/4">{file.file.name}</p>
            <p><Time time={file.track.duration} /></p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Media;
