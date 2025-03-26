import React, { useEffect } from "react";
import '../css/GlitterEffect.css'; // make sure to create this CSS file

const GlitterEffect = () => {
  
    useEffect(() => {
      const createGlitter = (x, y) => {
        const glitter = document.createElement('div');
        glitter.className = 'glitter';
  
        // Randomize size for a more natural effect
        const size = Math.random() * (15 - 5) + 5; // Between 5px and 15px
        glitter.style.width = `${size}px`;
        glitter.style.height = `${size}px`;
  
        // Randomize position with a slight offset
        glitter.style.left = `${x + (Math.random() * 20 - 10)}px`;
        glitter.style.top = `${y + (Math.random() * 20 - 10)}px`;
  
        // Randomize color slightly for variety (gold to light yellowish)
        const goldHue = Math.random() * 10; // Small random value
        glitter.style.backgroundColor = `rgba(255, 223, 0, 0.8)`;
  
        document.body.appendChild(glitter);
        
        glitter.addEventListener('animationend', () => {
          glitter.remove(); // Remove glitter after the animation ends
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