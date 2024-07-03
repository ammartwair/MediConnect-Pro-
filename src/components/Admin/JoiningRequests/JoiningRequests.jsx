import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import Loading from '../../Loading/Loading.jsx';
import './JoiningRequests.css'
import LoadingButton from '../../LoadingButton/LoadingButton.jsx';

export default function JoiningRequests() {

    const [doctors, setDoctors] = useState([]);
    const [loadingAccept, setLoadingAccept] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newPage, setNewPage] = useState(true);
    const [customIndex, setCustomIndex] = useState('-1');
    const [request, setRequest] = useState(false);

    useEffect(() => {
        if (newPage) {
            window.scrollTo(0, 0);
            setNewPage(false);
        }
        getDoctors();
    }, [request]);

    async function getDoctors() {
        setLoading(true);
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.get(`http://localhost:5000/user/doctorsUnAccepted`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setDoctors(data.doctors);
                    setLoading(false);
                } else {
                    console.log(response.data.message);
                    setLoading(false);
                }
            }
        })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
    }

    async function handleAccept(id, index) {
        setCustomIndex(index);
        setLoadingAccept(true);
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.patch(`http://localhost:5000/user/acceptDoctors?id=${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Doctor Accepted") {
                    toast.success("Doctor Accepted successfully");
                    setLoadingAccept(false);
                    setRequest(!request);
                } else {
                    toast.error("Error Occured")
                    setLoadingAccept(false);
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                toast.error("Error Occured")
                console.log(err);
                setLoadingAccept(false);
            })
    }

    async function handleReject(role, id, index) {
        setCustomIndex(index);
        setLoadingReject(true);
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.delete(`http://localhost:5000/user/delete/${role}/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    toast.success("Rejected successfully");
                    setLoadingReject(false);
                    setRequest(!request);
                } else {
                    toast.error("Error Occured");
                    setLoadingReject(false);
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                toast.error("Error Occured");
                setLoadingReject(false);
                console.log(err);
            })
    }

    if (loading) {
        return <Loading />
    }


    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Joining Requests</title>
                <meta name="description" content="This is Specialty page" />
                <link rel="canonical" href="www.facebook.com" />
            </Helmet>
            {
                doctors.length > 0 ?
                    <div className='container pt-5' >
                        <h3>Doctors Joining Requests: </h3>
                    </div>
                    : <></>
            }
            <div className="container joiningReq">
                {doctors.length > 0 ?
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={3}
                        onSlideChange={() => console.log('slide change')}
                    >
                        {doctors.map((doctor, index) => (
                            <SwiperSlide key={doctor._id}>
                                <div className="doctor-card">
                                    <div className="doctor-image">
                                        <Link to={`/Profile/${doctor._id}`}>
                                            <img decoding="async" src={doctor.image.secure_url} alt={`DR ${doctor.userName}`} height={"470px"} />
                                        </Link>
                                    </div>
                                    <div className="doctor-content">
                                        <h3><Link to={`/Profile/${doctor._id}`}>Dr. {doctor.userName}</Link></h3>
                                    </div>
                                    <div>
                                        <p>Specialties: {doctor.specialties.join(', ')}</p>
                                        <p>License Number: {doctor.licenseNumber}</p>
                                        <p>Years Of Experience: {doctor.yearsOfExperience}</p>
                                        <p>Phone: {doctor.phoneNumber}</p>
                                        <p>Address: {doctor.address}</p>
                                        <button type="button" onClick={() => handleAccept(doctor._id, index)} className="btn btn-success mt-3 mx-4 px-3 py-2">
                                            {
                                                loadingAccept && index === customIndex ?
                                                    <LoadingButton /> :
                                                    <>Accept</>
                                            }
                                        </button>
                                        <button type="button" onClick={() => handleReject(doctor.role, doctor._id, index)} className="btn btn-danger mt-3 px-3 py-2 mx-4 ">
                                            {loadingReject && index === customIndex ?
                                                <LoadingButton /> : <>
                                                    Reject </>
                                            }
                                        </button>
                                    </div>
                                </div>

                            </SwiperSlide>
                        ))
                        }
                    </Swiper>
                    : <>
                        <h2 style={{ textAlign: "center" }}>There Is Not Any Joining Requests.</h2>
                    </>
                }

            </div>
        </>
    )
}