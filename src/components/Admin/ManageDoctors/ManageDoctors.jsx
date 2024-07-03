import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import Loading from '../../Loading/Loading.jsx';

export default function ManageDoctors() {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        getDoctors();
    }, []);

    async function getDoctors() {
        setLoading(true);
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.get(`http://localhost:5000/user/doctorsAccepted`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setDoctors(data.doctors);
                    setLoading(false);

                } else {
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
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
                doctors?.length > 0 ?
                    <div className='container pt-5' >
                        <h3>Registered Doctors: </h3>
                    </div>
                    : <></>
            }
            <div className="container joiningReq">
                {doctors?.length > 0 ?
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
                                    </div>
                                </div>

                            </SwiperSlide>
                        ))
                        }
                    </Swiper>
                    : <>
                        <h2 style={{ textAlign: "center" }}>No Registered Doctors Yet</h2>
                    </>
                }

            </div>
        </>
    )
}