'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

function Loader() {
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader after page fully loads
    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 600); // adjust delay if needed
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  if (!loading) return null;
  
        return (
          <div id="preloader">
            <div id="loading-center">
                <div id="loading-center-absolute">
                    <img src="/assets/img/loader.gif" alt="Loading..." />
                </div>
            </div>
        </div>
        );
     } 
export default Loader;  

