import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import toast, { Toaster } from 'react-hot-toast';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Swal from "sweetalert2";
import Web3 from 'web3';

import { getProfileAction, deleteUserCategoryAction, getUserCategoryAction, getCategoryShopPriceAction, InsertCategoryAction, updateCategoryAction, getcategorybyidAction } from '../Action/user.action';
import config from '../config';
const CreateCategory = () => {
    const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));
    const [userCategoryList, setuserCategoryList] = useState([]);
    const [userDetails, setuserDetails] = useState({});
    const { id } = useParams();
    const [UpdateCategory, setUpdateCategory] = useState({});
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [shopPrice, setShopPrice] = useState('');
    const handleClose = () => setShow(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = (item) => {
        setShow1(true);
        setUpdateCategory({
            id: item.id,
            name: item.name
        })
    }
    let [responseData, setResponseData] = useState('')
    const [connectWalletAddress, setConnectWalletAddress] = useState('');
    const handleShow = () => setShow(true);
    const [validatioError, setvalidatioError] = useState({});
    const [isLoading, setisLoading] = useState(false);
    const [form, setForm] = useState({ 'name': '', 'user_id': loginData?.id })
    const [form1, setForm1] = useState({ user_id: "", name: "" });
    const [spinloader, setspinloader] = useState(0);

    
    useEffect(() => {
        getProfileAPI();
        getCategoryAPI();
        getBNBToUsd();
        getCategoryShopPriceAPI();
    }, []);
    const getCategoryShopPriceAPI = async () => {
        let res = await getCategoryShopPriceAction();
        if (res.success) {
            setShopPrice(res.data);
        }
    };
    const columnsCategory = [
        {
            key: "sn",
            text: "S.no.",
            cell: (row, index) => index + 1
        },
        {
            key: "name",
            text: "Name",
            cell: (item) => {
                return (
                    item.name
                );
            }
        },
        {
            key: "action",
            text: "Action",
            cell: (item) => {
                return (
                    <>
                        <button className='sale-list btn btn-primary' onClick={() => handleShow1(item)} data-toggle="modal" data-target="#productShareSheet">Edit</button>
                        &nbsp;    <button
                            type="button"
                            className="sale-list btn btn-primary"
                            id="editbtnid"
                            onClick={() => deleteUserCategory(item.id)}
                        >
                            Delete
                        </button>{" "}
                    </>
                );
            }
        },
    ];

    const category = {
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
    const connectMetasmask = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setConnectWalletAddress(accounts);
        }
        else {
            toast.error(`Please use dApp browser to connect wallet!`);
        }
    }

    const deleteUserCategory = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to Delete this Category!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await deleteUserCategoryAction({ id: id });
                if (res.success) {
                    getCategoryAPI();
                    Swal.fire("Deleted!", res.msg, "success");
                } else {
                    Swal.fire("Failed!", res.msg, "error");
                }
            }
        });
    };

    const getCategoryAPI = async () => {
        let res = await getUserCategoryAction({ 'user_id': loginData?.id, 'id': id });
        if (res.success) {
            setuserCategoryList(res.data)
        }
    }
    const getProfileAPI = async () => {
        let res = await getProfileAction({ 'user_id': loginData?.id, 'email': loginData?.email });
        if (res.success) {
            setuserDetails(res.data)
        }
    }

    const inputHandler = async (e) => {
        const { name, value, id } = e.target;
        setForm((old) => {
            return { ...old, [name]: value };
        })
        if (value != '') {
            setvalidatioError((old) => {
                return { ...old, [id]: '' }
            })
        }

    };
    const inputHandlers = (e) => {
        const { name, value, id } = e.target
        setUpdateCategory((old) => { return { ...old, [name]: value } })
        if (value != '') {
            setvalidatioError((old) => {
                return { ...old, [id]: '' }
            })
        }
    }

    function validates() {
        let nameError = "";
        if (UpdateCategory?.name === '') {
            nameError = "Name is required."
        }
        if (nameError) {
            setvalidatioError({
                nameError
            })
            return false
        } else {
            return true
        }
    }
    // const insertCategory = async (e) => {
    //     e.preventDefault()
    //     const isValid = validate();
    //     if (!isValid) {
    //     }
    //     else {
    //         setisLoading(true);
    //         let res = await InsertCategoryAction(form);
    //         if (res.success) {
    //             toast.success(res.msg);
    //             setTimeout(() => {
    //                 window.location.reload()
    //             }, 2000);
    //         } else {
    //             setisLoading(false);
    //             toast.error(res.msg);
    //         }
    //     }
    // }

    const updateCategory = async (e) => {
        e.preventDefault()
        const isValid = validates();
        if (!isValid) {
        } else {
            let res = await updateCategoryAction(UpdateCategory);
            if (res.success) {
                toast.success(res.msg);
                setTimeout(() => {
                    window.location.reload()
                }, 1200);
            } else {
                toast.error(res.msg);
            }
        }
    };

    const getBNBToUsd = async (e) => {
        await axios({
            method: 'get',
            url: `https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`,

        })
            .then((response) => {
                setResponseData(response.data.price)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const buy_category = async () => {
        let fees = shopPrice.price;
        
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
                var dollarprice = responseData;
                var usdInBNB = (parseFloat(fees) / parseFloat(dollarprice)).toFixed(6);
                                let feeCharge = parseFloat(fees) * parseFloat(usdInBNB) / 100;
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
                } else {
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


    const insertCategory = async (e) => {
        e.preventDefault()
        const isValid = validate();
        if (!isValid) {
        }
        else {
            setspinloader(1);
            let adminfeeTrx = await buy_category();
            if (adminfeeTrx) {
                form.txhash = adminfeeTrx 
                let res = await InsertCategoryAction(form);
                if (res.success) {
                    toast.success(res.msg);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    setspinloader(0);
                    toast.error(res.msg);
                }
            } else {
                setspinloader(0);
                toast.error('Something went wrong please try again.');
            }
        }
    }

    function validate() {
        let nameError = "";
        if (form.name === '') {
            nameError = "Name is required."
        }
        if (nameError) {
            setvalidatioError({ nameError })
            return false
        } else {
            return true
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
                                <h1 className="heading text-center">Category</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-section transactionlist">
                <div className="container">
                    <div className='add-category'>
                        <div className="row mt-4">
                            <h3 className='heading '>Category List</h3>
                        </div>
                        <button onClick={handleShow}>Add +</button>
                    </div>
                    <div className="row mt-4">
                        <ReactDatatable
                            config={category}
                            records={userCategoryList}
                            columns={columnsCategory}
                        />
                    </div>
                </div>
            </section>
            <Footer />
            {/* Modal for Insert Category */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Name</Form.Label><br /><br />
                            <Form.Control type="text"
                                name="name" id='nameError' onChange={inputHandler}
                                placeholder="Name" rows={3} />
                            <span className="validationErr">{validatioError.nameError}</span>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {
                        connectWalletAddress ?
                            spinloader == '0' ?
                                <Button className='btn btn-primary btn-lg' onClick={insertCategory}>Submit</Button>
                                :
                                <Button disabled className='btn btn-primary btn-lg' >Creating Category <i className="fa fa-spinner fa-spin validat"></i></Button>
                            :
                            <Button onClick={() => connectMetasmask()} className="btn btn-primary btn-lg">Connect Wallet</Button>
                    }
                    {/* <Button variant="primary" onClick={insertCategory}>
                        Submit
                    </Button> */}
                </Modal.Footer>
            </Modal>



            {/* Modal for Update Category */}
            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Name</Form.Label><br /><br />
                            <span className="validationErr">{validatioError.nameError}</span>
                            <Form.Control type="text"
                                name="name" id='nameError'
                                value={UpdateCategory?.name}
                                onChange={inputHandlers}
                                placeholder="Name" rows={3} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={updateCategory}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
}

export default CreateCategory;
