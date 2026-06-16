'use client';

import { useEffect, useState, useMemo } from "react";
import Link from 'next/link';
import { upcomingMovies } from '@/data/upcomingMovies';

const MovieGrid = () => {
    // Background image handler
    useEffect(() => {
        const elements = document.querySelectorAll('[data-background]');
        elements.forEach((el) => {
            const bg = el.getAttribute('data-background');
            if (bg) {
                el.style.backgroundImage = `url(${bg})`;
            }
        });
    }, []);

    // 1. Filter States
    const [activeGenre, setActiveGenre] = useState('All');
    const [activeLanguage, setActiveLanguage] = useState('All');
    
    // 2. Accordion Toggle States
    const [genreOpen, setGenreOpen] = useState(true);
    const [langOpen, setLangOpen] = useState(true);

    // 3. Clear Data Function
    const handleClearAll = () => {
        setActiveGenre('All');
        setActiveLanguage('All');
    };

    // Extract Unique Values
    const genres = ['All', ...new Set(upcomingMovies.map(m => m.genre).filter(Boolean))];
    const languages = ['All', ...new Set(upcomingMovies.map(m => m.language).filter(Boolean))];

    // Filter Logic
    const filteredMovies = useMemo(() => {
        return upcomingMovies.filter((movie) => {
            const genreMatch = activeGenre === 'All' || 
                movie.genre?.toLowerCase() === activeGenre.toLowerCase();
            const langMatch = activeLanguage === 'All' || 
                movie.language?.toLowerCase() === activeLanguage.toLowerCase();
            return genreMatch && langMatch;
        });
    }, [activeGenre, activeLanguage]);

    return (
        <>
          <section className="top-rated-movie tr-movie-bg" style={{ backgroundImage: "url('assets/img/bg/tr_movies_bg.jpg')", padding: "80px 0" }}>
                <div className="container">
                    <div className="row">
                        {/* SIDEBAR ACCORDION */}
                        <div className="col-xl-3 col-lg-4">
                            <aside className="movie-sidebar">
                                
                                {/* Clear Data Header */}
                                <div className="d-flex justify-content-between align-items-center mb-30">
                                    <h5 className="text-white mb-0">Filters</h5>
                                    {(activeGenre !== 'All' || activeLanguage !== 'All') && (
                                        <button 
                                            onClick={handleClearAll}
                                            style={{ background: 'transparent', border: 'none', color: '#e2d191', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Genre Accordion */}
                                <div className="widget mb-30" style={{ background: '#12151e', padding: '20px', borderRadius: '5px', border: '1px solid #242c38' }}>
                                    <h4 className="widget-title" 
                                        onClick={() => setGenreOpen(!genreOpen)}
                                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '18px' }}>
                                        Genres <i className={`fas ${genreOpen ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                                    </h4>
                                    {genreOpen && (
                                        <div className="filter-list mt-20" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {genres.map(genre => (
                                                <button 
                                                    key={genre}
                                                    onClick={() => setActiveGenre(genre)}
                                                    style={{
                                                        textAlign: 'left',
                                                        background: 'none',
                                                        border: 'none',
                                                        fontSize: '15px',
                                                        color: activeGenre === genre ? '#e2d191' : '#bcbcbc',
                                                        fontWeight: activeGenre === genre ? 'bold' : 'normal',
                                                        transition: '0.3s',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {genre}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Language Accordion */}
                                <div className="widget mb-30" style={{ background: '#12151e', padding: '20px', borderRadius: '5px', border: '1px solid #242c38' }}>
                                    <h4 className="widget-title" 
                                        onClick={() => setLangOpen(!langOpen)}
                                        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '18px' }}>
                                        Languages <i className={`fas ${langOpen ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                                    </h4>
                                    {langOpen && (
                                        <div className="filter-list mt-20" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {languages.map(lang => (
                                                <button 
                                                    key={lang}
                                                    onClick={() => setActiveLanguage(lang)}
                                                    style={{
                                                        textAlign: 'left',
                                                        background: 'none',
                                                        border: 'none',
                                                        fontSize: '15px',
                                                        color: activeLanguage === lang ? '#e2d191' : '#bcbcbc',
                                                        fontWeight: activeLanguage === lang ? 'bold' : 'normal',
                                                        transition: '0.3s',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>

                        {/* MOVIE GRID */}
                        <div className="col-xl-9 col-lg-8">
                            <div className="row align-items-center mb-40">
                                <div className="col-md-6">
                                    <p className="text-white mb-0">Showing <strong>{filteredMovies.length}</strong> movies</p>
                                </div>
                            </div>

                            <div className="row">
                                {filteredMovies.length > 0 ? (
                                    filteredMovies.map((movie) => (
                                        <div key={movie.id} className="col-xl-4 col-md-6">
                                            {/* ... (Existing movie item JSX) ... */}
                                            <div className="movie-item mb-60">
                                                <div className="movie-poster">
                                                    <Link href={`/movieDetails/${movie.id}`}>
                                                        <img src={movie.poster} alt={movie.title} />
                                                    </Link>
                                                </div>
                                                <div className="movie-content">
                                                    <div className="top">
                                                        <h5 className="title">
                                                            <Link href={`/movieDetails/${movie.id}`}>{movie.title}</Link>
                                                        </h5>
                                                        <span className="date">{movie.year}</span>
                                                    </div>
                                                    <div className="bottom">
                                                        <ul>
                                                            <li><span className="quality">{movie.quality}</span></li>
                                                            <li>
                                                                <span className="duration"><i className="far fa-clock"></i> {movie.duration}</span>
                                                                <span className="rating"><i className="fas fa-thumbs-up"></i> {movie.rating}</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center text-white" style={{ padding: '100px 0' }}>
                                        <h3>No movies found.</h3>
                                        <p>Try resetting the filters.</p>
                                        <button onClick={handleClearAll} className="btn" style={{ background: '#e2d191', color: '#000', padding: '10px 25px' }}>Reset Filters</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MovieGrid;