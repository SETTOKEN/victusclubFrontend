import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Tabs, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import toast, { Toaster } from 'react-hot-toast';
import config from '../config';
import Cookies from 'js-cookie';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCategoryAction, updateNftAction, createMetadataAction, getNftDetailsAction } from '../Action/user.action';
import { useParams } from 'react-router-dom';
const EditeNFT = () => {

    const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));
    const { id } = useParams();
    const [Category, setCategory] = useState([]);
    const [image_preview, setimage_preview] = useState('');
    const [video_preview, setvideo_preview] = useState('');
    const [image_file, setimage_file] = useState('');
    const [FileType, setFileType] = useState('');
    const [validatioError, setvalidatioError] = useState({});
    const [spinloader, setspinloader] = useState(0);
    const [NftDetails, setNftDetails] = useState(0);
    const [currentDate, setcurrentDate] = useState(new Date());

    useEffect(() => {
        if (!loginData?.email) {
            window.location.href = `${config.baseUrl}login`
        }
        getCategoryAPI();
        getNFTDetailsAPI();
    }, []);

    const getCategoryAPI = async () => {
        let res = await getCategoryAction();
        if (res.success) {
            setCategory(res.data)
        }
    }

    const getNFTDetailsAPI = async () => {
        let res = await getNftDetailsAction({ 'id': id });
        if (res.success) {
            setNftDetails(res.data)
        }
    }

    const imageUpload = async (e) => {
        e.preventDefault()
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        let file_type = '';
        if (image_as_files.type.indexOf('image') === 0) {
            file_type = 'image';
            setimage_preview(image_as_base64);

        } else if (image_as_files.type.indexOf('video') === 0) {
            file_type = 'video';
            setvideo_preview(image_as_base64);

        }
        setimage_file(image_as_files);
        setFileType(file_type);
        setvalidatioError((old) => {
            return { ...old, ['imageError']: '' }
        })
    }
    const inputHandler = (e) => {
        const { name, value, id } = e.target
        setNftDetails((old) => {
            return { ...old, [name]: value }
        })
        if (value != '') {
            setvalidatioError((old) => {
                return { ...old, [id]: '' }
            })
        }
    }
    function validate() {
        let titleError = "";
        let descriptionError = "";
        let categoryError = "";
        let priceError = "";
        let imageError = "";
        let startDateError = "";
        let expiryDateError = "";
        if (NftDetails?.title === '') {
            titleError = "Title field is required."
        }
        if (NftDetails?.description === '') {
            descriptionError = "Description field is required."
        }
        if (NftDetails?.category_id == 0) {
            categoryError = "Category field is required."
        }
        if (NftDetails?.price == 0) {
            priceError = "Price field is required."
        }
        if (image_file == '' && NftDetails?.image == "") {
            imageError = "Image field is required."
        }
        if (NftDetails.sell_type == 2) {
            if (NftDetails.start_date === '' || NftDetails.start_date === null) {
                startDateError = "Start date required."
            }
            if (NftDetails.expiry_date === '' || NftDetails.expiry_date === null) {
                expiryDateError = "Expiry date required."
            }
        }
        if (titleError || descriptionError || categoryError || priceError || imageError) {
            setvalidatioError({
                titleError, descriptionError, categoryError, priceError, imageError
            })
            return false
        } else {
            return true
        }
    }
    const updateNFt = async (e) => {
        e.preventDefault()
        const isValid = validate();
        if (!isValid) {
        }
        else {
            setspinloader(1);
            let fileHash = "";
            if (image_file) {
                fileHash = await imageUploadOnPinata();
                NftDetails.file_type = FileType;
            } else {
                fileHash = NftDetails?.image;
                NftDetails.file_type = NftDetails?.file_type;
            }
            if (fileHash) {
                NftDetails.ipfsHash = fileHash;
                let res = await updateNftAction(NftDetails);
                if (res.success) {
                    toast.success(res.msg);
                    setTimeout(() => {
                        window.location.href = `${config.baseUrl}portfolio`;
                    }, 2000);
                } else {
                    toast.error(res.msg);
                }
            } else {
                setspinloader(0);
                toast.error('Something went wrong for uploading image on pinata.');
            }
        }
    }

    const imageUploadOnPinata = async () => {
        let formData = new FormData();
        formData.append('file', image_file);
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let resIPF = await axios.post(url,
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${formData._boundary}`,
                    'pinata_api_key': '47f938c25449b4a8b8e0',
                    'pinata_secret_api_key': '86cbf71e2981badd05a23aa09757007ec9ef2a578869353770d1a89cf88c0632'
                }
            }
        );
        if (resIPF.data.IpfsHash) {
            let ipfsImg = resIPF.data.IpfsHash;
            return ipfsImg;
        } else {
            toast.error('Something went wrong uploading image on IPFS.');
            setspinloader(0);
            return false;
        }
    }

    const metaDataUpload = async (fileHash) => {
        let reqData = {
            "name": NftDetails.title,
            "description": NftDetails.description,
            "image": `https://ipfs.io/ipfs/${fileHash}`
        }

        let resIPF = await createMetadataAction(reqData);
        if (resIPF.tokenId) {
            let tokenId = resIPF.tokenId;
            return tokenId;
        } else {
            toast.error('Something went wrong creating metadata.');
            setspinloader(0);
            return false;
        }
    }

    function formatDate(str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }

    const handleChangeStartDate = e => {
        let startDate = formatDate(e);
        setNftDetails((old) => {
            return { ...old, ['start_date']: startDate }
        })
        setvalidatioError({ ...validatioError, ['startDateError']: '' });
    }

    const handleChangeExpiryDate = e => {
        let expiryDate = formatDate(e);
        setNftDetails((old) => {
            return { ...old, ['expiry_date']: expiryDate }
        })
        setvalidatioError({ ...validatioError, ['expiryDateError']: '' });
    }

    return (
        <div className='create-item'>
            <Toaster />
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Edit NFT</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="tf-create-item tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-xl-2 col-lg-6 col-md-6 col-12"> </div>
                        <div className="col-xl-8 col-lg-6 col-md-12 col-12">
                            <div className="form-create-item">
                                <h4 className="title-create-item">Upload file</h4>
                                <span className="validationErr">{validatioError.imageError}</span>
                                <label className="uploadFile">
                                    {console.log('image_preview', image_preview)}
                                    {console.log('video_preview', video_preview)}

                                    {
                                        image_preview ?
                                            <img src={image_preview} style={{ height: '115px', width: '115px' }} alt="" className="btn-rounded" /> :
                                            video_preview ?
                                                <video autoplay="true" muted loop id="myVideo" className='' style={{ height: '115px', width: '115px' }}>
                                                    <source src={video_preview} type="video/mp4" />
                                                </video> :
                                                NftDetails?.file_type == 'image' ?
                                                    <img src={`${config.ipfsUrl + NftDetails?.image}`} style={{ height: '115px', width: '115px' }} />
                                                    :
                                                    NftDetails?.file_type == 'video' ?
                                                        <video muted autoPlay playsInline loop style={{ height: '115px', width: '115px' }}>
                                                            <source src={`${config.ipfsUrl + NftDetails?.image}`} type="video/mp4" />
                                                        </video>
                                                        :
                                                        ''

                                    }
                                    <span className="filename">PNG, JPG, GIF, WEBP,MP4</span>
                                    <input onChange={imageUpload} type="file" className="inputfile form-control" name="file" />
                                </label>
                                <div className="flat-tabs tab-create-item">
                                    <Tabs>
                                        <TabPanel>
                                            <form onSubmit={updateNFt}>

                                                <h4 className="title-create-item">Title</h4>
                                                <span className="validationErr">{validatioError.titleError}</span>
                                                <input type="text" placeholder="Enter Title" id='titleError' name='title' onChange={inputHandler} value={NftDetails?.title} />

                                                <h4 className="title-create-item">Description</h4>
                                                <span className="validationErr">{validatioError.descriptionError}</span>
                                                <textarea id='descriptionError' name='description' onChange={inputHandler} placeholder="e.g. “This is very limited item”" value={NftDetails?.description}></textarea>

                                                <h4 className="title-create-item">Category</h4>
                                                <span className="validationErr">{validatioError.categoryError}</span>
                                                <select value={NftDetails?.category_id} name='category_id' id='categoryError' onChange={inputHandler}>
                                                    <option value="0">Select Category</option>
                                                    {Category.map(cat => (
                                                        <option value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <br />
                                                <h4 className="title-create-item mt-4">NFT Type</h4>
                                                <select value={NftDetails?.nft_type} name='nft_type' id='nftType' onChange={inputHandler}>
                                                    <option value="1">Digital</option>
                                                    <option value="2">Physical</option>
                                                </select>

                                                <div className="row-form style-3 mt-4">
                                                    <div className="inner-row-form">
                                                        <h4 className="title-create-item">Sell Type</h4>
                                                        <span className="validationErr">{validatioError.sellType}</span>
                                                        <select value={NftDetails?.sell_type} name='sell_type' id='sellType' onChange={inputHandler}>
                                                            <option value="1">Price</option>
                                                            <option value="2">Auction</option>
                                                        </select>
                                                    </div>
                                                    {NftDetails.sell_type == 2 ?
                                                        <>
                                                            <div className="inner-row-form">
                                                                <h4 className="title-create-item">Start Date</h4>
                                                                <span className="validationErr">{validatioError.startDateError}</span>
                                                                <DatePicker onChange={handleChangeStartDate} minDate={currentDate} autoComplete="off" name="start_date" id="startDateError" className="form-control createNFTDate" value={NftDetails.start_date} />
                                                            </div>
                                                            <div className="inner-row-form">
                                                                <h4 className="title-create-item">End Date</h4>
                                                                <span className="validationErr">{validatioError.expiryDateError}</span>
                                                                <DatePicker onChange={handleChangeExpiryDate} minDate={currentDate} value={NftDetails.expiry_date} autoComplete="off" className='createNFTDate' id="expiryDateError" name="expiry_date" />
                                                            </div>
                                                        </>
                                                        : ""}
                                                </div>
                                                <div className="row-form style-3 mt-4">
                                                    <div className="inner-row-form">
                                                        <h4 className="title-create-item">Royalties(%)</h4>
                                                        <input disabled={NftDetails?.owner_id == NftDetails.created_by ? '' : 'disabled'} name='royalty_percentage' onChange={inputHandler} type="text" placeholder="Eg. 5%, 10%, 15%" onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} value={NftDetails?.royalty_percentage} />
                                                    </div>
                                                    <div className="inner-row-form">
                                                        <h4 className="title-create-item">Price(BNB)</h4>
                                                        <span className="validationErr">{validatioError.priceError}</span>
                                                        <input name='price' id='priceError' onChange={inputHandler} type="text" placeholder="Enter Price (BNB)" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} value={NftDetails?.price} />
                                                    </div>
                                                    <div className="inner-row-form style-2">
                                                        <div className="seclect-box">
                                                            {spinloader == '0' ?
                                                                <button className='btn btn-primary btn-lg update' >Update</button>
                                                                :
                                                                <button disabled className='btn btn-primary btn-lg update' >Updating NFT <i className="fa fa-spinner fa-spin validat"></i></button>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </TabPanel>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-2 col-lg-6 col-md-6 col-12"> </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditeNFT;
