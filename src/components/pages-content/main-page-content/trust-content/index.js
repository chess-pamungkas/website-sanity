import React, { useState, useContext, useRef, useEffect } from "react";
import { useWindowSize } from "../../../../helpers/hooks/use-window-size";
import { useTranslationWithVariables } from "../../../../helpers/hooks/use-translation-with-vars";
import BadgeSecurityIcon from "../../../../assets/images/icons/main-page/badge-security.svg";
import CircleMarkIcon from "../../../../assets/images/icons/circle-mark.svg";
import CloseOverlayIcon from "../../../../assets/images/icons/main-page/trust/close-overlay.svg";
import { ShowRegistrationPopup } from "../../../../helpers/constants";
import LanguageContext from "../../../../context/language-context";
import { StandardButtons } from "../../../shared/reusable-buttons";
import BuffonVideo from "../../../../assets/video/Buffon-Precision-Protection-Performance-Website-version.mp4";

const TrustContent = () => {
  const { isMobile } = useWindowSize();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isVideoClicked, setIsVideoClicked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const { selectedLanguage } = useContext(LanguageContext);
  const { t } = useTranslationWithVariables();
  const videoRef = useRef(null);

  // Autoplay video when it's clicked
  useEffect(() => {
    if (isVideoClicked && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay prevented:", error);
      });
    }
  }, [isVideoClicked]);

  // Pause and reset video when closed
  useEffect(() => {
    if (!isVideoClicked && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isVideoClicked]);

  const handleShowRegistrationPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleVideoClick = () => {
    setIsVideoClicked(true);
  };

  const handleVideoClose = () => {
    setIsVideoClicked(false);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current
          .requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
          })
          .catch(() => {
            console.log("Fullscreen request failed");
          });
      } else {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false);
          })
          .catch(() => {
            console.log("Exit fullscreen failed");
          });
      }
    }
  };

  // Listen for fullscreen changes to keep state in sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const trustFeatures = [
    {
      boldText: t("trust-content_feature1-bold"),
      text: t("trust-content_feature1-text"),
      icon: CircleMarkIcon,
    },
    {
      boldText: t("trust-content_feature2-bold"),
      text: t("trust-content_feature2-text"),
      icon: CircleMarkIcon,
    },
    {
      boldText: t("trust-content_feature3-bold"),
      text: t("trust-content_feature3-text"),
      icon: CircleMarkIcon,
    },
  ];

  return (
    <section className="trust-content">
      <div className="trust-content__container">
        {/* Video Section */}
        <div
          className={`trust-content__video-section ${
            isVideoHovered ? "trust-content__video-section--hovered" : ""
          } ${isVideoClicked ? "trust-content__video-section--clicked" : ""}`}
          onMouseEnter={() => setIsVideoHovered(true)}
          onMouseLeave={() => setIsVideoHovered(false)}
          onClick={handleVideoClick}
        >
          <div className="trust-content__video-container">
            {/* Default/Hovered State */}
            <div className="trust-content__video-background"></div>
            {/* Video overlay text */}
            <div className="trust-content__video-overlay">
              <h3 className="trust-content__video-name">
                {t("trust-content_video-name")}
              </h3>
              <p className="trust-content__video-title">
                {t("trust-content_video-title")}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="trust-content__content-section">
          {/* Trust Badge */}
          <div className="trust-content__badge">
            <img
              src={BadgeSecurityIcon}
              alt={t("trust-content_badge-icon-alt")}
              className="trust-content__badge-icon"
            />
            <span className="trust-content__badge-text">
              {t("trust-content_badge-text")}
            </span>
          </div>

          {/* Main Title */}
          <h2 className="trust-content__title">{t("trust-content_title")}</h2>

          {/* Subtitle */}
          <p className="trust-content__subtitle">
            {t("trust-content_subtitle")}
          </p>

          {/* Features List */}
          <ul className="trust-content__features">
            {trustFeatures.map((feature, index) => (
              <li key={index} className="trust-content__feature">
                <img
                  src={feature.icon}
                  alt={t("trust-content_check-icon-alt")}
                  className="trust-content__feature-icon"
                />
                <span className="trust-content__feature-text">
                  <strong>{feature.boldText}</strong>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          {/* Button Group */}
          <div className="navbar-dropdown-highlight__button-group">
            <StandardButtons
              primaryText={t("button-start-trading")}
              secondaryText={t("button-try-demo")}
              onPrimaryClick={handleShowRegistrationPopup}
              onSecondaryClick={handleShowRegistrationPopup}
            />
          </div>
        </div>
      </div>

      {/* Video Overlay - Full Screen */}
      {isVideoClicked && (
        <div className="trust-content__youtube-overlay">
          {/* Video player */}
          <div className="trust-content__youtube-player">
            <video
              ref={videoRef}
              src={BuffonVideo}
              className="trust-content__video-element"
              autoPlay
              playsInline
              width="100%"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnded}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />

            {/* YouTube-style Video Controls */}
            <div className="trust-content__video-controls">
              {/* Left side controls */}
              <div className="trust-content__controls-left">
                <button
                  className="trust-content__play-pause-button"
                  onClick={handlePlayPause}
                  type="button"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <button
                  className="trust-content__volume-button"
                  type="button"
                  onClick={handleVolumeToggle}
                >
                  {isMuted ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>

                <div className="trust-content__time-display">
                  <span className="trust-content__current-time">
                    {formatTime(currentTime)}
                  </span>
                  <span className="trust-content__time-separator">/</span>
                  <span className="trust-content__duration">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Center progress bar */}
              <div
                className="trust-content__progress-container"
                onClick={handleProgressClick}
              >
                <div className="trust-content__progress-bar">
                  <div
                    className="trust-content__progress-filled"
                    style={{
                      width: `${
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      }%`,
                    }}
                  ></div>
                  <div
                    className="trust-content__progress-handle"
                    style={{
                      left: `${
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Right side controls */}
              <div className="trust-content__controls-right">
                <button
                  className="trust-content__fullscreen-button"
                  onClick={handleFullscreen}
                  type="button"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              className="trust-content__close-button"
              onClick={(e) => {
                e.stopPropagation();
                handleVideoClose();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Registration Popup */}
      {isPopupOpen && (
        <ShowRegistrationPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          langParam={selectedLanguage.id}
        />
      )}
    </section>
  );
};

export default TrustContent;
