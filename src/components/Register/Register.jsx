import axios from 'axios'
import { useFormik, yupToFormErrors } from 'formik'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet';
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom';

import * as Yup from 'yup'

export default function Register() {

  let [doctor, setDoctor] = useState(null);
  let [errors, setErrors] = useState([]);
  let [statusError, setStatusErrors] = useState('');
  let navigate = useNavigate();

  const validSpecialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Hematology', 'InfectiousDisease', 'Neurology', 'ObstetricsAndGynecology(OB/GYN)',
    'Oncology', 'Ophthalmology', 'Orthopedics', 'Otolaryngology(ENT)',
    'Pediatrics', 'Pulmonology', 'Rheumatology', 'Urology',
    'Psychiatry', 'Anesthesiology', 'EmergencyMedicine', 'FamilyMedicine'
  ];

  const schema = Yup.object({
    userName: Yup.string().required("Name is required").min(3, "Min is 3 characters").max(10, "Max is 10 characters"),
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

  let role = "Patient";

  let formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      address: '',
      gender: '',
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
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your Regisrtation Done Sucessfully",
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setErrors(response.data.err[0]);
        }
      }).catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
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
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your Regisrtation Done Sucessfully",
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setErrors(response.data.err[0]);
        }
      }).catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
        console.error('Error, ', error.response.data);
      });
    }
  }

  const handleImageUpload = (file) => {
    formik.setFieldValue('image', file);
  };

  function toggleRegisterToDoctor() {
    const element = document.getElementById('RegisterTitle');
    element.innerHTML = "Doctor Register Page";
    formik.values.role = 'Doctor';
    role = "Doctor";
    setDoctor("yes");
  }
  function toggleRegisterToUser() {
    const element = document.getElementById('RegisterTitle');
    element.innerHTML = "User Register Page";
    formik.values.role = 'Patient'
    role = "Patient";
    setDoctor(null);
  }

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

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MediConnect Pro | Register</title>
        <meta name="description" content="This is Register page" />
        <link rel="canonical" href="www.facebook.com" />
      </Helmet>
      <div>

        <h2 className='my-4' id="RegisterTitle">User Register Page</h2>
        <ul className="userDoctor">
          <li>
            <input type="radio" id="rsvp-yes" name="selector" defaultChecked onClick={toggleRegisterToUser} />
            <label htmlFor="rsvp-yes" className="button">User</label>
          </li>
          <li>
            <input type="radio" id="rsvp-no" name="selector" onClick={toggleRegisterToDoctor} />
            <label htmlFor="rsvp-no" className="button">Doctor</label>
          </li>
        </ul>

        {errors.map((error) => {
          return <div className='text-dager'>{error.message}</div>
        })}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-floating mb-3">
            <input type="text" name='userName' className="form-control" id="floatingName" placeholder="Username"
              value={formik.values.userName}
              onChange={formik.handleChange}
            />
            <label htmlFor="floatingName">Username</label>
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
            <label htmlFor="floatingPassword">Password</label>
            <p className='text-danger'>{formik.errors.password}</p>
          </div>
          <div className="form-floating mb-3">
            <input type="text" name='address' className="form-control" id="floatingAddress" placeholder="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
            />
            <label htmlFor="floatingAddress">Address</label>
            <p className='text-danger'>{formik.errors.address}</p>
          </div>
          <input type="hidden" name='role' className="form-control" id="floatingRole"
            value={formik.values.role}
          />
          <div className="form-floating mb-3">
            <input type="text" name='gender' className="form-control" id="floatingGender" placeholder="Gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
            />
            <label htmlFor="floatingGender">Gender</label>
            <p className='text-danger'>{formik.errors.address}</p>
          </div>
          <div className="form-floating mb-3">
            <label htmlFor="floatingPhoneNumber">Phone Number</label>
            <br />
            <br />

            <select name="countryCode" id="2" defaultValue={970}>
              <option data-countrycode="DZ" value={213}>Algeria (+213)</option>
              <option data-countrycode="AD" value={376}>Andorra (+376)</option>
              <option data-countrycode="AO" value={244}>Angola (+244)</option>
              <option data-countrycode="AI" value={1264}>Anguilla (+1264)</option>
              <option data-countrycode="AG" value={1268}>Antigua &amp; Barbuda (+1268)</option>
              <option data-countrycode="AR" value={54}>Argentina (+54)</option>
              <option data-countrycode="AM" value={374}>Armenia (+374)</option>
              <option data-countrycode="AW" value={297}>Aruba (+297)</option>
              <option data-countrycode="AU" value={61}>Australia (+61)</option>
              <option data-countrycode="AT" value={43}>Austria (+43)</option>
              <option data-countrycode="AZ" value={994}>Azerbaijan (+994)</option>
              <option data-countrycode="BS" value={1242}>Bahamas (+1242)</option>
              <option data-countrycode="BH" value={973}>Bahrain (+973)</option>
              <option data-countrycode="BD" value={880}>Bangladesh (+880)</option>
              <option data-countrycode="BB" value={1246}>Barbados (+1246)</option>
              <option data-countrycode="BY" value={375}>Belarus (+375)</option>
              <option data-countrycode="BE" value={32}>Belgium (+32)</option>
              <option data-countrycode="BZ" value={501}>Belize (+501)</option>
              <option data-countrycode="BJ" value={229}>Benin (+229)</option>
              <option data-countrycode="BM" value={1441}>Bermuda (+1441)</option>
              <option data-countrycode="BT" value={975}>Bhutan (+975)</option>
              <option data-countrycode="BO" value={591}>Bolivia (+591)</option>
              <option data-countrycode="BA" value={387}>Bosnia Herzegovina (+387)</option>
              <option data-countrycode="BW" value={267}>Botswana (+267)</option>
              <option data-countrycode="BR" value={55}>Brazil (+55)</option>
              <option data-countrycode="BN" value={673}>Brunei (+673)</option>
              <option data-countrycode="BG" value={359}>Bulgaria (+359)</option>
              <option data-countrycode="BF" value={226}>Burkina Faso (+226)</option>
              <option data-countrycode="BI" value={257}>Burundi (+257)</option>
              <option data-countrycode="KH" value={855}>Cambodia (+855)</option>
              <option data-countrycode="CM" value={237}>Cameroon (+237)</option>
              <option data-countrycode="CA" value={1}>Canada (+1)</option>
              <option data-countrycode="CV" value={238}>Cape Verde Islands (+238)</option>
              <option data-countrycode="KY" value={1345}>Cayman Islands (+1345)</option>
              <option data-countrycode="CF" value={236}>Central African Republic (+236)</option>
              <option data-countrycode="CL" value={56}>Chile (+56)</option>
              <option data-countrycode="CN" value={86}>China (+86)</option>
              <option data-countrycode="CO" value={57}>Colombia (+57)</option>
              <option data-countrycode="KM" value={269}>Comoros (+269)</option>
              <option data-countrycode="CG" value={242}>Congo (+242)</option>
              <option data-countrycode="CK" value={682}>Cook Islands (+682)</option>
              <option data-countrycode="CR" value={506}>Costa Rica (+506)</option>
              <option data-countrycode="HR" value={385}>Croatia (+385)</option>
              <option data-countrycode="CU" value={53}>Cuba (+53)</option>
              <option data-countrycode="CY" value={90392}>Cyprus North (+90392)</option>
              <option data-countrycode="CY" value={357}>Cyprus South (+357)</option>
              <option data-countrycode="CZ" value={42}>Czech Republic (+42)</option>
              <option data-countrycode="DK" value={45}>Denmark (+45)</option>
              <option data-countrycode="DJ" value={253}>Djibouti (+253)</option>
              <option data-countrycode="DM" value={1809}>Dominica (+1809)</option>
              <option data-countrycode="DO" value={1809}>Dominican Republic (+1809)</option>
              <option data-countrycode="EC" value={593}>Ecuador (+593)</option>
              <option data-countrycode="EG" value={20}>Egypt (+20)</option>
              <option data-countrycode="SV" value={503}>El Salvador (+503)</option>
              <option data-countrycode="GQ" value={240}>Equatorial Guinea (+240)</option>
              <option data-countrycode="ER" value={291}>Eritrea (+291)</option>
              <option data-countrycode="EE" value={372}>Estonia (+372)</option>
              <option data-countrycode="ET" value={251}>Ethiopia (+251)</option>
              <option data-countrycode="FK" value={500}>Falkland Islands (+500)</option>
              <option data-countrycode="FO" value={298}>Faroe Islands (+298)</option>
              <option data-countrycode="FJ" value={679}>Fiji (+679)</option>
              <option data-countrycode="FI" value={358}>Finland (+358)</option>
              <option data-countrycode="FR" value={33}>France (+33)</option>
              <option data-countrycode="GF" value={594}>French Guiana (+594)</option>
              <option data-countrycode="PF" value={689}>French Polynesia (+689)</option>
              <option data-countrycode="GA" value={241}>Gabon (+241)</option>
              <option data-countrycode="GM" value={220}>Gambia (+220)</option>
              <option data-countrycode="GE" value={7880}>Georgia (+7880)</option>
              <option data-countrycode="DE" value={49}>Germany (+49)</option>
              <option data-countrycode="GH" value={233}>Ghana (+233)</option>
              <option data-countrycode="GI" value={350}>Gibraltar (+350)</option>
              <option data-countrycode="GR" value={30}>Greece (+30)</option>
              <option data-countrycode="GL" value={299}>Greenland (+299)</option>
              <option data-countrycode="GD" value={1473}>Grenada (+1473)</option>
              <option data-countrycode="GP" value={590}>Guadeloupe (+590)</option>
              <option data-countrycode="GU" value={671}>Guam (+671)</option>
              <option data-countrycode="GT" value={502}>Guatemala (+502)</option>
              <option data-countrycode="GN" value={224}>Guinea (+224)</option>
              <option data-countrycode="GW" value={245}>Guinea - Bissau (+245)</option>
              <option data-countrycode="GY" value={592}>Guyana (+592)</option>
              <option data-countrycode="HT" value={509}>Haiti (+509)</option>
              <option data-countrycode="HN" value={504}>Honduras (+504)</option>
              <option data-countrycode="HK" value={852}>Hong Kong (+852)</option>
              <option data-countrycode="HU" value={36}>Hungary (+36)</option>
              <option data-countrycode="IS" value={354}>Iceland (+354)</option>
              <option data-countrycode="IN" value={91}>India (+91)</option>
              <option data-countrycode="ID" value={62}>Indonesia (+62)</option>
              <option data-countrycode="IR" value={98}>Iran (+98)</option>
              <option data-countrycode="IQ" value={964}>Iraq (+964)</option>
              <option data-countrycode="IE" value={353}>Ireland (+353)</option>
              <option data-countrycode="IL" value={972}>Israel (+972)</option>
              <option data-countrycode="IT" value={39}>Italy (+39)</option>
              <option data-countrycode="JM" value={1876}>Jamaica (+1876)</option>
              <option data-countrycode="JP" value={81}>Japan (+81)</option>
              <option data-countrycode="JO" value={962}>Jordan (+962)</option>
              <option data-countrycode="KZ" value={7}>Kazakhstan (+7)</option>
              <option data-countrycode="KE" value={254}>Kenya (+254)</option>
              <option data-countrycode="KI" value={686}>Kiribati (+686)</option>
              <option data-countrycode="KP" value={850}>Korea North (+850)</option>
              <option data-countrycode="KR" value={82}>Korea South (+82)</option>
              <option data-countrycode="KW" value={965}>Kuwait (+965)</option>
              <option data-countrycode="KG" value={996}>Kyrgyzstan (+996)</option>
              <option data-countrycode="LA" value={856}>Laos (+856)</option>
              <option data-countrycode="LV" value={371}>Latvia (+371)</option>
              <option data-countrycode="LB" value={961}>Lebanon (+961)</option>
              <option data-countrycode="LS" value={266}>Lesotho (+266)</option>
              <option data-countrycode="LR" value={231}>Liberia (+231)</option>
              <option data-countrycode="LY" value={218}>Libya (+218)</option>
              <option data-countrycode="LI" value={417}>Liechtenstein (+417)</option>
              <option data-countrycode="LT" value={370}>Lithuania (+370)</option>
              <option data-countrycode="LU" value={352}>Luxembourg (+352)</option>
              <option data-countrycode="MO" value={853}>Macao (+853)</option>
              <option data-countrycode="MK" value={389}>Macedonia (+389)</option>
              <option data-countrycode="MG" value={261}>Madagascar (+261)</option>
              <option data-countrycode="MW" value={265}>Malawi (+265)</option>
              <option data-countrycode="MY" value={60}>Malaysia (+60)</option>
              <option data-countrycode="MV" value={960}>Maldives (+960)</option>
              <option data-countrycode="ML" value={223}>Mali (+223)</option>
              <option data-countrycode="MT" value={356}>Malta (+356)</option>
              <option data-countrycode="MH" value={692}>Marshall Islands (+692)</option>
              <option data-countrycode="MQ" value={596}>Martinique (+596)</option>
              <option data-countrycode="MR" value={222}>Mauritania (+222)</option>
              <option data-countrycode="YT" value={269}>Mayotte (+269)</option>
              <option data-countrycode="MX" value={52}>Mexico (+52)</option>
              <option data-countrycode="FM" value={691}>Micronesia (+691)</option>
              <option data-countrycode="MD" value={373}>Moldova (+373)</option>
              <option data-countrycode="MC" value={377}>Monaco (+377)</option>
              <option data-countrycode="MN" value={976}>Mongolia (+976)</option>
              <option data-countrycode="MS" value={1664}>Montserrat (+1664)</option>
              <option data-countrycode="MA" value={212}>Morocco (+212)</option>
              <option data-countrycode="MZ" value={258}>Mozambique (+258)</option>
              <option data-countrycode="MN" value={95}>Myanmar (+95)</option>
              <option data-countrycode="NA" value={264}>Namibia (+264)</option>
              <option data-countrycode="NR" value={674}>Nauru (+674)</option>
              <option data-countrycode="NP" value={977}>Nepal (+977)</option>
              <option data-countrycode="NL" value={31}>Netherlands (+31)</option>
              <option data-countrycode="NC" value={687}>New Caledonia (+687)</option>
              <option data-countrycode="NZ" value={64}>New Zealand (+64)</option>
              <option data-countrycode="NI" value={505}>Nicaragua (+505)</option>
              <option data-countrycode="NE" value={227}>Niger (+227)</option>
              <option data-countrycode="NG" value={234}>Nigeria (+234)</option>
              <option data-countrycode="NU" value={683}>Niue (+683)</option>
              <option data-countrycode="NF" value={672}>Norfolk Islands (+672)</option>
              <option data-countrycode="NP" value={670}>Northern Marianas (+670)</option>
              <option data-countrycode="NO" value={47}>Norway (+47)</option>
              <option data-countrycode="OM" value={968}>Oman (+968)</option>
              <option data-countrycode="PW" value={680}>Palau (+680)</option>
              <option data-countrycode="PS" value={970} >Palestine (+970)</option>
              <option data-countrycode="PA" value={507}>Panama (+507)</option>
              <option data-countrycode="PG" value={675}>Papua New Guinea (+675)</option>
              <option data-countrycode="PY" value={595}>Paraguay (+595)</option>
              <option data-countrycode="PE" value={51}>Peru (+51)</option>
              <option data-countrycode="PH" value={63}>Philippines (+63)</option>
              <option data-countrycode="PL" value={48}>Poland (+48)</option>
              <option data-countrycode="PT" value={351}>Portugal (+351)</option>
              <option data-countrycode="PR" value={1787}>Puerto Rico (+1787)</option>
              <option data-countrycode="QA" value={974}>Qatar (+974)</option>
              <option data-countrycode="RE" value={262}>Reunion (+262)</option>
              <option data-countrycode="RO" value={40}>Romania (+40)</option>
              <option data-countrycode="RU" value={7}>Russia (+7)</option>
              <option data-countrycode="RW" value={250}>Rwanda (+250)</option>
              <option data-countrycode="SM" value={378}>San Marino (+378)</option>
              <option data-countrycode="ST" value={239}>Sao Tome &amp; Principe (+239)</option>
              <option data-countrycode="SA" value={966}>Saudi Arabia (+966)</option>
              <option data-countrycode="SN" value={221}>Senegal (+221)</option>
              <option data-countrycode="CS" value={381}>Serbia (+381)</option>
              <option data-countrycode="SC" value={248}>Seychelles (+248)</option>
              <option data-countrycode="SL" value={232}>Sierra Leone (+232)</option>
              <option data-countrycode="SG" value={65}>Singapore (+65)</option>
              <option data-countrycode="SK" value={421}>Slovak Republic (+421)</option>
              <option data-countrycode="SI" value={386}>Slovenia (+386)</option>
              <option data-countrycode="SB" value={677}>Solomon Islands (+677)</option>
              <option data-countrycode="SO" value={252}>Somalia (+252)</option>
              <option data-countrycode="ZA" value={27}>South Africa (+27)</option>
              <option data-countrycode="ES" value={34}>Spain (+34)</option>
              <option data-countrycode="LK" value={94}>Sri Lanka (+94)</option>
              <option data-countrycode="SH" value={290}>St. Helena (+290)</option>
              <option data-countrycode="KN" value={1869}>St. Kitts (+1869)</option>
              <option data-countrycode="SC" value={1758}>St. Lucia (+1758)</option>
              <option data-countrycode="SD" value={249}>Sudan (+249)</option>
              <option data-countrycode="SR" value={597}>Suriname (+597)</option>
              <option data-countrycode="SZ" value={268}>Swaziland (+268)</option>
              <option data-countrycode="SE" value={46}>Sweden (+46)</option>
              <option data-countrycode="CH" value={41}>Switzerland (+41)</option>
              <option data-countrycode="SI" value={963}>Syria (+963)</option>
              <option data-countrycode="TW" value={886}>Taiwan (+886)</option>
              <option data-countrycode="TJ" value={7}>Tajikstan (+7)</option>
              <option data-countrycode="TH" value={66}>Thailand (+66)</option>
              <option data-countrycode="TG" value={228}>Togo (+228)</option>
              <option data-countrycode="TO" value={676}>Tonga (+676)</option>
              <option data-countrycode="TT" value={1868}>Trinidad &amp; Tobago (+1868)</option>
              <option data-countrycode="TN" value={216}>Tunisia (+216)</option>
              <option data-countrycode="TR" value={90}>Turkey (+90)</option>
              <option data-countrycode="TM" value={7}>Turkmenistan (+7)</option>
              <option data-countrycode="TM" value={993}>Turkmenistan (+993)</option>
              <option data-countrycode="TC" value={1649}>Turks &amp; Caicos Islands (+1649)</option>
              <option data-countrycode="TV" value={688}>Tuvalu (+688)</option>
              <option data-countrycode="GB" value={44}>UK (+44)</option>
              <option data-countrycode="US" value={1}>USA (+1)</option>
              <option data-countrycode="UG" value={256}>Uganda (+256)</option>
              <option data-countrycode="UA" value={380}>Ukraine (+380)</option>
              <option data-countrycode="AE" value={971}>United Arab Emirates (+971)</option>
              <option data-countrycode="UY" value={598}>Uruguay (+598)</option>
              <option data-countrycode="UZ" value={7}>Uzbekistan (+7)</option>
              <option data-countrycode="VU" value={678}>Vanuatu (+678)</option>
              <option data-countrycode="VA" value={379}>Vatican City (+379)</option>
              <option data-countrycode="VE" value={58}>Venezuela (+58)</option>
              <option data-countrycode="VN" value={84}>Vietnam (+84)</option>
              <option data-countrycode="VG" value={84}>Virgin Islands - British (+1284)</option>
              <option data-countrycode="VI" value={84}>Virgin Islands - US (+1340)</option>
              <option data-countrycode="WF" value={681}>Wallis &amp; Futuna (+681)</option>
              <option data-countrycode="YE" value={969}>Yemen (North)(+969)</option>
              <option data-countrycode="YE" value={967}>Yemen (South)(+967)</option>
              <option data-countrycode="ZM" value={260}>Zambia (+260)</option>
              <option data-countrycode="ZW" value={263}>Zimbabwe (+263)</option>
            </select>
            <br />
            <br />

            <input type="text" name='phoneNumber' className="form-control" id="floatingPhoneNumber" placeholder="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
            <p className='text-danger'>{formik.errors.phoneNumber}</p>
          </div>

          <div className="form-floating mb-3">
            <label htmlFor="img">Select image:</label>
            <br />
            <br />
            <div style={{ border: '1px solid #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
              <input
                id="image"
                name="image"
                type="file"
                onChange={(event) => handleImageUpload(event.target.files[0])}
              />
            </div>
            <p className='text-danger'>{formik.errors.image}</p>
          </div>
          {doctor ? <>
            <div className="form-floating mb-3">
              <input type="text" name='licenseNumber' className="form-control" id="floatingLicenseNumber" placeholder="License Number"
                value={formik.values.licenseNumber}
                onChange={formik.handleChange}
              />
              <label htmlFor="floatingLicenseNumber">License Number</label>
              <p className='text-danger'>{formik.errors.licenseNumber}</p>
            </div>
            <div className="form-floating mb-3">
              <input type="text" name='yearsOfExperience' className="form-control" id="floatingYearsOfExperience" placeholder="Years Of Experience"
                value={formik.values.yearsOfExperience}
                onChange={formik.handleChange}
              />
              <label htmlFor="floatingYearsOfExperience">Years Of Experience</label>
              <p className='text-danger'>{formik.errors.yearsOfExperience}</p>
            </div>
            <div className="form-floating mb-3">
              <input type="text" name='consultationFees' className="form-control" id="floatingConsultationFees" placeholder="Consultation Fees"
                value={formik.values.consultationFees}
                onChange={formik.handleChange}
              />
              <label htmlFor="floatingConsultationFees">Consultation Fees</label>
              <p className='text-danger'>{formik.errors.consultationFees}</p>
            </div>
            <div className="form-floating mb-3">
              <input type="text" name='bio' className="form-control" id="floatingBio" placeholder="Bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
              />
              <label htmlFor="floatingBio">Bio</label>
              <p className='text-danger'>{formik.errors.bio}</p>
            </div>
            <div className="form-floating mb-3">
              <br />
              <div className='specialtiesCheckbox'>
                <p>Select Specialties <span>(At least one)</span> :</p>
                {
                  validSpecialties.map((specialty, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        value={specialty}
                        checked={selectedValues.includes(specialty)}
                        onChange={() => handleCheckboxChange(specialty)}
                      />  {specialty}
                    </div>
                  ))
                }
              </div>
            </div>
          </> : <></>
          }

          <div className="d-grid gap-2 my-5">
            <button className="btn btn-primary mt-3" type="submit">Sign Up</button>
          </div>
          <br /><br /><br /><br /><br /><br /><br />
        </form>
      </div>
    </>
  )
}