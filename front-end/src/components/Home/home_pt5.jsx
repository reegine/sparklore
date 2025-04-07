import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import vid1 from "../../assets/video/vid1.mp4";
import vid2 from "../../assets/video/vid2.mp4";
import vid3 from "../../assets/video/vid3.mp4";
import vid4 from "../../assets/video/vid4.mp4";
import vid5 from "../../assets/video/vid1.mp4";

const VideoCarousel = () => {
  const scrollRef = useRef(null);
  const videoRefs = useRef([]);

  const videos = [vid1, vid2, vid3, vid4, vid5];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      current.scrollLeft += direction === "left" ? -300 : 300;
    }
  };

  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (i === index) {
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  return (
    <div className="relative bg-[#F9F5EE] py-8 px-0 md:px-[10rem]">
      <div className="max-w-6xl mx-auto flex items-center">
        {/* Left Chevron - Hidden on mobile, shown on desktop */}
        <button
          className="hidden md:flex absolute left-40 z-10 p-2"
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Video Carousel */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth space-x-4 px-4 md:px-10"
        >
          {videos.map((video, index) => (
            <div key={index} className="relative w-[15rem] h-[27rem] flex-shrink-0">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={video}
                className="w-full h-full object-cover rounded-lg"
                muted
                loop
                playsInline
              />
              <button
                className="absolute inset-0 flex items-center justify-center"
                onClick={() => handlePlay(index)}
              >
                <Play size={40} className="text-white bg-black/50 rounded-full p-2" />
              </button>
            </div>
          ))}
        </div>

        {/* Right Chevron - Hidden on mobile, shown on desktop */}
        <button
          className="hidden md:flex absolute right-40 z-10 p-2"
          onClick={() => scroll("right")}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Hide scrollbar in desktop mode */}
      <style jsx>{`
        @media (min-width: 768px) {
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
          .overflow-x-auto {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoCarousel;