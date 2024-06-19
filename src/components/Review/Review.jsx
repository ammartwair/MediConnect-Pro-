import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function Review() {


    const { id } = useParams();
    const [review, setReview] = useState([]);

    useEffect(() => {
        getReview(id).then((result) => {
            setReview(result);
        });
    }, []);

    async function getReview(id) {
        let review = null;
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.get(`http://localhost:5000/review/getAppointmentReview/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    review = data.review;
                    return review;
                } else {
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
            })
        return review;
    }

    if (!review) {
        return <div>Loading...</div>;
    }

    return (<>
        <div>Appointment Review</div>
        <p>{review.comment}</p>
        <p>{review.rating}</p>
    </>
    )
}
