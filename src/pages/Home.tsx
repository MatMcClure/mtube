import React, { useEffect, useState, useRef } from "react";
//import Loading from "../components/loading";
import "../styles/Home.css";
//import banner from "../images/banner_img2.png";
import type { YouTubeVideo } from "../components/youtube";

const PANELS = 3;
const CHANNEL_ID = "UCrcsK5kCyBSncGzdwWLGoRQ";

const Home = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  // 🔹 Fetch videos
useEffect(() => {
  const fetchVideos = async () => {
    try {
      const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

      if (!API_KEY) {
        console.error("Missing YouTube API key");
        return;
      }

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=3&order=date&type=video&key=${API_KEY}`
      );

      const data = await res.json();

      console.log("YouTube response:", data); // ← keep for debugging

      if (!Array.isArray(data.items)) {
        console.error("Invalid YouTube response", data);
        setVideos([]);
        return;
      }

      setVideos(data.items);
    } catch (err) {
      console.error(err);
      setVideos([]);
    }
  };

  fetchVideos();
}, []);


  // 🔹 Horizontal scroll logic (same as before)
  useEffect(() => {
    let currentX = 0;
    let targetX = 0;

    const onScroll = () => {
      if (!trackRef.current) return;
      const section = trackRef.current.parentElement!;
      const start = section.offsetTop;
      const end = start + section.offsetHeight - window.innerHeight;

      if (window.scrollY >= start && window.scrollY <= end) {
        const progress = (window.scrollY - start) / (end - start);
        targetX = progress * window.innerWidth * (PANELS - 1);
      }
    };

    const smooth = () => {
      currentX += (targetX - currentX) * 0.08;
      trackRef.current!.style.transform = `translateX(-${currentX}px)`;
      requestAnimationFrame(smooth);
    };

    window.addEventListener("scroll", onScroll);
    smooth();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="horizontal-section">
      <div className="horizontal-track" ref={trackRef}>
        {videos.map((video) => (
          <div key={video.id.videoId} className="panel video-panel">
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
              />
              <h3>{video.snippet.title}</h3>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;