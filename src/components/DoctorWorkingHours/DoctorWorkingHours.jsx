
import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import * as Yup from 'yup';


export default function DoctorWorkingHours({ user }) {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { id } = useParams();
    let [errors, setErrors] = useState([]);
    let [statusError, setStatusErrors] = useState('');
    let navigate = useNavigate();

    const schema = Yup.object().shape({
        workingHours: Yup.array()
            .of(
                Yup.object().shape({
                    dayOfWeek: Yup.number().required(),
                    start: Yup.string().required('Start time is required'),
                    end: Yup.string().required('End time is required')
                })
            )
            .min(5, 'You must provide working hours for at least 5 days')
            .max(5, 'You can provide working hours for maximum 5 days')
            .required('Working hours are required')
    });

    let formik = useFormik({
        initialValues: {
            workingHours: [
                { dayOfWeek: 0, start: '09:00', end: '16:00' },
                { dayOfWeek: 1, start: '09:00', end: '16:00' },
                { dayOfWeek: 2, start: '09:00', end: '16:00' },
                { dayOfWeek: 3, start: '09:00', end: '16:00' },
                { dayOfWeek: 4, start: '09:00', end: '16:00' },
            ]
        }, validationSchema: schema,
        onSubmit: sendHoursData,
    })


    async function sendHoursData(values) {
        values.workingHours.map((day) => {
            if (!isValidTimeFormat(day.start) || !isValidTimeFormat(day.end)) {
                toast.error("Error Occured");
                return;
            }
        })
        try {
            const axiosInstance = axios.create({
                baseURL: 'http://localhost:5000',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${localStorage.getItem('Authorization')}`
                }
            });
            console.log(values.workingHours);
            let { data } = await axiosInstance.post(`http://localhost:5000/auth/addWorkingHours`, values)
                .catch((err) => {
                    console.log(err);
                    toast.error("Error Occured");
                })

            if (data.message === 'Success Adding Working Hours') {
                setErrors([]);
                setStatusErrors('');
                toast.success("Working Hours Updated Successfully");
                setTimeout(() => navigate('/Dashboard'), 1500);
            } else {
                setErrors(data.err[0]);
                toast.error("Error Occured");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error Occured");
        }
    }
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

    // Ensuring that only a specific user (identified by id) can access Doctor woring hours page.

    if (user) {
        if (user.id !== id) {
            return <Navigate to='/Dashboard'></Navigate>
        }
    }

    function isValidTimeFormat(input) {
        // Regular expression for HH:mm format
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        return regex.test(input);
    }



    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Working Hours</title>
                <meta name='description' content='This is Login page' />
                <link rel="canonical" href="http://localhost:5000" />
            </Helmet>
            <div>
                <h2 className='my-4'>Working Hours</h2>
                {errors.map((error) => {
                    return <div className='text-dager'>{error.message}</div>
                })}

                <form onSubmit={formik.handleSubmit}>
                    {formik.values.workingHours.map((hour, index) => (

                        <div key={index}>
                            <span style={{ marginRight: "5px" }}>{daysOfWeek[index]}: </span>
                            <label htmlFor={`workingHours[${index}].start`} style={{ marginRight: "5px" }}>Start Time</label>
                            <input
                                type="time"
                                id={`workingHours[${index}].start`}
                                name={`workingHours[${index}].start`}
                                value={formik.values.workingHours[index].start}
                                onChange={formik.handleChange}
                                min='08:00'
                                max='22:00'
                                style={{ marginRight: "5px" }}
                            />
                            <label htmlFor={`workingHours[${index}].end`} style={{ marginRight: "5px" }}>End Time</label>
                            <input
                                type="time"
                                id={`workingHours[${index}].end`}
                                name={`workingHours[${index}].end`}
                                value={formik.values.workingHours[index].end}
                                onChange={formik.handleChange}
                                min='08:00'
                                max='22:00'
                            />
                            <br />
                            <br />
                        </div>
                    ))}
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}
