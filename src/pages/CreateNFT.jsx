import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Tabs, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import toast, { Toaster } from 'react-hot-toast';
import { Player } from 'video-react';
import { Link, useParams } from 'react-router-dom';
import config from '../config';
import Cookies from 'js-cookie';
import axios from 'axios';
import Web3 from 'web3';
// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCategoryAction, createNftAction, createMetadataAction, getNftTypeAction } from '../Action/user.action';
const CreateNFT = () => {

    const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));
    const { id } = useParams();
    const [Category, setCategory] = useState([]);
    const [connectWalletAddress, setConnectWalletAddress] = useState('');
    const [nftType, setnftType] = useState([]);
    const [image_preview, setimage_preview] = useState('');
    const [video_preview, setvideo_preview] = useState('');
    const [image_file, setimage_file] = useState('');
    const [FileType, setFileType] = useState('');
    const [validatioError, setvalidatioError] = useState({});
    const [spinloader, setspinloader] = useState(0);
    const [currentDate, setcurrentDate] = useState(new Date());
    const [selectCurrency, setSelectCurrency] = useState('BNB')
    let [responseData, setResponseData] =useState('')
    const [nftdata, setnftdata] = useState({
        title: '',
        description: '',
        category_id: '0',
        nft_type: '0',
        royalty_percentage: '0',
        price: '0',
        sell_type: "1",
        start_date: null,
        expiry_date: null
    });

    useEffect(() => {
        if (!loginData?.email) {
            window.location.href = `${config.baseUrl}login`
        }
        getCategoryAPI()
        getNftTypeAPI()
        getBNBToUsd()
    }, []);
    const getCategoryAPI = async () => {
        let res = await getCategoryAction();
        if (res.success) {
            setCategory(res.data)
        }
    }
    const getNftTypeAPI = async () => {
        let res = await getNftTypeAction();
        if (res.success) {
            setnftType(res.data)
        }
    }
    const imageUpload = async (e) => {
        e.preventDefault()
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        let imageType = e.target.files[0].type;
        if (imageType == 'image/jpeg' || imageType == 'image/jpg' || imageType == 'image/png' || imageType == 'image/gif' || imageType == 'video/mp4') {
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
        } else {
            toast.error('File type wrong please select JPG, JPEG, PNG or gif.');
        }
    }

    const inputHandler = (e) => {
        const { name, value, id } = e.target
        setnftdata({ ...nftdata, [name]: value })
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
        let nftTypeError = "";
        let priceError = "";
        let imageError = "";
        let startDateError = "";
        let expiryDateError = "";

        if (nftdata.title === '') {
            titleError = "Title field is required."
        }
        if (nftdata.description === '') {
            descriptionError = "Description field is required."
        }
        if (nftdata.category_id == 0) {
            categoryError = "Category field is required."
        }
        if (nftdata.price == 0) {
            priceError = "Price field is required."
        }
        if (nftdata.nft_type == 0) {
            nftTypeError = "NFT Type field is required."
        }

        if (nftdata.sell_type == 2) {
            if (nftdata.start_date === '' || nftdata.start_date === null) {
                startDateError = "Start date required."
            }
            if (nftdata.expiry_date === '' || nftdata.expiry_date === null) {
                expiryDateError = "Expiry date required."
            }
        }
        if (image_file == '') {
            imageError = "Image field is required."
        }
        if (titleError || descriptionError || categoryError || nftTypeError || priceError || imageError || startDateError || expiryDateError) {
            setvalidatioError({
                titleError, descriptionError, categoryError, priceError, nftTypeError, imageError, startDateError, expiryDateError
            })
            return false
        } else {
            return true
        }
    }

    const getBNBToUsd = async (e) =>{
        await axios({
            method: 'get',
            // url: `https://min-api.cryptocompare.com/data/price?fsym=BNB&tsyms=USD&Apikey=a8353644909600f9c297c8fd38447a21d31bdf70b9b4f286d4b79accf97e4dda`,

            url: `https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`, 

        })
        .then((response)=>{
            setResponseData( response.data.price
            )
            
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const createNFt = async (e) => {
        e.preventDefault()
        const isValid = validate();
        if (!isValid) {
        }
        else {
            setspinloader(1);
            let adminfeeTrx = await buy_now();
            if(adminfeeTrx){
                let fileHash = await imageUploadOnPinata();
                if (fileHash) {
                    let tokenId = await metaDataUpload(fileHash);
                    if (tokenId) {
                        nftdata.ipfsHash = fileHash;
                        nftdata.token_id = tokenId;
                        nftdata.file_type = FileType;
                        nftdata.txhash = adminfeeTrx;
                        
                        console.log('nftdata', nftdata);
                        let res = await createNftAction(nftdata);
                        if (res.success) {
                            toast.success(res.msg);
                            setTimeout(() => {
                                window.location.href = `${config.baseUrl}portfolio`;
                            }, 2000);
                        } else {
                            setspinloader(0);
                            toast.error(res.msg);
                        }
                    } else {
                        setspinloader(0);
                        toast.error('Something went wrong for creating metadata.');
                    }
                } else {
                    setspinloader(0);
                    toast.error('Something went wrong for uploading image on pinata.');
                }
            }else{
                setspinloader(0);
                toast.error('Something went wrong please try again.');                
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
            "name": nftdata.title,
            "description": nftdata.description,
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

    const buy_now = async () => {
        let fees = 0;
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let web3 = new Web3(window.ethereum);
            let currentNetwork = web3.currentProvider.chainId;
            if (currentNetwork != config.chainId) {
                toast.error(`Please select smartchain!!`, {
                });
                return false;
            }
            let chainId = config.chainId;
            try {
                
                var dollarprice = responseData ;

                var usdInBNB = (parseFloat(dollarprice) * parseFloat(nftdata.price)).toFixed(6);
                console.log(dollarprice)
                console.log(usdInBNB, "usdInBNB")
                if (parseFloat(usdInBNB) <= 5000) {
                    fees = 5
                } else if (parseFloat(usdInBNB) > 5000 && parseFloat(usdInBNB) <= 10000) {
                    fees = 2.5
                } else if (parseFloat(usdInBNB) > 10000) {
                    fees = 1
                }
                let feeCharge = parseFloat(nftdata.price) * parseFloat(usdInBNB)/100;
                let trx_amount = parseInt(feeCharge * (10 ** 18));
                let to_address = config.AdminWallet //admin address 
                let from_address = accounts[0];
                let getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
                let currentBal = parseFloat(getBalace).toFixed(6)
                if (currentBal < feeCharge) {
                    toast.error(`Insufficient fund for transfer`, {
                    });
                    return false;
                }
                let gasPrice = await web3.eth.getGasPrice();
                let gasLimit = await web3.eth.estimateGas({
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: to_address,
                    from: from_address,
                    value: web3.utils.toHex(trx_amount),
                    chainId: chainId,
                });
                gasPrice = parseInt(gasPrice) + (5 * (10 ** 9));
                const transactionParameters = {
                    gasPrice: web3.utils.toHex(gasPrice),
                    gas: web3.utils.toHex(gasLimit),
                    to: to_address,
                    from: from_address,
                    value: web3.utils.toHex(trx_amount),
                    chainId: chainId,
                };
                const txHash = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });
                if (txHash) {
                    return txHash;
                }else{
                    toast.error(`Something went wrong! Please try again.`, {
                    });
                    return false;                    
                }

            } catch (error) {
                toast.error(`Something went wrong! Please try again.`, {
                });
                return false;
            }
        } else {
            toast.error(`Please connect your MetaMask wallet!`, {
            });
            return false;
        }

    }


    const handleChangeStartDate = e => {
        let startDate = formatDate(e);
        setnftdata({ ...nftdata, ['start_date']: startDate });
        setvalidatioError({ ...validatioError, ['startDateError']: '' });
    }

    const handleChangeExpiryDate = e => {
        let expiryDate = formatDate(e);
        setnftdata({ ...nftdata, ['expiry_date']: expiryDate });
        setvalidatioError({ ...validatioError, ['expiryDateError']: '' });
    }

    const connectMetasmask = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setConnectWalletAddress(accounts);
        }
        else {
            toast.error(`Please use dApp browser to connect wallet!`);
        }
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
                                <h1 className="heading text-center">Create NFT</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="tf-create-item tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-xl-2 col-lg-6 col-md-6 col-12"> </div>
                        <div className="col-xl-8 col-lg-6 col-md-12 col-12 mt-4">
                            <div className="form-create-item">
                                <div className='add-category'>
                                    <h4 className="title-create-item">Upload file</h4>
                                    <a href={`${config.baseUrl}createcategory`} className='add-categorys'>Create a shop</a>
                                </div>
                                <label className="uploadFile upload">

                                    <>
                                        {
                                            image_preview ?
                                                <img src={image_preview} style={{ height: '115px', width: '115px' }} alt="" className="btn-rounded" /> :
                                                video_preview ?
                                                    <video autoplay="true" muted loop id="myVideo" className='' style={{ height: '115px', width: '115px' }}>
                                                        <source src={video_preview} style={{ height: '115px', width: '115px' }} type="video/mp4" />
                                                    </video>
                                                    :
                                                    ''
                                        }
                                    </>
                                    <span className="filename">PNG, JPG, JPEG, GIF or MP4</span>
                                    <input onChange={imageUpload} type="file" className="inputfile form-control" name="file" />
                                </label>
                                <span className="validationErr">{validatioError.imageError}</span>
                                <div className="flat-tabs tab-create-item">
                                    <Tabs>
                                        <TabPanel>
                                            <form >
                                                <h4 className="title-create-item">Title</h4>
                                                <input type="text" placeholder="Enter Title" id='titleError' name='title' onChange={inputHandler} />
                                                <span className="validationErr">{validatioError.titleError}</span>
                                                <h4 className="title-create-item">Description</h4>
                                                <textarea id='descriptionError' name='description' onChange={inputHandler} placeholder="e.g. “This is very limited item”"></textarea>
                                                <span className="validationErr">{validatioError.descriptionError}</span>
                                                <div className='add-category'>
                                                    <h4 className="title-create-item">Category</h4>
                                                </div>
                                                {/* {Category.map((categoryList) => (
                                                        <>
                                                            <label>{categoryList.name}
                                                                <input onClick={() => CategoryFilter()} type="checkbox" name='category_id[]' value={categoryList.id} />
                                                                <span className="btn-checkbox"></span>
                                                            </label><br />
                                                        </>
                                                    ))} */}
                                                <select style={{ marginBottom: "10px" }} name='category_id' id='categoryError' onChange={inputHandler}>
                                                    <option value="0">Select Category</option>
                                                    {Category.map(cat => (
                                                        <option value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                                <span className="validationErr">{validatioError.categoryError}</span>
                                                <h4 className="title-create-item ">NFT Type</h4>
                                                <select style={{ marginBottom: "10px" }} name='nft_type' id='nftTypeError' onChange={inputHandler}>
                                                    <option value="0">Select Product Type</option>
                                                    <option value="1">Digital</option>
                                                    <option value="2">Physical</option>
                                                </select>
                                                <span className="validationErr">{validatioError.nftTypeError}</span>
                                                <div className="row-form style-3 ">
                                                    <div className="inner-row-form">
                                                        <h4 className="title-create-item">Sell Type</h4>
                                                        <select style={{ marginBottom: "10px" }} name='sell_type' id='sellType' onChange={inputHandler}>
                                                            <option value="1">Price</option>
                                                            <option value="2">Auction</option>
                                                        </select>
                                                    </div>
                                                    {nftdata.sell_type == 2 ?
                                                        <>
                                                            <div className="inner-row-form">
                                                                <h4 className="title-create-item">Start Date</h4>
                                                                <span className="validationErr">{validatioError.startDateError}</span>
                                                                <DatePicker onChange={handleChangeStartDate} minDate={currentDate} autoComplete="off" name="start_date" id="startDateError" value={nftdata.start_date} />
                                                            </div>
                                                            <div className="inner-row-form">
                                                                <h4 className="title-create-item">End Date</h4>
                                                                <span className="validationErr">{validatioError.expiryDateError}</span>
                                                                <DatePicker onChange={handleChangeExpiryDate} minDate={currentDate} value={nftdata.expiry_date} autoComplete="off" id="expiryDateError" name="expiry_date" />
                                                            </div>
                                                        </>
                                                        : ""}
                                                </div>
                                                <div className="row-form style-3 ">
                                                    <div className="inner-row-form">
                                                        <h4 className="title-create-item">Royalties(%)</h4>
                                                        <input name='royalty_percentage' onChange={inputHandler} type="text" placeholder="Eg. 5%, 10%, 15%" onKeyPress={(event) => { if (!/^\d*[]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} />
                                                    </div>
                                                    <div className="inner-row-form">
                                                        <h4 className="title-create-item">Price(BNB)</h4>
                                                        <input name='price' id='priceError' className='mb-3' onChange={inputHandler} type="text" placeholder="Enter Price (BNB)" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} />
                                                        <span className="validationErr">{validatioError.priceError}</span>
                                                    </div>
                                                    <div className="inner-row-form style-2">
                                                        <div className="seclect-box">

                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                            {
                                                connectWalletAddress ?
                                                    spinloader == '0' ?
                                                        <button className='btn btn-primary btn-lg' onClick={createNFt}>Submit</button>
                                                        :
                                                        <button disabled className='btn btn-primary btn-lg' >Creating NFT <i className="fa fa-spinner fa-spin validat"></i></button>
                                                    :
                                                    <button onClick={() => connectMetasmask()} className="btn btn-primary btn-lg">Connect Wallet</button>
                                            }
                                        </TabPanel>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-2 col-lg-6 col-md-6 col-12"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CreateNFT;
