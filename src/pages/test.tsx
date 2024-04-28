import React, { DragEvent, useRef, useState } from "react";

type Props = {};

const test = (props: Props) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

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
  };

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
      const newFiles = [...files, cfile];
      setFiles(newFiles);
      // Here, you can handle the file (e.g., upload it to a server)
    }
  };

  return (
    <div className="p-10 gap-4 min-h-screen bg-systembgDark-300">
      <div
        style={{
          background:
            " linear-gradient(-45deg, #91a100, #0e5987, #61092b, #ce3000) center / 400%",
        }}
        className={`border-2 ${
          dragOver ? "border-systembgDark-100" : "border-transparent"
        } mx-auto overflow-hidden mb-10 h-60 max-w-screen-md rounded-lg flex flex-col group justify-center text-center cursor-pointer bg-[size:400%] dropzone_gradient animate-animate-gradient`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          style={{ display: "none" }}
          accept=".mp3"
        />
        {error && (
          <p className="text-white group-hover:scale-125 transition-all duration-500">
            {error}
          </p>
        )}
        {!error && (
          <p className="text-white text-lg md:text-2xl group-hover:scale-125 transition-all duration-500">
            DROP AUDIO FILES HERE
          </p>
        )}
        {!error && (
          <p className="text-white text-xs md:text-base group-hover:scale-125 transition-all duration-500">
            Accepts 0.5 to 10 MB and 1second to 5 minutes
          </p>
        )}
      </div>
      <section className="max-w-screen-md mx-auto flex flex-col gap-4">
        {files.map((file, index) => (
          <div className="rounded-lg bg-systembgDark-100 p-2 text-sm text-white flex">
            <p>{file.name}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default test;
