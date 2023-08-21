import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable';
import { Container, Col } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


import { getUserPurchaseAPIAction, getUserSaleDataAPIAction, getUsertransactionsAPIAction } from '../Action/user.action';
import config from '../config';

const TransactionList = () => {
    const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));
    const [getUserPurchaseData, setgetUserPurchaseData] = useState([]);
    const [getUserSaleData, setgetUserSaleData] = useState([]);
    const [getUsertransactions, setgetUsertransactions] = useState([]);

    useEffect(() => {
        getUserPurchaseAPI();
        getUserSaleDataAPI();
        getUsertransactionsAPI();
    }, []);

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User purchase history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const columnsForPurchase = [
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
                            <img src={`${config.ipfsUrl}` + item.image} width="70px" />
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
            key: "price",
            text: "Amount",
            cell: (item) => {
                return (
                    Math.abs(item.price) + ' BNB'
                );
            }
        },
        {
            key: "nft_datetime",
            text: "Created Date",
            cell: (item) => {
                return (
                    item.nft_datetime
                );
            }
        },
        {
            key: "action",
            text: "Action",
            cell: (item) => {
                return (
                    item.transfer_hash ?
                        <a href={`${config.trxHash + item.transfer_hash}`} target="_blank">
                            <button className="btn-main2">Blockchain view</button>
                        </a>
                        : ""
                );
            }
        },
    ];

    const configForPurchase = {
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

    //  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   User Sale history >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    const columnsForSale = [
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
                            <img src={`${config.ipfsUrl}` + item.image} width="70px" />
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
            key: "price",
            text: "Amount",
            cell: (item) => {
                return (
                    Math.abs(item.price) + ' BNB'
                );
            }
        },

        {
            key: "nft_datetime",
            text: "Created Date",
            cell: (item) => {
                return (
                    item.nft_datetime
                );
            }
        },

    ];

    const configForSale = {
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

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>    All Transactions History >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const columnsForAllTransactions = [
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
                            <img src={`${config.ipfsUrl}` + item.image} width="70px" />
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
            key: "trxType",
            text: "Type",
            sortable: true
        },

        {
            key: "price",
            text: "Amount",
            cell: (item) => {
                return (
                    Math.abs(item.price) + ` BNB`
                );
            }
        },

        {
            key: "nft_datetime",
            text: "Created Date",
            cell: (item) => {
                return (
                    item.nft_datetime
                );
            }
        }


    ];

    const configForAllTransactions = {
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

    const getUserPurchaseAPI = async (id) => {
        let res = await getUserPurchaseAPIAction({ 'user_id': loginData?.id, 'email': loginData?.email, 'item_id': id });
        if (res.success) {
            setgetUserPurchaseData(res.data);
        }
    }

    const getUserSaleDataAPI = async (id) => {
        let res = await getUserSaleDataAPIAction({ 'user_id': loginData?.id, 'email': loginData?.email, 'item_id': id });
        if (res.success) {
            setgetUserSaleData(res.data);
        }
    }

    const getUsertransactionsAPI = async (id) => {
        let res = await getUsertransactionsAPIAction({ 'user_id': loginData?.id, 'email': loginData?.email, 'item_id': id });
        if (res.success) {
            setgetUsertransactions(res.data);
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
                                <h1 className="heading text-center">Transactions List</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="tf-section transactionlist">
                <div className="container">
                    <div className="row">
                        <Tabs>
                            <TabList>
                                <Tab>Purchase History</Tab>
                                <Tab>Sale History</Tab>
                                <Tab>All Transaction History</Tab>
                            </TabList>

                            <TabPanel>
                                <>

                                    <ReactDatatable
                                        config={configForPurchase}
                                        records={getUserPurchaseData}
                                        columns={columnsForPurchase}
                                    />
                                </>
                            </TabPanel>

                            <TabPanel>
                                <Container>
                                    <Col lg={12}>
                                        <ReactDatatable
                                            config={configForSale}
                                            records={getUserSaleData}
                                            columns={columnsForSale}
                                        />
                                    </Col>
                                </Container>
                            </TabPanel>

                            <TabPanel>
                                <Container>
                                    <Col lg={12}>
                                        <ReactDatatable
                                            config={configForAllTransactions}
                                            records={getUsertransactions}
                                            columns={columnsForAllTransactions}
                                        />
                                    </Col>
                                </Container>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default TransactionList;
