import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import Link from 'next/link'

function MyApp({ Component, pageProps }) {
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
      <Link href={"/login"} passHref>
        <Button variant="outline-info">Log in</Button>
      </Link>
    </Navbar>
    <div className="container mainContainer">
      <div className="row">
        <div className="col-11 mx-auto"></div>
        <Component {...pageProps} />
      </div>
    </div>
  </>
}

export default MyApp
