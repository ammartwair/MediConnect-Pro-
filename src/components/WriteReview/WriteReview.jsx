import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import LoadingButton from '../LoadingButton/LoadingButton.jsx';
import StartRating from './StarRating.jsx'
import reviewImage from '../../images/reviewPortal.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading.jsx';

export default function WriteReview() {

    const [loadingSubmit, setLoadingSubmit] = useState(true);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
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
                toast.error("Error Occured");
            })

        if (data.message === 'success review') {
            toast.success("Your Review Saved Sucessfully")
            setTimeout(() => navigate('/Dashboard'), 1500);
        } else {
            setLoadingSubmit(false);
            toast.error("Error Occured");
            console.log(data.message);
        }
    }
    const inputRef = useRef(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isRatingValid, setIsRatingValid] = useState(false);
    const [isCommentValid, setIsCommentValid] = useState(false);
    const [equalComment, setEqualComment] = useState(true);
    const [equalRating, setEqualRating] = useState(true);
    const [newPage, setNewPage] = useState('');


    useEffect(() => {
        if (newPage) {
            inputRef.current.focus();
            setNewPage(false);
        } else {
            checkInputs();
        }
    }, [comment, rating]);

    const checkInputs = () => {
        const subBtn = document.getElementById("subBtn");

        if (isCommentValid && isRatingValid) {
            subBtn.removeAttribute('disabled');
            subBtn.type = "submit";
            if (subBtn.classList.contains('btn-outline-secondary')) {
                subBtn.classList.remove('btn-outline-secondary');
            }
            subBtn.classList.add('btn-outline-success');
        } else {
            if (subBtn.classList.contains('btn-outline-success')) {
                subBtn.classList.remove('btn-outline-success');
            }
            subBtn.classList.add('btn-outline-secondary');
            subBtn.setAttribute('disabled', 'disabled');
            subBtn.type = "button";
        }
    }

    const handleCommentChange = (event) => {
        setEqualComment(false);
        const value = event.target.value;
        formik.values.comment = value;
        setComment(value);
        const minLength = 10;
        const maxLength = 15000;
        setIsCommentValid(value.length >= minLength && value.length <= maxLength);
    }

    const handleRatingChange = (newRating) => {
        setEqualRating(false);
        setIsRatingValid(true);
        setRating(newRating);
        formik.values.rating = newRating;
    };

    if (loading) {
        return <Loading />
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
                <div className="row my-5 mx-0">
                    <div className="col-lg-6 my-5 px-5">
                        <h2 className='my-4 mx-5'>Write a Review</h2>
                        <form onSubmit={formik.handleSubmit} autoComplete="off">
                            <label>Comment</label>
                            <div className="firstinput">
                                <input
                                    id="comment"
                                    type="comment"
                                    placeholder="Type your comment"
                                    value={comment}
                                    ref={inputRef}
                                    name="email"
                                    className={`logininput form-control  ${!equalComment ? isCommentValid ? 'is-valid' : 'is-invalid' : ''}`}
                                    onChange={handleCommentChange}
                                    required
                                />
                                <span className="focus-100">
                                    <FontAwesomeIcon id="fa-user" className="px-2 mx-2" icon={faComment} style={{ color: !equalComment ? isCommentValid ? 'green' : 'red' : '' }} />
                                </span>
                            </div>
                            {
                                !equalComment ?
                                    !isCommentValid ?
                                        <div className="small text-danger" id="userAlert">* Comment shouldbe between 10 to 1500 characters</div>
                                        : <></>
                                    : <></>
                            }
                            <label>Rating <span>({rating})</span></label>
                            <div className="firstinput">
                                <StartRating onChange={handleRatingChange} outOf={5} />
                            </div>
                            <div className="d-grid gap-2">
                                <button type="button" name="subBtn" id="subBtn" className="btn btn-outline-secondary mt-4" disabled>
                                    {
                                        loadingSubmit ?
                                            <LoadingButton />
                                            : <>Submit</>}</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-6 d-flex justify-content-center mb-5  ">
                        <img src={reviewImage} alt="reviewImage" />
                    </div>
                </div>

            </div>
        </>
    )
}
