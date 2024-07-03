import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import Loading from '../../Loading/Loading.jsx';

export default function ManagePatients() {

    const [patients, setPatients] = useState([]);
    const [newPage, setNewPage] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (newPage) {
            window.scrollTo(0, 0);
            getPatients();
            setNewPage(false);
        }
    }, []);

    async function getPatients() {
        setLoading(true);
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.get(`http://localhost:5000/user/patients`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setPatients(data.patients);
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
                patients?.length > 0 ?
                    <div className='container pt-5' >
                        <h3>Registered Patients: </h3>
                    </div>
                    : <></>
            }
            <div className="container joiningReq">
                {patients?.length > 0 ?
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={3}
                        onSlideChange={() => console.log('slide change')}
                    >
                        {patients.map((patient, index) => (
                            <SwiperSlide key={patient._id}>
                                <div className="doctor-card">
                                    <div className="doctor-image">
                                        <Link to={`/Profile/${patient._id}`}>
                                            <img decoding="async" src={patient.image.secure_url} alt={`DR ${patient.userName}`} height={"470px"} />
                                        </Link>
                                    </div>
                                    <div className="doctor-content">
                                        <h3><Link to={`/Profile/${patient._id}`}>Dr. {patient.userName}</Link></h3>
                                    </div>
                                    <div>
                                        <p>Phone: {patient.phoneNumber}</p>
                                        <p>Address: {patient.address}</p>
                                    </div>
                                </div>

                            </SwiperSlide>
                        ))
                        }
                    </Swiper>
                    : <>
                        <h2 style={{ textAlign: "center" }}>No Registered Patients Yet</h2>
                    </>
                }

            </div>
        </>
    )
}