'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';

const timelineData = [
  { year: '1991', event: 'Inception of Wide Angle Cinemas' },
  { year: '1995', event: 'Partnership with Australian Village Roadshow' },
];

const aboutus = () => {
   useEffect(() => {
      // This runs only on the client side after the component mounts
      const elements = document.querySelectorAll('[data-background]');
      elements.forEach((el) => {
        const bg = el.getAttribute('data-background');
        if (bg) {
          el.style.backgroundImage = `url(${bg})`;
        }
      });
    }, []);
  return (
    <>
    <section className="breadcrumb-area breadcrumb-bg" data-background="/assets/img/bg/movie_details_bg.jpg">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="breadcrumb-content">
                                <h2 className="title">About Us</h2>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">About Us</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="live-area live-bg fix" data-background="assets/img/bg/live_bg.jpg">
                <div className="container">
                    <div className="row align-items-center mb-50">
                        <div className="col-xl-8 col-lg-8 col-sm-8 col-md-8">
                            <div className="section-title title-style-two mb-25"><span className="sub-title">The History</span>
                                <h3 className="title">Wide Angle is a family entertainment center par excellence... where... time waits for you.</h3>
                            </div>
                            <div className="live-movie-content">
                                <p>WIDE ANGLE is the most sophisticated entertainment complexes of Ahmedabad. It is a place where each feature is an entertainment freak's delight. Situated Nr. Satellite crossing on Sarkhej - Gandhinagar Highway, Wide Angle is designed to leave on the visitor a lasting impression of a comprehensive sensorial experience. A dream of Manubhai S Patel, Chairman of Essem Entertainment Private Limited (EEPL) and promoters of Wide Angle Complex of Entertainment, Shopping and Enjoyment.</p>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-sm-4 col-md-4">
                                <div className="live-movie-img wide_angle_box wow fadeInRight" data-wow-delay=".2s" data-wow-duration="1.8s">
                                    <img src="assets/img/images/aboutbg.webp" alt="" />
                                </div>
                        </div>
                    </div>
                    <div className="row align-items-center mb-80 abt_text_intro">
                        <div className="col-xl-4 col-lg-4">
                                <div className="live-movie-img wide_angle_box left wow fadeInRight" data-wow-delay=".2s" data-wow-duration="1.8s">
                                    <img src="assets/img/images/is-seats.webp" alt="" />
                                </div>
                        </div>
                        <div className="col-xl-8 col-lg-8">
                            <div className="section-title title-style-two mb-25"><h3 className="title">The Idea</h3></div>
                            <div className="live-movie-content">
                                <p>"The idea of WIDE ANGLE is that people of Ahmedabad who insist on CLASS in every little detail, including fun - whether they be couples, teams, families or crowds - should have an opportunity to troop in for enjoying quality time."
Wide Angle is an entrepreneur's dream, a designer's envy and the city's pride. Proving to be a swanky hangout joint for the youngster, it is a vibrant interacting place for the young at heart.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-xl-4 col-lg-4 multiplex_area flex justify-center">
                            <img src="assets/img/images/wide-angle-multiplex.webp" alt="" width={'400px'} />
                        </div>
                        <div className="col-xl-8 col-lg-8 mb-30">
                            <div className="section-title title-style-two mb-25">
                                <h3 className="title">Amenities</h3>
                            </div>
                            <div className="live-movie-content">
                                <p>WIDE ANGLE is the most sophisticated entertainment complexes of Ahmedabad. It is a place where each feature is an entertainment freak's delight. Situated Nr. Satellite crossing on Sarkhej - Gandhinagar Highway, Wide Angle is designed to leave on the visitor a lasting impression of a comprehensive sensorial experience. A dream of Manubhai S Patel, Chairman of Essem Entertainment Private Limited (EEPL) and promoters of Wide Angle Complex of Entertainment, Shopping and Enjoyment.</p>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 mt-20">
                            <div className="live-movie-content">
                                A 250' Wide Entrance Plaza.
                                Centrally Air-Conditioned Entertainment Complex.
                                Four high-tech state of the art cinema screens.
                                Ultramodern J.B.L. Sound System.
                                The zero-degree Projection System.
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6">
                            <div className="live-movie-content">
                                More than 1400 luxuriously upholstered spacious stadium seating.
                                Exclusive Club-Class suites with balcony arrangements.
                                Technology aided ticket counters.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    <section className="py-16 px-8 bg-white overflow-x-auto ourjourneysection">
      <div className="max-w-6xl mx-auto">
        <div className="section-title title-style-two mb-25">
            <h3 className="title">Our Journey</h3>
        </div>
        
        {/* Container for the horizontal scroll on mobile */}
        <div className="relative min-w-[1000px]">
          
          {/* Main Horizontal Line */}
          <div className="absolute top-0 w-full h-[2px] bg-black"></div>

          {/* Timeline Points */}
          <div className="flex justify-between relative">
            {timelineData.map((item, index) => (
              <div key={index} className="flex flex-col items-start w-50">
                
                {/* Node Dot */}
                <div className="w-4 h-4 rounded-full border-2 border-black bg-yellow-400 z-10 -mt-[7px]"></div>
                
                {/* Content */}
                <div className="mt-4">
                  <span className="block font-black text-xl text-black">
                    {item.year}
                  </span>
                  <div className="flex items-start mt-1 group">
                    {/* Small Yellow Bullet */}
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mt-2 mr-2 flex-shrink-0"></span>
                    <p className="text-sm font-medium text-gray-600 leading-snug">
                      {item.event}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
      </>
  );
};

export default aboutus;