import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link } from 'react-router-dom'
import { getNFTListByUserAction, cancelOrderAction, putOnSaleAction, updateStatusAction } from '../Action/user.action';
import config from '../config';
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";
import Countdown, { zeroPad } from 'react-countdown';
import Modal from 'react-modal';
import moment from "moment";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const Portfolio = () => {
    let subtitle;
    const [NFTList, setNFTList] = useState([]);
    const [isPutonsale, setisPutonsale] = useState(0);
    const [itemDetails, setItemDetails] = useState([]);
    const [spinLoader, setSpinLoader] = useState(0);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [blockchainUpdationType, setblockchainUpdationType] = useState(0);
    const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));
    const [walletAddress, setwalletAddress] = useState('');

    useEffect(async () => {
        getNFTListAPI();

        // setInterval(async () => {
        //     if (window.ethereum) {
        //         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //         setwalletAddress(accounts[0])
        //     }
        // }, 1000);
    }, []);

    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }

    const editStatus = async (e, item) => {
        e.preventDefault()
        Swal.fire({
            title: "Are you sure?",
            text: "You want to Update the status!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ffa11e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Updated it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await updateStatusAction({ 'owner_id': item.owner_id, 'token_id': item.token_id, 'status': item.status == 0 ? 1 : 0 });
                if (res.success) {
                    getNFTListAPI();
                    Swal.fire("Updated!", res.msg, "success");
                } else {
                    Swal.fire("Failed!", res.msg, "error");
                }
            }
        });
    }

    const getNFTListAPI = async () => {
        let res = await getNFTListByUserAction();
        if (res.success) {
            setNFTList(res.data);
        }
    }

    const putOnSaleModelAPI = async (item) => {
        setisPutonsale(1);
        setItemDetails(item);
    }

    const closeModel = async () => {
        setisPutonsale(0);
    }


 

    const approveNFT = async (itemDetails, cancelType = 0) => {
        if (window.ethereum) {
            let web3 = '';
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            let walletAdd = accounts[0];
            if (!walletAdd) {
                toast.error('Please connect your metamask wallet.');
                return;
            } else if (itemDetails.owner_address && walletAdd.toUpperCase() != itemDetails.owner_address.toUpperCase()) {
                toast.error(`Please select (${itemDetails?.owner_address.substring(0, 8) + '...' + itemDetails?.owner_address.substr(itemDetails?.owner_address.length - 8)}) address to your metamask wallet.`);
                return;
            }
            let from_address = accounts[0];
            var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
            var currentBal = parseFloat(getBalace).toFixed(6)
            if (currentBal == 0) {
                toast.error(`Insufficient fund!!`);
                return false;
            }

            let currentNetwork = await web3.currentProvider.chainId;
            web3.eth.defaultAccount = accounts[0];
            let chainId = config.chainId;
            console.log(currentNetwork, chainId);
            if (currentNetwork !== chainId) {
                toast.error('Please select BNB testnet smartchain!!');
                return false;
            }
            setSpinLoader(1);
            setisPutonsale(0);
            setDialogOpen(true);
            try {
                let mintFee = 0;
                let SalePrice;
                let start_date = 0;
                let expiry_date = 0;
                let tokenId = itemDetails.token_id;

                if (itemDetails.sell_type == 1) {
                    SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString()
                }

                else if (itemDetails.sell_type == 2) {
                    SalePrice = parseInt(parseFloat(itemDetails.price) * (10 ** 18)).toString();
                    start_date = Math.round(new Date(itemDetails.start_date).getTime() / 1000);
                    expiry_date = Math.round(new Date(itemDetails.expiry_date).getTime() / 1000);
                }

                let contractAddress = `${config.marketplaceContract}`
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                if (cancelType == 1) {
                    setblockchainUpdationType(2)
                    await contract.methods.cancelOrder(tokenId.toString()).call();
                    var tx_builder = await contract.methods.cancelOrder(tokenId.toString());
                } else {
                    setblockchainUpdationType(1)
                    if (itemDetails.is_minted == 1) {
                        await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();
                        var tx_builder = await contract.methods.updateDetails(tokenId.toString(), SalePrice.toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());
                    } else {
                        await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();
                        var tx_builder = await contract.methods._mint(tokenId.toString(), SalePrice.toString(), (itemDetails.royalty_percent * 100).toString(), itemDetails.sell_type.toString(), start_date.toString(), expiry_date.toString());
                    }
                }
                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();
                gasPrice = parseInt(gasPrice) + parseInt(10000000000);
                let gasLimit = await web3.eth.estimateGas({
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    from: from_address,
                    value: web3.utils.toHex(mintFee),
                    chainId: chainId,
                    data: encoded_tx
                });
                const txData = await web3.eth.sendTransaction({
                    gasPrice: web3.utils.toHex(gasPrice),
                    gas: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    from: from_address,
                    value: web3.utils.toHex(mintFee),
                    chainId: chainId,
                    data: encoded_tx
                });
                if (txData.transactionHash) {
                    let dataArr = {
                        "wallet_address": from_address,
                        "user_id": loginData.id,
                        "item_id": itemDetails.id,
                        "token_hash": txData.transactionHash
                    }
                    let res;
                    if (cancelType) {
                        res = await cancelOrderAction(dataArr);
                    } else {
                        res = await putOnSaleAction(dataArr);
                    }
                    if (res.success === true) {
                        setDialogOpen(false);
                        toast.success(res.msg);
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        toast.error(res.msg);
                    }
                } else {
                    toast.error('Something went wrong please try again.');
                    setSpinLoader(0);
                    setisPutonsale(0);
                    setDialogOpen(false);
                    return false;
                }
            } catch (err) {
                console.log(err);
                if (err.message.toString().split('insufficient funds')[1]) {
                    toast.error('Transaction reverted : ' + err.message)
                } else {
                    if (err.toString().split('execution reverted:')[1]) {
                        toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

                    } else {
                        if (err.toString().split('execution reverted:')[1]) {
                            toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])
                        } else {
                            toast.error(err.message);
                        }
                    }
                }

                setSpinLoader(0);
                setisPutonsale(0);
                setDialogOpen(false);
                return false;
            }
        } else {
            toast.error('Please connect your metamask wallet.');
            setSpinLoader(0);
            setisPutonsale(0);
            setDialogOpen(false);
            return false;
        }
    }

    const cancelNftOrder = async (item) => {
        approveNFT(item, 1)
        // confirmAlert({
        //     title: 'Confirm to submit',
        //     message: 'Are you sure want to cancel this order?.',
        //     buttons: [
        //         {
        //             label: 'Yes',
        //             onClick: () =>
        //                 approveNFT(item, 1)
        //         },
        //         {
        //             label: 'No',
        //         }
        //     ]
        // });
    }

    return (
        <div className='auctions'>
            <Toaster />

            <Modal
                isOpen={isDialogOpen}
                onAfterOpen={afterOpenModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="text-center pl-3 pr-3">
                    < br />
                    {blockchainUpdationType == 1 ?
                        <h4 style={{ color: '#ffa11e', fontSize: '16px' }}>
                            Put on sale in progress, once process completed NFT will be display on marketplace page.
                        </h4>
                        :
                        blockchainUpdationType == 2 ?
                            <h4 style={{ color: '#ffa11e', fontSize: '16px' }}>
                                Canceling your listing will unpublish this sale from Victus Token and requires a transaction.
                            </h4>
                            :
                            <h4 style={{ color: '#ffa11e', fontSize: '16px' }}>
                                Bid accepting in progress, Please wait for a while.
                            </h4>
                    }

                    <p style={{ color: '#ffa11e' }}>
                        Please do not refresh page or close tab.
                    </p>
                    <div>
                        <img src="images/loader.gif" height={50} width={50} />
                    </div>
                </div>
            </Modal>

            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Portfolio</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="tf-section ">
                <div className="themesflat-container">
                    <div className="row">

                        {NFTList.map((item) => (
                            <div className="fl-item col-xl-3 col-lg-6 col-md-6">
                                <div className="sc-card-product nft">
                                    {item.is_on_sale == 1 ?
                                        <button onClick={() => { cancelNftOrder(item, 1) }} className='btn-sm btn-primary' data-toggle="modal" data-target="#putOnSale">Cancel Listing</button>
                                        :
                                        <>
                                            <button onClick={() => { putOnSaleModelAPI(item) }} className='btn-sm btn-primary' data-toggle="modal" data-target="#putOnSale">Put On Sale</button>
                                            &nbsp;
                                            <Link to={`${config.baseUrl}edit-nft/` + item.id} >
                                                <button className='btn-sm btn-primary'>Edit</button>
                                            </Link>
                                        </>
                                    }
                                    {/* {
                                        item.is_on_sale == 1 ?
                                            item.nft_type === 2 ?
                                                item.status == 0 ?
                                                    ''
                                                    :
                                                    <button onClick={(e) => editStatus(e, item)} className='btn-sm btn-primary' data-toggle="modal" data-target="#putOnSale">Active</button>
                                                :
                                                ''
                                            :
                                            ''
                                    } */}
                                    <div className="card-media">
                                        <Link to={`${config.baseUrl}nft-details/` + item.id}>
                                            {item.file_type == 'image' ?
                                                <img src={`${config.ipfsUrl + item.image}`} />
                                                :
                                                item.file_type == 'video' ?
                                                    <video muted autoPlay playsInline loop style={{height:"100%"}}>
                                                        <source src={`${config.ipfsUrl + item.image}`} type="video/mp4" />
                                                    </video>
                                                    :
                                                    ''
                                            }
                                            {/* <img src={`${config.ipfsUrl + item.image}`} alt="axies" /> */}
                                        </Link>
                                    </div>
                                    <div className="card-title">
                                        <h5><Link to={`${config.baseUrl}nft-details/` + item.id}>{item.name}</Link></h5>
                                    </div>
                                    <div className="meta-info">
                                        <div className="author">
                                            <div className="avatar">
                                                {!item.owner_profile || item.owner_profile == null || item.owner_profile == 'null' ?
                                                    <img src="images/default-user-icon.jpg" alt="owner profile" />
                                                    :
                                                    <img src={`${config.imageUrl + item.owner_profile}`} alt="owner profile" />
                                                }
                                            </div>
                                            <div className="info">
                                                <span>Category</span>
                                                <h6> <Link to="/authors-02">{item.category_name}
                                                </Link> </h6>
                                            </div>
                                        </div>
                                        <div className="price">
                                            <span>Price</span>
                                            <h5>{parseFloat(item.price).toFixed(6)} BNB</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Put on sale model */}
            <div className={isPutonsale === 0 ? "modal fade" : "modal fade show"} id="putOnSale" style={{ display: isPutonsale === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel"> Put On Sale </h5>
                            <a type="button" className="close" data-dismiss="modal" style={{
                                fontSize: '26px'
                            }} aria-label="Close" onClick={closeModel} >
                                <span aria-hidden="true">&times;</span>
                            </a>
                        </div>
                        <div className="modal-body">
                            <div className="de_tab tab_methods">
                                <div className="de_tab_content">
                                    <span style={{ color: '#ffa11e' }}>List price and listing schedule can not be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price. </span><br /><br />
                                    {itemDetails?.sell_type === 1 ?
                                        <>
                                            <h5>Price (BNB)</h5>
                                            <input type="text" disabled value={itemDetails?.price} name="price" id="item_price_bid" className="form-control" placeholder="Enter Price" />
                                        </>
                                        :
                                        itemDetails?.sell_type === 2 ?
                                            <>
                                                <div className="row" style={{ lineHeight: '22px' }}>
                                                    <div className="col-md-6">
                                                        <h5>NFT Type</h5>
                                                        Auction
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h5>Minimum bid</h5>
                                                        {itemDetails?.price} BNB
                                                    </div>
                                                </div>
                                                <br />
                                                <div className="spacer-10" />
                                                <div className="row" style={{ lineHeight: '22px' }}>
                                                    <div className="col-md-6">
                                                        <h5>Starting date</h5>
                                                        {moment(itemDetails?.start_date ? itemDetails?.start_date : '').format("DD/MM/YYYY")}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h5>Expiration date</h5>
                                                        {moment(itemDetails?.expiry_date ? itemDetails?.expiry_date : '').format("DD/MM/YYYY")}

                                                    </div>
                                                    <div className="spacer-single" />
                                                </div>
                                            </>
                                            :
                                            ""
                                    }
                                </div>
                            </div>
                            <div className="spacer-10 mt-10" />
                            {spinLoader == '0' ?
                                <input type="submit" onClick={() => { approveNFT(itemDetails) }} value="Approve" id="submit" className="btn-main" defaultValue="Create Item" />
                                :
                                <button disabled className="btn-main" id="deposit-page" >Processing &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                            }
                            <div className="spacer-single" />
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Portfolio;
