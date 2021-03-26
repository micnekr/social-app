import Head from "next/head";

import Router from 'next/router'

import Spinner from 'react-bootstrap/Spinner';

import styles from '../styles/spinner.module.css'

export default function Logout({ getUserDataMutate }) {
    // only run on client
    if (typeof window === "undefined") return;

    // so that it is non-blocking

    async function runLogOut() {

        const response = await fetch("/api/logout", {
            "method": "GET",
            "headers": {

                "content-type": "application/json",
                "accept": "application/json",
            },
            "credentials": "same-origin",
        })
        await getUserDataMutate();
        Router.push("/login");
    }

    try {
        runLogOut();
    } catch (err) {
        console.error(err);
    }

    // the actual code

    return (
        <div className="container">
            <Head>
                <title>Log out</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="d-flex justify-content-center">
                <Spinner className={`${styles.waitSpinner} d-flex justify-content-center`} animation="border" role="status" />
            </div>
        </div>
    );
}
