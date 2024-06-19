import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom';
import doctorsImage from '../../../images/A-doctor-talking-to-a-man.jpg'
import joiningImage from '../../../images/141885289_s.jpg'
import appointmentsImage from '../../../images/appointments.png'
import patientsImage from '../../../images/wh-blog-3-reasons-why-patient-centered-care-is-important.jpg'

export default function AdminDashboard() {


    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Dashboard</title>
                <meta name='description' content='This is home page' />
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <div className="container">
                <br /><br />
                <div className="row d-flex justify-content-around">
                    <div className="col-md-5" style={{ border: '1px solid black', position: "relative" }}>
                        <p>Current Number of Doctors: </p>
                        <p>Current Number of Appintments: </p>
                        <p>Current Number of Patients:</p>
                    </div>
                    <div className="col-md-5" style={{ border: '1px solid black', position: "relative" }}>
                        <p>More than 2000 patients have been treated.</p>
                        <p>More than 2500 appointments have been arranged.</p>
                        <p>We have provided care for over 3 years.</p>
                    </div>
                </div>
                <br /><br />
                <div className="row d-flex justify-content-between">
                    <div className="col-md-3" style={{ border: '1px solid black', position: "relative", height: '550px', padding: "0" }} >
                    <br /><br /><br />
                        <div height={'60%'}>
                            <img src={doctorsImage} alt="Doctors image" style={{ height: '100%', width: '100%' }} />
                        </div>
                        <br />
                        <div height={'20%'}>
                            <h4 className='mt-2' style={{ textAlign: 'center', textTransform: 'capitalize' }} >Doctors Accounts</h4>
                        </div>
                        <div style={{ position: 'absolute', bottom: "0", left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Link to={`/ManageDoctors`}>
                                <h5 style={{ textAlign: 'center' }}>MANAGE</h5>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3" style={{ border: '1px solid black', position: "relative", height: '550px', padding: "0" }} >
                        <br /><br /><br />
                        <div height={'60%'}>
                            <img src={joiningImage} alt="Patients image" style={{ width: '100%' }} />
                        </div>
                        <br />
                        <div height={'20%'}>
                            <h4 className='mt-2' style={{ textAlign: 'center', textTransform: 'capitalize' }} >Joining Requests</h4>
                        </div>
                        <div style={{ position: 'absolute', bottom: "0", left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Link to={`/JoiningRequests`}>
                                <h5 style={{ textAlign: 'center' }}>MANAGE</h5>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3" style={{ border: '1px solid black', position: "relative", height: '550px', padding: "0" }} >
                        <br /><br /><br />
                        <div height={'60%'}>
                            <img src={patientsImage} alt="Patients Image" style={{ width: '100%' }} />
                        </div>
                        <br />
                        <div height={'20%'}>
                            <h4 className='mt-2' style={{ textAlign: 'center', textTransform: 'capitalize' }} >Patients Accounts</h4>
                        </div>
                        <div style={{ position: 'absolute', bottom: "0", left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <Link to={`/ManagePatients`}>
                                <h5 style={{ textAlign: 'center' }}>MANAGE</h5>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
