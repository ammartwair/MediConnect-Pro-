import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom';
import doctorsImage from '../../../images/A-doctor-talking-to-a-man.jpg'
import joiningImage from '../../../images/141885289_s.jpg'
import './AdminDashboard.css' 
import patientsImage from '../../../images/wh-blog-3-reasons-why-patient-centered-care-is-important.jpg'

export default function AdminDashboard() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Dashboard</title>
                <meta name='description' content='This is home page' />
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <div className="AdminDashboardCover">
            </div>
            <div className="adminSections">
                <div className="row mx-0 mt-5 " >
                    <div className='col-lg-6'>
                        <div className="container mt-5 pt-5 px-5">
                            <h3 className='my-2' style={{ textTransform: 'capitalize' }} >Doctors Accounts</h3>
                            <p>Welcome to the Doctor Management section. Here, you can view, edit, and manage the accounts of all registered doctors. Ensure each doctor’s profile is updated with the latest qualifications, contact details, and availability schedules. This section helps you maintain an organized roster of healthcare professionals, facilitating efficient patient care and administrative processes.</p>
                            <div className="mt-5 py-5">
                                <Link to={`/ManageDoctors`}>
                                    <h5>MANAGE</h5>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6 d-flex justify-content-center px-0'>
                        <img src={doctorsImage} alt="Doctors image" style={{ width: '100%' }} />
                    </div>
                </div>


                <div className="row mx-0" >
                    <div className='col-lg-6 d-flex justify-content-center px-0 '>
                        <img src={joiningImage} alt="Doctors image" style={{ width: '100%' }} />
                    </div>
                    <div className='col-lg-6'>
                        <div className="container mt-5 pt-5 px-5">
                            <h3 className='my-2' style={{ textTransform: 'capitalize' }} >Joining Requests</h3>
                            <p>Access and review new joining requests from doctors here. Each application includes personal information, credentials, and a statement of intent. Evaluate these applications to ensure that only qualified and committed professionals join our clinic. You can approve or reject requests based on the credentials and the current needs of the clinic.</p>
                            <div className="mt-5 py-5">
                                <Link to={`/JoiningRequests`}>
                                    <h5>MANAGE</h5>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mx-0 " >
                    <div className='col-lg-6'>
                        <div className="container mt-5 pt-5 px-5">
                            <h3 className='my-2' style={{ textTransform: 'capitalize' }} >Patients Accounts</h3>
                            <p>This section provides a comprehensive view of all patient accounts. You can access patient histories, manage their details, and monitor ongoing treatments or appointments. It’s vital to keep patient information confidential and up-to-date to deliver high-quality medical care and support. Use this tool to enhance patient engagement and streamline their journey through our medical services.</p>
                            <div className="mt-5 py-5">
                                <Link to={`/ManagePatients`}>
                                    <h5>MANAGE</h5>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6 d-flex justify-content-center px-0'>
                        <img src={patientsImage} alt="Doctors image" style={{ width: '100%' }} />
                    </div>
                </div>
            </div>
        </>
    )
}
