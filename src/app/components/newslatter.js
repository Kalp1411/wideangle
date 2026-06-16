'use client'; // Required because we use useEffect
import { useEffect, useState } from 'react';

function NewsLatter() {
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

  const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents page reload
        console.log('Email submitted:', email);
        // Add your API logic here (e.g., send to backend)
    };
    return (
        <>
        <section className="newsletter-area newsletter-bg" data-background="/assets/img/bg/newsletter_bg.webp">
                <div className="container">
                    <div className="newsletter-inner-wrap">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="newsletter-content">
                                    <h4>Subscribe Your Email</h4>
                                    <p>Get the latest updates, tips, and news delivered straight to your inbox.</p>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <form onSubmit={handleSubmit} className="newsletter-form">
                                    <input type="email" required placeholder="Enter your email" value={email}
                onChange={(e) => setEmail(e.target.value)} />
                                    <button className="btn" type="submit">get started</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default NewsLatter;