import Router from 'next/router'

import { Magic } from 'magic-sdk'

import styles from '../styles/LoginOrSignup.module.css'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { createRef, useState } from "react";

export default function LoginOrSignup() {

    // state setup
    const emailInput = createRef();
    // const passwordInput = createRef();

    const [isLoading, setIsLoading] = useState(false);

    async function doLogin(e) {
        e.preventDefault();

        if (isLoading) return;

        // get the fields
        const email: string = emailInput.current.value;
        // const password: string = passwordInput.current.value;

        try {
            setIsLoading(true);

            const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
            const didToken = await magic.auth.loginWithMagicLink({ email });

            console.log(didToken);

            const response = await fetch("/api/login", {
                "method": "POST",
                "headers": {

                    "content-type": "application/json",
                    "accept": "application/json",
                    'Authorization': `Bearer ${didToken}`
                },
                "body": JSON.stringify({ email })
            })
            console.log("Response");
            console.log(response);

            // check if there was an error
            if (response.status !== 200) throw Error(`Something went wrong with the status '${response.status}' with this response`);

            // Router.push("/");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }

    }

    // the actual code

    return (
        <div className="row">
            <div className="col-8 mx-auto">
                <Form onSubmit={doLogin}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            ref={emailInput}
                            placeholder="Enter email" />
                    </Form.Group>

                    {/* <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password"
                                required
                                ref={passwordInput}
                                placeholder="Enter password" />
                            <Form.Text className="text-muted">
                                Never tell anyone your password
                    </Form.Text>
                        </Form.Group> */}
                    <Button disabled={isLoading} variant="primary" type="submit">
                        Submit
                        </Button>
                </Form>
                {
                    isLoading ?
                        <Spinner className={styles.waitSpinner} animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                        : null
                }
            </div>
        </div>
    );
}
