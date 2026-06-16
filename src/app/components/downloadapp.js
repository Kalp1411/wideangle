import { useEffect } from 'react';
import { FaAppStore, FaGooglePlay } from 'react-icons/fa';

function DownloadApp() {
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
             <section className="services-area services-bg" data-background="assets/img/bg/services_bg.jpg">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="services-img-wrap">
                                <img src="assets/img/images/app2.gif" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="services-content-wrap">
                                <div className="section-title title-style-two mb-20">
                                    <span className="sub-title">Movies Now Showing</span>
                                    <h2 className="title">Download App available play store</h2>
                                </div>
                                <p>Lorem ipsum dolor sit amet, consecetur adipiscing elseddo eiusmod tempor.There are many variations of passages of lorem
                                Ipsum available, but the majority have suffered alteration in some injected humour.</p>
                                <div className="services-list">
                                    <ul className="d-lg-flex align-items-start justify-content-between">
                                        <li>
                                            <div className="icon">
                                                <FaGooglePlay size={50} />
                                            </div>
                                            <div className="content">
                                                <h5>Google Play</h5>
                                                <p>Get It on Movie & TV</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="icon">
                                                <FaAppStore size={50} />
                                            </div>
                                            <div className="content">
                                                <p>Download on the</p>
                                                <h5>App Store</h5>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default DownloadApp;