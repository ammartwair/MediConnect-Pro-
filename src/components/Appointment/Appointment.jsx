import React, { useEffect, useState } from 'react'
import { useFormik, } from 'formik'
import * as Yup from 'yup'
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import { Helmet } from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleNotch, faRefresh } from '@fortawesome/free-solid-svg-icons';
import LoadingButton from '../LoadingButton/LoadingButton.jsx';


export default function Appointment({ user }) {

    let [errors, setErrors] = useState([]);
    const [doctor, setDoctor] = useState(null);
    let [statusError, setStatusErrors] = useState('');
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    let navigate = useNavigate();

    useEffect(() => {
        getUser(id);
    }, []);

    async function getUser(id) {
        let user = null;
        let res = await axios.get(`http://localhost:5000/user/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setDoctor(data.user);
                    setLoading(false);
                    return data.user;
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
        setLoading(false);
        return user;
    }

    const schema = Yup.object().shape({
        doctorId: Yup.string().required('Doctor ID is required'),
        date: Yup.date().required('Date is required'),
        startTime: Yup.mixed().required('Start time is required'),
        endTime: Yup.mixed().required('Start time is required'),
        // .min(Yup.ref("startTime"), 'End time must be after start time'),
        reasonForVisit: Yup.string().min(3, 'Reason for visit must be at least 3 characters').max(100, 'Reason for visit must be at most 100 characters').required('Reason for visit is required'),
        notes: Yup.string(),
    });

    let formik = useFormik({
        initialValues: {
            doctorId: id,
            date: '',
            startTime: '',
            endTime: '',
            reasonForVisit: '',
            notes: ''
        },
        validationSchema: schema,
        onSubmit: sendAppointmentData
    });


    async function sendAppointmentData(values) {
        setLoadingSubmit(true);
        const startTimeISO = new Date(`${values.date}T${values.startTime}`).toISOString();
        const endTimeISO = new Date(`${values.date}T${values.endTime}`).toISOString();
        values.startTime = startTimeISO;
        values.endTime = endTimeISO;
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        // const dateTime = new Date(formik.values.startTime);
        // const date = dateTime.toISOString().split('T')[0];
        // formik.values.date = date;
        let { data } = await axiosInstance.post("http://localhost:5000/appointment/bookAppointment", values)
            .catch((err) => {
                setLoadingSubmit(false)
                console.log(err);
            })
        if (data.message === 'Success Booking') {
            setErrors([]);
            setLoadingSubmit(false);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your Booking Done Sucessfully",
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(() => navigate('/Dashboard'), 1500);
        } else {
            setLoadingSubmit(false);
            setErrors(data.err[0]);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
            console.log("Error");
        }

    }
    return (<>
        <Helmet>
            <meta charSet="utf-8" />
            <title>MediConnect Pro | Appointment</title>
            <meta name='description' content='This is appointment page' />
            <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>

        {errors.map((error) => {
            return <div className='text-dager'>{error.message}</div>
        })}
        {doctor ?
            <>
                <h2 className='my-3'>Pick An Appointment With Dr. {doctor.userName}</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-floating mb-3">
                        <input type="date" name='date' className="form-control" id="floatingDate" placeholder="Date"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingDate">Date</label>
                        <p className='text-danger'>{formik.errors.date}</p>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="time" name='startTime' className="form-control" id="floatingStartTime" placeholder="Start Time"
                            value={formik.values.startTime}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingStartTime">Start Time</label>
                        <p className='text-danger'>{formik.errors.startTime}</p>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="time" name='endTime' className="form-control" id="floatingEndTime" placeholder="End Time"
                            value={formik.values.endTime}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingEndTime">End Time</label>
                        <p className='text-danger'>{formik.errors.endTime}</p>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" name='reasonForVisit' className="form-control" id="floatingReasonForVisit" placeholder="Reason For Visit"
                            value={formik.values.reasonForVisit}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingReasonForVisit">Reason For Visit</label>
                        <p className='text-danger'>{formik.errors.reasonForVisit}</p>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" name='notes' className="form-control" id="floatingNotes" placeholder="Notes"
                            value={formik.values.notes}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingNotes">Notes</label>
                        <p className='text-danger'>{formik.errors.notes}</p>
                    </div>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary mt-3" type={loadingSubmit ? 'button' : 'submit'}>
                            {
                                loadingSubmit ?
                                <LoadingButton />
                                    : <>Submit</>}
                        </button>
                    </div>
                </form>
            </> : <></>
        }
    </>
    )
}
