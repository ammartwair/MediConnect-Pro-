import React from 'react';
import coverPhoto from '../../images/banner-building-day.jpg'; // Import the image file

const CoverPhoto = () => {
    return (
        <div style={{
            width: '100%',
            height:'50vh',
            backgroundImage: `url(${coverPhoto})`, // Set the background image
            backgroundSize: 'cover', // Cover the entire container
            backgroundPosition: 'center', // Center the background image
        }}>
            {/* Content inside the cover photo if needed */}
        </div>
    );
};

export default CoverPhoto;
