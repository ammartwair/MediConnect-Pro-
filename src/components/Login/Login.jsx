import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'

export default function Login(props) {

  let [errors,setErrors] = useState([]);
  let [statusError,setStatusErrors] = useState('');
  let navigate = useNavigate();
  const schema = Yup.object({
    email:Yup.string().required("Email is required").email("Not valid email"),
    password:Yup.string().required("Password is required")
  });
  let formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    }, validationSchema:schema,
    onSubmit: sendRegisterData,
  })

  async function sendRegisterData(values){

    let {data} = await axios.post("https://ecommerce-node-3.vercel.app/auth/signup",values)
    .catch((err)=>{
      console.log(err);
    })
 
    if (data.message == 'Done'){
      setErrors([]);
      setStatusErrors('');
      localStorage.setItem('userToken', data.access_Token);
      props.saveCurrentUser();
      navigate('/');
    }else{
      setErrors(data.err[0]);
    }
  }
  return (
    <>
     <Helmet>
        <meta charSet="utf-8" />
        <title>A - Shop | Login</title>
        <meta name='description' content='This is Login page' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div>
        <h2 className='my-4'>Login</h2>
        {errors.map((error)=>{
          return <div className='text-dager'>{error.message}</div>
        })}

        <form onSubmit={formik.handleSubmit}>
        <div className="form-floating mb-3">
          <input type="email" name='email' className="form-control" id="floatingEmail" placeholder="Email address" 
          value = {formik.values.email}
          onChange={formik.handleChange}
          />
          <label htmlFor="floatingEmail">Email address</label>
          <p className='text-danger'>{formik.errors.email}</p>
        </div>
        <div className="form-floating mb-3">
          <input type="password" name='password' className="form-control" id="floatingPassword" placeholder="Password" 
          value = {formik.values.password} 
          onChange={formik.handleChange}
          />
          <label htmlFor="floatingPassword">Password</label>
          <p className='text-danger'>{formik.errors.password}</p>
        </div>
        <Link to= "/SendCode">Forgot Password?</Link>
          <div className="d-grid gap-2">
          <button className="btn btn-primary mt-3" type="submit">Submit</button>
        </div>
      </form>
      </div>
    </>
  )
}
