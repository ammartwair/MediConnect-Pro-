import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ManagePatients() {

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        getPatients().then((result) => {
            setPatients(result);
        });
    }, []);

    async function getPatients() {
        let pats = [];
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
                    pats = data.patients;
                    return pats;
                } else {
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
            })
        return pats;
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
                    {patients.length > 0 ?
                        <>
                            <div className="row">
                                {
                                    patients.map((patient) => (
                                        <div key={patient._id} className="col-md-4" style={{ border: '1px solid black', position: "relative", height: '600px' }} >

                                            <div height={'60%'}>
                                                <img src={patient.image.secure_url} alt="patient's image" style={{ height: '100%', width: '100%' }} />
                                            </div>
                                            <div height={'20%'}>
                                                <h4 className='mt-2' style={{ textAlign: 'center', textTransform: 'capitalize' }} >{patient.userName}</h4>
                                            </div>
                                            <div style={{ position: 'absolute', bottom: "0", left: '50%', transform: 'translate(-50%, -50%)' }}>
                                                <Link to={`/Profile/${patient._id}`}>
                                                    <h5 style={{ textAlign: 'center' }}>VIEW PROFILE</h5>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </> : <>
                            <h3> No Registerd Patients Yet</h3>
                        </>
                    }
                </div>
            </div>
        </>
    )
}