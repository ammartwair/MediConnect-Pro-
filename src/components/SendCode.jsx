import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup'

export default function SendCode(props) {

  let navigate = useNavigate();
  const schema = Yup.object({
    email:Yup.string().required("Email is required").email("Not valid email")
  });
  let formik = useFormik({
    initialValues: {
      email: '',
    }, validationSchema:schema,
    onSubmit: sendCodeDate,
  })

  async function sendCodeDate(values){
    let code = null;
    let res = await axios.patch("http://localhost:5000/auth/sendCode",values)
    .then((response)=>{
      if (response.data.message == 'Done'){
        navigate('/ChangePassword');
      }else{
        console.log(response.data.message);
    }
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  return (
    <>
     <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Forgot Password</title>
        <meta name='description' content='This is Forgot Password page' />
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div>
        <h2 className='my-4'>Send Code To Change Password</h2>
        <form onSubmit={formik.handleSubmit}>
        <div className="form-floating mb-3">
          <input type="email" name='email' className="form-control" id="floatingEmail" placeholder="Email address" 
          value = {formik.values.email}
          onChange={formik.handleChange}
          />
          <label htmlFor="floatingEmail">Email address</label>
          <p className='text-danger'>{formik.errors.email}</p>
        </div>
          <div className="d-grid gap-2">
          <button className="btn btn-primary mt-3" type="submit">Send</button>
        </div>
      </form>
      </div>
    </>
  )
}
