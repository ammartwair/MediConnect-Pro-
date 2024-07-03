import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Profile.css'
import { useFormik, yupToFormErrors } from 'formik'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleNotch, faRefresh, faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup'
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading.jsx';
import LoadingButton from '../LoadingButton/LoadingButton.jsx';
import ProfileImageUpload from './ProfileImageUpload.jsx';
import profImage from '../../images/profileImage.webp'


export default function Profile({ user }) {
    const [loading, setLoading] = useState(true);
    const [loadingChangeProfile, setLoadingChangeProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    let [errors, setErrors] = useState([]);
    let [statusError, setStatusErrors] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showbutton, setShowButton] = useState(true);
    const { id } = useParams();
    let navigate = useNavigate();
    const [showHide, setShowHide] = useState(false);
    const [request, setRequest] = useState(false);


    const [opassword, setoPassword] = useState('');
    const [npassword, setnPassword] = useState('');
    const [cpassword, setcPassword] = useState('');
    const [isoPasswordValid, setIsoPasswordValid] = useState(false);
    const [equaloPassword, setEqualoPassword] = useState(true);
    const [isnPasswordValid, setIsnPasswordValid] = useState(false);
    const [equalnPassword, setEqualnPassword] = useState(true);
    const [iscPasswordValid, setIscPasswordValid] = useState(false);
    const [equalcPassword, setEqualcPassword] = useState(true);
    const [newPage, setNewPage] = useState(true);


    useEffect(() => {
        if (newPage) {
            window.scrollTo(0, 0);
            setNewPage(false);
        }
        getUser(id);
    }, [request]);


    useEffect(() => {
        if (showForm) {
            checkPasswordInputs();
        }
        console.log(opassword, npassword, cpassword);
    }, [opassword, npassword, cpassword]);

    const checkPasswordInputs = () => {
        if (isnPasswordValid && iscPasswordValid && isoPasswordValid && cpassword === npassword && npassword !== opassword) {
            console.log("yes");
            ApproveInputs();
        } else {
            DeclineInputs();
        }
    }
    const ApproveInputs = () => {
        const updatePass = document.getElementById("updatePass");
        updatePass.removeAttribute('disabled');
        updatePass.type = "submit";
        if (updatePass.classList.contains('btn-outline-secondary')) {
            updatePass.classList.remove('btn-outline-secondary');
        }
        updatePass.classList.add('btn-outline-success');
    }
    const DeclineInputs = () => {
        const updatePass = document.getElementById("updatePass");
        if (updatePass.classList.contains('btn-outline-success')) {
            updatePass.classList.remove('btn-outline-success');
        }
        updatePass.classList.add('btn-outline-secondary');
        updatePass.setAttribute('disabled', 'disabled');
        updatePass.type = "button";
    }

    async function getUser(id) {
        let user = null;
        let res = await axios.get(`http://localhost:5000/user/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    setUserProfile(data.user);
                    setLoading(false);
                    return data.user;
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
        return user;
    }

    const schema = Yup.object({
        image: Yup.mixed()
            .required('Image is required')
            .test('fileSize', 'File size is too large', (value) => {
                if (value) {
                    return value.size <= 1048576; // 1MB
                }
                return true; // No file uploaded
            })
            .required("Image is Required")
            .test('fileType', 'Unsupported file type', (value) => {
                if (value) {
                    return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
                }
                return true; // No file uploaded
            })
    });

    const passwordSchema = Yup.object({
        oldPassword: Yup.string().required("Old Password is required"),
        newPassword: Yup.string().required("New Password is required"),
        cPassword: Yup.string().required("Confirm Password is required")
            .test('passwords-match', 'Passwords must match', function (value) {
                // 'this' refers to the entire object being validated, so you can access newPassword
                return value === this.parent.newPassword;
            }),
    });

    let passwordFormik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            cPassword: ''
        }, validationSchema: passwordSchema,
        onSubmit: updatePassword
    })


    async function updatePassword(values) {
        setLoadingPassword(true);
        if (opassword === npassword) {
            toast.error("Please insert a new Password");
            setLoadingPassword(false);
            return
        }
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.patch('http://localhost:5000/user/updatePassword', values).then((response) => {
            if (response.data.message === 'Success') {
                setLoadingPassword(false);
                toast.success("Your Passowrd Updated Sucessfully");
                DeclineInputs();
                toggleFormVisibility();
                setnPassword('');
                setoPassword('');
                setcPassword('');
                setIscPasswordValid(false);
                setIsnPasswordValid(false);
                setIscPasswordValid(false);
                setEqualcPassword(true);
                setEqualnPassword(true);
                setEqualoPassword(true);
                setRequest(!request);
            } else {
                setLoadingPassword(false);
                toast.error("Error Occured");
                console.log(response.data.message);
            }
        }).catch((error) => {
            setLoadingPassword(false);
            toast.error("Error Occured");
            console.log('Error, ', error);
        });
    }

    let formik = useFormik({
        initialValues: {
            image: null,
        }, validationSchema: schema,
        onSubmit: updateImage
    })


    async function updateImage(values) {
        setLoadingChangeProfile(true);
        const formData = new FormData();
        formData.append('image', formik.values.image);

        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.patch('http://localhost:5000/user/profilePic', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then((response) => {
            if (response.data.message === 'success') {
                toast.success("Your Profile Picture Updated Sucessfully");
                setLoadingChangeProfile(false);
                const imgbtn = document.getElementById("imgbtn");
                imgbtn.setAttribute('disabled', 'disabled');
                imgbtn.type = "button";
                if (imgbtn.classList.contains('btn-outline-success')) {
                    imgbtn.classList.remove('btn-outline-success');
                }
                imgbtn.classList.add('btn-outline-secondary');
                setRequest(!request);
            } else {
                toast.error("Error Occured");
                console.log(response.data);
            }
        }).catch((error) => {
            setLoadingChangeProfile(false);
            toast.error("Error Occured");
            console.log('Error, ', error);
        });
    }

    const [uploadedImage, setUploadedImage] = useState(null);


    const handleImageUpload = (imageData) => {
        setUploadedImage(imageData);
        const imgbtn = document.getElementById("imgbtn");
        imgbtn.removeAttribute('disabled');
        imgbtn.type = "submit";
        if (imgbtn.classList.contains('btn-outline-secondary')) {
            imgbtn.classList.remove('btn-outline-secondary');
        }
        imgbtn.classList.add('btn-outline-success');
        formik.setFieldValue('image', imageData);
    }


    const toggleFormVisibility = () => {
        setShowForm(prevState => !prevState);
        setShowButton(prevState => !prevState);
    };

    const handleoPasswordChange = (event) => {
        setEqualoPassword(false);
        const value = event.target.value;
        passwordFormik.values.oldPassword = value;
        setoPassword(value);
        const pattern = /^[A-Za-z][A-Za-z0-9\\\/\*\_\.\@\!\$\#\%\^\&\(\)\]\[\{\}\-\+\,\|\=\?\`\<\>\;\:\"\']{5,25}$/;
        setIsoPasswordValid(pattern.test(value));
    }

    const handlenPasswordChange = (event) => {
        setEqualnPassword(false);
        const value = event.target.value;
        passwordFormik.values.newPassword = value;
        setnPassword(value);
        const pattern = /^[A-Za-z][A-Za-z0-9\\\/\*\_\.\@\!\$\#\%\^\&\(\)\]\[\{\}\-\+\,\|\=\?\`\<\>\;\:\"\']{5,25}$/;
        setIsnPasswordValid(pattern.test(value));
    }

    const handlecPasswordChange = (event) => {
        setEqualcPassword(false);
        const value = event.target.value;
        passwordFormik.values.cPassword = value;
        setcPassword(value);
        const pattern = /^[A-Za-z][A-Za-z0-9\\\/\*\_\.\@\!\$\#\%\^\&\(\)\]\[\{\}\-\+\,\|\=\?\`\<\>\;\:\"\']{5,25}$/;
        setIscPasswordValid(pattern.test(value));
    }
    const [adminLoad, setAdminLoad] = useState(false);


    async function handleAdmin(id) {
        setAdminLoad(true)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Make an admin"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                const axiosInstance = axios.create({
                    baseURL: 'http://localhost:5000',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${localStorage.getItem('Authorization')}`
                    }
                });
                let res = await axiosInstance.post(`http://localhost:5000/user/userAdmin?id=${id}`).then((response) => {
                    if (response.data) {
                        let { data } = response;
                        if (data.message === "Admin Created") {
                            setAdminLoad(false);
                            toast.success("Admin Created Successfully")
                            setTimeout(() => {
                                navigate("/ManageDoctors")
                            }, 1500);
                        } else {
                            setAdminLoad(false);
                            console.log(response.data.message);
                            toast.error("Error Occured")
                        }
                    }
                })
                    .catch((err) => {
                        setAdminLoad(false);
                        console.log(err);
                        toast.error("Error Occured")
                    })
            }
        });
    }

    const [deletionLoad, setDeletionLoad] = useState(false);


    function handleDelete(role, id) {
        Swal.fire({
            title: "Are you sure you want to Delete this account?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(role, id);
            }
        });
    }

    async function deleteUser(role, id) {
        setDeletionLoad(true)
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.delete(`http://localhost:5000/user/delete/${role}/${id}`).then((response) => {
            if (response.data) {
                let { data } = response;
                if (data.message === "Success") {
                    toast.success("Account Deleted successfully");
                    setDeletionLoad(false);
                    setTimeout(() => {
                        if (role === "Doctor") {
                            navigate("/ManageDoctors");
                        } else {
                            navigate("/Dashboard")
                        }
                    }, 2000);
                } else {
                    toast.error("Error Occured")
                    setDeletionLoad(false);
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                console.log(err);
                setDeletionLoad(false);
            })
    }

    if (loading) {
        return <Loading />
    }


    const handleTogglePasswordVisibility = () => {
        const passField = document.getElementById('opass');
        const cpassField = document.getElementById('cpass');
        const npassField = document.getElementById('npass');
        if (passField.type === 'password') {
            passField.type = 'text';
            cpassField.type = 'text';
            npassField.type = 'text';
        } else {
            cpassField.type = 'password';
            passField.type = 'password';
            npassField.type = 'password';
        }
        setShowHide(!showHide);
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Profile</title>
                <meta name="description" content="This is Profile page" />
                <link rel="canonical" href="www.facebook.com" />
            </Helmet>
            <div>
                {
                    userProfile ?
                        <div className='prof row pb-5 mx-0' >
                            <div className="col-lg-6 container mt-5 mx-0">
                                <div className='row'>
                                    <div className="col-lg-6"><form onSubmit={formik.handleSubmit}>
                                        <ProfileImageUpload onImageUpload={handleImageUpload} image={userProfile.image.secure_url} edit={user.id === userProfile._id ? "Edit" : ''} />
                                        <div className="d-grid gap-2" id="changePassutton">
                                            {
                                                userProfile._id == user.id &&
                                                <button type="button" id="imgbtn" className="btn btn-outline-secondary mt-4" disabled>
                                                    {
                                                        loadingChangeProfile ?
                                                            <LoadingButton />
                                                            : <>Change Profile Picture </>}
                                                </button>
                                            }

                                        </div>
                                    </form>
                                        <h2 className='mt-5' style={{ textAlign: 'center', textTransform: 'capitalize' }} > {userProfile.role === "Doctor" ? <>Dr. </> : ''}{userProfile.userName}</h2>
                                        {
                                            userProfile.role === 'Doctor' ?
                                                userProfile._id !== user.id ?
                                                    user.role === "Admin" ?
                                                        <div className='d-flex justify-content-center'>
                                                            <div className="adiminEdition" style={{ textAlign: "center" }}>
                                                                <button onClick={() => handleAdmin(userProfile._id)} className='btn btn-warning'>
                                                                    {
                                                                        adminLoad ?
                                                                            <LoadingButton /> : <>
                                                                                Make as an Admin
                                                                            </>
                                                                    }
                                                                </button><br /><br />
                                                                <button onClick={() => handleDelete(userProfile.role, userProfile._id)} className='btn btn-danger'>
                                                                    {
                                                                        deletionLoad ?
                                                                            <LoadingButton /> : <>
                                                                                Delete Account
                                                                            </>
                                                                    }
                                                                </button><br /><br />
                                                            </div>
                                                        </div> :
                                                        user.role === "Patient" ?
                                                            <div className="d-flex justify-content-center">
                                                                <Link to={`/Appointment/${userProfile._id}`} className="default-btn">
                                                                    <span className="icon-circle mx-2">
                                                                        <FontAwesomeIcon icon={faArrowRight} className='rightArrow' />
                                                                    </span>
                                                                    <span style={{ fontSize: "20px" }}>Book an Appointment</span>
                                                                </Link>
                                                            </div>
                                                            : <></>
                                                    : <div className='d-flex justify-content-center'>
                                                        <Link to={`/DoctorWorkingHours/${userProfile._id}`}>Manage Working Hours</Link><br /><br />
                                                    </div>
                                                : <></>
                                        }
                                    </div>
                                    <div className="col-lg-6 pt-3">
                                        {userProfile.role === 'Doctor' ? <>

                                            <div className="my-5 d-flex justify-content-center pt-5">
                                                <div className="Info">
                                                    <p>Bio: {userProfile.bio}</p>
                                                    <p>Specialties: {userProfile.specialties.join(', ')}</p>
                                                    <p>Years of Experience: {userProfile.yearsOfExperience}</p>
                                                    <p>Consultation Fees: {userProfile.consultationFees}</p>
                                                    <p>Address: {userProfile.address}</p>
                                                    <p>Phone: {userProfile.phoneNumber}</p>
                                                </div>
                                            </div>
                                        </> : <>
                                            {
                                                user.role === "Admin" && userProfile._id !== user.id ?
                                                    <>
                                                        <div className="my-5 d-flex justify-content-center" >
                                                            <div className="Info">
                                                                <p>Address: {userProfile.address}</p>
                                                                <p>Phone: {userProfile.phoneNumber}</p>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-center'>
                                                            <button onClick={() => handleDelete(userProfile.role, userProfile._id)} className='btn btn-danger'>Delete Account</button><br /><br />
                                                        </div>

                                                    </> : <>
                                                        <div className="my-5 d-flex justify-content-center">
                                                            <div className="Info">
                                                                <p>Address: {userProfile.address}</p>
                                                                <p>Phone: {userProfile.phoneNumber}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                            }
                                        </>}
                                        {
                                            userProfile._id == user.id ? <>
                                                <div className='d-flex justify-content-center'>
                                                    <div className="paswordChange" style={{ width: "50%" }}>
                                                        <br />
                                                        {
                                                            showbutton && (<>
                                                                <div className="d-grid gap-2">
                                                                    <button className="btn btn-primary mt-3" onClick={toggleFormVisibility}>Change Password</button>
                                                                </div>
                                                            </>)
                                                        }
                                                        {
                                                            !showbutton && (<>
                                                                <div className="d-grid gap-2">
                                                                    <button className="btn btn-primary mt-3" onClick={toggleFormVisibility}>Cancel</button>
                                                                </div>
                                                            </>)
                                                        }
                                                        <br />
                                                        <div>
                                                            {showForm && (<>
                                                                <form onSubmit={passwordFormik.handleSubmit} autoComplete='off'>
                                                                    {/*  Old Password */}
                                                                    <label>Old Password</label>
                                                                    <div className="firstinput">
                                                                        <input
                                                                            id="opass"
                                                                            type="password"
                                                                            placeholder="Type your password"
                                                                            value={opassword}
                                                                            name="opassword"
                                                                            className={`logininput form-control ${!equaloPassword ? isoPasswordValid ? 'is-valid' : 'is-invalid' : ''}`}
                                                                            onChange={handleoPasswordChange}
                                                                            required
                                                                        />
                                                                    </div>
                                                                    {
                                                                        !equaloPassword ?
                                                                            !isoPasswordValid ?
                                                                                <div className="small text-danger" id="passwordAlert">* Use 6 to 25 characters</div>
                                                                                : <></>
                                                                            : <></>
                                                                    }
                                                                    {/*  New Password */}
                                                                    <label>New Password</label>
                                                                    <div className="firstinput">
                                                                        <input
                                                                            id="npass"
                                                                            type="password"
                                                                            placeholder="Type your password"
                                                                            value={npassword}
                                                                            name="npassword"
                                                                            className={`logininput form-control ${!equalnPassword ? isnPasswordValid ? 'is-valid' : 'is-invalid' : ''}`}
                                                                            onChange={handlenPasswordChange}
                                                                            required
                                                                        />
                                                                    </div>
                                                                    {
                                                                        !equalnPassword ?
                                                                            !isnPasswordValid ?
                                                                                <div className="small text-danger" id="passwordAlert">* Use 6 to 25 characters</div>
                                                                                : <></>
                                                                            : <></>
                                                                    }
                                                                    {/*  Confirm Password */}
                                                                    <label>Confirm New Password</label>
                                                                    <div className="firstinput">
                                                                        <input
                                                                            id="cpass"
                                                                            type="password"
                                                                            placeholder="Type your password"
                                                                            value={cpassword}
                                                                            name="cpassword"
                                                                            className={`logininput form-control ${!equalcPassword ? iscPasswordValid ? npassword == cpassword ? 'is-valid' : 'is-invalid' : 'is-invalid' : ''}`}
                                                                            onChange={handlecPasswordChange}
                                                                            required
                                                                        />
                                                                    </div>
                                                                    {
                                                                        !equalcPassword ?
                                                                            !iscPasswordValid ?
                                                                                <div className="small text-danger" id="passwordAlert">* Use 6 to 25 characters</div>
                                                                                :
                                                                                npassword !== cpassword &&
                                                                                <div className="small text-danger" id="passwordAlert">* Not match</div>
                                                                            : <></>
                                                                    }

                                                                    {
                                                                        !showHide ?
                                                                            <>
                                                                                <FontAwesomeIcon style={{ cursor: "pointer" }} id="showIcon" className="px-2 mx-1 showhide" onClick={handleTogglePasswordVisibility} icon={faEye} />
                                                                                <span style={{ cursor: "pointer" }} id="showPass" className="showhide" onClick={handleTogglePasswordVisibility}>Show Password</span>
                                                                            </> :
                                                                            <>
                                                                                <FontAwesomeIcon style={{ cursor: "pointer" }} id="hideIcon" className="px-2 mx-1 showhide" onClick={handleTogglePasswordVisibility} icon={faEyeSlash} />
                                                                                <span style={{ cursor: "pointer" }} id="hidePass" className="showhide" onClick={handleTogglePasswordVisibility}>Hide Password</span>
                                                                            </>
                                                                    }
                                                                    <div className="d-grid gap-2">
                                                                        <button type='button' id='updatePass' className="btn btn-outline-secondary mt-3" disabled>
                                                                            {
                                                                                loadingPassword ?
                                                                                    <LoadingButton />
                                                                                    : <>Update Password </>}
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            </>)}
                                                        </div>
                                                    </div>
                                                </div> </> :
                                                <></>
                                        }

                                        {
                                            userProfile.role !== "Admin" && user.role === "Admin" ?
                                                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                                                    <Link to={`/Appointments/${userProfile._id}`}><p>View Appointments</p></Link><br /><br />
                                                </div> : <></>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 d-flex justify-content-center  ">
                                <img src={profImage} alt="profImage" width={"100%"} style={{ height: "100vh" }} />
                            </div>
                        </div> : <></>}

            </div >
        </>
    )
}