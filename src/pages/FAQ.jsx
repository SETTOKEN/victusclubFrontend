import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Accordion } from 'react-bootstrap-accordion'
import { faqsAction } from '../Action/user.action';

const FAQ = () => {
    const [faqs, setfaqs] = useState([]);

    useEffect(() => {
        faqsAPI()
    }, []);

    const faqsAPI = async () => {
        let res = await faqsAction();
        if (res.success) {
            setfaqs(res.data);
        }
    }

    const [data] = useState(
        [
            {   key: "0",
                show: "show",
                title: 'What is an NFT?',
                text: 'NFTs or non-fungible tokens, are cryptographic assets on blockchain with unique identification codes and metadata that distinguish them from each other. NFTs are unique and not mutually interchangeable, which means no two NFTs are the same.'
            },
            {
                key: "1",
                title: 'Customer support is available ?',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
            },
            {
                key: "2",
                title: 'How do I find my transaction hash?',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
            },
            {
                key: "3",
                title: 'What are gas fees on Axies?',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
            },
            {
                key: "4",
                title: 'What is the effective staking amount?',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'
            },
        ]
    )
    return (
        <div>
            <Header />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">FAQs</h1>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <section className="tf-section wrap-accordion">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="tf-title-heading ct style-2 fs-30 mg-bt-10">
                                Frequently Asked Questions
                            </h2>
                        </div>
                        <div className="col-md-12">
                            <div className="flat-accordion2">
                                {
                                    faqs.map((item,index) => (
                                        <Accordion key={index} title={item.question} >
                                            <p>{item.answer}</p>
                                        </Accordion>
                                    ))
                                }                             
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default FAQ;
