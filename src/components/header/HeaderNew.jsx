import React, { Component, useEffect } from 'react'
import config from '../../config';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import $ from 'jquery';
import ScrollToTop from "react-scroll-to-top";
import { Button, Container, Form, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';

const loginData = (!Cookies.get('loginSuccessStarWallet')) ? [] : JSON.parse(Cookies.get('loginSuccessStarWallet'));
let p = 0;
const HeaderNew = () => {
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: 'en,zh-CN,id,vi,ja,ko',
        autoDisplay: false
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    if(p == 0){
      var addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
      p++;
    }
  }, [])

  useEffect(() => {
    let url = window.location.href;
    let result = url.split('/');
    let Param = result[result.length - 1];

    if (Param == 'login' || Param == 'forgetpassword' || Param == 'nftdetail' || Param == 'signup' || Param == 'faq' || Param == 'privacypolicy' || Param == 'tos' || Param == 'nftdetail') {
      $('header').css({ 'box-shadow': 'rgb(164 166 166) 0px 0px 6px 0px', 'background-color': '#000', position: 'relative' });
    }
    let getUrl = url.split('#');
    if (getUrl[1]) {
      if (getUrl[1]) {
        $("#" + getUrl[1] + '1')[0].click();
      }
    }
    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 50) {
        $("header").addClass("fixed-bg-white");
      } else {
        $("header").removeClass("fixed-bg-white");
      }
    });
  }, [])
  return (
    <>
      <header>
        <ScrollToTop />
        <>
          {['lg'].map((expand) => (
            <Navbar key={expand} bg="transparent" expand={expand} className="mb-0">
              <Container>
                <Link to={`${config.baseUrl}`} >
                  <Navbar.Brand><img className="atom" src="assets/images/logo.png" width="100px" /></Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                <Navbar.Offcanvas
                  id={`offcanvasNavbar-expand-${expand}`}
                  aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                  placement="end"
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                      <img class="atom" src="assets/images/logo.png" width="100px" />
                    </Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                      <Nav.Link href="#home" id='home1'>Home</Nav.Link>
                      <Nav.Link href="#about" id='about1'>About</Nav.Link>
                      <Nav.Link href="#buynft" id='buynft1'>Buy NFTs</Nav.Link>
                      <Nav.Link href={`${config.baseUrl}faq`}>FAQs</Nav.Link>
                      <div id="google_translate_element"></div>
                    </Nav>
                    {!loginData?.email ?
                      <>
                        <a href={`${config.baseUrl}login`}>
                          <Button variant="primary">Login</Button>
                        </a> &nbsp;&nbsp;&nbsp;
                        <a href={`${config.baseUrl}signup`}>
                          <Button variant="primary">Sign up</Button>
                        </a>
                      </>
                      :
                      <Link to={`${config.baseUrl}dashboard`}>
                        <Button variant="primary">Dashboard</Button>
                      </Link>
                    }
                  </Offcanvas.Body>
                </Navbar.Offcanvas>
              </Container>
            </Navbar>
          ))}
        </>
      </header>



    </>

  )

}
export default HeaderNew;