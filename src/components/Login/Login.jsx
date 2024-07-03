import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import * as Yup from 'yup'
import loginCover from '../../images/b417ec0c-3707-48f7-b049-ff75bf458c2b.webp'
import { toast } from 'react-toastify';
import './Login.css'
import LoadingButton from '../LoadingButton/LoadingButton.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons'

export default function Login(props) {

  let [errors, setErrors] = useState([]);
  let [statusError, setStatusErrors] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
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
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: sendLoginData,
  })

  async function sendLoginData(values) {
    setLoadingSubmit(true);
    let { data } = await axios.post("http://localhost:5000/auth/login", values)
      .catch((err) => {
        setLoadingSubmit(false);
        toast.error("Email or Password is incorrect");
        console.log(err);
      })

    if (data.message == 'Login successful') {
      setErrors([]);
      setStatusErrors('');
      const customBearerKey = "MediConnectPro__";
      const token = customBearerKey + data.token;
      localStorage.setItem('Authorization', token);
      props.saveCurrentUser();
      setLoadingSubmit(false);
      navigate('/Dashboard');
    } else {
      setLoadingSubmit(false);
      toast.error(data.message);
    }
  }

  const [newPage, setNewPage] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [equalEmail, setEqualEmail] = useState(true);
  const [equalPassword, setEqualPassword] = useState(true);
  const [showHide, setShowHide] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (newPage) {
      inputRef.current.focus();
      window.scrollTo(0, 0);
      setNewPage(false);
    }
    checkInputs();
  }, [email, password]);

  const checkInputs = () => {
    const lginbtn = document.getElementById("lginbtn");

    if (isEmailValid && isPasswordValid) {
      lginbtn.removeAttribute('disabled');
      lginbtn.type = "submit";
      if (lginbtn.classList.contains('btn-outline-secondary')) {
        lginbtn.classList.remove('btn-outline-secondary');
      }
      lginbtn.classList.add('btn-outline-success');
    } else {
      if (lginbtn.classList.contains('btn-outline-success')) {
        lginbtn.classList.remove('btn-outline-success');
      }
      lginbtn.classList.add('btn-outline-secondary');
      lginbtn.setAttribute('disabled', 'disabled');
      lginbtn.type = "button";
    }
  }

  const handleEmailChange = (event) => {
    setEqualEmail(false);
    const value = event.target.value;
    formik.values.email = value;
    setEmail(value);
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(pattern.test(value));
  }

  const handlePasswordChange = (event) => {
    setEqualPassword(false);
    const value = event.target.value;
    formik.values.password = value;
    setPassword(value);
    const pattern = /^[A-Za-z][A-Za-z0-9\\\/\*\_\.\@\!\$\#\%\^\&\(\)\]\[\{\}\-\+\,\|\=\?\`\<\>\;\:\"\']{5,25}$/;
    setIsPasswordValid(pattern.test(value));
  }

  const handleTogglePasswordVisibility = () => {
    const passField = document.getElementById('upass');
    if (passField.type === 'password') {
      passField.type = 'text';
    } else {
      passField.type = 'password';
    }
    setShowHide(!showHide);
  }


  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Login</title>
        <meta name='description' content='This is Login page' />
        <link rel="canonical" href="http://localhost:5000" />
      </Helmet>
      <div className="login-container"
        style={{
          // backgroundImage: `url(${loginCover})`,
          // backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100vh', // Adjust height as needed
        }}>
        <div className="row pt-5 mx-0">
          <div className="col-md-6 d-flex align-items-center mt-5 pt-5">
            <div className="container" style={{ width: "70%" }}>
              <h2 className='login'>Log In</h2>
              <br /><br />
              {errors.map((error) => {
                return <div className='text-danger'>{error.message}</div>
              })}
              <form onSubmit={formik.handleSubmit} autoComplete="off">
                <label>Email</label>
                <div className="firstinput">
                  <input
                    id="email"
                    type="email"
                    placeholder="Type your email"
                    value={email}
                    ref={inputRef}
                    name="email"
                    className={`logininput form-control  ${!equalEmail ? isEmailValid ? 'is-valid' : 'is-invalid' : ''}`}
                    onChange={handleEmailChange}
                    required
                  />
                  <span className="focus-100">
                    <FontAwesomeIcon id="fa-user" className="px-2 mx-2" icon={faEnvelope} style={{ color: !equalEmail ? isEmailValid ? 'green' : 'red' : '' }} />
                  </span>
                </div>
                {
                  !equalEmail ?
                    !isEmailValid ?
                      <div className="small text-danger" id="userAlert">* Please insert a valid email address</div>
                      : <></>
                    : <></>
                }

                <label>Password</label>
                <div className="firstinput">
                  <input
                    id="upass"
                    type="password"
                    placeholder="Type your password"
                    value={password}
                    name="password"
                    className={`logininput form-control ${!equalPassword ? isPasswordValid ? 'is-valid' : 'is-invalid' : ''}`}
                    onChange={handlePasswordChange}
                    required
                  />
                  <span className="focus-100">
                    {
                      !showHide ?
                        <FontAwesomeIcon id="fa-lock" className="px-2 mx-2" icon={faLock} style={{ color: !equalPassword ? isPasswordValid ? 'green' : 'red' : '' }} />
                        :
                        <FontAwesomeIcon id="fa-unlock" className="px-2 mx-2" icon={faUnlock} style={{ color: !equalPassword ? isPasswordValid ? 'green' : 'red' : '' }} />

                    }
                  </span>
                </div>
                {
                  !equalPassword ?
                    !isPasswordValid ?
                      <div className="small text-danger" id="passwordAlert">* Use 6 to 25 characters starting with a letter</div>
                      : <></>
                    : <></>
                }
                <div id="showHide" className='mt-3'>
                  {
                    !showHide ?
                      <>
                        <FontAwesomeIcon id="showIcon" className="px-2 mx-1 showhide" onClick={handleTogglePasswordVisibility} icon={faEye} />
                        <span id="showPass" className="showhide" onClick={handleTogglePasswordVisibility}>Show Password</span>
                      </> :
                      <>
                        <FontAwesomeIcon id="hideIcon" className="px-2 mx-1 showhide" onClick={handleTogglePasswordVisibility} icon={faEyeSlash} />
                        <span id="hidePass" className="showhide" onClick={handleTogglePasswordVisibility}>Hide Password</span>
                      </>
                  }
                </div>
                <center className='mt-4'>
                  <Link to="/SendCode">Forgot Password?</Link>
                  <br />
                  <button type="button" name="loginbtn" id="lginbtn" className="btn btn-outline-secondary mt-4" disabled>
                    {
                      loadingSubmit ?
                        <LoadingButton /> :
                        <>Log in</>
                    }
                  </button><br /><br />
                  New user? <Link to="/Register">Register Here?</Link>
                </center>
              </form>
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-center">
          </div>
        </div>
      </div >
    </>
  )
}
