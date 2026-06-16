'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import CountUp from 'react-countup';
import { movieOffers } from '@/data/movieOffers';
import NewsLatter from './newslatter';


function Offers() {
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
              <section className="live-area live-bg fix" data-background="assets/img/bg/live_bg.jpg">
                <div className="container">
                    <div className="row align-items-center mb-50">
                        <div className="col-xl-5 col-lg-6">
                            <div className="section-title title-style-two mb-25">
                                <span className="sub-title">Offers For You</span>
                                <h2 className="title">Live Movie For Friends & Family</h2>
                            </div>
                            <div className="live-movie-content">
                                <p>Planning your night out shouldn't be a chore. Browse showtimes at theaters near you, pick your favorite snacks, and get your digital tickets delivered instantly. Your perfect movie night starts here.</p>
                                <div className="live-fact-wrap">
                                    <div className="resolution">
                                        <h2>HD</h2>
                                    </div>
                                    <div className="active-customer">
                                        <h4><CountUp 
                                            end={20} 
                                            duration={5} 
                                            enableScrollSpy 
                                            className="odometer" 
                                            />
                                            +</h4>
                                        <p>offer Valid</p>
                                    </div>
                                </div>
                                <Link href="#" className="btn popup-video">View Now</Link>
                            </div>
                        </div>
                        <div className="col-xl-7 col-lg-6">
                            <div className="live-movie-img wow fadeInRight" data-wow-delay=".2s" data-wow-duration="1.8s">
                                <img src="assets/img/images/offer.png" alt="" />
                            </div>
                        </div>
                    </div>

                     
                </div>
            </section>
           
        </>
    );
}
export default Offers;