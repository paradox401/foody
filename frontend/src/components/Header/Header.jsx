import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets'; // Replace with actual image paths
import './Header.css';

const Header = () => {
  const bannerImages = [
    assets.banner1, // Replace with actual image paths
    assets.banner2,
    assets.banner3
  ];

  // Clone the first image and append to the end to create the infinite loop illusion
  const extendedBannerImages = [...bannerImages, bannerImages[0]];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
      setTimeout(() => {
        if (currentImageIndex >= bannerImages.length-1) {
          // Jump back to the first image after the transition ends
          setCurrentImageIndex(0);
          setIsTransitioning(false); // Avoid showing transition while resetting
        } else {
          setIsTransitioning(false);
        }
      }, 1000); // Timeout should match CSS transition duration
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [currentImageIndex, bannerImages.length]);

  return (
    <div className="header-slider">
      <div
        className="header-slides-container"
        style={{
          transform: `translateX(-${currentImageIndex * 100}%)`,
          transition: isTransitioning ? 'transform 1s ease-in-out' : 'none'
        }}
      >
        {extendedBannerImages.map((image, index) => (
          <div
            key={index}
            className="header-slide"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="header-contents">
              {/* Your header content goes here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
