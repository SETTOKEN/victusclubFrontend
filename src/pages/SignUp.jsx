import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import toast, { Toaster } from 'react-hot-toast';
import config from '../config';
import { RegisterAction } from '../Action/user.action';

const Login = () => {
    const [passwordType, setPasswordType] = useState("password");
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', confirm_password: '' })
    const [validatioError, setvalidatioError] = useState({});
    const [isLoading, setisLoading] = useState(false);

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

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }


    function validate() {
        let firstnameError = "";
        let lastnameError = "";
        let emailError = "";
        let passwordError = "";
        let confirmPasswordError = "";

        if (form.first_name === '') {
            firstnameError = "First name is required."
        }

        if (form.last_name === '') {
            lastnameError = "Last name is required."
        }

        if (form.email === '') {
            emailError = "Email is required."
        }
        if (form.password === '') {
            passwordError = "Password is required."
        }

        if (form.confirm_password === '') {
            confirmPasswordError = "Confirm password is required."
        }

        if (form.password != form.confirm_password) {
            confirmPasswordError = "Password and confirm password not match."
        }

        if (firstnameError || lastnameError || emailError || passwordError || confirmPasswordError) {
            setvalidatioError({
                firstnameError, lastnameError, emailError, passwordError, confirmPasswordError
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
            let res = await RegisterAction(form);
            if (res.success) {
                toast.success(res.msg);
                setTimeout(() => {
                    window.location.href = `${config.baseUrl}login`;
                }, 2000);
            } else {
                setisLoading(false);
                toast.error(res.msg);
            }
        }
    }

    return (
        <div>
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
                                Signup To Victus Token
                            </h2>

                            <div className="flat-form box-login-email">
                                <div className="box-title-login">
                                    <h5>Signup with email & password</h5>
                                </div>

                                <div className="form-inner">
                                    <form onSubmit={SubmitForm}>


                                        <input autoComplete="off" name="first_name" id='firstnameError' onChange={inputHandler} type="text" placeholder="Enter First Name" />
                                        <span className="validationErr">{validatioError.firstnameError}</span>

                                        <input autoComplete="off" name="last_name" id='lastnameError' onChange={inputHandler} type="text" placeholder="Enter Last Name" />
                                        <span className="validationErr">{validatioError.lastnameError}</span>

                                        <input autoComplete="off" name="email" id='emailError' onChange={inputHandler} type="email" placeholder="Enter Email Address" />
                                        <span className="validationErr">{validatioError.emailError}</span>
                                        <div className="input-group ">
                                            <input name="password" className='passworderr' type={passwordType} id='passwordError' onChange={inputHandler} placeholder="Enter Password" />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary eye btn-sm" type="button"><i onClick={togglePassword} className={passwordType == 'password' ? 'fa fa-eye' : 'fa fa-eye-slash'} style={{ fontSize: "15px", margin: "0" }}></i></button>
                                            </div>
                                        </div>
                                        <span className="validationErr">{validatioError.passwordError}</span>
                                        <div className="input-group ">
                                            <input name="confirm_password" className='passworderr' type={passwordType} id='confirmPasswordError' onChange={inputHandler} placeholder="Enter Confirm Password" />                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary eye btn-sm" type="button"><i onClick={togglePassword} className={passwordType == 'password' ? 'fa fa-eye' : 'fa fa-eye-slash'} style={{ fontSize: "15px", margin: "0" }}></i></button>
                                            </div>
                                        </div>
                                        <span className="validationErr">{validatioError.confirmPasswordError}</span>
                                        {isLoading ?
                                            <>
                                                <div className='footer mt-3 text-center'>
                                                    <button disabled className="submit">Processing &nbsp; <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px' }}></i></button>
                                                </div>
                                            </>

                                            :
                                            <>
                                                <div className='footer mt-3 text-center'>
                                                    <button className="submit" >Signup</button>
                                                </div>
                                            </>

                                        }

                                        <div className="row-form style-1">
                                            <Link to={`${config.baseUrl}login`} className="forgot-pass">Already have an account? Login</Link>
                                        </div>
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
