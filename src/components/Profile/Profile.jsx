import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Profile.css'
import { useFormik, yupToFormErrors } from 'formik'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleNotch, faRefresh } from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup'
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading.jsx';
import LoadingButton from '../LoadingButton/LoadingButton.jsx';


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
    useEffect(() => {
        getUser(id);
    }, []);

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
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('Authorization')}`
            }
        });
        let res = await axiosInstance.patch('http://localhost:5000/user/updatePassword', values).then((response) => {
            if (response.data.message === 'Success') {
                setErrors([]);
                setStatusErrors('');
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Your Passowrd Updated Sucessfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setLoadingPassword(false);
                setErrors(response.data.err[0]);
                console.log(response.data);
            }
        }).catch((error) => {
            setLoadingPassword(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
            console.error('Error, ', error);
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
                setErrors([]);
                setStatusErrors('');
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Your Profile Picture Updated Sucessfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setErrors(response.data.err[0]);
                console.log(response.data);
            }
        }).catch((error) => {
            setLoadingChangeProfile(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
            console.error('Error, ', error);
        });
    }


    const handleImageUpload = (file) => {
        formik.setFieldValue('image', file);
    };


    const toggleFormVisibility = () => {
        setShowForm(prevState => !prevState);
        setShowButton(prevState => !prevState);
    };


    async function handleAdmin(id) {

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
                            setLoading(false);
                            toast.success("Admin Created Successfully")
                            setTimeout(() => {
                                navigate("/ManageDoctors")
                            }, 2000);
                        } else {
                            setLoading(false);
                            console.log(response.data.message);
                            toast.error("Error Occured")
                        }
                    }
                })
                    .catch((err) => {
                        setLoading(false);
                        console.log(err);
                        toast.error("Error Occured")
                    })
            }
        });
    }

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
        setLoading(true);
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
                    setLoading(false);
                    toast.success("Account Deleted successfully");
                    setTimeout(() => {
                        if (role === "Doctor") {
                            navigate("/ManageDoctors");
                        } else {
                            navigate("/Dashboard")
                        }
                    }, 2000);
                } else {
                    setLoading(false);
                    toast.error("Error Occured")
                    console.log(response.data.message);
                }
            }
        })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            })
    }

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <title>MediConnect Pro | Profile</title>
                <meta name="description" content="This is Profile page" />
                <link rel="canonical" href="www.facebook.com" />
            </Helmet>
            <div>{
                userProfile ? <>
                    <div style={{ border: '1px solid black', height: '800px' }} className="profileflex" >
                        <div >
                            <div style={{ height: '60%', width: '100%' }}>
                                <img src={userProfile.image.secure_url} alt="Doctor's image" style={{ height: '100%', objectFit: 'contain' }} />
                            </div>
                            <h2 className='mt-2' style={{ textAlign: 'center', textTransform: 'capitalize' }} >{userProfile.userName}</h2>
                        </div>
                        <div>
                            <div height={'20%'} style={{ padding: '1rem' }}>
                                {userProfile.role === 'Doctor' ? <>
                                    {
                                        userProfile._id !== user.id ?
                                            <>
                                                {
                                                    user.role === "Admin" ?
                                                        <>
                                                            <button onClick={() => handleAdmin(userProfile._id)} className='btn btn-warning'>Make as an Admin</button><br /><br />
                                                            <button onClick={() => handleDelete(userProfile.role, userProfile._id)} className='btn btn-danger'>Delete Account</button><br /><br />

                                                        </> :
                                                        <>
                                                            <Link to={`/Appointment/${userProfile._id}`}>Request an appointment</Link><br /><br />
                                                        </>
                                                }
                                            </> : <>
                                                <Link to={`/DoctorWorkingHours/${userProfile._id}`}>Manage Working Hours</Link><br /><br />
                                            </>
                                    }
                                    <p>Bio: {userProfile.bio}</p>
                                    <p>Specialties: {userProfile.specialties.join(', ')}</p>
                                    <p>Years of Experience: {userProfile.yearsOfExperience}</p>
                                    <p>Consultation Fees: {userProfile.consultationFees}</p>
                                </> : <>
                                    {
                                        user.role === "Admin" && userProfile._id !== user.id ?
                                            <>
                                                <button onClick={() => handleDelete(userProfile.role, userProfile._id)} className='btn btn-danger'>Delete Account</button><br /><br />
                                            </>
                                            : <></>
                                    }
                                </>}
                                <p>Phone: {userProfile.phoneNumber}</p>
                                {
                                    userProfile._id == user.id ?
                                        <>
                                            <p>Address: {userProfile.address}</p>
                                            <form onSubmit={formik.handleSubmit}>
                                                <input
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    onChange={(event) => handleImageUpload(event.target.files[0])}
                                                />
                                                <p className='text-danger'>{formik.errors.image}</p>
                                                <div className="d-grid gap-2" id="changePassutton">
                                                    <button className="btn btn-primary mt-3">
                                                        {
                                                            loadingChangeProfile ?
                                                                <LoadingButton />
                                                                : <>Change Profile Picture </>}
                                                    </button>
                                                </div>
                                            </form>
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
                                            {showForm && (<>
                                                <form onSubmit={passwordFormik.handleSubmit}>
                                                    <div className="form-floating mb-3">
                                                        <input type="password" name='oldPassword' className="form-control" id="floatingOldPassword" placeholder="Old Password"
                                                            value={passwordFormik.values.oldPassword}
                                                            onChange={passwordFormik.handleChange}
                                                        />
                                                        <label htmlFor="floatingOldPassword">Old Password</label>
                                                        <p className='text-danger'>{passwordFormik.errors.oldPassword}</p>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="password" name='newPassword' className="form-control" id="floatingNewPassword" placeholder="New Password"
                                                            value={passwordFormik.values.newPassword}
                                                            onChange={passwordFormik.handleChange}
                                                        />
                                                        <label htmlFor="floatingNewPassword">New Password</label>
                                                        <p className='text-danger'>{passwordFormik.errors.newPassword}</p>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input type="password" name='cPassword' className="form-control" id="floatingCPassword" placeholder="Confirm Password"
                                                            value={passwordFormik.values.cPassword}
                                                            onChange={passwordFormik.handleChange}
                                                        />
                                                        <label htmlFor="floatingCPassword">Confirm Password</label>
                                                        <p className='text-danger'>{passwordFormik.errors.cPassword}</p>
                                                    </div>
                                                    <div className="d-grid gap-2">

                                                        <button className="btn btn-primary mt-3">
                                                            {
                                                                loadingPassword ?
                                                                    <LoadingButton />
                                                                    : <>Update Password </>}
                                                        </button>

                                                    </div>
                                                </form>
                                            </>)}
                                        </> :
                                        <></>
                                }
                            </div>
                            {
                                userProfile.role !== "Admin" && user.role === "Admin" ?
                                    <>
                                        <Link to={`/Appointments/${userProfile._id}`}>View Appointments</Link><br /><br />
                                    </> : <></>
                            }
                        </div>
                    </div>
                </> : <></>}

            </div >
        </>
    )
}