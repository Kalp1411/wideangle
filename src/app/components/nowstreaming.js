import { useState, useEffect } from "react";
import { streamingItems } from "@/data/streamingItems";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaClock, FaThumbsUp, FaCalendarAlt } from "react-icons/fa";
import CategorySlider from "./CategorySlider";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMovieCategories,
  fetchMovies,
  fetchNowStreamingMovies,
} from "@/store/movieSlice";
import { capitalizeName, formatDuration } from "@/utils/helper";

function NowStreaming() {
  const dispatch = useDispatch();
  const { nowstreamingmovies, loading, nowstreamingcategories } = useSelector(
    (state) => state.movies,
  );
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchMovies({ is_now_streaming: 1 }));
    dispatch(fetchMovieCategories({ is_now_streaming: 1 }));
  }, [dispatch]);

  const formattedItems = useMemo(() => {
    if (!nowstreamingmovies?.length) return [];

    let filteredMovies = nowstreamingmovies;

    if (activeTab !== 0) {
      filteredMovies = nowstreamingmovies.filter((movie) =>
        movie.category?.some((cat) => cat.id === activeTab),
      );
    }

    return filteredMovies.map((movie) => ({
      id: movie.id,
      title: movie.movie_name,
      thumbnail:
        movie.image?.thumbnail?.["317x422"] ||
        movie.image?.original ||
        "/placeholder.jpg",
      duration: formatDuration(movie.totalduration),
      rating: movie.rating,
      language: movie.language?.map((l) => l.language_name).join(", "),
      quality: movie.movie_type?.map((t) => t.type_name).join(", "),
    }));
  }, [nowstreamingmovies, activeTab]);

  const showNavigation = formattedItems.length > 4;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const SkeletonCard = () => (
    <div className="movie-item mb-50 animate-pulse">
      <div className="movie-poster bg-gray-300 h-[320px] rounded"></div>

      <div className="movie-content mt-3">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>

        <div className="flex gap-2">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section
        className="ucm-area ucm-bg"
        data-background="assets/img/bg/ucm_bg_shape.png"
      >
        <div className="container">
          <div className="row align-items-end mb-55">
            <div className="col-lg-6">
              <div className="section-title text-center text-lg-left">
                <span className="sub-title">ONLINE STREAMING</span>
                <h2 className="title">Now Streaming</h2>
              </div>
            </div>
            <div className="col-lg-6">
              {!loading.nowstreamingmovies && formattedItems.length !== 0 && (
                <div className="ucm-nav-wrap">
              <CategorySlider
                categories={[
                  { id: 0, label: 'All' },
                  ...nowstreamingcategories.map((cat) => ({
                    id: cat.id,
                    label: capitalizeName(cat.category_name),
                  })),
                ]}
                activeCategory={activeTab}
                onCategoryChange={handleTabClick}
              />
            </div>
              )}
            
          </div>
            {/* <div className="col-lg-6">
              <div className="ucm-nav-wrap">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" key="0">
                    <button
                      className={`nav-link ${activeTab === 0 ? "active" : ""}`}
                      onClick={() => handleTabClick(0)}
                      type="button"
                    >
                      All
                    </button>
                  </li>
                  {nowstreamingcategories.map((cat) => (
                    <li className="nav-item" key={cat.id}>
                      <button
                        className={`nav-link ${activeTab === cat.id ? "active" : ""}`}
                        onClick={() => handleTabClick(cat.id)}
                        type="button"
                      >
                        {capitalizeName(cat.category_name)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
          </div>

          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active">
              <div className="streaming">
                {loading.nowstreamingmovies ? (
                  <div className="row">
                    {[...Array(4)].map((_, i) => (
                      <div className="col-lg-3 col-md-6" key={i}>
                        <SkeletonCard />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {showNavigation && (
                      <div className="navigation_section">
                        <div className="swiper-button-prev"></div>
                        <div className="swiper-button-next"></div>
                      </div>
                    )}

                    <Swiper
                      key={activeTab}
                      modules={[Navigation]}
                      spaceBetween={20}
                      navigation={
                        showNavigation
                          ? {
                              prevEl: ".swiper-button-prev",
                              nextEl: ".swiper-button-next",
                            }
                          : false
                      }
                      breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                      }}
                      className="my-8">
                      {formattedItems.map((item) => (
                        <SwiperSlide key={`${activeTab}-${item.id}`}>
                          <div className="movie-item mb-50">
                            <div className="movie-poster">
                              <Link href={`/movieDetails/${item.id}`}>
                                <img src={item.thumbnail} alt={item.title} />
                              </Link>
                            </div>
                            <div className="movie-content">
                              <div className="top">
                                <h5 className="title">
                                  <Link href={`/movieDetails/${item.id}`}>
                                    {item.title}
                                  </Link>
                                </h5>
                                <Link
                                  href={`/movieDetails/${item.id}`}
                                  className="btn">
                                  <span className="date">Book Now</span>
                                </Link>
                              </div>
                              <div className="bottom">
                                <ul>
                                  <li>
                                    <span className="quality">
                                      {item.quality}
                                    </span>
                                  </li>
                                  <li className="gap-3">
                                    <span className="language">
                                      {item.language}
                                    </span>
                                    <span className="duration d-flex align-items-center gap-2">
                                      <FaClock size={14} fill="#F28C28" />{" "}
                                      {item.duration}
                                    </span>
                                    <span className="rating d-flex align-items-center gap-2">
                                      <FaThumbsUp size={14} fill="#F28C28" />{" "}
                                      {item.like}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </>
                )}

                {!loading.nowstreamingmovies && formattedItems.length === 0 && (
                  <div className="text-center py-20">
                    <h3 className="text-2xl text-gray-500">No movies found.</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default NowStreaming;