import { cardio } from 'ldrs';
import React from 'react'
import './Loading.css';

export default function Loading() {

    cardio.register();

    return (
        <div className="loader-container">
            <l-cardio
                size="250"
                stroke="4"
                speed="1.7"
                color="red"
            ></l-cardio>;
        </div>
    )
}



