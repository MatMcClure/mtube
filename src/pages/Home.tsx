import React, { useEffect, useState, useRef } from "react";
//import Loading from "../components/loading";
import "../styles/Home.css";
//import banner from "../images/banner_img2.png";
import type { YouTubeVideo } from "../components/youtube";
import loadingImg from "../images/loading_img.jpg"; 
import colorgradeImg from "../images/colorgradeimg.png";
import ColorGradeReveal from "../components/colorgrade";
import helmetImg from "../images/helmet.png";
import jacketImg from "../images/jacket.png";
import glovesImg from "../images/gloves.png";
import bootsImg from "../images/boots.png";
import pantsImg from "../images/pants.png";
import suitImg from "../images/suit.png";
import cameraImg from "../images/camera.png";
import micImg from "../images/micmini.png";
//import CameraSettingsSection from "../components/camerasettings";

const PANELS = 3;
const CHANNEL_ID = "UCrcsK5kCyBSncGzdwWLGoRQ";

const Home = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const gearTrackRef = useRef<HTMLDivElement>(null);

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [hovered, setHovered] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

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

  useEffect(() => {
    if (!cameraRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setShowCamera(true);
          observer.disconnect(); // only animate once
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(cameraRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let currentX = 0;
    let targetX = 0;

    const onScroll = () => {
      if (!gearTrackRef.current) return;

      const section = gearTrackRef.current.parentElement!;
      const start = section.offsetTop;
      const end = start + section.offsetHeight - window.innerHeight;

      const maxX = window.innerWidth * 1; // only ONE gear panel to slide

      if (window.scrollY < start) {
        targetX = 0;
      } else if (window.scrollY > end) {
        targetX = maxX;
      } else {
        const progress = (window.scrollY - start) / (end - start);
        targetX = progress * maxX;
      }
    };

    const smooth = () => {
      if (!gearTrackRef.current) return;
      currentX += (targetX - currentX) * 0.08;
      gearTrackRef.current.style.transform = `translateX(-${currentX}px)`;
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
    </section>
      <section
        ref={cameraRef}
        className={`camera-settings-section ${showCamera ? "show" : ""}`}
      >
        <div className="camera-info">
          <p>Camera Settings</p>
          <p>🎥 4K 30 FPS</p>
          <p>⏱ 1/60 Shutter Angle</p>
          <p>🌡 ISO 100 ~ 800</p>
          <p>🪨 RockSteady: Off</p>
        </div>

        <ColorGradeReveal src={colorgradeImg} />
      </section>
      <section className="horizontal-gear-section">
        <div className="horizontal-gear-track" ref={gearTrackRef}>
          <div className="gear-panel">
            <div className="gear-grid">
              <a className="gear-item" href="https://www.alpinestars.com/products/supertech-r10-element-helmet-black-carbon-bright-red-white-glossy" target="_blank" rel="noopener noreferrer">
                <img src={helmetImg} alt="R10 Helmet" className="gear-item-img" />
              </a>
              <a className="gear-item" href="https://www.alpinestars.com/products/t-gp-plus-v4-airflow-jacket-black-black" target="_blank" rel="noopener noreferrer">
                <img src={jacketImg} alt="GP Plus Jacket" className="gear-item-img" />
              </a>
              <a className="gear-item" href="https://www.alpinestars.com/products/gp-pro-rs4-gloves-black-red-fluo-white" target="_blank" rel="noopener noreferrer">
                <img src={glovesImg} alt="GP RS4 Gloves" className="gear-item-img" />
              </a>
              <a className="gear-item" href="https://www.alpinestars.com/products/supertech-r-vented-boots-2020-black-white-red-fluo" target="_blank" rel="noopener noreferrer">
                <img src={bootsImg} alt="Supertech Boots" className="gear-item-img" />
              </a>
              <a className="gear-item" href="https://www.uglybrosusa.com/collections/mens/products/moto-jogger-v3-black" target="_blank" rel="noopener noreferrer">
                <img src={pantsImg} alt="Uglybros Pants" className="gear-item-img" />
              </a>
              <a className="gear-item" href="https://www.alpinestars.com/products/gp-plus-v4-sprint-1pc-leather-suit-red-fluo-mid-red-white" target="_blank" rel="noopener noreferrer">
                <img src={suitImg} alt="Uglybros Pants" className="gear-item-img" />
              </a>
              <a className="gear-item" href="https://www.dji.com/osmo-action-4" target="_blank" rel="noopener noreferrer">
                <img src={cameraImg} alt="DJI Camera" className="gear-item-img" />
              </a>
              <a className="gear-item" href="https://www.dji.com/mic-mini" target="_blank" rel="noopener noreferrer">
                <img src={micImg} alt="DJI Mic" className="gear-item-img" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;