import React, { useState } from 'react';

const StarRating = ({ outOf = 5, onChange }) => {
    const [stars] = useState(Array.from({ length: outOf }, (_, i) => i + 1));
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);

    const selectedIcon = "★";
    const deselectedIcon = "☆";

    const changeRating = newRating => {
        setRating(newRating);
        if (onChange) {
            onChange(newRating);
        }
    };

    const hoverRating = rating => {
        setHovered(rating);
    };

    return (
        <div>
            <div className="rating" style={{ fontSize: '5em', color: "#38d39f" }}>
                {stars.map(star => (
                    <span
                        key={star}
                        style={{ cursor: 'pointer' }}
                        onClick={() => changeRating(star)}
                        onMouseEnter={() => hoverRating(star)}
                        onMouseLeave={() => hoverRating(0)}
                    >
                        {rating < star ? (hovered < star ? deselectedIcon : selectedIcon) : selectedIcon}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default StarRating;

// Usage
// ReactDOM.render(<StarRating />, document.getElementById('app'));
