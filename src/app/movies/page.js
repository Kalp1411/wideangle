'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaClock,
  FaThumbsUp,
  FaChevronDown,
  FaCheck,
  FaSlidersH,
  FaTimes,
} from 'react-icons/fa';
import { fetchMovieCategories, fetchMovies } from '@/store/movieSlice';
import Image from 'next/image';
import { formatDuration } from '@/utils/helper';


const FloatingDropdown = ({
  label,
  options,
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  const floated = isOpen || !!value;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        minWidth: '160px',
      }}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          background: isOpen
            ? '#12151e'
            : 'rgba(255,255,255,0.05)',
          border: isOpen
            ? '1px solid #fff'
            : '1px solid rgba(255,255,255,0.13)',
          borderRadius: '10px',
          color: '#fff',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: '14px',
            top: floated ? '-10px' : '50%',
            transform: floated
              ? 'none'
              : 'translateY(-50%)',
            fontSize: floated ? '10px' : '12px',
            color: isOpen ? '#F28C28' : '#fff',
            background: floated
              ? '#0f0f1e'
              : 'transparent',
            padding: '0 6px',
            transition: 'all .2s ease',
            zIndex: 2,
          }}
        >
          {label}
        </span>

        <span>{value || label}</span>

        <FaChevronDown
          size={11}
          style={{
            transform: isOpen
              ? 'rotate(180deg)'
              : 'rotate(0deg)',
            transition: '.25s',
          }}
        />
      </button>

      {isOpen && (
        <div
          className="common_filter_drp"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            zIndex: 999,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow:
              '0 16px 40px rgba(0,0,0,0.65)',
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              className="open__filter"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 16px',
                fontSize: '12px',
                cursor: 'pointer',
                background:
                  opt === value
                    ? '#F28C28'
                    : 'transparent',
                color:
                  opt === value
                    ? '#12151e'
                    : undefined,
              }}
            >
              <span>{opt}</span>

              {opt === value && (
                <FaCheck
                  size={11}
                  style={{ color: '#12151e' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterContent = ({
  categories,
  activeCategory,
  setActiveCategory,

  languages,
  activeLanguage,
  setActiveLanguage,

  movieTypes,
  activeType,
  setActiveType,

  handleClearAll,
  showClearBtn,
  isMobile,
}) => (
  <>
    <FloatingDropdown
      className="genre_drp"
      label="Category"
      options={categories}
      value={activeCategory || 'All Category'}
      onChange={(value) =>
        setActiveCategory(
          value === 'All Category' ? '' : value
        )
      }
    />

    <FloatingDropdown
      className="lang_drp"
      label="Language"
      options={languages}
      value={activeLanguage || 'Language'}
      onChange={(value) =>
        setActiveLanguage(
          value === 'Language' ? '' : value
        )
      }
    />

    <FloatingDropdown
      className="type_drp"
      label="Type"
      options={movieTypes}
      value={activeType || 'Type'}
      onChange={(value) =>
        setActiveType(
          value === 'Type' ? '' : value
        )
      }
    />

    {showClearBtn && (
      <button
        className="clear-btn"
        style={
          isMobile
            ? {
                width: '100%',
                marginTop: '10px',
              }
            : {}
        }
        onClick={handleClearAll}
      >
        Clear All
      </button>
    )}
  </>
);

const MovieGrid = () => {
  const dispatch = useDispatch();

  const {
    nowstreamingmovies,
    loading,
  } = useSelector((state) => state.movies);

  const [activeCategory, setActiveCategory] =
    useState('');

  const [activeLanguage, setActiveLanguage] =
    useState('');

  const [activeType, setActiveType] =
    useState('');

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  useEffect(() => {
    dispatch(
      fetchMovies({
        is_now_streaming: 1,
      })
    );
  }, [dispatch]);

//   const categories = useMemo(() => {
//     return [
//       'All Category',
//       ...(nowstreamingcategories?.map(
//         (item) =>
//           item.category_name ||
//           item.name
//       ) || []),
//     ];
//   }, [nowstreamingcategories]);

  const categories = useMemo(() => {
    const set = new Set();

    nowstreamingmovies?.forEach((movie) => {
      movie.category?.forEach((cat) => {
        set.add(cat.category_name);
      });
    });

    return [
      'Category',
      ...Array.from(set),
    ];
  }, [nowstreamingmovies]);

  const languages = useMemo(() => {
    const set = new Set();

    nowstreamingmovies?.forEach((movie) => {
      movie.language?.forEach((lang) => {
        set.add(lang.language_name);
      });
    });

    return [
      'Language',
      ...Array.from(set),
    ];
  }, [nowstreamingmovies]);

  const movieTypes = useMemo(() => {
    const set = new Set();

    nowstreamingmovies?.forEach((movie) => {
      movie.movie_type?.forEach((type) => {
        set.add(type.type_name);
      });
    });

    return [
      'Type',
      ...Array.from(set),
    ];
  }, [nowstreamingmovies]);

  const filteredMovies = useMemo(() => {
    let movies = [...nowstreamingmovies];

    if (activeCategory) {
      movies = movies.filter((movie) =>
        movie.category?.some(
          (cat) =>
            cat.category_name ===
            activeCategory
        )
      );
    }

    if (activeLanguage) {
      movies = movies.filter((movie) =>
        movie.language?.some(
          (lang) =>
            lang.language_name ===
            activeLanguage
        )
      );
    }

    if (activeType) {
      movies = movies.filter((movie) =>
        movie.movie_type?.some(
          (type) =>
            type.type_name === activeType
        )
      );
    }

    return movies.map((movie) => ({
      id: movie.id,
      slug: movie.slug,
      title: movie.movie_name,
      thumbnail:
        movie.image?.thumbnail?.[
          '317x422'
        ] ||
        movie.image?.original ||
        '/placeholder.jpg',

      duration: movie.totalduration ? formatDuration(movie?.totalduration) : '-',

      rating: movie.rating,

      language:
        movie.language
          ?.map(
            (l) =>
              l.language_name
          )
          .join(', ') || '-',

      quality:
        movie.movie_type
          ?.map(
            (t) =>
              t.type_name
          )
          .join(', ') || '-',
    }));
  }, [
    nowstreamingmovies,
    activeCategory,
    activeLanguage,
    activeType,
  ]);

  const handleClearAll = () => {
    setActiveCategory('');
    setActiveLanguage('');
    setActiveType('');
  };

  const isFilterActive =
    !!activeCategory ||
    !!activeLanguage ||
    !!activeType;

  return (
    <section
      className="top-rated-movie tr-movie-bg pt-130"
      style={{
        backgroundImage:
          'url("/assets/img/bg/episode_bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container">
        <div className="now-showing-bar">
          <div className="nsb-inner">
            <h1 className="nsb-title">
              Now Showing
            </h1>

            <div className="nsb-right">
              <FilterContent
                categories={categories}
                activeCategory={
                  activeCategory
                }
                setActiveCategory={
                  setActiveCategory
                }
                languages={languages}
                activeLanguage={
                  activeLanguage
                }
                setActiveLanguage={
                  setActiveLanguage
                }
                movieTypes={movieTypes}
                activeType={activeType}
                setActiveType={
                  setActiveType
                }
                handleClearAll={
                  handleClearAll
                }
                showClearBtn={
                  isFilterActive
                }
              />
            </div>

            <button
              className="mobile-filter-trigger"
              onClick={() =>
                setIsMobileMenuOpen(
                  true
                )
              }
            >
              <FaSlidersH />
              Filters
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="mobile-bottom-sheet"
            onClick={() =>
              setIsMobileMenuOpen(
                false
              )
            }
          >
            <div
              className="sheet-content"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="sheet-header">
                <h3>
                  Filter Movies
                </h3>

                <FaTimes
                  size={20}
                  style={{
                    cursor:
                      'pointer',
                  }}
                  onClick={() =>
                    setIsMobileMenuOpen(
                      false
                    )
                  }
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection:
                    'column',
                  gap: '25px',
                }}
              >
                <FilterContent
                  categories={
                    categories
                  }
                  activeCategory={
                    activeCategory
                  }
                  setActiveCategory={
                    setActiveCategory
                  }
                  languages={
                    languages
                  }
                  activeLanguage={
                    activeLanguage
                  }
                  setActiveLanguage={
                    setActiveLanguage
                  }
                  movieTypes={
                    movieTypes
                  }
                  activeType={
                    activeType
                  }
                  setActiveType={
                    setActiveType
                  }
                  handleClearAll={
                    handleClearAll
                  }
                  showClearBtn={
                    isFilterActive
                  }
                  isMobile
                />

                <button
                  className="btn w-100"
                  style={{
                    background:
                      '#6e3fff',
                    color: '#fff',
                    padding:
                      '15px',
                    borderRadius:
                      '12px',
                    border: 'none',
                    fontWeight:
                      '700',
                  }}
                  onClick={() =>
                    setIsMobileMenuOpen(
                      false
                    )
                  }
                >
                  Show Results (
                  {
                    filteredMovies.length
                  }
                  )
                </button>
              </div>
            </div>
          </div>
        )}

        {loading.nowstreamingmovies ? (
          <div className="text-center py-5 text-white">
            Loading movies...
          </div>
        ) : filteredMovies.length ===
          0 ? (
          <div className="text-center py-5 text-white">
            No movies found.
          </div>
        ) : (
          <div className="row">
            {filteredMovies.map(
              (movie) => (
                <div
                  key={movie.id}
                  className="col-xl-3 col-lg-3 col-md-6 col-sm-6"
                >
                  <div className="movie-item mb-60">
                    <div className="movie-poster mb-20">
                      <Link
                        href={`/movie/${movie.slug}`}
                      >
                        <Image
                          src={
                            movie.thumbnail
                          }
                          alt={
                            movie.title
                          }
                          width={317}
                          height={422}
                          unoptimized
                        />
                        {/* <img
                          src={
                            movie.thumbnail
                          }
                          alt={
                            movie.title
                          }
                          style={{
                            width:
                              '100%',
                            borderRadius:
                              '8px',
                          }}
                        /> */}
                      </Link>
                    </div>

                    <div className="movie-content">
                      <div className="top">
                        <h5 className="title text-white">
                          <Link
                            href={`/movie/${movie.slug}`}
                          >
                            {
                              movie.title
                            }
                          </Link>
                        </h5>

                        <Link
                          href={`/movie/${movie.slug}`}
                          className="btn"
                        >
                          <span className="date">
                            Book
                            Now
                          </span>
                        </Link>
                      </div>

                      <div className="bottom">
                        <ul>
                          <li>
                            <span className="quality">
                              {
                                movie.quality
                              }
                            </span>
                          </li>

                          <li className="gap-4">
                            <span className="language">
                              {
                                movie.language
                              }
                            </span>

                            <span className="duration d-flex align-items-center gap-2">
                              <FaClock
                                size={
                                  14
                                }
                                fill="#F28C28"
                              />
                              {
                                movie.duration
                              }
                            </span>

                            <span className="rating d-flex align-items-center gap-2">
                              <FaThumbsUp
                                size={
                                  14
                                }
                                fill="#F28C28"
                              />
                              {
                                movie.rating
                              }
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieGrid;