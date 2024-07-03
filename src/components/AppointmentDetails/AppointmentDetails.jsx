import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';
import LoadingButton from '../LoadingButton/LoadingButton.jsx';
import appointmentDetailsImage from '../../images/appointmentDetails.webp'
import './AppointmentDetails.css'
import { toast } from 'react-toastify';

export default function AppointmentDetails({ user }) {

    const [loading, setLoading] = useState(true);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [loadingCancelled, setLoadingCancelled] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState('');
    const [newPage, setNewPage] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        if (newPage) {
            window.scrollTo(0, 0);
            setNewPage(false);
        }
        getAppointmentDetails(id);
    }, [status]);

    const [doctorId, setDoctorId] = useState('');
    const [patientId, setPatientId] = useState('');


    async function getAppointmentDetails(id) {
        let appointment = null;
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.get(`http://localhost:5000/appointment/getAppointmentDetails/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setAppointmentDetails(data.appointment);
                    setDoctorId(data.appointment.doctorId);
                    setPatientId(data.appointment.patientId);
                    getDoctorName(data.appointment.doctorId);
                    getPatientName(data.appointment.patientId);
                    if (data.appointment.status === 'completed and reviewed') {
                        getReview(data.appointment._id);
                    }
                    setLoading(false);
                } else {
                    setLoading(false);
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })
        return appointment;
    }

    const [doctorName, setDoctorName] = useState('');
    const [patientName, setPatientName] = useState('');
    const [review, setReview] = useState('');


    async function getDoctorName(id) {
        let res = await axios.get(`http://localhost:5000/user/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setPatientName(data.user.userName);
                    return data.user;
                } else {
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
        setLoading(false);
    }

    async function getPatientName(id) {
        let res = await axios.get(`http://localhost:5000/user/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setDoctorName(data.user.userName);
                    return data.user;
                } else {
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
        setLoading(false);
    }

    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0'); // Adding 1 because getMonth() returns zero-based index
        const day = `${d.getDate()}`.padStart(2, '0');
        return `${day}-${month}-${year}`; // Format: DD-MM-YYYY
    }

    function formatTime(date) {
        const d = new Date(date);
        let hours = d.getHours();
        const minutes = `${d.getMinutes()}`.padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert hours to 12-hour format
        return `${hours}:${minutes} ${ampm}`; // Format: HH:mm AM/PM
    }

    if (!appointmentDetails) {
        return <Loading />
    }



    async function updateStatus(appointmentId, status) {
        if (status === "confirmed") {
            setLoadingConfirm(true);
        } else if (status === "completed") {
            setLoadingComplete(true);
        } else if (status === "cancelled") {
            setLoadingCancelled(true);
        }
        let res = await axios.patch(`http://localhost:5000/appointment/changeAppointmentStatus/${appointmentId}`, { status }, {
            headers: {
                Authorization: localStorage.getItem('Authorization')
            }
        }).then((response) => {
            if (response.data.message === 'Updated Appointment Status') {
                setLoadingConfirm(false);
                setLoadingComplete(false);
                setLoadingCancelled(false);
                toast.success("Appointment Status Updated Sucessfully");
                setStatus(status);
                // setTimeout(() => window.location.reload(), 1500);
            } else {
                setLoadingConfirm(false);
                setLoadingComplete(false);
                setLoadingCancelled(false);
                toast.error("Something went wrong!");
            }
        })
            .catch((err) => {
                toast.error("Something went wrong!");
                console.log(err);
            })
    }

    async function cancelAppointment(appointmentId) {
        setLoadingCancelled(true);
        let res = await axios.delete(`http://localhost:5000/appointment/cancelAppointment/${appointmentId}`, {
            headers: {
                Authorization: localStorage.getItem('Authorization')
            }
        }).then((response) => {
            if (response.data.message === 'Appointment cancelled') {
                setLoadingCancelled(false);
                toast.success("Appointment Cancelled Sucessfully");
                setStatus('cancelled')
            } else {
                setLoadingCancelled(false);
                toast.error("Something went wrong!");
            }
        })
            .catch((err) => {
                setLoadingCancelled(false);
                console.log(err);
            })
    }


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
                    setReview(data.review)
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


    if (loading) {
        return <Loading />
    }

    return (<>
        <div className="appointmentDetails row mx-0">
            <div className="col-lg-6 my-5 pt-5">
                <div className="container mt-5" >

                    <h2 className='my-5'>Appointment Details</h2>
                    {
                        user?.role == "Patient" &&
                        doctorName && doctorId &&
                        <h3>Appointment with: <Link to={`/Profile/${doctorId}`} className='link'>Dr.{doctorName}</Link></h3>
                    }
                    {
                        user?.role == "Doctor" &&
                        patientName && patientId &&
                        <h3>Appointment with: <Link to={`/Profile/${patientId}`} className='link'>{patientName}</Link></h3>
                    }
                    <h3>Date: {formatDate(appointmentDetails.date)}</h3>
                    <h3>Start Time: {formatTime(appointmentDetails.startTime)}</h3>
                    <h3>End Time: {formatTime(appointmentDetails.endTime)}</h3>
                    <h3>Reason For Visit: {appointmentDetails.reasonForVisit}</h3>
                    <h3>Notes: {appointmentDetails.notes}</h3>
                    <h3 style={{ textTransform: "capitalize" }}>Status: <span style={{ color: appointmentDetails.status === 'pending' ? 'tomato' : appointmentDetails.status == 'completed' ? 'green' : appointmentDetails.status == 'completed and reviewed' ? 'green' : '' }}>{appointmentDetails.status}</span></h3>
                    {
                        user?.role !== "Patient" ?
                            appointmentDetails.status === 'pending' ?
                                <button className="btns mt-3 mx-3" onClick={!loadingConfirm ? () => updateStatus(appointmentDetails._id, 'confirmed') : ''}>
                                    {
                                        loadingConfirm ?
                                            <LoadingButton />
                                            : <>Confirm</>}
                                </button>
                                : appointmentDetails.status === 'confirmed' ?
                                    <button className="btns mt-3 mx-3" onClick={!loadingComplete ? () => updateStatus(appointmentDetails._id, 'completed') : ''}> {
                                        loadingComplete ?
                                            <LoadingButton />
                                            : <>Completed</>}
                                    </button>
                                    : appointmentDetails.status === 'completed' ?
                                        <p>Not Reviewed Yet</p>
                                        : appointmentDetails.status === 'completed and reviewed' ?
                                            <p style={{ fontWeight: "bold" }} className='showReview' onClick={() => setShow(!show)}>
                                                {
                                                    !show ?
                                                        <>Show Review</> : <>Hide Review</>
                                                }
                                            </p>
                                            : <></>
                            : <></>
                    }
                    {
                        review && show &&
                        <>
                            <p>Rating: {review.rating}</p>
                            <p>Comment: {review.comment}</p>
                        </>
                    }
                    {
                        user?.role === "Patient" ?
                            appointmentDetails.status === 'pending' || appointmentDetails.status === 'confirmed' ?
                                <button className="btns mt-3 mx-2" type='button' onClick={!loadingCancelled ? () => cancelAppointment(appointmentDetails._id) : ''}>
                                    {
                                        loadingCancelled ?
                                            <LoadingButton />
                                            : <>Cancel</>}
                                </button>
                                : appointmentDetails.status === 'completed' ?
                                    <Link to={`/WriteReview/${id}`}><p>Write a Review</p></Link>
                                    : <></>
                            : appointmentDetails.status === 'pending' || appointmentDetails.status === 'confirmed' ?
                                <button className="btns mt-3 mx-2" type='button' onClick={!loadingCancelled ? () => updateStatus(appointmentDetails._id, 'cancelled') : ''}> {
                                    loadingCancelled ?
                                        <LoadingButton />
                                        : <>Cancel</>}</button>
                                : <></>
                    }
                </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-center mb-5  ">
                <img src={appointmentDetailsImage} alt="appointmentDetailsImage" />
            </div>
        </div>
    </>
    )
}


