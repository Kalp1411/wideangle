"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Autoplay,
  EffectCoverflow,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import { useDispatch, useSelector } from "react-redux";
import { fetchMovieTrailers } from "@/store/movieSlice";

// 🔹 Extract YouTube ID
const getYoutubeId = (url) => {
  const regExp =
    /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// 🔹 Thumbnail URL
const getThumbnail = (id, quality = "maxresdefault") => `https://img.youtube.com/vi/${id}/${quality}.jpg`;

function MovieTrailer() {
  const dispatch = useDispatch();
  const { upcomingmovietrailers = [] } = useSelector(
    (state) => state.movies
  );

  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    dispatch(fetchMovieTrailers({ is_upcoming: 1 }));
  }, [dispatch]);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-background]");
    elements.forEach((el) => {
      const bg = el.getAttribute("data-background");
      if (bg) el.style.backgroundImage = `url(${bg})`;
    });
  }, []);


  return (
    <section
      className="movie-trailer-section live-bg fix"
      data-background="/assets/img/bg/live_bg.jpg"
    >
      <div className="container">
        <div className="section-title text-center mb-50">
          <h2 className="title">Movie Trailer</h2>
        </div>
      </div>
    {!upcomingmovietrailers.length ? (
        <div className="text-center py-20">
          <h3 className="text-2xl text-dark">No trailers found.</h3>
        </div>
      ) : (
      <div className="slider-container">
        <Swiper
          modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{ clickable: true }}
          className="trailer-swiper">
          {upcomingmovietrailers.map((trailer) => {
            const videoId = getYoutubeId(trailer.trailer_url);

            return (
              <SwiperSlide key={trailer.id} className="trailer-slide">
                <div className="video-wrapper">
                  {activeVideo === trailer.id ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      title={trailer.movie_name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      className="thumbnail-wrapper"
                      onClick={() => setActiveVideo(trailer.id)}
                      style={{
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={getThumbnail(videoId, "maxresdefault")}
                        alt={trailer.movie_name}
                        onError={(e) => {
                            if (e.target.src.includes("maxresdefault")) {
                              e.target.src = getThumbnail(videoId, "sddefault");
                            } else if (e.target.src.includes("sddefault")) {
                              e.target.src = getThumbnail(videoId, "hqdefault");
                            } else {
                              e.target.src = getThumbnail(videoId, "mqdefault");
                            }
                          }}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "rgba(0,0,0,0.6)",
                          borderRadius: "50%",
                          padding: "15px",
                        }}>
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="#fff">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}

          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </Swiper>
      </div>
      )}
    </section>
  );
}

export default MovieTrailer;