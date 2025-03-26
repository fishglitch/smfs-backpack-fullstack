import React, { useEffect } from "react";
import '../css/GlitterEffect.css'; // Ensure you have this CSS file

const GlitterEffect = () => {
  
  useEffect(() => {
    let timeoutId;
    const delay = 100; // Delay in milliseconds before creating a glitter particle

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
      // Clear the previous timeout if it exists
      clearTimeout(timeoutId);

      // Create a new timeout to delay the glitter creation
      timeoutId = setTimeout(() => {
        createGlitter(event.pageX, event.pageY);
      }, delay);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Clean up event listener and timeout on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  return null; // No JSX to render
};

export default GlitterEffect;