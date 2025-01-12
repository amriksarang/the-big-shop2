import React from 'react';

const MagnifierCanvas = ({magniFiedImageSrc, className}: {magniFiedImageSrc: string, className: string}) => {
    return <div id="magnifier-canvas" className={className}><img src={magniFiedImageSrc} id="magnified-image" alt="Magnified"/></div>
}

export default MagnifierCanvas;
