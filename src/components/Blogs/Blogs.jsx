import axios from 'axios'
import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup'
import './Blogs.css';
import Loading from '../Loading/Loading.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faFont, faList } from '@fortawesome/free-solid-svg-icons'
import LoadingButton from '../LoadingButton/LoadingButton.jsx';

export default function Blogs({ user }) {

    const inputRef = useRef(null);
    const [blogs, setBlogs] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [title, setTitle] = useState("");
    const [equalTitle, setEqualTitle] = useState(true);
    const [isTitleValid, setIsTitleValid] = useState(false);
    const [blogText, setBlogText] = useState("");
    const [equalBlogText, setEqualBlogText] = useState(true);
    const [isBlogTextValid, setIsBlogTextValid] = useState(false);
    const [request, setRequest] = useState(false);
    let navigate = useNavigate();
    const schema = Yup.object().shape({
        title: Yup.string().required('Title is required').min(4, 'Title must be at least 4 characters').max(100, 'Title must be at most 100 characters'),
        blogText: Yup.string().required('Blog text is required').min(5, 'Blog text must be at least 5 characters').max(5000000000, 'Blog text is too long'),
    });
    let formik = useFormik({
        initialValues: {
            title: '',
            blogText: '',
        }, validationSchema: schema,
        onSubmit: sendBlogData,
    })

    async function sendBlogData(values) {
        setLoadingSubmit(true);
        try {
            const axiosInstance = axios.create({
                baseURL: 'http://localhost:5000',
                headers: {
                    'Authorization': `${localStorage.getItem('Authorization')}`
                }
            });
            const response = await axiosInstance.post("http://localhost:5000/blog/createBlog", values);

            if (response.data.message === 'Blog Created') {
                toast.success("Blog Created successfully");
                setLoadingSubmit(false);
                setRequest(!request);
            } else if (response.data.message) {
                setLoadingSubmit(false);
                console.log(response.data.message);
                toast.error(response.data.message);
            } else {
                console.log(response.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingSubmit(false);
        }
    }

    const toggleFormVisibility = () => {
        setShowForm(prevState => !prevState);
    };


    const fetchData = async () => {
        setLoading(true);
        try {
            const axiosInstance = axios.create({
                baseURL: 'http://localhost:5000',
                headers: {
                    'Authorization': `${localStorage.getItem('Authorization')}`
                }
            });
            await axiosInstance.get('http://localhost:5000/blog').then((response) => {
                if (response.data.message === 'success') {
                    setBlogs(response.data.blogsWithUsernames);
                } else {
                    console.log(response.data.message);
                }
            })
        } catch (error) {
            console.log(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const [newPage, setNewPage] = useState(true);

    const handleTitleChange = (event) => {
        setEqualTitle(false);
        const value = event.target.value;
        formik.values.title = value;
        setTitle(value);
        const pattern = /^[a-zA-Z0-9\s]{3,100}$/;
        setIsTitleValid(pattern.test(value));
    }

    const handleBlogTextChange = (event) => {
        setEqualBlogText(false);
        const value = event.target.value;
        formik.values.blogText = value;
        setBlogText(value);
        const pattern = /^[\s\S]{10,2000}$/;
        setIsBlogTextValid(pattern.test(value));
    }


    const checkInputs = () => {
        const blogbtn = document.getElementById("blogbtn");

        if (isTitleValid && isBlogTextValid) {
            blogbtn.removeAttribute('disabled');
            blogbtn.type = "submit";
            if (blogbtn.classList.contains('btn-outline-secondary')) {
                blogbtn.classList.remove('btn-outline-secondary');
            }
            blogbtn.classList.add('btn-outline-success');
        } else {
            if (blogbtn.classList.contains('btn-outline-success')) {
                blogbtn.classList.remove('btn-outline-success');
            }
            blogbtn.classList.add('btn-outline-secondary');
            blogbtn.setAttribute('disabled', 'disabled');
            blogbtn.type = "button";
        }
    }

    useEffect(() => {
        if (newPage) {
            setNewPage(false);
            window.scrollTo(0, 0);
        }
        if (!loading && showForm) {
            checkInputs();
        }
    }, [title, blogText]);

    useEffect(() => {
        fetchData();
        setTitle('');
        setBlogText('');
        setIsTitleValid(false);
        setIsBlogTextValid(false);
        setEqualBlogText(true);
        setEqualTitle(true);
    }, [request]);

    if (loading) {
        return <Loading />
    }


    return (<>
        <Helmet>
            <meta charSet="utf-8" />
            <title>MediConnect Pro | Blogs</title>
            <meta name='description' content='This is Blogs page' />
            <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <div className="blogsImage">
            <h2>Blogs</h2>
        </div>
        <div className="blogs">
            <div className="container my-5 pt-5">
                {user?.role == 'Doctor' ?
                    !user.isAdmin ?
                        <div className='d-flex justify-content-center'>
                            <div style={{ width: "70%" }}>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary mt-3" onClick={toggleFormVisibility}>Create a new blog</button>
                                </div>
                                <br />
                                {showForm && (<>
                                    <form onSubmit={formik.handleSubmit} autoComplete='off'>
                                        <label>Title</label>
                                        <div className="firstinput">
                                            <input
                                                id="title"
                                                type="title"
                                                placeholder="Type your title"
                                                value={title}
                                                ref={inputRef}
                                                name="title"
                                                className={`logininput form-control  ${!equalTitle ? isTitleValid ? 'is-valid' : 'is-invalid' : ''}`}
                                                onChange={handleTitleChange}
                                                required
                                            />
                                            <span className="focus-100">
                                                <FontAwesomeIcon id="fa-user" className="px-2 mx-2" icon={faFont} style={{ color: !equalTitle ? isTitleValid ? 'green' : 'red' : '' }} />
                                            </span>
                                        </div>
                                        {
                                            !equalTitle ?
                                                !isTitleValid ?
                                                    <div className="small text-danger" id="userAlert">* Please insert at least three and at most 20 characters</div>
                                                    : <></>
                                                : <></>
                                        }

                                        <label>Blog Text</label>
                                        <div className="firstinput">
                                            <textarea
                                                id="blogText"
                                                type="blogText"
                                                placeholder="Type your blogText"
                                                value={blogText}
                                                ref={inputRef}
                                                name="blogText"
                                                className={`logininput form-control  ${!equalBlogText ? isBlogTextValid ? 'is-valid' : 'is-invalid' : ''}`}
                                                onChange={handleBlogTextChange}
                                                required
                                            />
                                            <span className="focus-100">
                                                <FontAwesomeIcon id="fa-user" className="px-2 mx-2" icon={faList} style={{ color: !equalBlogText ? isBlogTextValid ? 'green' : 'red' : '' }} />
                                            </span>
                                        </div>
                                        {
                                            !equalBlogText ?
                                                !isBlogTextValid ?
                                                    <div className="small text-danger" id="userAlert">* Please insert a valid Blog Text</div>
                                                    : <></>
                                                : <></>
                                        }

                                        <div className="d-grid gap-2">
                                            <button id="blogbtn" className="btn btn-outline-secondary mt-3" type="button" disabled>
                                                {loadingSubmit ?
                                                    <LoadingButton /> : <>Submit</>
                                                }
                                            </button>
                                        </div>
                                    </form>
                                </>
                                )}
                                <br /><br />
                            </div>
                        </div>
                        : <></> : <></>
                }
                {
                    blogs?.length > 0 ?
                        blogs.map((blog, index) => (
                            <div className="my-5" key={index}>
                                <div className="">
                                    <h3>{blog.title}</h3>
                                    <p>{blog.blogText}</p>
                                    <span>By: {
                                        blog.createdBy.userName
                                    }
                                    </span>
                                </div>
                            </div>
                        ))
                        : <>
                            <div>No Blogs Yet</div>
                        </>
                }
            </div>
        </div>
    </>
    )
}