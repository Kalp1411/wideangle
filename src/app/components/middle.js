'use client'
import { useEffect } from "react";
import MainBanner from "./mainbanner";
import NowStreaming from "./nowstreaming";
import MovieTrailer from "./movietrailer";
import DownloadApp from "./downloadapp";
import Upcoming from "./upcoming";
import Offers from "./offers";
import NewsLatter from "./newslatter";


function Middle() {
  return (
    <div>
       <main>
            <MainBanner />
            <NowStreaming />
            <MovieTrailer />
            <DownloadApp />
            <Upcoming />
            <Offers />
            <NewsLatter />
        </main>
    </div>
    );
}
export default Middle;