import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import LoadingButton from '../LoadingButton/LoadingButton.jsx';

export default function WriteReview() {

    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { id } = useParams();
    let [errors, setErrors] = useState([]);
    let [statusError, setStatusErrors] = useState('');
    let navigate = useNavigate();
    const schema = Yup.object({
        comment: Yup.string().required("Comment is required"),
        rating: Yup.string().required("Rating is required")
    });
    let formik = useFormik({
        initialValues: {
            comment: '',
            rating: ''
        }, validationSchema: schema,
        onSubmit: sendReviewData,
    })

    async function sendReviewData(values) {
        setLoadingSubmit(true);
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let { data } = await axiosInstance.post(`http://localhost:5000/review/${id}`, values)
            .catch((err) => {
                console.log(err);
                setLoadingSubmit(false);
            })

        if (data.message === 'success review') {
            setErrors([]);
            setStatusErrors('');
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your Review Saved Sucessfully",
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(() => navigate('/Dashboard'), 1500);
        } else {
            setErrors(data.err[0]);
            setLoadingSubmit(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
        }
    }
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Write a Review</title>
                <meta name='description' content='This is Login page' />
                <link rel="canonical" href="http://localhost:5000" />
            </Helmet>
            <div>
                <h2 className='my-4'>Write a Review</h2>
                {errors.map((error) => {
                    return <div className='text-dager'>{error.message}</div>
                })}

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-floating mb-3">
                        <input type="text" name='comment' className="form-control" id="floatingComment" placeholder="Comment"
                            value={formik.values.comment}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingComment">Comment</label>
                        <p className='text-danger'>{formik.errors.comment}</p>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" name='rating' className="form-control" id="floatingRating" placeholder="Rating"
                            value={formik.values.rating}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingRating">Rating</label>
                        <p className='text-danger'>{formik.errors.rating}</p>
                    </div>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary mt-3" type={loadingSubmit ? "button" : "submit"}> {
                            loadingSubmit ?
                                <LoadingButton />
                                : <>Submit</>}</button>
                    </div>
                </form>
            </div>
        </>
    )
}
