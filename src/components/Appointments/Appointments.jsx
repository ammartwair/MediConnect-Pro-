import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';

export default function Appointments({ user }) {

    let navigate = useNavigate();

    const [appointments, setAppointments] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    async function getUser(id) {
        let user = null;
        let res = await axios.get(`http://localhost:5000/user/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setUserProfile(data.user);
                    getAppointments(data.user.role, id);
                } else {
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
            })
    }
    async function getAppointments(role, id) {

        try {
            let appointments = [];
            const axiosInstance = axios.create({
                baseURL: 'http://localhost:5000',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('Authorization')}`
                }
            });
            let res = await axiosInstance.get(`http://localhost:5000/appointment/getAppointments/${role}/${id}`).then((response) => {
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
            setLoading(false)
        } catch (error) {
            console.error('Error fetching user profile: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser(id);
    }, []);

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
            <div>
                <h2 className='my-4' id="AppointmentsTitle">{userProfile?.role === "Doctor" ? <>Dr. </> : ''}{userProfile.userName}'s Appointments</h2>
                <div className="container">
                    {appointments?.length > 0 ?
                        <>
                            <div className="row">
                                {
                                    appointments.map((appointment) => (
                                        <div key={appointment._id} className="col-md-4 container" style={{ border: '1px solid black', height: '200px' }} >
                                            <p>Date: {formatDate(appointment.date)}</p>
                                            <p style={{ textTransform: 'capitalize' }}>Status: {appointment.status}</p>
                                            <Link to={`/AppointmentDetails/${appointment._id}`} >Show Appointment Details</Link>
                                        </div>
                                    ))
                                }
                            </div>
                        </> : <>
                            <h3> No Appointments Yet</h3>
                        </>
                    }
                </div>
            </div>
        </>
    )
}
