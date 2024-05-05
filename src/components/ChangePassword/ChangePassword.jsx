import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup'


export default function ChangePassword() {


    let [errors, setErrors] = useState([]);
    let [statusError, setStatusErrors] = useState('');
    let navigate = useNavigate();
    const schema = Yup.object({
        forgetCode: Yup.string().required("Name is required").min(3, "Min is 3 characters").max(10, "Max is 10 characters"),
        email: Yup.string().required("Email is required").email("Not valid email"),
        password: Yup.string().required("Password is required"),
        cPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref('password')], "Not match password")

    });
    let formik = useFormik({
        initialValues: {
            forgetCode: '',
            email: '',
            password: '',
            cPassword: ''
        }, validationSchema: schema,
        onSubmit: changePasswordData,
    })

    async function changePasswordData(values) {

        let { data } = await axios.patch("https://king-prawn-app-3mgea.ondigitalocean.app/auth/forgetPassword", values)
            .catch((err) => {
                console.log(err);
            })
        if (data.message == 'success') {
            setErrors([]);
            setStatusErrors('');
            toast.success("Password changed successfully")
            navigate('/Login');
        } else {
            setErrors(data.err[0]);
        }
    }
    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>A - Shop | Change Password</title>
                <meta name='description' content='This is Change Password page' />
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <div>
                <h2 className='my-4'>Change Password</h2>
                {errors.map((error) => {
                    return <div className='text-dager'>{error.message}</div>
                })}

                <form onSubmit={formik.handleSubmit}>
                    <div className="form-floating mb-3">
                        <input type="text" name='forgetCode' className="form-control" id="floatingCode" placeholder="forgetCode"
                            value={formik.values.forgetCode}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingCode">Code</label>
                        <p className='text-danger'>{formik.errors.userName}</p>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="email" name='email' className="form-control" id="floatingEmail" placeholder="Email address"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingEmail">Email address</label>
                        <p className='text-danger'>{formik.errors.email}</p>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" name='password' className="form-control" id="floatingPassword" placeholder="Password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingPassword">New Password</label>
                        <p className='text-danger'>{formik.errors.password}</p>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" name='cPassword' className="form-control" id="floatingcPassword" placeholder="Password"
                            value={formik.values.cPassword}
                            onChange={formik.handleChange}
                        />
                        <label htmlFor="floatingcPassword">Confirm Your Password</label>
                        <p className='text-danger'>{formik.errors.cPassword}</p>
                        <div className="d-grid gap-2">
                            <button className="btn btn-primary mt-3" type="submit">Change</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
