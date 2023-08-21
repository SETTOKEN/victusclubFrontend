import React, { useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Link, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import moment from "moment";
import ReactDatatable from '@ashvin27/react-datatable';
import 'react-tabs/style/react-tabs.css';
import Swal from "sweetalert2";
import { getProfileAction, getPhysicalRequestAction, userPhysicalRejectApproveAction } from '../Action/user.action';
import config from '../config';

const Physicalrequest = () => {
    const loginData = (!Cookies.get('loginSuccessScarlettUserpanel')) ? [] : JSON.parse(Cookies.get('loginSuccessScarlettUserpanel'));
    const [userCategoryList, setuserCategoryList] = useState([]);
    const [userDetails, setuserDetails] = useState({});
    const { id } = useParams();
    useEffect(() => {
        getProfileAPI();
        getPhysicalRequest()
    }, []);

    const columnsCategory = [
        {
            key: "sn",
            text: "S.no.",
            cell: (row, index) => index + 1
        },
        {
            key: "image",
            text: "Image",
            cell: (item) => {
                return (
                    <>
                        {

                            !item?.image || item?.image == null || item?.image == 'null' ?
                                <img src="images/default-user-icon.jpg" style={{width:"50px" , height:"50px"}} alt="image" />
                                :
                                <img src={`${config.ipfsUrl + item?.image}`} style={{width:"50px" , height:"50px"}} alt="Owner Profile" />

                        }
                    </>

                );
            }
        },
        {
            key: "description",
            text: "Detail",
            cell: (item) => {
                return (
                    item.description
                );
            }
        },

        {
            key: "action",
            text: "Action",
            cell: (item) => {
                return (
                    <>
                        <button className='sale-list btn btn-primary' onClick={() => userPhysicalRejectApprove(item, 1)} data-toggle="modal" data-target="#productShareSheet">Accept</button>
                        &nbsp; <button className='sale-list btn btn-primary' onClick={() => userPhysicalRejectApprove(item, 2)} data-toggle="modal" data-target="#productShareSheet">Reject</button>
                    </>
                );
            }
        },
        {
            key: "status",
            text: "Status",
            cell: (item) => {
                return (
                    <>
                        {
                            item.status == 0 ?
                                <p style={{ color: '#ca7e15' }}>Pending</p>
                                :
                                item.status == 1 ?
                                    <p style={{ color: 'green' }}>Accepted</p>
                                    :
                                    item.status == 2 ?
                                        <p style={{ color: 'red' }}>Rejected</p>
                                        :
                                        ''
                        }
                    </>
                );
            }
        },
        {
            key: "datetime",
            text: "Date",
            cell: (item) => {
                return `${moment(item.datetime).format("DD/MM/YYYY")}`;
            }
        }
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


    const getPhysicalRequest = async () => {
        let res = await getPhysicalRequestAction({ 'owner_id': loginData?.id, 'id': id });
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


    const userPhysicalRejectApprove = async (item, status) => {
        Swal.fire({
            title: 'Are you sure?',
            text: status == 1 ? "You want to Accept this request!" : "You want to Reject this request!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ffa11e',
            cancelButtonColor: '#d33',
            confirmButtonText: status == 1 ? 'Yes, Accept it!' : 'Yes, Reject it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let res = await await userPhysicalRejectApproveAction({ 'physical_id': item.id, 'user_id': item.user_id, 'item_id': item.item_id, 'status': status });
                if (res.success) {
                    getPhysicalRequest();
                    Swal.fire(
                        status == 1 ? 'Accepted' : 'Rejected',
                        res.msg,
                        'success'
                    )
                } else {
                    Swal.fire(
                        'Failed!',
                        res.msg,
                        'error'
                    )
                }
            }
        })
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
                                <h1 className="heading text-center">Physical NFT Request</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tf-section transactionlist">
                <div className="container">
                    <div className="row ">
                        <div className='add-category'>
                            <h3 className='heading '>Request list</h3>
                        </div>
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
        </div>

    );
}

export default Physicalrequest;
