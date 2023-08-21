import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import toast, { Toaster } from 'react-hot-toast';
import config from '../config';
import { ResetPasswordAction } from '../Action/user.action';

const Login = () => {
    const [passwordType, setPasswordType] = useState("password");
    let { token } = useParams();
    const [form, setForm] = useState({ password: '', confirm_password: '', token: token })
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
        let passwordError = "";
        let confirmPasswordError = "";

        if (form.password === '') {
            passwordError = "Password is required."
        }
        if (form.confirm_password === '') {
            confirmPasswordError = "Confirm password is required."
        }
        if (form.password != form.confirm_password && (form.password && form.confirm_password)) {
            confirmPasswordError = "Password and confirm password does not match."
        }
        if (passwordError || confirmPasswordError) {
            setvalidatioError({
                passwordError, confirmPasswordError
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
            let res = await ResetPasswordAction(form);
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
                                Reset Password
                            </h2>
                            <div className="flat-form box-login-email">
                                <div className="box-title-login">
                                    <h5>Reset Password</h5>
                                </div>
                                <div className="form-inner">
                                    <form onSubmit={SubmitForm}>
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
                                        <div className="row-form style-1">
                                            <Link to={`${config.baseUrl}login`} className="forgot-pass">Login?</Link>
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
                                                    <button className="submit" >Update</button>
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
