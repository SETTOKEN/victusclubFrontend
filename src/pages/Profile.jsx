import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import avt from '../assets/images/avatar/avata_profile.jpg'
import toast, { Toaster } from 'react-hot-toast';
import config from '../config';
import Cookies from 'js-cookie';
import { getProfileAction, UpdateProfileAction } from '../Action/user.action';
const Profile = () => {

    const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));

    const [userDetails, setuserDetails] = useState([]);
    const [image_preview, setimage_preview] = useState('');
    const [image_file, setimage_file] = useState('');

    useEffect(() => {
        if (!loginData?.email) {
            window.location.href = `${config.baseUrl}login`
        }

        getProfileAPI()
    }, []);

    const getProfileAPI = async () => {
        let res = await getProfileAction({ 'user_id': loginData?.id });
        if (res.success) {
            setuserDetails(res.data)
        }
    }

    const profilePicChange = async (e) => {
        e.preventDefault()
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        let imageType = e.target.files[0].type;
        if (imageType == 'image/jpeg' || imageType == 'image/jpg' || imageType == 'image/png') {
            setimage_file(image_as_files);
            setimage_preview(image_as_base64);
            setuserDetails((old) => {
                return { ...old, ['profile_pic']: image_as_files }
            })
        } else {
            toast.error('File type wrong please select JPG, JPEG or PNG.');
        }
    }

    const inputHandler = (e) => {
        const { name, value } = e.target
        setuserDetails((old) => {
            return { ...old, [name]: value }
        })
    }

    const updateProfile = async (e) => {
        e.preventDefault()
        if (!image_file) {
            userDetails.old_profile_pic = userDetails?.profile_pic;
        }

        let res = await UpdateProfileAction(userDetails);
        if (res.success) {
            toast.success(res.msg);
            setTimeout(() => {
                window.location.href = `${config.baseUrl}profile`;
            }, 2000);
        } else {
            toast.error(res.msg);
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
                                <h1 className="heading text-center">Profile</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="tf-create-item tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-xl-3 col-lg-4 col-md-6 col-12 mt-4">
                            <div className="sc-card-profile text-center">
                                <div className="card-media">
                                    {image_preview ?
                                        <img id="profileimg" src={image_preview ? image_preview : avt} alt="User Profile" />
                                        :
                                        !userDetails?.profile_pic || userDetails?.profile_pic == null || userDetails?.profile_pic == 'null' ?
                                            <img id="profileimg" src="images/default-user-icon.jpg" alt="User Profile" />
                                            :
                                            <img id="profileimg" src={`${config.imageUrl + userDetails?.profile_pic}`} alt="User Profile" />
                                    }
                                </div>
                                <div id="upload-profile">
                                    <Link to="#" className="btn-upload">
                                        Upload New Photo </Link>
                                    <input onChange={profilePicChange} id="tf-upload-img" accept="image/png, image/jpeg" type="file" name="profile" required="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-9 col-lg-8 col-md-12 col-12 mt-4">
                            <div className="form-upload-profile">
                                <form className="form-profile" onSubmit={updateProfile}>
                                    <div className="form-infor-profile">
                                        <div className="info-account">
                                            <h4 className="title-create-item">Account info</h4>
                                            <fieldset>
                                                <h4 className="title-infor-account">First Name</h4>
                                                <input type="text" placeholder="Enter First Name" name="first_name" value={userDetails?.first_name} onChange={inputHandler} />
                                            </fieldset>
                                            <fieldset>
                                                <h4 className="title-infor-account">Last Name</h4>
                                                <input type="text" placeholder="Enter Last Name" value={userDetails?.last_name} name="last_name" onChange={inputHandler} />
                                            </fieldset>
                                            <fieldset>
                                                <h4 className="title-infor-account">Email</h4>
                                                <input type="email" placeholder="Enter your email" value={userDetails?.email} onChange={inputHandler} readOnly disabled />
                                            </fieldset>
                                            <fieldset>
                                                <h4 className="title-infor-account">Bio</h4>
                                                <textarea tabIndex="4" rows="5" name="bio" value={userDetails?.bio} onChange={inputHandler}></textarea>
                                            </fieldset>
                                        </div>
                                        <div className="info-account">
                                            <h4 className="title-create-item">Your Social media</h4>
                                            <fieldset>
                                                <h4 className="title-infor-account">Facebook</h4>
                                                <input type="text" placeholder="Enter Facebook Link" value={userDetails?.facebook} name="facebook" onChange={inputHandler} />
                                            </fieldset>
                                            <fieldset>
                                                <h4 className="title-infor-account">Twitter</h4>
                                                <input type="text" placeholder="Enter Twitter Link" value={userDetails?.twitter} name="twitter" onChange={inputHandler} />
                                            </fieldset>
                                            <fieldset>
                                                <h4 className="title-infor-account">Discord</h4>
                                                <input type="text" placeholder="Enter Discord Link" value={userDetails?.discord} name="discord" onChange={inputHandler} />
                                            </fieldset>
                                            <fieldset>
                                                <h4 className="title-infor-account">Telegram</h4>
                                                <input type="text" placeholder="Enter Telegram Link" value={userDetails?.telegram} name="telegram" onChange={inputHandler} />
                                            </fieldset>
                                        </div>
                                    </div>
                                    <button className="tf-button-submit mg-t-15" type="submit">
                                        Update Profile
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;
