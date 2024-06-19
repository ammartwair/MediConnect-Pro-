import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { useNavigate , Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup'


export default function ChangePassword() {


    let [errors, setErrors] = useState([]);
    let [statusError, setStatusErrors] = useState('');
    let navigate = useNavigate();
    const schema = Yup.object({
        code: Yup.string().required("Name is required").min(3, "Min is 3 characters").max(10, "Max is 10 characters"),
        email: Yup.string().required("Email is required").email("Not valid email"),
        password: Yup.string().required("Password is required"),
    });
    let formik = useFormik({
        initialValues: {
            code: '',
            email: '',
            password: '',
        }, validationSchema: schema,
        onSubmit: changePasswordData,
    })

    async function changePasswordData(values) {

        let res = await axios.post("http://localhost:5000/auth/forgotPassword", values)
            .then((response) => {
                if (response.data.message == 'Password is Changed') {
                    setErrors([]);
                    setStatusErrors('');
                    toast.success("Password changed successfully")
                    navigate('/Login');
                } else {
                    setErrors(response.data.err[0]);
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
                <title>MediConnect Pro | Change Password</title>
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
                        <input type="text" name='code' className="form-control" id="floatingCode" placeholder="Forget Code"
                            value={formik.values.code}
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
                    <div>
                        <Link to ="/SendCode" >Resend the code</Link>
                    </div>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary mt-3" type="submit">Change</button>
                    </div>
                </form>
            </div>
        </>
    )
}
