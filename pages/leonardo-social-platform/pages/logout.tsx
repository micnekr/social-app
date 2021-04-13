import Head from "next/head";

import Router from 'next/router'

import Spinner from 'react-bootstrap/Spinner';

import styles from '../styles/spinner.module.css'

import { server } from "../lib/config";

export default function Logout({ userData, getUserDataMutate }) {

    // so that it is non-blocking
    async function runLogOut() {
        if (!userData?.user) return Router.push("/login");
        const response = await fetch(`${server}/api/logout`, {
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
    if (typeof (window) !== "undefined") {
        try {
            runLogOut()
        } catch (err) {
            console.error(err);
            Router.push("/login");
        }
    }

    // the actual code

    return <div className="container">
        <Head>
            <title>Log out</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="d-flex justify-content-center">
            <Spinner className={`${styles.waitSpinner} d-flex justify-content-center`} animation="border" role="status" />
        </div>
    </div>;
}
