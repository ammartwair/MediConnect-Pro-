import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ManageDoctors() {

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        getDoctors().then((result) => {
            setDoctors(result);
        });
    }, []);

    async function getDoctors() {
        let docs = [];
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
                    docs = data.doctors;
                    return docs;
                } else {
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
            })
        return docs;
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Joining Requests</title>
                <meta name="description" content="This is Specialty page" />
                <link rel="canonical" href="www.facebook.com" />
            </Helmet>
            <div>
                <h2 className='my-4' id="SpecialtyTitle" style={{ textTransform: 'capitalize' }}>{ }</h2>
                <div className="container">
                    {doctors.length > 0 ?
                        <>
                            <div className="row">
                                {
                                    doctors.map((doctor) => (
                                        <div key={doctor._id} className="col-md-4" style={{ border: '1px solid black', position: "relative", height: '600px' }} >

                                            <div height={'60%'}>
                                                <img src={doctor.image.secure_url} alt="Doctor's image" style={{ height: '100%', width: '100%' }} />
                                            </div>
                                            <div height={'20%'}>
                                                <h4 className='mt-2' style={{ textAlign: 'center', textTransform: 'capitalize' }} >{doctor.userName}</h4>
                                                <p>{doctor.specialties.join(', ')}</p>
                                            </div>
                                            <div style={{ position: 'absolute', bottom: "0", left: '50%', transform: 'translate(-50%, -50%)' }}>
                                                <Link to={`/Profile/${doctor._id}`}>
                                                    <h5 style={{ textAlign: 'center' }}>VIEW PROFILE</h5>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </> : <>
                            <h3> No Registerd Doctors Yet</h3>
                        </>
                    }
                </div>
            </div>
        </>
    )
}