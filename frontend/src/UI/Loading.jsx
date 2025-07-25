import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white z-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-blue-300 border-b-transparent animate-[spin_2s_linear_infinite]"></div>
      </div>
    </div>
  );
};

export default Loading;