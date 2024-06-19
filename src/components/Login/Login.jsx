import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import * as Yup from 'yup'

export default function Login(props) {

  let [errors, setErrors] = useState([]);
  let [statusError, setStatusErrors] = useState('');
  let navigate = useNavigate();
  const schema = Yup.object({
    email: Yup.string().required("Email is required").email("Not valid email").min(5),
    password: Yup.string().required("Password is required").min(3)
  });
  let formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    }, validationSchema: schema,
    onSubmit: sendLoginData,
  })

  async function sendLoginData(values) {


    let { data } = await axios.post("http://localhost:5000/auth/login", values)
      .catch((err) => {
        console.log(err);
      })

    if (data.message == 'Login successful') {
      setErrors([]);
      setStatusErrors('');
      const customBearerKey = "MediConnectPro__";
      const token = customBearerKey + data.token;
      localStorage.setItem('Authorization', token);
      props.saveCurrentUser();
      navigate('/Dashboard');
    } else if (data.message == "Email is not confirmed") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email is not confirmed",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: data.message,
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    }
  }
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Login</title>
        <meta name='description' content='This is Login page' />
        <link rel="canonical" href="http://localhost:5000" />
      </Helmet>
      <div>
        <h2 className='my-4'>Login</h2>
        {errors.map((error) => {
          return <div className='text-dager'>{error.message}</div>
        })}

        <form onSubmit={formik.handleSubmit}>
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
            <label htmlFor="floatingPassword">Password</label>
            <p className='text-danger'>{formik.errors.password}</p>
          </div>
          <Link to="/SendCode">Forgot Password?</Link>
          <div className="d-grid gap-2">
            <button className="btn btn-primary mt-3" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  )
}
