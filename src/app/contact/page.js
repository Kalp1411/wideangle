'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ContactForm from '../components/contactForm';



const page = () => {
    const [sticky, setSticky] = useState(false);
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
                                <h2 className="title">Contact Us</h2>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Contact</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
    <section className="contact-area contact-bg" data-background="/assets/img/bg/contact_bg.jpg">
    <div className='container'>
    <div className='row'>
    <div className='col-xl-6 col-lg-6 mb-80'>
        <div className='widget-title mb-50'>
            <h5 className="title">WIDE ANGLE ENTERTAINMENT PVT LTD.</h5>
        </div>
        <div className='contact-info-wrap'>
            <p><span>Head Office:</span> 304, 3rd Floor, Silver Spring Plaza, Opp. Gurudwara, SG Highway, Ahmedabad - 380054, Gujarat, INDIA.</p>
            <div className="contact-info-list">
                                    <ul>
                                        <li>
                                            <div className="icon"><i className="fas fa-phone-alt"></i></div>
                                            <p><span>Phone :</span> <Link href="tel:+919825008038">+91-9825008038</Link></p>
                                        </li>
                                        <li>
                                            <div className="icon"><i className="fas fa-envelope"></i></div>
                                            <p><span>Email :</span> <Link href="mailto:info@wideangleindia.co.in">info@wideangleindia.co.in</Link></p>
                                        </li>
                                    </ul>
                                </div>
        </div>
    </div>
    <div className='col-xl-6 col-lg-6 mb-80'>
        <div className='widget-title mb-50'>
            <h5 className="title">BALAJI ENTERTAINMENT (GUJ) PVT LTD.</h5>
        </div>
        <div className='contact-info-wrap'>
            <p><span>Wide Angle: Mahesana :</span> Nr. Nagalpur Village, Khari River Bridge, Mahesana. GUJARAT, INDIA.</p>
            <div className="contact-info-list">
                                    <ul>
                                        <li>
                                            <div className="icon"><i className="fas fa-phone-alt"></i></div>
                                            <p><span>Phone :</span> <Link href="tel:+919925008038">+91-9925008038</Link></p>
                                        </li>
                                        <li>
                                            <div className="icon"><i className="fas fa-envelope"></i></div>
                                            <p><span>Email :</span> <Link href="mailto:balaji@wideangleindia.co.in">balaji@wideangleindia.co.in</Link></p>
                                        </li>
                                    </ul>
                                </div>
        </div>
    </div>
    <div className='col-xl-8 col-lg-7 m-auto'>
        <div className='contact-form-wrap'>
            <div className='widget-title mb-50'>
                <h5 className="title">Contact Form</h5>
            </div>
            <ContactForm />
        </div>
    </div>
    </div>
    </div>
    </section>
    </>
    )
}

export default page