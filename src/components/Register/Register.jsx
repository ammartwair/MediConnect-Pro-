import axios from 'axios'
import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import {  useNavigate } from 'react-router-dom';
import './Register.css'
import RegisterCover from '../../images/RegisterPage.webp'
import * as Yup from 'yup'
import LoadingButton from '../LoadingButton/LoadingButton.jsx';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser, faUserCheck, faEnvelope, faLock, faUnlock, faLocationDot, faMars, faVenus, faPhone, faIdCard, faDollarSign, faBusinessTime, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import 'intl-tel-input/build/css/intlTelInput.css';
import ImageUpload from '../ImageUpload/ImageUpload.jsx';

export default function Register() {

  const [role, setRole] = useState('Patient');

  const inputRef = useRef(null);
  let [doctor, setDoctor] = useState(null);
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusErrors] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  let navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
    formik.setFieldValue('image', imageData);
  }

  const validSpecialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Hematology', 'Infectious Disease', 'Neurology', 'Obstetrics And Gynecology (OB/GYN)',
    'Oncology', 'Ophthalmology', 'Orthopedics', 'Otolaryngology (ENT)',
    'Pediatrics', 'Pulmonology', 'Rheumatology', 'Urology',
    'Psychiatry', 'Anesthesiology', 'Emergency Medicine', 'Family Medicine'
  ];

  const schema = Yup.object({
    userName: Yup.string().required("Name is required").min(3, "Min is 3 characters").max(20, "Max is 20 characters"),
    email: Yup.string().required("Email is required").email("Not valid email"),
    password: Yup.string().required("Password is required"),
    address: Yup.string().required("Address is required"),
    gender: Yup.string().required("Gender is required"),
    phoneNumber: Yup.string().required("phoneNumber is required").length(13),
    role: Yup.string().required("Role is required"),
    image: Yup.mixed()
      .required('Image is required')
      .test('fileSize', 'File size is too large', (value) => {
        if (value) {
          return value.size <= 1048576; // 1MB
        }
        return true; // No file uploaded
      })
      .test('fileType', 'Unsupported file type', (value) => {
        if (value) {
          return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
        }
        return true; // No file uploaded
      })
  });


  const doctorSchemab = Yup.object({
    licenseNumber: Yup.string().required("License Number is required"),
    yearsOfExperience: Yup.number().min(1).required("Years Of Experience is required"),
    consultationFees: Yup.number().min(50).required("Consultation Fees  is required"),
    bio: Yup.string().min(10).max(15000),
    specialties: Yup.array()
      .of(
        Yup.string().oneOf([
          'Cardiology',
          'Dermatology',
          'Endocrinology',
          'Gastroenterology',
          'Hematology',
          'InfectiousDisease',
          'Neurology',
          'ObstetricsAndGynecology(OB/GYN)',
          'Oncology',
          'Ophthalmology',
          'Orthopedics',
          'Otolaryngology(ENT)',
          'Pediatrics',
          'Pulmonology',
          'Rheumatology',
          'Urology',
          'Psychiatry',
          'Anesthesiology',
          'EmergencyMedicine',
          'FamilyMedicine'
        ])
      )
      .required(),
  });

  const doctorSchema = schema.concat(doctorSchemab);


  let formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      address: '',
      gender: 'Male',
      phoneNumber: '',
      role: 'Patient',
      image: null,
      licenseNumber: '',
      yearsOfExperience: '',
      consultationFees: '',
      bio: '',
      specialties: '',
    }, validationSchema: (role === 'Patient') ? schema : doctorSchema,
    onSubmit: sendRegisterData
  })

  async function sendRegisterData(values) {
    setLoadingSubmit(true);
    const formData = new FormData();
    formData.append('userName', formik.values.userName);
    formData.append('email', formik.values.email);
    formData.append('password', formik.values.password);
    formData.append('address', formik.values.address);
    formData.append('gender', formik.values.gender);
    formData.append('phoneNumber', formik.values.phoneNumber);
    formData.append('role', formik.values.role);
    formData.append('image', formik.values.image);
    if (formik.values.role === 'Doctor') {
      formData.append('licenseNumber', formik.values.licenseNumber);
      formData.append('yearsOfExperience', formik.values.yearsOfExperience);
      formData.append('consultationFees', formik.values.consultationFees);
      formData.append('bio', formik.values.bio);
      formData.append('specialties', JSON.stringify(formik.values.specialties));
      let res = await axios.post('http://localhost:5000/auth/doctorSignup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }).then((response) => {
        if (response.data.message === 'User Created') {
          setErrors([]);
          setStatusErrors('');
          setLoadingSubmit(false);
          toast.success('Regisrtation Done Sucessfully');
          setTimeout(() => navigate('/login'), 1500);
        } else if (response.data.message === "User Already Registered") {
          setLoadingSubmit(false);
          toast.error(response.data.message);
        } else {
          setLoadingSubmit(false);
          toast.error('Error Occured');
          console.log(response);
        }
      }).catch((error) => {
        setLoadingSubmit(false);
        toast.error('Error Occured');
        console.error('Error, ', error.response.data);
      });
    } else {
      let res = await axios.post('http://localhost:5000/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }).then((response) => {
        if (response.data.message === 'User Created') {
          setErrors([]);
          setStatusErrors('');
          setLoadingSubmit(false);
          toast.success('Regisrtation Done Sucessfully');
          setTimeout(() => navigate('/login'), 1500);
        } else if (response.data.message === "User Already Registered") {
          setLoadingSubmit(false);
          toast.error(response.data.message);
        } else {
          setLoadingSubmit(false);
          toast.error('Error Occured');
          console.log(response);
        }
      }).catch((error) => {
        setLoadingSubmit(false);
        toast.error('Error Occured');
        console.error('Error, ', error);
      });
    }
  }

  function toggleMaleToFemale() {
    formik.values.gender = 'Female';
  }
  function toggleFemaleToMale() {
    formik.values.gender = 'Male';
  }

  const [selectedOption, setSelectedOption] = useState('User');
  const [gender, setGender] = useState('Male');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "Doctor") {
      setRole("Doctor");
      formik.values.role = 'Doctor';
      setDoctor("yes");
    } else {
      setRole("Patient");
      formik.values.role = 'Patient'
      setDoctor(null);
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
    if (event.target.value === "Female") {
      toggleMaleToFemale();
    } else {
      toggleFemaleToMale();
    }
  };

  const [selectedValues, setSelectedValues] = useState([]);

  const handleCheckboxChange = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
      formik.values.specialties = selectedValues.filter((item) => item !== value);
    } else {
      setSelectedValues([...selectedValues, value]);
      formik.values.specialties = [...selectedValues, value];
    }
  };

  const [newPage, setNewPage] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [prefix, setPrefix] = useState('+970');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [consultationFees, setConsultationFees] = useState('');
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [iscPasswordValid, setIscPasswordValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isAdressValid, setIsAddressValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isLicenseNumberValid, setIsLicesnseNumberValid] = useState(false);
  const [isYearsOfExperienceValid, setIsYearsOfExperienceValid] = useState(false);
  const [isConsultationFeesValid, setIsConsultationFeesValid] = useState(false);
  const [isBioValid, setIsBioValid] = useState(false);
  const [areSpecialtiesValid, setAreSpecialtiesValid] = useState(false);
  const [equalEmail, setEqualEmail] = useState(true);
  const [equalPassword, setEqualPassword] = useState(true);
  const [equalcPassword, setEqualcPassword] = useState(true);
  const [equalUsername, setEqualUsername] = useState(true);
  const [equalAddress, setEqualAddress] = useState(true);
  const [equalPhone, setEqualPhone] = useState(true);
  const [equalLicenseNumber, setEquaLicenseNumber] = useState(true);
  const [equalYearsOfExperience, setEqualYearsOfExperience] = useState(true);
  const [equalConsultationFees, setEqualConsultationFees] = useState(true);
  const [equalBio, setEqualBio] = useState(true);
  const [equalSpecialties, setEqualSpecialties] = useState(true);
  const [showHide, setShowHide] = useState(false);

  const handleUsernameChange = (event) => {
    setEqualUsername(false);
    const value = event.target.value;
    formik.values.userName = value;
    setUsername(value);
    const pattern = /^[a-zA-Z][a-zA-Z0-9_ ]{2,19}$/;
    setIsUsernameValid(pattern.test(value));
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

  const handlecPasswordChange = (event) => {
    setEqualcPassword(false);
    const value = event.target.value;
    formik.values.password = value;
    setCPassword(value);
    const pattern = /^[A-Za-z][A-Za-z0-9\\\/\*\_\.\@\!\$\#\%\^\&\(\)\]\[\{\}\-\+\,\|\=\?\`\<\>\;\:\"\']{5,25}$/;
    setIscPasswordValid(pattern.test(value));
  }

  const handleAddressChange = (event) => {
    setEqualAddress(false);
    const value = event.target.value;
    formik.values.address = value;
    setAddress(value);
    const pattern = /^[a-zA-Z][a-zA-Z0-9_\-\, ]{3,49}$/;
    setIsAddressValid(pattern.test(value));
  }

  const [number, setNumber] = useState('');
  const [isNumberValid, setIsNumberValid] = useState(false);

  const handleNumberChange = (event) => {
    setEqualPhone(false);
    const value = event.target.value;
    setNumber(value);
    const pattern = /^\d{9}$/;
    setIsNumberValid(pattern.test(value));
    const newValue = prefix + value;
    formik.values.phoneNumber = newValue;
    setPhone(newValue);
    const npattern = /^[+\d]{13}$/;
    setIsPhoneValid(npattern.test(newValue));
  }

  const handlePrefixChange = (event) => {
    const value = event.target.value;
    setSelectedCountryCode(value);
    if (value === '972') {
      setPrefix('+972');
    } else {
      setPrefix('+970');
    }
    const newValue = '+' + value + number;
    formik.values.phoneNumber = newValue;
    setPhone(newValue);
    const npattern = /^[+\d]{13}$/;
    setIsPhoneValid(npattern.test(newValue));
  }

  const handleLicenseNumberChange = (event) => {
    setEquaLicenseNumber(false)
    const value = event.target.value;
    formik.values.licenseNumber = value;
    setLicenseNumber(value);
    const pattern = /^[0-9A-Za-z-]{5,20}$/;
    setIsLicesnseNumberValid(pattern.test(value));
  };

  const handleYearsOfExperienceChange = (event) => {
    setEqualYearsOfExperience(false)
    const value = event.target.value;
    formik.values.yearsOfExperience = value;
    setYearsOfExperience(value);
    const minValue = 1;
    setIsYearsOfExperienceValid(!isNaN(value) && parseInt(value) >= minValue);
  };

  const handleConsultationFeesChange = (event) => {
    setEqualConsultationFees(false)
    const value = event.target.value;
    formik.values.consultationFees = value;
    setConsultationFees(value);
    const minValue = 50;
    setIsConsultationFeesValid(!isNaN(value) && parseInt(value) >= minValue);
  };

  const handleBioChange = (event) => {
    setEqualBio(false)
    const value = event.target.value;
    formik.values.bio = value;
    setBio(value);
    const minLength = 10;
    const maxLength = 15000;
    setIsBioValid(value.length >= minLength && value.length <= maxLength);
  };


  const handleSpecialtiesChange = (specialty) => {
    setEqualSpecialties(false);
    setSpecialties(prevSpecialties => {
      const noSpacesSpecialty = specialty.replace(/\s+/g, '');
      if (prevSpecialties.includes(noSpacesSpecialty)) {
        // If already included, remove it (uncheck)
        if (prevSpecialties.length === 1) {
          setAreSpecialtiesValid(false);
        }
        formik.values.specialties = prevSpecialties.filter(s => s !== noSpacesSpecialty);
        return prevSpecialties.filter(s => s !== noSpacesSpecialty);
      } else {
        // If not included, add it (check)
        setAreSpecialtiesValid(true);
        formik.values.specialties = [...prevSpecialties, noSpacesSpecialty];
        return [...prevSpecialties, noSpacesSpecialty];
      }
    });
  };


  const handleTogglePasswordVisibility = () => {
    const passField = document.getElementById('upass');
    const cpassField = document.getElementById('cpass');
    if (passField.type === 'password') {
      passField.type = 'text';
      cpassField.type = 'text';
    } else {
      cpassField.type = 'password';
      passField.type = 'password';
    }
    setShowHide(!showHide);
  }

  const checkInputs = () => {
    if (isUsernameValid && isEmailValid && isPasswordValid && iscPasswordValid && cpassword === password && isAdressValid && isPhoneValid && uploadedImage) {
      if (role === 'Patient') {
        console.log(formik.values);
        ApproveInputs();
      } else if (isLicenseNumberValid && isBioValid && isConsultationFeesValid && isYearsOfExperienceValid && areSpecialtiesValid) {
        ApproveInputs();
      } else {
        DeclineInputs();
      }
    } else {
      DeclineInputs();
    }
  }
  const ApproveInputs = () => {
    const regbtn = document.getElementById("regbtn");
    regbtn.removeAttribute('disabled');
    regbtn.type = "submit";
    if (regbtn.classList.contains('btn-outline-secondary')) {
      regbtn.classList.remove('btn-outline-secondary');
    }
    regbtn.classList.add('btn-outline-success');
  }
  const DeclineInputs = () => {
    const regbtn = document.getElementById("regbtn");
    if (regbtn.classList.contains('btn-outline-success')) {
      regbtn.classList.remove('btn-outline-success');
    }
    regbtn.classList.add('btn-outline-secondary');
    regbtn.setAttribute('disabled', 'disabled');
    regbtn.type = "button";
  }

  const [selectedCountryCode, setSelectedCountryCode] = useState(970);

  useEffect(() => {
    if (!newPage) {
      inputRef.current.focus();
      window.scrollTo(0, 0);
      setNewPage(true);
    }
    checkInputs();
  }, [role, gender, username, email, password, cpassword, address, phone, uploadedImage, licenseNumber, bio, specialties, yearsOfExperience, consultationFees]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Register</title>
        <meta name="description" content="This is Register page" />
        <link rel="canonical" href="www.facebook.com" />
      </Helmet>
      <div style={{
        backgroundImage: `url(${RegisterCover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        // height: '100vh',
        backgroundAttachment: 'fixed'
      }}>
        <div className='col-md-6 pt-5 register' >
          <div className="container" style={{ width: "70%" }}>
            <p className='mx-5' style={{ display: "inline-block", fontWeight: "bold" }}>I'm A :</p>
            <div className="switches-container mb-4" style={{ display: "inline-block" }}>
              <input
                type="radio"
                id="switchUser"
                name="switchPlan"
                value="User"
                checked={selectedOption === 'User'}
                onChange={handleOptionChange}
              />
              <input
                type="radio"
                id="switchDoctor"
                name="switchPlan"
                value="Doctor"
                checked={selectedOption === 'Doctor'}
                onChange={handleOptionChange}
              />
              <label htmlFor="switchUser">User</label>
              <label htmlFor="switchDoctor">Doctor</label>
              <div className="switch-wrapper">
                <div className="switch">
                  <div>User</div>
                  <div>Doctor</div>
                </div>
              </div>
            </div>

            {errors.map((error) => {
              return <div className='text-dager'>{error.message}</div>
            })}

            <form onSubmit={formik.handleSubmit} autoComplete='off'>
              {/* UserName */}
              <label>Username</label>
              <div className="firstinput">
                <input
                  id="Username"
                  type="text"
                  placeholder="Type your username"
                  value={username}
                  ref={inputRef}
                  name="username"
                  className={`logininput form-control  ${!equalUsername ? isUsernameValid ? 'is-valid' : 'is-invalid' : ''}`}
                  onChange={handleUsernameChange}
                  required
                />
                <span className="focus-100">
                  {
                    equalUsername ?
                      <FontAwesomeIcon id="fa-user" className="px-2 mx-2" icon={faUser} />
                      :
                      !isUsernameValid ?
                        <FontAwesomeIcon id="fa-user" className="px-2 mx-2" icon={faUser} style={{ color: "red" }} />
                        :
                        <FontAwesomeIcon id="fa-usercheck" className="px-2 mx-2" icon={faUserCheck} style={{ color: "green" }} />
                  }
                </span>
              </div>
              {
                !equalUsername ?
                  !isUsernameValid ?
                    <div className="small text-danger" id="userAlert">* Use 3 to 20 characters starting with a letter</div>
                    : <></>
                  : <></>
              }
              {/*  */}
              {/*  Email Address */}
              <label>Email</label>
              <div className="firstinput">
                <input
                  id="email"
                  type="email"
                  placeholder="Type your email"
                  value={email}
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
              {/*  Password */}
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
              {/* Confirm Password */}
              <label>Confirm Password</label>
              <div className="firstinput">
                <input
                  id="cpass"
                  type="password"
                  placeholder="Type your password"
                  value={cpassword}
                  name="cpassword"
                  className={`logininput form-control ${!equalcPassword ? iscPasswordValid ? password === cpassword ? 'is-valid' : 'is-invalid' : 'is-invalid' : ''}`}
                  onChange={handlecPasswordChange}
                  required
                />
                <span className="focus-100">
                  {
                    !showHide ?
                      <FontAwesomeIcon id="fa-lock" className="px-2 mx-2" icon={faLock} style={{ color: !equalcPassword ? iscPasswordValid ? password === cpassword ? 'green' : 'red' : 'red' : '' }} />
                      :
                      <FontAwesomeIcon id="fa-unlock" className="px-2 mx-2" icon={faUnlock} style={{ color: !equalcPassword ? iscPasswordValid ? password === cpassword ? 'green' : 'red' : 'red' : '' }} />
                  }
                </span>
              </div>
              {
                !equalcPassword ?
                  !iscPasswordValid ?
                    <div className="small text-danger" id="cpasswordAlert">* Use 6 to 25 characters starting with a letter</div>
                    : password === cpassword ? <></>
                      : <div className="small text-danger" id="cpasswordAlert">* The confirm password should match the password</div>
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
              {/* Address */}
              <label>Address</label>
              <div className="firstinput">
                <input
                  id="Address"
                  type="text"
                  placeholder="Type your Address"
                  value={address}
                  name="Address"
                  className={`logininput form-control  ${!equalAddress ? isAdressValid ? 'is-valid' : 'is-invalid' : ''}`}
                  onChange={handleAddressChange}
                  required
                />
                <span className="focus-100">
                  <FontAwesomeIcon id="faLocationDot" className="px-2 mx-2" icon={faLocationDot} style={{ color: !equalAddress ? isAdressValid ? 'green' : 'red' : '' }} />
                </span>
              </div>
              {
                !equalAddress ?
                  !isAdressValid ?
                    <div className="small text-danger" id="userAlert">* Use 4 to 50 characters</div>
                    : <></>
                  : <></>
              }
              {/* Gender */}
              <p className='mx-5 mt-5' style={{ display: "inline-block", fontWeight: "bold" }}>I'm A :</p>
              <div className="switches-container mb-4" style={{ display: "inline-block" }}>
                <input
                  type="radio"
                  id="switchMale"
                  name="switchPlan"
                  value="Male"
                  checked={gender === 'Male'}
                  onChange={handleGenderChange}
                />
                <input
                  type="radio"
                  id="switchFemale"
                  name="switchPlan"
                  value="Female"
                  checked={gender === 'Female'}
                  onChange={handleGenderChange}
                />
                <label htmlFor="switchMale">Male <FontAwesomeIcon icon={faMars} /></label>
                <label htmlFor="switchFemale">Female <FontAwesomeIcon icon={faVenus} /></label>
                <div className="switch-wrapper">
                  <div className="switch">
                    <div>Male <FontAwesomeIcon icon={faMars} /></div>
                    <div>Female <FontAwesomeIcon icon={faVenus} /></div>
                  </div>
                </div>
              </div>
              {/* Phone Number */}
              {/*  */}
              <div className="form-floating mb-3 row">
                <div className="col-3">
                  <select
                    name="countryCode"
                    id="countryCode"
                    value={selectedCountryCode}
                    onChange={handlePrefixChange}
                    style={{ height: "100%" }}
                  >
                    <option data-countrycode="IL" value={972}>Israel (+972)</option>
                    <option data-countrycode="PS" value={970}>Palestine (+970)</option>
                  </select>
                </div>
                <div className="col-9 firstinput">
                  <input
                    type="number"
                    name="phoneNumber"
                    id="floatingPhoneNumber"
                    placeholder="phoneNumber"
                    value={number}
                    onChange={handleNumberChange}
                    className={`logininput form-control  ${!equalPhone ? isPhoneValid ? 'is-valid' : 'is-invalid' : ''}`}
                  />
                  <span className="focus-100">
                    <FontAwesomeIcon id="faLocationDot" className="px-2 mx-2" icon={faPhone} style={{ color: !equalPhone ? isPhoneValid ? 'green' : 'red' : '' }} />
                  </span>
                </div>
                <div className="col-3"></div>
                <div className="col-9">
                  {
                    !equalPhone ?
                      !isPhoneValid ?
                        <div className="small text-danger" id="userAlert">* Use exactly 9 digits for phone number</div>
                        : <></>
                      : <></>
                  }
                </div>
              </div>
              <ImageUpload onImageUpload={handleImageUpload} />
              {/* Doctor Section */}
              {doctor ? <>
                {/* License Number */}
                <label>License Number</label>
                <div className="firstinput">
                  <input
                    id="LicenseNumber"
                    type="text"
                    placeholder="Type your License Number"
                    value={licenseNumber}
                    name="licenseNumber"
                    className={`logininput form-control  ${!equalLicenseNumber ? isLicenseNumberValid ? 'is-valid' : 'is-invalid' : ''}`}
                    onChange={handleLicenseNumberChange}
                    required
                  />
                  <span className="focus-100">
                    <FontAwesomeIcon id="faLocationDot" className="px-2 mx-2" icon={faIdCard} style={{ color: !equalLicenseNumber ? isLicenseNumberValid ? 'green' : 'red' : '' }} />
                  </span>
                </div>
                {
                  !equalLicenseNumber ?
                    !isLicenseNumberValid ?
                      <div className="small text-danger" id="userAlert">* Use 5 to 20 characters</div>
                      : <></>
                    : <></>
                }
                {/* Consultation Fees */}
                <label>Consultation Fees</label>
                <div className="firstinput">
                  <input
                    id="ConsultationFees"
                    type="number"
                    placeholder="Enter consultation fees"
                    value={consultationFees}
                    name="consultationFees"
                    className={`logininput form-control ${!equalConsultationFees ? isConsultationFeesValid ? 'is-valid' : 'is-invalid' : ''}`}
                    onChange={handleConsultationFeesChange}
                    required
                  />
                  <span className="focus-100">
                    <FontAwesomeIcon className="px-2 mx-2" icon={faDollarSign} style={{ color: !equalConsultationFees ? isConsultationFeesValid ? 'green' : 'red' : '' }} />
                  </span>
                </div>
                {
                  !equalConsultationFees &&
                  !isConsultationFeesValid &&
                  <div className="small text-danger" id="feesAlert">* Minimum fee must be $50</div>
                }

                {/* Years of Experience */}
                <label>Years of Experience</label>
                <div className="firstinput">
                  <input
                    id="YearsOfExperience"
                    type="number"
                    placeholder="Enter years of experience"
                    value={yearsOfExperience}
                    name="yearsOfExperience"
                    className={`logininput form-control ${!equalYearsOfExperience ? isYearsOfExperienceValid ? 'is-valid' : 'is-invalid' : ''}`}
                    onChange={handleYearsOfExperienceChange}
                    required
                  />
                  <span className="focus-100">
                    <FontAwesomeIcon className="px-2 mx-2" icon={faBusinessTime} style={{ color: !equalYearsOfExperience ? isYearsOfExperienceValid ? 'green' : 'red' : '' }} />
                  </span>
                </div>
                {
                  !equalYearsOfExperience &&
                  !isYearsOfExperienceValid &&
                  <div className="small text-danger" id="experienceAlert">* At least 1 year required</div>
                }

                {/* Bio */}
                <label>Bio</label>
                <div className="firstinput">
                  <textarea
                    id="Bio"
                    placeholder="Describe your professional background"
                    value={bio}
                    name="bio"
                    className={`logininput form-control ${!equalBio ? isBioValid ? 'is-valid' : 'is-invalid' : ''}`}
                    onChange={handleBioChange}
                    required
                  />
                </div>
                {
                  !equalBio &&
                  !isBioValid &&
                  <div className="small text-danger" id="bioAlert">* Bio must be between 10 and 15000 characters</div>
                }

                {/* Specialties */}
                <label>Specialties</label>
                <div className="row">
                  {validSpecialties.map((specialty) => (
                    <div key={specialty} className={`form-check col-md-6 col-lg-4 my-1 `} onClick={() => handleSpecialtiesChange(specialty)}>
                      <div className={`specialty-name ${specialties.includes(specialty.replace(/\s+/g, '')) ? 'selected-specialty' : ''}`}>{specialty}</div>
                    </div>
                  ))}
                </div>
                {
                  !equalSpecialties &&
                  !areSpecialtiesValid &&
                  <div className="small text-danger" id="specialtiesAlert">* At least one specialty must be selected</div>
                }
                {/*  */}
                <p className='mt-5 specialties'>Specialties: </p><span>
                  {
                    specialties.length > 0 ?
                      specialties.map((specialty, index) => {
                        if (index === specialties.length - 1) {
                          return specialty
                        }
                        return specialty + ', '
                      })
                      :
                      'No specialties selected'
                  }
                </span>

              </> : <></>
              }
              {formik.touched.userName && formik.errors.userName ? (
                <div>{formik.errors.userName}</div>
              ) : null}
              <div className="d-grid gap-2 my-5">
                <button type="button" name="regbtn" id="regbtn" className="btn btn-outline-secondary mt-4" disabled>
                  {
                    loadingSubmit ?
                      <LoadingButton /> :
                      <>Sign Up</>
                  }
                </button>
              </div>
              <br /><br /><br /><br /><br /><br /><br />
            </form>
          </div>
        </div>
      </div>
    </>
  )
}