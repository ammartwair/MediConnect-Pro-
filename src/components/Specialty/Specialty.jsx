import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';

export default function Specialty() {

    const [loading, setLoading] = useState(true);
    const { specialty } = useParams();
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        getDoctors(specialty).then((result) => {
            setLoading(false)
            setDoctors(result);
        });
    }, []);

    async function getDoctors(specialty) {
        let docs = [];
        let res = await axios.get(`http://localhost:5000/specialties/${specialty}/getDoctors`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    docs = data.doctors;
                    return docs;
                } else {
                    console.log(response.data.message);
                    setLoading(false)
                }
            }
        })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            })
        return docs;
    }
if (loading){
    return <Loading />
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
                <h2 className='my-4' id="SpecialtyTitle" style={{ textTransform: 'capitalize' }}>{specialty}</h2>
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
                            <h3> No Doctors in This Specialty Yet</h3>
                        </>
                    }
                </div>
            </div>
        </>
    )
}