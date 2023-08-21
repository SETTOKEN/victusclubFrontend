import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import toast, { Toaster } from 'react-hot-toast';
import { getProfileAction, getBidPlacedHistoryAction, getNftBidReceivedHistoryAPIAction, viewNftBidDetailsAction, bidAcceptAction } from '../Action/user.action';
import Web3 from 'web3';
import config from '../config';

const BidsTransaction = () => {
    const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));
    const [getBidPlacedHistoryData, setgetBidPlacedHistoryData] = useState([]);
    const [getBidReceivedNftHistoryData, setgetBidReceivedNftHistoryData] = useState([]);
    const [getNftBidDetailsData, setgetNftBidDetailsData] = useState([]);
    const [bidDetails, setbidDetails] = useState(0);
    const [userDetails, setuserDetails] = useState({});
    const [isDialogOpen, setisDialogOpen] = useState(false);
    const [ownerAddress, setownerAddress] = useState(false);

    useEffect(() => {
        getBidPlacedHistoryAPI();
        getNftBidReceivedHistoryAPI();
        getProfileAPI();
    }, []);

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Bid Placed history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const getBidPlacedHistoryAPI = async () => {
        let res = await getBidPlacedHistoryAction({ 'user_id': loginData?.id, 'email': loginData?.email });
        if (res.success) {
            console.log(res.data);
            setgetBidPlacedHistoryData(res.data)
        }
    }

    const columnsForUserBid = [
        {
            key: "sn",
            text: "#",
            cell: (row, index) => index + 1
        },
        {
            key: "image",
            text: "Image",
            cell: (item) => {
                return (
                    <Link to={`${config.baseUrl}nft-details/` + item.item_id}>
                        <div className="image-circle">
                            <img src={`${config.ipfsUrl}` + item.image} width="60px" />
                        </div>
                    </Link>
                );
            }
        },

        {
            key: "item_name",
            text: "Title",
            sortable: true,
            cell: (item) => {
                return (
                    <Link to={`${config.baseUrl}nft-details/` + item.item_id}>
                        {item.item_name}
                    </Link>
                )
            }
        },

        {
            key: "owner_name",
            text: "Owner Name",
            cell: (item) => {
                return (
                    item.owner_name
                );
            }
        },

        {
            key: "item_price",
            text: "Reserve Price",
            cell: (item) => {
                return (
                    item.item_price + ' BNB'
                );
            }
        },

        {
            key: "max_bid",
            text: "Hightest Bid",
            cell: (item) => {
                return (
                    item.max_bid + ' BNB'
                );
            }
        },

        {
            key: "bid_price",
            text: "Your Bid",
            cell: (item) => {
                return (
                    item.bid_price + ' BNB'
                );
            }
        },

        {
            key: "status",
            text: "Status",
            cell: (item) => {
                return (
                    item.status
                );
            }
        },
    ];

    const configForUserBid = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        button: {
            excel: false,
            print: false

        }
    }

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Bid Receive history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const getNftBidReceivedHistoryAPI = async () => {
        let res = await getNftBidReceivedHistoryAPIAction({ 'user_id': loginData?.id, 'email': loginData?.email });
        if (res.success) {
            setgetBidReceivedNftHistoryData(res.data)
        }
    }

    const columnsForNftBidReceived = [
        {
            key: "sn",
            text: "#",
            cell: (row, index) => index + 1
        },
        {
            key: "image",
            text: "Image",
            cell: (item) => {
                return (
                    <Link to={`${config.baseUrl}nft-details/` + item.item_id}>
                        <div className="image-circle">
                            <img src={`${config.ipfsUrl}` + item.image} width="60px" />
                        </div>
                    </Link>
                );
            }
        },

        {
            key: "item_name",
            text: "Title",
            sortable: true,
            cell: (item) => {
                return (
                    <Link to={`${config.baseUrl}nft-details/` + item.item_id}>
                        {item.item_name}
                    </Link>
                )
            }
        },

        {
            key: "item_category",
            text: "Category Name",
            cell: (item) => {
                return (
                    item.item_category
                );
            }
        },

        {
            key: "item_price",
            text: "Reserve Price",
            cell: (item) => {
                return (
                    item.price + ' BNB'
                );
            }
        },

        {
            key: "max_bid",
            text: "Hightest Bid",
            cell: (item) => {
                return (
                    item.max_bid + ' BNB'
                );
            }
        },

        {
            key: "action",
            text: "Action",
            cell: (item) => {
                return (
                    <button onClick={() => viewNftBidDetails(item.item_id, item.owner_address)} className='sale-list btn btn-primary' data-toggle="modal" data-target="#productShareSheet">View Bids</button>
                );
            }
        },
    ];

    const configForNftBidReceived = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        button: {
            excel: false,
            print: false

        }
    }

    const viewNftBidDetails = async (id, owner_address) => {
        setownerAddress(owner_address);
        let res = await viewNftBidDetailsAction({ 'user_id': loginData?.id, 'email': loginData?.email, 'item_id': id });
        if (res.success) {
            setgetNftBidDetailsData(res.data);
            setbidDetails(1);
        }
    }

    const getProfileAPI = async () => {
        let res = await getProfileAction({ 'user_id': loginData?.id, 'email': loginData?.email });
        if (res.success) {
            setuserDetails(res.data)
        }
    }

    const modalShow = async (status) => {
        if (status === 1) {
            setbidDetails(0);
        }
        else if (status === 0) {
            setbidDetails(1);
        }
    }

    const BidAcceptAPI = async (itemData) => {
        let tokenId = itemData.token_id;
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let web3 = new Web3(window.ethereum);
            let currentNetwork = await web3.currentProvider.chainId;
            web3.eth.defaultAccount = accounts[0];
            let chainId = config.chainId;
            if (currentNetwork !== chainId) {
                toast.error('Please select BNB testnet smartchain!!');
                return false;
            }
            try {
                setisDialogOpen(true);
                // setbidDetails(0);
                let contractAddress = `${config.marketplaceContract}`
                let from_address = accounts[0];
                if (accounts[0].toLowerCase() != ownerAddress.toLowerCase()) {
                    toast.error(`Please select (${ownerAddress.substring(0, 8) + '...' + ownerAddress.substr(ownerAddress.length - 8)}) address to your metamask wallet.`);
                    setisDialogOpen(false);
                    setbidDetails(1);
                    return false;
                }
                const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
                let tx_builder = await contract.methods.acceptBid(tokenId.toString());
                let encoded_tx = tx_builder.encodeABI();
                let gasPrice = await web3.eth.getGasPrice();

                let gasLimit = await web3.eth.estimateGas({
                    gasPrice: web3.utils.toHex(gasPrice),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    data: encoded_tx
                });
                console.log(gasPrice);
                const txData = await web3.eth.sendTransaction({
                    gasPrice: web3.utils.toHex(gasPrice),
                    gas: web3.utils.toHex(gasLimit),
                    to: contractAddress,
                    from: from_address,
                    chainId: chainId,
                    data: encoded_tx
                });

                if (txData.transactionHash) {
                    let response = await bidAcceptAction({
                        'user_id': loginData?.id,
                        'email': loginData?.email,
                        'item_id': itemData.item_id,
                        "bid_id": itemData.bid_id,
                        "hash": txData.transactionHash,
                        'owner_address': 'owner_address'
                    });
                    if (response.success) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                        toast.success(response?.msg, {});
                    } else {
                        toast.error(response?.msg, {});
                        setbidDetails(1);
                    }
                } else {
                    toast.error('Something went wrong please try again3.');
                    setisDialogOpen(false);
                    setbidDetails(1);
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
                setisDialogOpen(false);
                setbidDetails(1);
                return false;
            }
        } else {
            toast.error('Please connect your metamask wallet which you set at the time of registration.');
            setisDialogOpen(false);
            setbidDetails(1);
            return false;
        }
    }

    return (
        <div className='auctions'>
            {/* <Toaster /> */}

            <Header />

            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Bids History</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="tf-section  transactionlist">
                <div className="container">
                    <div className="row">
                        <Tabs>
                            <TabList>
                                <Tab>Bid Placed</Tab>
                                <Tab>Bid Received</Tab>
                            </TabList>

                            <TabPanel>
                                <ReactDatatable
                                    config={configForUserBid}
                                    records={getBidPlacedHistoryData}
                                    columns={columnsForUserBid}
                                />
                            </TabPanel>

                            <TabPanel>
                                <ReactDatatable
                                    config={configForNftBidReceived}
                                    records={getBidReceivedNftHistoryData}
                                    columns={columnsForNftBidReceived}
                                />
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </section>

            <div className={bidDetails == 0 ? "modal fade" : "modal fade show"} id="productShareSheet" style={{ display: bidDetails == 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Bids Details</h5>
                            <button type="button" className="close bidsclose" data-dismiss="modal" style={{
                                fontSize: '26px'
                            }} aria-label="Close " onClick={() => modalShow(1)} >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div class="table-responsive">
                                <table class="table table-striped mb-0">
                                    <thead>
                                        <tr>

                                            <th>Image</th>
                                            <th>Username</th>
                                            <th>Title</th>
                                            <th>Bid Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getNftBidDetailsData.length === 0 ?
                                            <tr >
                                                <td colspan="6" className="text-center"><p>No data found!!</p></td></tr> :
                                            getNftBidDetailsData.map(item => (
                                                <tr>
                                                    <td>
                                                        {!item.profile_pic || item.profile_pic == '' || item.profile_pic == null || item.profile_pic == undefined || item.profile_pic == 'undefined' || item.profile_pic == 'null' ?
                                                            <img width="50px" height="50px" src={`images/default-user-icon.jpg`}></img>
                                                            :
                                                            <img width="50px" height="50px" src={`${config.imageUrl}` + item.profile_pic}></img>
                                                        }
                                                    </td>
                                                    <td>{item.first_name}</td>
                                                    <td>{item.item_name}</td>
                                                    <td>{item.bid_price} BNB</td>
                                                    <td>
                                                        {isDialogOpen ?
                                                            <button id={'acceptId' + item.bid_id} disabled className="btn text-center btn-primary">Processing...</button>
                                                            :
                                                            <button type='submit' id={'acceptId' + item.bid_id} onClick={() => BidAcceptAPI(item)} className="btn btn-primary text-center acceptId">Accept</button>
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default BidsTransaction;
