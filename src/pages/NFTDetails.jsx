import React, { useState, useEffect } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link, useParams } from 'react-router-dom'
import Countdown, { zeroPad } from 'react-countdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import 'react-tabs/style/react-tabs.css';
import ReactTooltip from 'react-tooltip';
import { getNftDetailsAction, nftLikeDislikeAction, PhysicalNftAction, getNftHistoryAction, buyItemAction, bidPlaceAPIAction } from '../Action/user.action';
import config from '../config';
import Cookies from 'js-cookie';
import Web3 from 'web3';
import toast, { Toaster } from 'react-hot-toast';
const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));


const NFTDetails = () => {
    const { id } = useParams();
    const [NFTDetails, setNFTDetails] = useState([]);
    const [NFTHistory, setNFTHistory] = useState([]);
    const [connectWalletAddress, setConnectWalletAddress] = useState('');
    const [spinLoader, setSpinLoader] = useState(0);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [modalopen, setModalopen] = useState(0);
    const [validatioError, setvalidatioError] = useState({});
    const [isLoading, setisLoading] = useState(false);


    const [Biderror, setBiderror] = useState(0);
    const [ErrorMessage, setErrorMessage] = useState('');
    const [form, setForm] = useState({
        'bid_price': '',

    })
    const [form1, setForm1] = useState({ 'description': '', 'item_id': id })
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(async () => {
        getNFTDetailsAPI();
        getNftHistoryAPI();
        setTimeout(() => {
            if (window.ethereum) {
                const { ethereum } = window;
                setConnectWalletAddress(ethereum.selectedAddress);
            }
        }, 200);

    }, []);

    const getNFTDetailsAPI = async () => {
        let res = await getNftDetailsAction({ 'id': id, 'user_id': loginData?.id });
        if (res.success) {
            setNFTDetails(res.data);
        }
    }
    const inputHandlers = (e) => {
        const { name, value, id } = e.target
        setForm1((old) => {
            return { ...old, [name]: value }
        })

        if (value != '') {
            setvalidatioError((old) => {
                return { ...old, [id]: '' }
            })
        }

    }

    const getNftHistoryAPI = async () => {
        let res = await getNftHistoryAction({ 'id': id });
        if (res.success) {
            setNFTHistory(res.data);
        }
    }

    const nftLike = async (type, item_id) => {
        let res = await nftLikeDislikeAction({ 'type': type, 'item_id': item_id });
        if (res.success) {
            getNFTDetailsAPI();
        }
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

    const purchaseItem = async () => {
        if (!loginData?.id) {
            toast.error('Please login first!!');
        } else {
            let tokenId = NFTDetails.token_id;
            let tokenPrice = NFTDetails.price;
            // && NFTDetails.nft_type == 2 ? '0' : NFTDetails.price;
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                let web3 = new Web3(window.ethereum);
                let currentNetwork = web3.currentProvider.chainId;
                let chainId = config.chainId;
                if (currentNetwork !== chainId) {
                    toast.error('Please select BNB testnet network!');
                    return false;
                }
                try {
                    tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
                    let from_address = accounts[0];
                    var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
                    var currentBal = parseFloat(getBalace).toFixed(6)
                    if (currentBal < NFTDetails.price) {
                        toast.error(`Insufficient fund for transfer`);
                        return false;
                    }

                    setSpinLoader(1);
                    setDialogOpen(true);

                    await trnasferNFT(tokenId, tokenPrice);
                } catch (error) {
                    toast.error('Something went wrong please try again2.');
                    this.setState({
                        spinLoader: 0,
                        isDialogOpen: false
                    })
                    return false;
                }
            } else {
                toast.error('Please Connect to MetaMask.');
                this.setState({
                    spinLoader: '0',
                    isDialogOpen: false
                })
                return false;
            }
        }
    }


    const insertDetailPhysicalNft = async (e) => {
        e.preventDefault()
        form1.token_id = NFTDetails.token_id
        form1.owner_id = NFTDetails.owner_id
        form1.created_by = NFTDetails.created_by
        form1.image = NFTDetails.image
        form1.user_id = loginData?.id
        const isValid = validate();
        if (!isValid) {

        }
        else {
            setisLoading(true);
            let res = await PhysicalNftAction(form1);
            if (res.success) {
                toast.success(res.msg);
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            } else {
                setisLoading(false);
                toast.error(res.msg);
            }
        }
    }

    function validate() {
        let bioError = "";
        if (form1.description === '') {
            bioError = "Message is required."
        }
        if (bioError) {
            setvalidatioError({ bioError })
            return false
        } else {
            return true
        }
    }
    const trnasferNFT = async (tokenId, tokenPrice) => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let web3 = new Web3(window.ethereum);
            var chainId = web3.currentProvider.chainId;
            try {
                let contractAddress = `${config.marketplaceContract}`
                let from_address = accounts[0];
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                let tx_builder = '';
                let cryptoAmount = tokenPrice;
                let itemPrice = 0;
                itemPrice = tokenPrice / 10 ** 18;
                tx_builder = await contract.methods.buy(tokenId.toString());
                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();
                let gasLimit = await web3.eth.estimateGas({
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    value: web3.utils.toHex(cryptoAmount),
                    data: encoded_tx
                });

                const txData = await web3.eth.sendTransaction({
                    gasPrice: web3.utils.toHex(gasPrice),
                    gas: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    value: web3.utils.toHex(cryptoAmount),
                    data: encoded_tx
                });

                if (txData.transactionHash) {
                    var paymentArr = {
                        email: loginData?.email,
                        user_id: loginData?.id,
                        txHash: txData.transactionHash,
                        amount: itemPrice,
                        to_address: from_address,
                        item_id: NFTDetails?.id
                    }
                    console.log(paymentArr);
                    buyItemAPI(paymentArr)
                } else {
                    toast.error('Something went wrong please try again3.');
                    setSpinLoader(0);
                    setDialogOpen(false);
                    return false;
                }

            } catch (err) {
                if (err.message.toString().split('insufficient funds')[1]) {
                    toast.error('Transaction reverted : ' + err.message)
                } else {
                    if (err.toString().split('execution reverted:')[1]) {
                        toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])
                    } else {
                        toast.error(err.message);
                    }
                }
                setSpinLoader(0);
                setDialogOpen(false);
                return false;
            }
        } else {
            toast.error('Please Connect to MetaMask.');
            setSpinLoader(0);
            setDialogOpen(false);
            return false;
        }
    }

    const buyItemAPI = async (data) => {
        let res = await buyItemAction(data);
        if (res.success) {
            toast.success(res.msg);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            toast.error(`Something went wrong! Please try again.`);
        }
    }

    const bidPlaced = async () => {
        if (!loginData?.id) {
            toast.error('Please login first!!');
        } else {
            let tokenId = NFTDetails.token_id;
            let tokenPrice = parseFloat(form?.bid_price).toFixed(6);
            if ((parseFloat(NFTDetails?.max_bid).toFixed(6)) >= tokenPrice) {
                setBiderror(1);
                setErrorMessage('Bid amount should be higher than max bid amount!!');
                return false;
            }
            setBiderror(0);
            setErrorMessage('');
            if (window.ethereum) {
                let web3 = new Web3(window.ethereum);
                let currentNetwork = web3.currentProvider.chainId;
                let chainId = config.chainId;
                if (currentNetwork !== chainId) {
                    toast.error('Please select BNB testnet network!');
                    return false;
                }
                try {
                    setSpinLoader(1);
                    setDialogOpen(true);
                    setModalopen(0);
                    tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
                    await placeBidNow(tokenId, tokenPrice);
                } catch (error) {
                    toast.error('Something went wrong please try again2.');
                    setSpinLoader(0);
                    setDialogOpen(false);
                    setModalopen(1);
                    return false;
                }
            } else {
                toast.error('Please Connect to MetaMask.');
                setSpinLoader(0);
                setDialogOpen(false);
                setModalopen(1);
                return false;
            }
        }
    }

    const placeBidNow = async (tokenId, tokenPrice) => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let web3 = new Web3(window.ethereum);
            var chainId = config.chainId;
            try {

                let contractAddress = `${config.marketplaceContract}`
                let from_address = accounts[0];
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                let tx_builder = '';
                tx_builder = await contract.methods.placeBid(tokenId.toString());
                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();
                let gasLimit = await web3.eth.estimateGas({
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    value: web3.utils.toHex(tokenPrice),
                    data: encoded_tx
                });

                const txData = await web3.eth.sendTransaction({
                    gasPrice: web3.utils.toHex(gasPrice),
                    gas: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    value: web3.utils.toHex(tokenPrice),
                    data: encoded_tx
                });

                if (txData.transactionHash) {
                    var paymentArr = {
                        "email": loginData?.email,
                        "bid_price": parseFloat(form?.bid_price).toFixed(6),
                        "user_id": loginData?.id,
                        "item_id": NFTDetails?.id,
                        "owner_id": NFTDetails?.owner_id,
                        "payable_address": from_address,
                        "txhash": txData.transactionHash
                    }
                    bidPlaceAPI(paymentArr)
                } else {
                    toast.error('Something went wrong please try again3.');
                    setSpinLoader(0);
                    setDialogOpen(false);
                    setModalopen(1);
                    return false;
                }

            } catch (err) {
                if (err.message.toString().split('insufficient funds')[1]) {
                    toast.error('Transaction reverted : ' + err.message)
                } else {
                    if (err.toString().split('execution reverted:')[1]) {
                        toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])
                    } else {
                        toast.error(err.message);
                    }
                }
                setSpinLoader(0);
                setDialogOpen(false);
                setModalopen(1);
                return false;
            }
        } else {
            toast.error('Please Connect to MetaMask.');
            setSpinLoader(0);
            setDialogOpen(false);
            setModalopen(1);
            return false;
        }
    }

    const bidPlaceAPI = async (paymentArr) => {
        let res = await bidPlaceAPIAction(paymentArr);
        if (res.success) {
            toast.success(res.msg);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            toast.error(`Something went wrong! Please try again.`);
        }
    }

    const bidItem = async () => {
        if (!loginData?.id) {
            toast.error('Please login first!!');
        }
        setModalopen(1);
    }

    const getTimeOfStartDate = (dateTime) => {
        var date = new Date(dateTime); // some mock date
        var milliseconds = date.getTime();
        return milliseconds;
    }

    const CountdownTimer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return "Starting";
        } else {
            // Render a countdowns
            var dayPrint = (days > 0) ? days + 'd' : '';
            return <span>{dayPrint} {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s</span>;
        }
    };


    const closebutton = async () => {
        setModalopen(0);
    }

    const inputHandler = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    return (
        <div className='item-details'>
            <Toaster />
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">NFT Details</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <Countdown
                date={getTimeOfStartDate(NFTDetails.expiry_date)}
                renderer={CountdownTimer()}
            /> */}
            {console.log(NFTDetails.expiry_date)}
            <div className="tf-section tf-item-details style-2">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-xl-6 col-md-12">
                            <div className="content-left">
                                <div className="media">
                                    {NFTDetails?.file_type == 'image' ?
                                        <img src={`${config.ipfsUrl + NFTDetails?.image}`} />
                                        :
                                        NFTDetails?.file_type == 'video' ?
                                            <video muted autoPlay playsInline loop>
                                                <source src={`${config.ipfsUrl + NFTDetails?.image}`} type="video/mp4" />
                                            </video>
                                            :
                                            ''
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <div className="content-right">
                                <div className="sc-item-details">
                                    <div className="meta-item">
                                        <div className="left">
                                            <h2>{NFTDetails?.title}</h2>
                                        </div>
                                        <div className="right">
                                            {loginData?.id ?
                                                <span to="#" onClick={() => nftLike(NFTDetails.isLike ? NFTDetails.isLike : '0', NFTDetails.id)} className="wishlist-button">
                                                    <i class="fa fa-heart" style={{ color: NFTDetails.isLike ? 'red' : '#fff' }} aria-hidden="true"></i> &nbsp; <span className="number-like">{NFTDetails.itemLike}</span>
                                                </span>
                                                :
                                                <span>
                                                    <Link to={`${config.baseUrl}login`} className="wishlist-button heart">
                                                        <span className="number-like">{NFTDetails.itemLike}</span>
                                                    </Link>
                                                </span>
                                            }
                                        </div>
                                    </div>
                                    <div className="client-infor sc-card-product">
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    {!NFTDetails?.owner_profile || NFTDetails?.owner_profile == null || NFTDetails?.owner_profile == 'null' ?
                                                        <img src="images/default-user-icon.jpg" alt="Owner Profile" />
                                                        :
                                                        <img src={`${config.imageUrl + NFTDetails?.owner_profile}`} alt="Owner Profile" />
                                                    }
                                                </div>
                                                <div className="info">
                                                    <span>Owned By</span>
                                                    <h6> <Link to="#">{NFTDetails?.owner_name}</Link> </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="meta-info">
                                            <div className="author">
                                                <div className="avatar">
                                                    {!NFTDetails?.creater_profile || NFTDetails?.creater_profile == "null" || NFTDetails?.creater_profile == null ?
                                                        <img src="images/default-user-icon.jpg" alt="Owner Profile" />
                                                        :
                                                        <img src={`${config.imageUrl + NFTDetails?.creater_profile}`} alt="Creater Profile" />
                                                    }
                                                </div>
                                                <div className="info">
                                                    <span>Create By</span>
                                                    <h6> <Link to="#">{NFTDetails?.creater_name}</Link> </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p>{NFTDetails?.description}</p>
                                    <div className="meta-item-details">
                                        <div className="item-style-2 item-details d-flex">
                                            <ul className="list-details">
                                                <li><span>Created Date : </span></li>
                                                <li><span>Category : </span> </li>
                                                <li><span>Token ID : </span> </li>
                                                <li><span>Price : </span></li>
                                                <li><span>Royalty : </span></li>
                                                <li><span>NFT Type : </span></li>
                                            </ul>
                                            <ul className="list-details">
                                                <li><span>{NFTDetails?.datetime}</span> </li>
                                                <li><span>{NFTDetails?.category_name}</span> </li>
                                                <li><span>#{NFTDetails?.token_id}</span> </li>
                                                <li><span>{NFTDetails?.price} BNB</span> </li>
                                                <li><span>{NFTDetails?.royalty_percentage} %</span> </li>
                                                <li><span>{NFTDetails?.nft_type == 1 ? 'Digital' : 'Physical'}</span> </li>
                                            </ul>
                                        </div>

                                        <div className="item-style-2 item-details">
                                            <a target="_blank" href={`${config.blockchainViewTokenId + NFTDetails?.token_id}`}>
                                                <button className="detailsPageBtn">Blockchain View</button>
                                            </a>
                                            <br /><br />
                                            {loginData.id == NFTDetails.owner_id && NFTDetails.is_sold == 0 ?
                                                <>
                                                    <i style={{ fontSize: '25px' }} class="fa fa-exclamation-circle" data-tip={`You are the owner of this NFT`} aria-hidden="true"></i>
                                                    <ReactTooltip /> &nbsp;
                                                </> : ''
                                            }
                                            <div className='countdown-timer-nft mb-3'>
                                                {NFTDetails.is_sold === 1 ?

                                                    "" :
                                                    NFTDetails?.sell_type == 2 ?
                                                        <>
                                                            <h5>Sale Ends In:</h5>&nbsp;&nbsp;
                                                            <div className="timer2">
                                                                <Countdown
                                                                    date={getTimeOfStartDate(NFTDetails.expiry_date)}
                                                                    renderer={CountdownTimer}
                                                                />
                                                                {console.log(NFTDetails.expiry_date)}
                                                            </div>
                                                        </>
                                                        :
                                                        ''


                                                }
                                            </div>

                                            {/* {NFTDetails?.sell_type == 2 ?
                                                new Date(NFTDetails.start_date) > new Date() ?
                                                    <>
                                                        <p> Sale start from {NFTDetails.start_date} </p>
                                                    </>
                                                    :
                                                    new Date(NFTDetails.expiry_date) > new Date() ?
                                                        <>
                                                            <p> Sale end in {NFTDetails.expiry_date} </p>
                                                        </>
                                                        :
                                                        new Date(NFTDetails.expiry_date) < new Date() ?
                                                            <>
                                                                <p> Sale End </p>
                                                            </>
                                                            : ""
                                                : ""
                                            } */}
                                            {
                                                loginData.id ?
                                                    connectWalletAddress ?
                                                        NFTDetails.nft_type === 2 ?
                                                            NFTDetails.status === 0 || NFTDetails?.status == 2 ?
                                                                <><button className="detailsPageBtn" style={{ cursor: NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id ? 'not-allowed' : '', background: NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id ? 'gray' : '', }} disabled={spinLoader || NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id || NFTDetails == 1 || NFTDetails?.is_on_sale == 0 ? true : false} onClick={handleShow}>Sent request to owner</button>
                                                                    <br />
                                                                    <br />
                                                                </>
                                                                :
                                                                loginData.id == NFTDetails.owner_id ?

                                                                    <button className='detailsPageBtn' style={{
                                                                        cursor: loginData.id == NFTDetails.owner_id ? 'not-allowed' : '', background: NFTDetails.is_sold === 1 ||
                                                                            NFTDetails.status === 0 || NFTDetails?.status == 2 || loginData.id == NFTDetails.owner_id ? 'gray' : ''
                                                                    }} disabled={NFTDetails.owner_id} >Sent request to owner</button> : ''
                                                            :

                                                            NFTDetails.is_sold === 1 ?
                                                                <p style={{ color: 'red' }} className='sold'>Sold Out</p> :
                                                                NFTDetails.sell_type === 1 ?
                                                                    <button className="detailsPageBtn" style={{ cursor: NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id ? 'not-allowed' : '', background: NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id ? 'gray' : '', }} disabled={spinLoader || NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id || NFTDetails == 1 || NFTDetails?.is_on_sale == 0 ? true : false} onClick={() => purchaseItem(NFTDetails.sell_type)} >
                                                                        {spinLoader == 1 ? 'Processing...' : `Buy for ${NFTDetails?.price} BNB`}</button>
                                                                    :
                                                                    <>
                                                                        <button className="detailsPageBtn" style={{ background: loginData.id == NFTDetails.owner_id ? 'gray' : '', }} disabled={spinLoader || new Date(NFTDetails.start_date) > new Date() || new Date(NFTDetails.expiry_date) < new Date() || NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id || NFTDetails?.is_on_sale == 0 ? true : false} onClick={() => bidItem()}>
                                                                            {spinLoader == 1 ? 'Processing...' : `Place Bid`}
                                                                        </button>
                                                                        <br />
                                                                        <br />
                                                                    </>
                                                        :
                                                        <button onClick={() => connectMetasmask()} className="detailsPageBtn">Connect Wallet</button>
                                                    :
                                                    <a href={`${config.baseUrl}login`}>
                                                        <button className="detailsPageBtn">Login</button>
                                                    </a>
                                            }
                                            {/* Payment mode of Physical NFT */}
                                            {
                                                loginData.id ?
                                                    connectWalletAddress ?
                                                        NFTDetails.nft_type === 2 ?
                                                            NFTDetails.status === 1 && loginData.id != NFTDetails.owner_id ?
                                                                NFTDetails.sell_type === 1 ?
                                                                    <>
                                                                        <button className="detailsPageBtn" style={{ cursor: NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id ? 'not-allowed' : '', background: NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id ? 'gray' : '', }} disabled={spinLoader || NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id || NFTDetails == 1 || NFTDetails?.is_on_sale == 0 ? true : false} onClick={() => purchaseItem(NFTDetails.sell_type)} >
                                                                            {spinLoader == 1 ? 'Processing...' : `Buy Physical ${NFTDetails?.price} BNB`}</button>

                                                                    </>
                                                                    :
                                                                    <>
                                                                        <button className="detailsPageBtn" style={{ background: loginData.id == NFTDetails.owner_id ? 'gray' : '', }} disabled={spinLoader || new Date(NFTDetails.start_date) > new Date() || new Date(NFTDetails.expiry_date) < new Date() || NFTDetails.is_sold === 1 || loginData.id == NFTDetails.owner_id || NFTDetails?.is_on_sale == 0 ? true : false} onClick={() => bidItem()}>
                                                                            {spinLoader == 1 ? 'Processing...' : `Place Bid`}
                                                                        </button>
                                                                        <br />
                                                                        <br />
                                                                    </>
                                                                :
                                                                ''
                                                            :
                                                            ""
                                                        :
                                                        ""
                                                    :
                                                    ""

                                            }
                                        </div>
                                    </div>
                                    <div className="flat-tabs themesflat-tabs">
                                        <Tabs>
                                            <TabList>
                                                <Tab>History</Tab>
                                            </TabList>
                                            <TabPanel>
                                                <ul className="bid-history-list">
                                                    {
                                                        NFTHistory.map((item, index) => (
                                                            <li key={index} item={item}>
                                                                <div className="content">
                                                                    <div className="client">
                                                                        <div className="sc-author-box style-2">
                                                                            <div className="author-avatar">
                                                                                {!item.user_profile || item.user_profile == null || item.user_profile == 'null' ?
                                                                                    <img src="images/default-user-icon.jpg" alt="Owner Profile" />
                                                                                    :
                                                                                    <img src={`${config.imageUrl + item.user_profile}`} alt="Axies" className="avatar" />
                                                                                }
                                                                            </div>
                                                                            <div className="author-infor">
                                                                                <div className="name">
                                                                                    <h6>{item.user_name}</h6> <span> {item.transaction_type}</span>
                                                                                </div>
                                                                                <span className="time">{item.created_date}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="price">
                                                                        <span> {parseFloat(Math.abs(item.amount)).toFixed(6)} BNB</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </TabPanel>
                                        </Tabs>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="myModal" className={modalopen == '0' ? "modal fade cart-modal" : "modal fade cart-modal show"} role="dialog" style={{ background: '0% 0% / cover rgba(6, 6, 6, 0.32)', display: modalopen == '0' ? 'none' : 'block' }}
                data-backdrop="false">
                <div className="modal-dialog modal-dialog-centered" style={{ margin: 'auto', marginTop: '15px' }}>
                    <div className="modal-content">
                        <div className="" style={{ borderBottom: "1px solid transparent" }}>
                            <button type="button" onClick={closebutton} className="close btnClose" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body" style={{ padding: '0px' }}>
                            <div className="">
                                <div className="col-sm-12">
                                    <div className="">
                                        <div className="">
                                            <h4 className="strong payment-method-options">Offer Method</h4>
                                        </div><br />
                                        <div className="tab-wrapper style-1">
                                            <div className="tabs-content clearfix">
                                                <div class="tab-info active" style={{ display: 'block' }}>
                                                    <div className="col-12 mt-3">
                                                        <strong>Your offer must be greater than: {NFTDetails?.max_bid} BNB </strong>
                                                    </div>
                                                    <div className="col-12 mt-3">
                                                        <input type="text" placeholder="Enter amount" onKeyPress={(event) => {
                                                            if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }} id="bidAmountCC" name="bid_price" className='form-control inputs' onChange={inputHandler} required="" />
                                                        {Biderror == 1 ?
                                                            <p style={{ color: 'red' }}>Bid price should be greater than {NFTDetails?.max_bid}</p> : ''
                                                        }
                                                    </div>
                                                    <div className="mt-4">
                                                        <div className="col-12 nopadding">
                                                            <span style={{ color: 'red', fontFamily: 'cursive', textAlign: 'center' }}>{ErrorMessage}</span>
                                                            <div className="my-3 text-center">
                                                                {(spinLoader) ?
                                                                    <button className="btn-main btn-lg mb-3" title="Place Bid"
                                                                        mptrackaction="nux:giveapproval" disabled>Processing...</button>
                                                                    :
                                                                    <button className="btn-main btn-lg mb-3" disabled={!form.bid_price} title="Place Bid"
                                                                        mptrackaction="nux:giveapproval"
                                                                        onClick={bidPlaced}>Place Bid</button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title><h3>Contact</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Message</Form.Label><br /><br />
                            <span className="validationErr">{validatioError.bioError}</span>
                            <Form.Control type="text"
                                name="description" id='bioError' onChange={inputHandlers}
                                placeholder="Message" rows={3} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className='detailsPageBtn' onClick={insertDetailPhysicalNft}>
                        Send
                    </button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </div>
    );
}

export default NFTDetails;
