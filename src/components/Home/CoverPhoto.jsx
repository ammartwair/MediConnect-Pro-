import React from 'react';
import coverPhoto from '../../images/banner-building-day.jpg'; // Import the image file

const CoverPhoto = () => {
    return (
        <div style={{
            width: '100%',
            height: '50vh',
            backgroundImage: `url(${coverPhoto})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'  // This makes the background image fixed
        }}>
            {/* Content inside the cover photo if needed */}
        </div>
    );
};

export default CoverPhoto;
