import React, { useState } from 'react';
import './TeaLevel.css';
import cup from './cup.jpg';

const bottomLevel = 20; // where the tea starts (0%)
const maxLevel = 80; // where the tea ends (100%)

function toRealLevel(level) {
  const H = maxLevel - bottomLevel;
  return (level / 100 * H) + bottomLevel;
}

function toPercentage(realLevel) {
  const H = maxLevel - bottomLevel;
  return (realLevel - bottomLevel) / H * 100;
}

function TeaLevel({ initialLevel=null }) {
  const estimatedLevel = 50;
  const [currentLevel, setCurrentLevel] = useState(initialLevel || 70);

  const handleCupClick = (e) => {
    const { top, height } = e.target.getBoundingClientRect();
    const clickY = e.clientY;
    const clickedPosition = top - clickY + height;
    const clickedPercentage = (clickedPosition / height) * 100;
    const newLevel = toPercentage(clickedPercentage);
    // limit the new level to the range [0, 100]
    setCurrentLevel( Math.min(Math.max(newLevel, 0), 100) );
  };

  return (
    <div className="tea-glass">
      <div className="tea-container">
        <img src={cup} alt="Cup" className="cup-image" draggable="false" 
          onClick={handleCupClick}
        />
        <div className="tea-level" style={{ bottom: `${toRealLevel(currentLevel)}%` }}></div>
        <div className="est-tea-level" style={{ bottom: `${toRealLevel(estimatedLevel)}%` }}></div>
      </div>
    </div>
  );
}

export default TeaLevel;
