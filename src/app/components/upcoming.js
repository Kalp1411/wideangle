"use client"; // Required because we use useState (interactive tabs)

import { useEffect, useState } from "react";
import Link from "next/link";
import { upcomingMovies } from "@/data/upcomingMovies";
import { FaClock, FaThumbsUp, FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieCategories, fetchMovies } from "@/store/movieSlice";
import { formatDuration } from "@/utils/helper";

function Upcoming() {
  const dispatch = useDispatch();
  const { upcomingmovies, loading, upcomingcategories } = useSelector(
    (state) => state.movies,
  );
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    dispatch(fetchMovies({ is_upcoming: 1 }));
    dispatch(fetchMovieCategories({ is_upcoming: 1 }));
  }, [dispatch]);

  const formattedItems = useMemo(() => {
    if (!upcomingmovies?.length) return [];

    let filteredMovies = upcomingmovies;

    if (activeTab !== 0) {
      filteredMovies = upcomingmovies.filter((movie) =>
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
      slug:movie.slug,
      language: movie.language?.map((l) => l.language_name).join(", "),
      quality: movie.movie_type?.map((t) => t.type_name).join(", "),
    }));
  }, [upcomingmovies, activeTab]);

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
    <section
      className="top-rated-movie tr-movie-bg"
      style={{ backgroundImage: "url('assets/img/bg/tr_movies_bg.jpg')" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-title text-center mb-50">
              <span className="sub-title">ONLINE STREAMING</span>
              <h2 className="title">Upcoming Movies</h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="tr-movie-menu-active text-center">
              <button
                className={activeTab === 0 ? "active" : ""}
                onClick={() => handleTabClick(0)}
              >
                All
              </button>

              {upcomingcategories.map((cat) => (
                <button
                  key={cat.id}
                  className={activeTab === cat.id ? "active" : ""}
                  onClick={() => handleTabClick(cat.id)}
                >
                  {cat.category_name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading.nowstreamingmovies ? (
          <div className="row">
            {[...Array(4)].map((_, i) => (
              <div
                className="col-xl-3 col-lg-4 col-sm-6 grid-item grid-sizer"
                key={i}
              >
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="row tr-movie-active">
              {formattedItems.length > 0 ? (
                formattedItems.map((movie) => (
                  <div
                    key={movie.id}
                    className="col-xl-3 col-lg-4 col-sm-6 grid-item grid-sizer"
                  >
                    <div className="movie-item mb-60">
                      <div className="movie-poster">
                        <Link href={`/movie/${movie.slug}`}>
                          <img src={movie.thumbnail} alt={movie.title} />
                        </Link>
                      </div>
                      <div className="movie-content">
                        <div className="top">
                          <h5 className="title">
                            <Link href={`/movie/${movie.slug}`}>{movie.title}</Link>
                          </h5>
                          <Link href={`/movie/${movie.slug}`} className="btn">
                            <span className="date">Book Now</span>
                          </Link>
                        </div>
                        <div className="bottom">
                          <ul>
                            <li>
                              <span className="quality">{movie.quality}</span>
                            </li>
                            <li className="gap-4">
                              <span className="language">{movie.language}</span>
                              <span className="duration d-flex align-items-center gap-2">
                                <FaClock size={14} fill="#F28C28" />
                                {movie.duration}
                              </span>
                              <span className="rating d-flex align-items-center gap-2">
                                <FaThumbsUp size={14} fill="#F28C28" />{" "}
                                {movie.time}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center text-white">
                  <p>No movies found in this category.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Upcoming;