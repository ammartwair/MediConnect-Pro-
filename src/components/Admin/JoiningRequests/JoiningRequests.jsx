import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function JoiningRequests() {

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
        let res = await axiosInstance.get(`http://localhost:5000/user/doctorsUnAccepted`).then((response) => {
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

    async function handleAccept(id) {
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
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    toast.error("Error Occured")
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
            })
    }

    async function handleReject(role, id) {
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
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    toast.error("Error Occured")
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
            })
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
                            {
                                doctors.map((doctor) => (
                                    <div key={doctor._id} className='d-flex justify-conetnt-between'>
                                        <div className='d-flex justify-content-center' style={{ width: "50%" }}>
                                            <img src={doctor.image.secure_url} alt="Doctor's image" />
                                        </div>
                                        <div style={{ width: "50%" }}>
                                            <br /><br />
                                            <h4 className='mt-2' style={{ textTransform: 'capitalize' }} >Name: {doctor.userName}</h4>
                                            <p>Specialties: {doctor.specialties.join(', ')}</p>
                                            <p>License Number: {doctor.licenseNumber}</p>
                                            <p>Years Of Experience: {doctor.yearsOfExperience}</p>
                                            <p>Phone Number: {doctor.phoneNumber}</p>
                                            <p>Address: {doctor.address}</p>
                                            <p>Bio: {doctor.bio}</p>
                                            <button type="button" onClick={() => handleAccept(doctor._id)} className="btn btn-success mt-3 mx-4">Accept</button>
                                            <button type="button" onClick={() => handleReject(doctor.role, doctor._id)} className="btn btn-danger mt-3 mx-4">Reject</button>
                                        </div>
                                    </div>
                                ))
                            }

                        </> : <>
                            <h3>There Is Not Any Joining Requests</h3>
                        </>
                    }
                </div>
            </div>
        </>
    )
}