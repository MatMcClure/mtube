import React, { useEffect, useState, useRef } from "react";
//import Loading from "../components/loading";
import "../styles/Home.css";
//import banner from "../images/banner_img2.png";
import type { YouTubeVideo } from "../components/youtube";
import loadingImg from "../images/loading_img.jpg"; 
import colorgradeImg from "../images/colorgradeimg.png";
import ColorGradeReveal from "../components/colorgrade";
import Footer from "../components/footer";
import helmetImg from "../images/helmet.png";
import jacketImg from "../images/jacket.png";
import glovesImg from "../images/gloves.png";
import bootsImg from "../images/boots.png";
import pantsImg from "../images/pants.png";
import suitImg from "../images/suit.png";
import cameraImg from "../images/camera.png";
import micImg from "../images/micmini.png";
import youtubeImg from "../images/youtube.png";
import tiktokImg from "../images/tiktok.png";
import arrowUp from "../images/arrowup.png";
//import CameraSettingsSection from "../components/camerasettings";

// const PANELS = 6;
const FULL_VIDEO_COUNT = 6;
const PLAYLIST_FETCH_COUNT = 15;
const CHANNEL_ID = "UCrcsK5kCyBSncGzdwWLGoRQ";

const Home = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  // const cameraRef = useRef<HTMLDivElement>(null);
  const gearTrackRef = useRef<HTMLDivElement>(null);

  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [hovered, setHovered] = useState(false);
  // const [showCamera, setShowCamera] = useState(false);
  
  const chunkVideos = (videos: YouTubeVideo[], size: number) => {
  const chunks = [];
    for (let i = 0; i < videos.length; i += size) {
      chunks.push(videos.slice(i, i + size));
    }
    return chunks;
  };

  const videoPanels = chunkVideos(videos, 6);
  // const VIDEO_PANELS = videoPanels.length;

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
// 2️⃣ Get recent uploads (grab more than needed)
const videosRes = await fetch(
  `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${PLAYLIST_FETCH_COUNT}&key=${API_KEY}`
);

const videosData = await videosRes.json();
if (!Array.isArray(videosData.items)) return;

// collect video IDs
const videoIds = videosData.items
  .map((item: any) => item.snippet.resourceId.videoId)
  .join(",");

      // 3️⃣ Get video durations
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
      );

      const detailsData = await detailsRes.json();

      // helper: filter out shorts
      const isLongerThan60s = (duration: string) => {
        const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
        const minutes = Number(match?.[1] || 0);
        const seconds = Number(match?.[2] || 0);
        return minutes * 60 + seconds > 70;
      };

      // filter + limit
      const fullVideos = videosData.items.filter((item: any) => {
        const videoId = item.snippet.resourceId.videoId;
        const details = detailsData.items.find((v: any) => v.id === videoId);
        return details && isLongerThan60s(details.contentDetails.duration);
      });

      setVideos(fullVideos.slice(0, FULL_VIDEO_COUNT));

      } catch (err) {
        console.error(err);
      }
    };

    fetchVideos();
  }, []);

  // 🔹 Horizontal scroll logic (same as before)
  // useEffect(() => {
  //   let currentX = 0;
  //   let targetX = 0;

  //   const onScroll = () => {
  //     if (!trackRef.current) return;

  //     const section = trackRef.current.parentElement!;
  //     const start = section.offsetTop;
  //     const end = start + section.offsetHeight - window.innerHeight;

  //     const maxX = window.innerWidth * (VIDEO_PANELS - 1);

  //     if (window.scrollY <= start) {
  //       targetX = 0;
  //       return;
  //     }

  //     if (window.scrollY >= end) {
  //       targetX = maxX;
  //       return;
  //     }

  //     const progress = (window.scrollY - start) / (end - start);
  //     targetX = progress * maxX;

  //     // 🔹 SNAP PER PANEL
  //     targetX =
  //       Math.round(targetX / window.innerWidth) * window.innerWidth;
  //   };

  //   const smooth = () => {
  //     if (!trackRef.current) return;
  //     currentX += (targetX - currentX) * 0.08;
  //     trackRef.current.style.transform = `translateX(-${currentX}px)`;
  //     requestAnimationFrame(smooth);
  //   };

  //   window.addEventListener("scroll", onScroll);
  //   smooth();

  //   return () => window.removeEventListener("scroll", onScroll);
  // }, [VIDEO_PANELS]);

  const cameraTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentX = 0;
    let targetX = 0;

    const onScroll = () => {
      if (!cameraTrackRef.current) return;

      const section = cameraTrackRef.current.parentElement!;
      const start = section.offsetTop;
      const end = start + section.offsetHeight - window.innerHeight;
      const maxX = window.innerWidth; // 1 panel slide

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
      if (!cameraTrackRef.current) return;
      currentX += (targetX - currentX) * 0.08;
      cameraTrackRef.current.style.transform = `translateX(-${currentX}px)`;
      requestAnimationFrame(smooth);
    };

    window.addEventListener("scroll", onScroll);
    smooth();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let currentX = 0;
    let targetX = 0;

    const onScroll = () => {
      if (!gearTrackRef.current) return;

      const section = gearTrackRef.current.parentElement!;
      const start = section.offsetTop;
      const end = start + section.offsetHeight - window.innerHeight;

      const maxX = window.innerWidth; // ONE panel

      if (window.scrollY <= start) {
        targetX = 0;
        return;
      }

      if (window.scrollY >= end) {
        targetX = maxX;
        return;
      }

      const progress = (window.scrollY - start) / (end - start);
      targetX = progress * maxX;

      // 🔹 SNAP HERE
      targetX =
        Math.round(targetX / window.innerWidth) * window.innerWidth;
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


  const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  };

return (
  <section className="home-page">
    <nav className="section-nav">
      <button onClick={() => trackRef.current?.closest('section')?.scrollIntoView({ behavior: 'smooth' })}>
        Videos
      </button>
      <button onClick={() => cameraTrackRef.current?.closest('section')?.scrollIntoView({ behavior: 'smooth' })}>
        Camera
      </button>
      <button onClick={() => gearTrackRef.current?.closest('section')?.scrollIntoView({ behavior: 'smooth' })}>
        Gear
      </button>
    </nav>
    <div className="top-logo">
      <a href="https://www.youtube.com/@mxclur" target="_blank" rel="noopener noreferrer">
        <img src={loadingImg} alt="Logo" />
      </a>
    </div>
    <section className={`horizontal-section ${hovered ? "dimmed" : ""}`}>
      <div className="horizontal-track" ref={trackRef}>
        {videoPanels.map((panelVideos, panelIndex) => (
          <div key={panelIndex} className="panel video-grid-panel">
            <div className="video-grid">
              {panelVideos.map((video) => {
                const videoId = video.snippet.resourceId.videoId;

                return (
                  <div
                    key={videoId}
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
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="horizontal-camera-section">
      <div className="horizontal-camera-track" ref={cameraTrackRef}>
        <div className="camera-panel">
          <div className="camera-info">
            * <p>Camera Settings</p>
            <p>🎥 4K 30 FPS</p>
            <p>⏱ 1/60 Shutter Angle</p>
            <p>🌡 ISO 100 ~ 800</p>
            <p>🪨 RockSteady: Off</p> 
          </div>
          <ColorGradeReveal src={colorgradeImg} />
        </div>
        

       <div className="gear-panel-horizontal">
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

        <div className="camera-panel">
          <p>More camera content</p>
        </div>
      </div>
    </section>
      <section className="gear-section">
      </section>
        <Footer/>
        <div className="footer-content">

          <div className="footer-socials">
            <a href="https://www.youtube.com/@mxclur" target="_blank" rel="noopener noreferrer">
              <img src={youtubeImg} alt="YouTube" />
            </a>

            <a href="https://www.tiktok.com/@mxclur" target="_blank" rel="noopener noreferrer">
              <img src={tiktokImg} alt="TikTok" />
            </a>
          </div>

          <div className="footer-brand">
            MXCLUR
          </div>

          <button className="footer-top" onClick={scrollToTop}>
            <img src={arrowUp} alt="Back to top" />
          </button>

        </div>
    </section>
  );
};

export default Home;



