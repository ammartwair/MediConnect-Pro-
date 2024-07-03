import React, { useEffect, useRef, useState } from 'react'
import { useFormik, } from 'formik'
import * as Yup from 'yup'
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import { Helmet } from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faHourglassStart, faHourglassEnd, faPen } from '@fortawesome/free-solid-svg-icons';
import LoadingButton from '../LoadingButton/LoadingButton.jsx';
import './Appointment.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import appointmentImage from '../../images/appointment.webp'
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading.jsx';

export default function Appointment({ user }) {

    const [doctor, setDoctor] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    let navigate = useNavigate();

    const [newPage, setNewPage] = useState(true);
    const today = new Date();
    const tomorrowDate = new Date(today);
    tomorrowDate.setDate(today.getDate() + 1);
    const tdate = new Date(tomorrowDate);
    // Convert date to YYYY-MM-DD format
    const year = tdate.getFullYear();
    const month = String(tdate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(tdate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const [date, setDate] = useState(formattedDate);
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [isDateValid, setIsDateValid] = useState(true);
    const [isStartValid, setIsStartValid] = useState(false);
    const [isEndValid, setIsEndValid] = useState(false);
    const [isReasonValid, setIsReasonValid] = useState(false);
    const [equalDate, setEqualDate] = useState(false);
    const [equalStart, setEqualStart] = useState(true);
    const [equalEnd, setEqualEnd] = useState(true);
    const [equalReason, setEqualReason] = useState(true);


    const checkInputs = () => {
        if (isDateValid && isStartValid && isEndValid && isReasonValid) {
            ApproveInputs();
        } else {
            DeclineInputs();
        }
    }
    const ApproveInputs = () => {
        const regbtn = document.getElementById("subBtn");
        regbtn.removeAttribute('disabled');
        regbtn.type = "submit";
        if (regbtn.classList.contains('btn-outline-secondary')) {
            regbtn.classList.remove('btn-outline-secondary');
        }
        regbtn.classList.add('btn-outline-success');
    }
    const DeclineInputs = () => {
        const regbtn = document.getElementById("subBtn");
        if (regbtn.classList.contains('btn-outline-success')) {
            regbtn.classList.remove('btn-outline-success');
        }
        regbtn.classList.add('btn-outline-secondary');
        regbtn.setAttribute('disabled', 'disabled');
        regbtn.type = "button";
    }

    useEffect(() => {
        if (newPage) {
            window.scrollTo(0, 0);
            getUser(id);
            setNewPage(false);
        }else{
            checkInputs();
        }
    }, [date, start, end, reason, notes]);

    async function getUser(id) {
        let res = await axios.get(`http://localhost:5000/user/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setDoctor(data.user);
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
        setLoading(false);
    }

    const schema = Yup.object().shape({
        doctorId: Yup.string().required('Doctor ID is required'),
        date: Yup.date().required('Date is required'),
        startTime: Yup.mixed().required('Start time is required'),
        endTime: Yup.mixed().required('Start time is required'),
        reasonForVisit: Yup.string().min(10, 'Reason for visit must be at least 10 characters').max(500, 'Reason for visit must be at most 500 characters').required('Reason for visit is required'),
        notes: Yup.string().required(),
    });

    let formik = useFormik({
        initialValues: {
            doctorId: id,
            date: date,
            startTime: '',
            endTime: '',
            reasonForVisit: '',
            notes: ''
        },
        validationSchema: schema,
        onSubmit: sendAppointmentData
    });

    async function sendAppointmentData(values) {
        try {
            setLoadingSubmit(true);
            if (!values.date || !values.startTime || !values.endTime || !values.reasonForVisit) {
                setLoadingSubmit(false);
                toast.error("Something is missing");
            }
            const startTimeISO = new Date(`${values.date}T${values.startTime}`).toISOString();
            const endTimeISO = new Date(`${values.date}T${values.endTime}`).toISOString();

            const axiosInstance = axios.create({
                baseURL: 'http://localhost:5000',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('Authorization')}`
                }
            });

            let response = await axiosInstance.post("appointment/bookAppointment", {
                ...values,
                startTime: startTimeISO,
                endTime: endTimeISO
            });
            if (response.data && response.data.message === 'Success Booking') {
                setLoadingSubmit(false);
                toast.success("Your Booking Done Successfully");
                setTimeout(() => navigate('/Dashboard'), 1500);
            } else if (response.data && response.data.message == 'Patient already has a conflicting appointment') {
                setLoadingSubmit(false);
                toast.error('You already have a conflicting appointment');
            } else if (response.data && (response.data.message == 'Doctor already has a conflicting appointment' || response.data.message == 'Doctor does not work on this day')) {
                setLoadingSubmit(false);
                toast.error(response.data.message);
            } else {
                if (response.data && response.data.message) {
                    console.log(response.data.message);
                }
                setLoadingSubmit(false);
                toast.error(response.data.message);

            }
        } catch (err) {
            setLoadingSubmit(false);
            console.log('Error during appointment booking:', err);
            toast.error("Something went wrong");
        }
    }

    const handleDateChange = (preDate) => {
        setEqualDate(false);
        const date = new Date(preDate);
        // Convert date to YYYY-MM-DD format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        formik.values.date = formattedDate;
        setDate(formattedDate);
        const isValidDate = (dateString) => {
            const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Format: YYYY-MM-DD
            if (!datePattern.test(dateString)) return false;
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        };
        const isAfterToday = (dateString) => {
            const selectedDate = new Date(dateString);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 to compare only dates
            return selectedDate > today;
        };
        const validDate = isValidDate(formattedDate);
        setIsDateValid(validDate && isAfterToday(formattedDate));
    }

    const handleStartTimeChange = (event) => {
        setEqualStart(false);
        const time = event.target.value;
        formik.values.startTime = time;
        setStart(time);
        validateTime(time, end);
    }

    const handleEndTimeChange = (event) => {
        setEqualEnd(false);
        const time = event.target.value;
        formik.values.endTime = time;
        setEnd(time);
        validateTime(start, time);
    }



    const handleReasonChange = (event) => {
        setEqualReason(false);
        const value = event.target.value;
        formik.values.reasonForVisit = value;
        setReason(value);
        const minLength = 10;
        const maxLength = 500;
        setIsReasonValid(value.length >= minLength && value.length <= maxLength);
    }



    const handleNotesChange = (event) => {
        const value = event.target.value;
        formik.values.notes = value;
        setNotes(value);
    }

    const validateTime = (startTime, endTime) => {
        const pattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        const isStartTimeValid = pattern.test(startTime);
        const isEndTimeValid = pattern.test(endTime);

        if (isStartTimeValid && isEndTimeValid) {
            const startDateTime = new Date(`1970-01-01T${startTime}:00`);
            const endDateTime = new Date(`1970-01-01T${endTime}:00`);

            // Check if end time is at least 15 minutes after start time
            const fifteenMinutesAfter = new Date(startDateTime.getTime() + 15 * 60000);
            const sixtyMinutesAfter = new Date(startDateTime.getTime() + 60 * 60000);

            const isValidEnd = endDateTime >= fifteenMinutesAfter && endDateTime <= sixtyMinutesAfter;

            setIsStartValid(isStartTimeValid);
            setIsEndValid(isValidEnd);

        } else {
            setIsStartValid(isStartTimeValid);
            setIsEndValid(false);
        }
    }

    if(loading){
        return <Loading />
    }

    return (<>
        <Helmet>
            <meta charSet="utf-8" />
            <title>MediConnect Pro | Appointment</title>
            <meta name='description' content='This is appointment page' />
            <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <div className="row mx-0 my-5 appointment">
            <div className="col-lg-6 my-5">
                <div className="container mt-5 pt-2 px-5">
                    <h3 className='my-5 mx-5'>Book an appointment with: Dr.{doctor?.userName}</h3>
                    <div className="appointment-form d-flex justify-content-center">
                        <form onSubmit={formik.handleSubmit} style={{ width: "60%" }}>
                            {/* Date */}
                            <label>Date</label>
                            <div className="firstinput">
                                <DatePicker wrapperClassName={`datePicker ${isDateValid ? 'validDate' : 'invalidDate'} `} selected={date} onChange={handleDateChange} />
                                <span className="focus-100">
                                    {
                                        equalDate ?
                                            <FontAwesomeIcon id="faCalendarDays" className="px-2 mx-2" icon={faCalendarDays} />
                                            :
                                            <FontAwesomeIcon id="faCalendarDays" className="px-2 mx-2" icon={faCalendarDays} style={{ color: isDateValid ? "green" : "red" }} />
                                    }
                                </span>
                            </div>
                            {
                                !equalDate ?
                                    !isDateValid ?
                                        <div className="small text-danger" id="userAlert">* Use a valid date</div>
                                        : <></>
                                    : <></>
                            }
                            {/*  */}
                            {/* Start Time */}
                            <label>Start Time</label>
                            <div className={`firstinput datePicker ${!equalStart ? isStartValid ? 'validDate' : 'invalidDate' : 'equalDate'}  `} style={{ width: "100%" }} >
                                <input type="time" name='startTime' className="form-control" id="timeInput" placeholder="Start Time"
                                    value={start}
                                    onChange={handleStartTimeChange}
                                    style={{ textAlign: "center", border: "0", width: "100%" }}
                                />

                                <span className="focus-100">
                                    {
                                        equalStart ?
                                            <FontAwesomeIcon id="faHourglassStart" className="px-2 mx-2" icon={faHourglassStart} />
                                            :
                                            <FontAwesomeIcon id="faHourglassStart" className="px-2 mx-2" icon={faHourglassStart} style={{ color: isStartValid ? "green" : "red" }} />
                                    }
                                </span>
                            </div>
                            {
                                !equalStart ?
                                    !isStartValid ?
                                        <div className="small text-danger" id="userAlert">* Use a valid start Time</div>
                                        : <></>
                                    : <></>
                            }
                            {/*  */}
                            {/* End Time */}
                            <label>End Time</label>
                            <div className={`firstinput datePicker ${!equalEnd ? isEndValid ? 'validDate' : 'invalidDate' : 'equalDate'}  `} style={{ width: "100%" }} >
                                <input type="time" name='endTime' className="form-control" id="floatingEndTime" placeholder="End Time"
                                    value={end}
                                    onChange={handleEndTimeChange}
                                    style={{ textAlign: "center", border: "0", width: "100%" }}
                                />
                                <span className="focus-100">
                                    {
                                        equalEnd ?
                                            <FontAwesomeIcon id="faHourglassEnd" className="px-2 mx-2" icon={faHourglassEnd} />
                                            :
                                            <FontAwesomeIcon id="faHourglassEnd" className="px-2 mx-2" icon={faHourglassEnd} style={{ color: isEndValid ? "green" : "red" }} />
                                    }
                                </span>
                            </div>
                            {
                                !equalEnd ?
                                    !isEndValid ?
                                        <div className="small text-danger" id="userAlert">* End time must be at least 15 minutes after and less than 60 minutes after start time.</div>
                                        : <></>
                                    : <></>
                            }
                            {/*  */}
                            {/* Reason For Visit */}
                            <label>Reason For Visit</label>
                            <div className="firstinput">
                                <textarea
                                    id="reason"
                                    placeholder="Describe your reason for visit"
                                    value={reason}
                                    name="reason"
                                    className={`logininput form-control ${!equalReason ? isReasonValid ? 'is-valid' : 'is-invalid' : ''}`}
                                    onChange={handleReasonChange}
                                    required
                                />
                                <span className="focus-100">
                                    {
                                        equalReason ?
                                            <FontAwesomeIcon id="faHourglassEnd" className="px-2 mx-2" icon={faPen} />
                                            :
                                            <FontAwesomeIcon id="faHourglassEnd" className="px-2 mx-2" icon={faPen} style={{ color: isReasonValid ? "green" : "red" }} />
                                    }
                                </span>
                            </div>
                            {
                                !equalReason &&
                                !isReasonValid &&
                                <div className="small text-danger" id="bioAlert">* Reason For Visit must be at between 10 and 500 characters</div>
                            }
                            {/* Notes */}
                            <label>Notes</label>
                            <div className="firstinput">
                                <textarea
                                    id="notes"
                                    placeholder="Add Your Notes"
                                    value={notes}
                                    name="notes"
                                    className={`logininput form-control`}
                                    onChange={handleNotesChange}
                                    required
                                />
                            </div>

                            <div className="d-grid gap-2">
                                <button type="button" name="subBtn" id="subBtn" className="btn btn-outline-secondary mt-4" disabled>
                                    {
                                        loadingSubmit ?
                                            <LoadingButton /> :
                                            <>Submit</>
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-lg-6 d-flex justify-content-center mb-5  ">
                <img src={appointmentImage} alt="appointmentImage" />
            </div>
        </div>

    </>
    )
}
