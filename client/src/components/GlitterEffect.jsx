import React, { useEffect } from "react";
import '../css/GlitterEffect.css'; // Ensure you have this CSS file


const GlitterEffect = () => {
  
  useEffect(() => {
    const createGlitter = (x, y) => {
      const glitter = document.createElement('div');
      glitter.className = 'glitter';
      glitter.style.left = `${x}px`;
      glitter.style.top = `${y}px`;
      document.body.appendChild(glitter);
      
      glitter.addEventListener('animationend', () => {
        glitter.remove();
      });
    };

    const handleMouseMove = (event) => {
      createGlitter(event.pageX, event.pageY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null; // No JSX to render
};

export default GlitterEffect;