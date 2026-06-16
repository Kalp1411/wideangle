'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import Offers from "../components/offers";
import { movieOffers } from '@/data/movieOffers';

const offerslist = () => {
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
                                <h2 className="title">Offers List</h2>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Offers</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Offers />
            <section className="live-area live-bg fix" data-background="assets/img/bg/live_bg.jpg">
                <div className="container">
                    <div className="offers-grid ">
                                {movieOffers.map((offer) => (
                                    <div key={offer.id} className="offer-card">
                                    <div className="offer-image">
                                        <img src={offer.banner} alt={offer.title} />
                                    </div>
                                    <div className="offer-content">
                                        <h4 className="offer-title">{offer.title}</h4>
                                        <div className="offer-footer">
                                        <p className="validity">Valid till: {offer.validity}</p>
                                        <Link href={`/offers/${offer.id}`} className="view-btn">
                                            View
                                        </Link>
                                        </div>
                                    </div>
                                    </div>
                                ))}
                                </div>
                </div>
            </section>
      </>
  );
};

export default offerslist;