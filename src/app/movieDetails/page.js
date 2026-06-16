'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Needed to get the ID
import ModalVideo from 'react-modal-video';

import 'animate.css';
import 'react-modal-video/css/modal-video.css';

export default function MovieDetails() {
  const params = useParams();
  const id = params.id; // This is your dynamic ID from the URL

  const [isOpen, setOpen] = useState(false);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // 1. Fetching logic - Replace this with your actual API or WordPress endpoint
    // For now, we simulate finding a movie by ID
    const fetchMovie = async () => {
      // Example: const res = await fetch(`https://your-api.com/movies/${id}`);
      // const data = await res.json();
      
      // Mock Data for demonstration
      const mockData = {
        title: id === "1" ? "JOLLY LLB 3" : "AVENGERS",
        year: "2021",
        duration: "128 min",
        category: "Comedy, Drama",
        poster: "/assets/img/poster/ucm_poster08.jpg",
        videoId: "R2gbPxeNk2E"
      };
      setMovie(mockData);
    };

    fetchMovie();

    // 2. Background and WOW.js logic
    const elements = document.querySelectorAll('[data-background]');
    elements.forEach((el) => {
      const bg = el.getAttribute('data-background');
      if (bg) el.style.backgroundImage = `url(${bg})`;
    });

    if (typeof window !== 'undefined') {
      const { WOW } = require('wowjs');
      const wow = new WOW({ live: false });
      wow.init();
    }
  }, [id]);

  if (!movie) return null; // Or return your skeleton loading here

  return (
    <>
      <ModalVideo 
        channel='youtube' 
        autoplay 
        isOpen={isOpen} 
        videoId={movie.videoId} 
        onClose={() => setOpen(false)} 
      />
      
      <section className="movie-details-area" 
  style={{ 
    backgroundImage: `url(${movie?.background || '/assets/img/bg/movie_details_bg.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}>
        <div className="container">
          <div className="row align-items-center position-relative">
            <div className="col-xl-3 col-lg-4">
              <div className="movie-details-img">
                <img src={movie.poster} alt={movie.title} />
                <Link href="#!" 
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(true);
                  }}
                  className="popup-video wow fadeInUp" 
                  data-wow-delay=".8s" 
                  data-wow-duration="1.8s">
                  <img src="/assets/img/images/play_icon.png" alt="Play" />
                </Link>
              </div>
            </div>
            
            <div className="col-xl-6 col-lg-8">
              <div className="movie-details-content">
                <h5>New Movie (ID: {id})</h5>
                <h2>{movie.title}</h2>
                <div className="banner-meta">
                  <ul>
                    <li className="quality">
                      <span>Pg 18</span>
                      <span>hd</span>
                    </li>
                    <li className="category">
                      <a href="#">{movie.category}</a>
                    </li>
                    <li className="release-time">
                      <span><i className="far fa-calendar-alt"></i> {movie.year}</span>
                      <span><i className="far fa-clock"></i> {movie.duration}</span>
                    </li>
                  </ul>
                </div>
                <p>
                  This is the dynamic description for movie {id}. You can pull this 
                  content from your WordPress ACF fields or Laravel database.
                </p>
                <Link href="/booking" className="btn mt-3">Details</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="episode-area episode-bg" data-background="/assets/img/bg/episode_bg.jpg">
        <div className="container">
            <div className="row data_schedule">
                <div className="col-xl-7 col-lg-6 col-sm-6 col-md-6">
                    <div className="date_wise">
                        <label>Data</label>
                        <div className="select__date"></div>
                    </div>
                </div>
                <div className="col-xl-5 col-lg-4 col-sm-4 col-md-4">
                    <div className="time__wise"></div>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}