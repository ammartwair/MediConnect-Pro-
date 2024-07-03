import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';
import './MyAppointments.css'

export default function MyAppointments({ user }) {

    const [appointments, setAppointments] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAppointments = async () => {
            try {

                let appointments = [];
                const axiosInstance = axios.create({
                    baseURL: 'http://localhost:5000',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('Authorization')}`
                    }
                });
                let path = '';
                if (user?.role === 'Patient') {
                    path = 'getPatientAppointments';
                } else if (user?.role === 'Doctor') {
                    path = 'getDoctorAppointments';
                }
                if (path) {
                    let res = await axiosInstance.get(`http://localhost:5000/appointment/${path}`).then((response) => {
                        if (response.data) {
                            let { data } = response;
                            if (data.message === "success") {
                                appointments = data.appointments;
                                setAppointments(appointments);
                                setLoading(false);
                            } else if (data.message === 'Doctor has no appointments!!' || data.message === 'Patient has no appointments!!') {
                                setLoading(false);
                            } else {
                                console.log(response.data.message);
                                setLoading(false);
                            }
                        }
                    });
                }
                setLoading(false)
            } catch (error) {
                console.error('Error fetching user profile: ', error);
                setLoading(false);
            }
        };
        getAppointments();
    }, [user]);

    if (loading) {
        return <Loading />
    }

    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0'); // Adding 1 because getMonth() returns zero-based index
        const day = `${d.getDate()}`.padStart(2, '0');
        return `${day}-${month}-${year}`; // Format: YYYY-MM-DD
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Specialty</title>
                <meta name="description" content="This is Specialty page" />
                <link rel="canonical" href="www.facebook.com" />
            </Helmet>
            <div className={`myAppointments-container`}>
                <h2 className='my-4' id="AppointmentsTitle">My Appointments</h2>
            </div>
            <div className="container my-5 py-5">
                {appointments?.length > 0 ?
                    <>
                        <div className="container list" >
                            <p style={{ color: "tomato" }}>No. </p>
                            <p  style={{ color: "tomato" }}>Date</p>
                            <p  style={{ color: "tomato" }}>Status</p>
                            <p  style={{ color: "tomato" }}>Details</p>
                        </div>
                        {
                            appointments.map((appointment, index) => (
                                <div key={appointment._id} className="container list" >
                                    <p >{index + 1}. </p>
                                    <p>{formatDate(appointment.date)}</p>
                                    <p style={{ textTransform: 'capitalize' }}>{appointment.status}</p>
                                    <p> <Link to={`/AppointmentDetails/${appointment._id}`} >Show</Link></p>
                                </div>
                            ))
                        }
                    </> : <>
                        <h3> No Appointments Yet</h3>
                    </>
                }
            </div>
        </>
    )
}
