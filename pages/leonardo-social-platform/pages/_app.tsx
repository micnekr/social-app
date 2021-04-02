import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import Link from 'next/link'

import useSWR from "swr";
import { jsonOrErrorText } from "../lib/rest-utils";

const fetcher = (url) =>
  fetch(url)
    .then((r) => jsonOrErrorText(r))
    .then((data) => {
      return { user: data?.user || null };
    });

function MyApp({ Component, pageProps }) {

  const { data, mutate } = useSWR("/api/getUserData", fetcher);

  pageProps.getUserDataMutate = mutate;
  pageProps.userData = data;

  return <>
    <Navbar bg="dark" variant="dark">
      <Link href={"/"} passHref>
        <Navbar.Brand>Navbar</Navbar.Brand>
      </Link>
      <Nav className="mr-auto">
        <Link href={"/"} passHref>
          <Nav.Link>Home</Nav.Link>
        </Link>
      </Nav>
      <Link href={data?.user ? "/logout" : "/login"} passHref>
        <Button variant="outline-info">{data?.user ? "Log out" : "Log in"}</Button>
      </Link>
    </Navbar>
    <div className="container mainContainer">
      <div className="row">
        <div className="col-11 mx-auto"></div>
        <Component {...pageProps} />
      </div>
    </div>
    {/* <footer className="footer bg-dark"><h1>Footer</h1></footer> */}
  </>
}

export default MyApp
