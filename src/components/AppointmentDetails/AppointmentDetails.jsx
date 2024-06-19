import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';
import LoadingButton from '../LoadingButton/LoadingButton.jsx';

export default function AppointmentDetails({ user }) {

    const [loading, setLoading] = useState(true);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [loadingCancelled, setLoadingCancelled] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [reviewed, setReviewed] = useState(null);

    const { id } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        getAppointmentDetails(id);
    }, []);

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
                    setLoading(false);
                    return data.appointment;
                } else {
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
            })
        return appointment;
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
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Appointment Status Updated Sucessfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setLoadingConfirm(false);
                setLoadingComplete(false);
                setLoadingCancelled(false);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        })
            .catch((err) => {
                setLoadingConfirm(false);
                setLoadingComplete(false);
                setLoadingCancelled(false);
                console.log(err);
            })
    }

    async function cancelAppointment(appointmentId) {
        setLoading(true);
        setLoadingCancelled(true);
        let res = await axios.delete(`http://localhost:5000/appointment/cancelAppointment/${appointmentId}`, {
            headers: {
                Authorization: localStorage.getItem('Authorization')
            }
        }).then((response) => {
            if (response.data.message === 'Appointment cancelled') {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Appointment Cancelled Sucessfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setLoadingCancelled(false);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        })
            .catch((err) => {
                setLoadingCancelled(true);
                console.log(err);
            })
    }

    if (loading) {
        return <Loading />
    }

    return (<>
        <h2>Appointment Details</h2>
        <h3>Date: {formatDate(appointmentDetails.date)}</h3>
        <h3>Start Time: {formatTime(appointmentDetails.startTime)}</h3>
        <h3>End Time: {formatTime(appointmentDetails.endTime)}</h3>
        <h3>Reason For Visit: {appointmentDetails.reasonForVisit}</h3>
        <h3>Notes: {appointmentDetails.notes}</h3>
        <h3 style={{ textTransform: "capitalize" }}>Status: {appointmentDetails.status}</h3>
        {
            user?.role !== "Patient" ?
                appointmentDetails.status === 'pending' ?
                    <button className="btn btn-primary mt-3" onClick={!loadingConfirm ? () => updateStatus(appointmentDetails._id, 'confirmed') : ''}>
                        {
                            loadingConfirm ?
                                <LoadingButton />
                                : <>Confirm</>}
                    </button>
                    : appointmentDetails.status === 'confirmed' ?
                        <button className="btn btn-primary mt-3" onClick={!loadingComplete ? () => updateStatus(appointmentDetails._id, 'completed') : ''}> {
                            loadingComplete ?
                                <LoadingButton />
                                : <>Completed</>}
                        </button>
                        : appointmentDetails.status === 'completed' ?
                            <p>Not Reviewed Yet</p>
                            : appointmentDetails.status === 'completed and reviewed' ?
                                <>
                                    <Link to={`/Review/${id}`}>Show Review</Link>
                                </>
                                : <></>
                : <></>

        }
        {
            user?.role === "Patient" ?
                appointmentDetails.status === 'pending' || appointmentDetails.status === 'confirmed' ?
                    <button className="btn btn-primary mt-3 mx-2" type='button' onClick={!loadingCancelled ? () => cancelAppointment(appointmentDetails._id) : ''}>
                        {
                            loadingCancelled ?
                                <LoadingButton />
                                : <>Cancel</>}
                    </button>
                    : appointmentDetails.status === 'completed' && !reviewed ?
                        <Link to={`/WriteReview/${id}`}>Write a Review</Link>
                        : <></>
                : appointmentDetails.status === 'pending' || appointmentDetails.status === 'confirmed' ?
                    <button className="btn btn-primary mt-3 mx-2" type='button' onClick={!loadingCancelled ? () => updateStatus(appointmentDetails._id, 'cancelled') : ''}> {
                        loadingCancelled ?
                            <LoadingButton />
                            : <>Cancel</>}</button>
                    : <></>
        }
    </>
    )
}


