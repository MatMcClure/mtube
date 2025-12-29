import React, { useEffect, useState, useRef } from "react";
//import Loading from "../components/loading";
import "../styles/Home.css";
//import banner from "../images/banner_img2.png";
import type { YouTubeVideo } from "../components/youtube";
import loadingImg from "../images/loading_img.jpg"; 
import colorgradeImg from "../images/colorgradeimg.png";
import ColorGradeReveal from "../components/colorgrade";

const PANELS = 3;
const CHANNEL_ID = "UCrcsK5kCyBSncGzdwWLGoRQ";

const Home = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [hovered, setHovered] = useState(false);

  // 🔹 Fetch videos
useEffect(() => {
  const fetchVideos = async () => {
    try {
      const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY!;
      
      // 1️⃣ Get uploads playlist
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      const channelData = await channelRes.json();
      console.log("Channel status:", channelRes.status);
      console.log("Channel response:", channelData);

      const uploadsPlaylistId =
        channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        console.error("No uploads playlist found", channelData);
        return;
      }

      // 2️⃣ Get last 3 uploads
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=3&key=${API_KEY}`
      );

      const videosData = await videosRes.json();

      if (!Array.isArray(videosData.items)) {
        console.error("Invalid playlist response", videosData);
        return;
      }

      setVideos(videosData.items);
    } catch (err) {
      console.error(err);
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
      const maxX = window.innerWidth * (PANELS - 1);

      if (window.scrollY < start) {
        targetX = 0; // 🔑 force reset
      } else if (window.scrollY > end) {
        targetX = maxX; // 🔑 clamp end
      } else {
        const progress = (window.scrollY - start) / (end - start);
        targetX = progress * maxX;
      }
    };

    const smooth = () => {
      if (!trackRef.current) return;

      currentX += (targetX - currentX) * 0.08;
      trackRef.current.style.transform = `translateX(-${currentX}px)`;
      requestAnimationFrame(smooth);
    };

    window.addEventListener("scroll", onScroll);
    smooth();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

return (
  <section className="home-page">
    <div className="top-logo">
      <img src={loadingImg} alt="Logo" />
    </div>
    <section className={`horizontal-section ${hovered ? "dimmed" : ""}`}>
      <div className="horizontal-track" ref={trackRef}>
        {videos.map((video) => {
          const videoId = video.snippet.resourceId.videoId;
          return (
            <div key={videoId} className="panel video-panel">
              <div
                className="video-wrapper"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <img
                  className="thumbnail"
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                />
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`}
                  allow="autoplay"
                  title={video.snippet.title}
                />
              </div>
              <h3>{video.snippet.title}</h3>
            </div>
          );
        })}
      </div>
        <section className="colorgrade-section">
          <ColorGradeReveal src={colorgradeImg}/>
      </section>
    </section>
  </section>
  );
};


export default Home;