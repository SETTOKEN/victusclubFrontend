import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import config from '../config';
import { Vertify } from '@alex_xu/react-slider-vertify';
import Modal from 'react-bootstrap/Modal'
import { LoginAction, verifyAccountAction } from '../Action/user.action';

const Login = () => {
    const [passwordType, setPasswordType] = useState("password");
    const [form, setForm] = useState({ email: '', password: '' })
    const [validatioError, setvalidatioError] = useState({});
    const [isLoading, setisLoading] = useState(false);
    let { token } = useParams();
    const [show1, setShow1] = useState(false);
    const [handleShow1, sethandleShow1] = useState(false);
    
    const handleClose1 = () => sethandleShow1(false);
    useEffect(() => {
        if (token) {
            verifyAccountAPI()
        }
    }, []);

    const verifyAccountAPI = async () => {
        let res = await verifyAccountAction({ 'token': token });
        if (res.success) {
            toast.success(res.msg);
            setTimeout(() => {
                window.location.href = `${config.baseUrl}login`;
            }, 1000);
        } else {
            toast.error(res.msg);
        }
    }
    const inputHandler = (e) => {
        const { name, value, id } = e.target
        setForm((old) => {
            return { ...old, [name]: value }
        })
        if (value != '') {
            setvalidatioError((old) => {
                return { ...old, [id]: '' }
            })
        }
    }

    function validate() {
        let emailError = "";
        let passwordError = "";
        if (form.email === '') {
            emailError = "Email is required."
        }
        if (form.password === '') {
            passwordError = "Password is required."
        }
        if (emailError || passwordError) {
            setvalidatioError({
                emailError, passwordError
            })
            return false
        } else {
            return true
        }
    }

    const SubmitForm = async (e) => {
        e.preventDefault()
        const isValid = validate();
        if (!isValid) {
        }
        else {
            setisLoading(true);
            setTimeout(async () => {
                let res = await LoginAction(form);
                if (res.success) {
                    sethandleShow1(true)
                    // toast.success(res.msg);
                    Cookies.set('loginSuccessScarlettUserpanel', JSON.stringify(res.data));
                    Cookies.set('token', JSON.stringify(res.Token));
                } else {
                    setisLoading(false);
                    toast.error(res.msg);
                }
            }, 1000);
        }
    }


    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }
    const verifiedCallback =()  => {    
            setisLoading(true);
            setTimeout(async () => {
                let res = await LoginAction(form);
                if (res.success) {
                    setShow1({ handleShow1: true })
                    toast.success(res.msg);
                    Cookies.set('loginSuccessScarlettUserpanel', JSON.stringify(res.data));
                    Cookies.set('token', JSON.stringify(res.Token));
                    setTimeout(() => {
                        window.location.href = `${config.baseUrl}marketplace`;
                    }, 2000);
                } else {
                    setisLoading(false);
                    toast.error(res.msg);
                    
                }
            })
    }

    return (
        <div>
            <Modal show={handleShow1} onHide={handleClose1} className='modal-puzzle'>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body> <div className='capture_modal'>
                    <div className='row'>
                        <div className='col-md-12 col-12'>
                            <Vertify
                                width={280}
                                height={160}
                                text='Slide To Complete the Puzzle'
                                onSuccess={() => verifiedCallback()}
                                onFail={() => alert('fail')}
                                onRefresh={() => alert('refresh')}
                            />
                        </div>
                    </div>
                </div></Modal.Body>
            </Modal>
            <Toaster />
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center"></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-login tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="tf-title-heading ct style-1">
                                Login To Victus Token
                            </h2>
                            <div className="flat-form box-login-email">
                                <div className="box-title-login">
                                    <h5>Login with email & password</h5>
                                </div>
                                <div className="form-inner">
                                    <form onSubmit={SubmitForm}>

                                        <input autoComplete="off" name="email" id='emailError' onChange={inputHandler} type="email" placeholder="Enter Email Address" />
                                        <span className="validationErr">{validatioError.emailError}</span>
                                        <div className="input-group ">
                                            <input name="password" className='passworderr' type={passwordType} id='passwordError' onChange={inputHandler} placeholder="Enter Password" />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary eye btn-sm" type="button"><i onClick={togglePassword} className={passwordType == 'password' ? 'fa fa-eye' : 'fa fa-eye-slash'} style={{ fontSize: "15px", margin: "0" }}></i></button>
                                            </div>
                                        </div>
                                        <span className="validationErr">{validatioError.passwordError}</span>
                                        <div className="row-form style-1">
                                            <Link to={`${config.baseUrl}forget-password`} className="forgot-pass">Forgot Password ?</Link>
                                            <Link to={`${config.baseUrl}sign-up`} className="forgot-pass">Don't have an account? Signup</Link>
                                        </div>
                                        {isLoading ?
                                            <>
                                                <div className='footer mt-3 text-center'>
                                                    <button disabled className="submit">Processing &nbsp; <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px' }}></i></button>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className='footer mt-3 text-center'>
                                                    <button className="submit" >Login</button>
                                                </div>
                                            </>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Login;
