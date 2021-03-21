import Router from 'next/router'

import { Magic } from 'magic-sdk'

import styles from '../styles/spinner.module.css'

import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { createRef, useState } from "react";
import { useUser } from '../lib/hooks';

export default function LoginOrSignup({ getUserDataMutate }) {
    useUser({ redirectTo: '/', redirectIfFound: true })

    // state setup
    const [usernameInput, setUsernameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [showEmailNotFoundAlert, setShowEmailNotFoundAlert] = useState(false);
    const [showUsernameUsedAlert, setShowUsernameUsedAlert] = useState(false);

    async function checkIfUserExists(email) {
        const userExistsResponse = await fetch(`/api/checkEmailExists?email=${email}`);

        // check if there was an error
        if (userExistsResponse.status !== 200) throw Error(`Something went wrong with the status '${userExistsResponse.status}' with this response`);
        return (await userExistsResponse.json()).result;
    }

    async function checkIfUsernameUsed(username) {
        const userExistsResponse = await fetch(`/api/checkUsernameExists?username=${username}`);

        // check if there was an error
        if (userExistsResponse.status !== 200) throw Error(`Something went wrong with the status '${userExistsResponse.status}' with this response`);
        return (await userExistsResponse.json()).result;
    }

    async function doLogin(e) {
        e.preventDefault();

        if (isLoading) return;

        // get the fields
        const email = emailInput;

        try {
            setIsLoading(true);

            const isEmailUsed = await checkIfUserExists(email);

            // if it is a signup, notify
            if (!isEmailUsed) {

                // if just logging in, notify
                if (!isSignup) {
                    setShowEmailNotFoundAlert(true);
                    setIsSignup(true);
                    return;
                }

                // only sign up if the user wants to
                if (usernameInput === "") return;

                const isUsernameUsed = await checkIfUsernameUsed(usernameInput);

                setShowUsernameUsedAlert(isUsernameUsed);

                if (isUsernameUsed) return;
            }

            // now, logging in
            setIsSignup(false);

            const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
            const didToken = await magic.auth.loginWithMagicLink({ email });

            const response = await fetch("/api/login", {
                "method": "POST",
                "headers": {

                    "content-type": "application/json",
                    "accept": "application/json",
                    'Authorization': `Bearer ${didToken}`
                },
                "body": JSON.stringify({ email, username: usernameInput })
            })

            // check if there was an error
            if (response.status !== 200) throw Error(`Something went wrong with the status '${response.status}' with this response`);

            await getUserDataMutate();
            Router.push("/");
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
                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={usernameInput}
                            onChange={e => setUsernameInput(e.target.value)}
                            placeholder={isSignup ? "Enter your username if you want to sign up" : "This is not needed right now"}
                            readOnly={!isSignup} />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                            placeholder="Enter email" />
                    </Form.Group>
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
                {
                    showEmailNotFoundAlert ?
                        <Alert variant="dark" className={styles.signupAlert} onClose={() => setShowEmailNotFoundAlert(false)} dismissible>
                            <Alert.Heading>We could not find that email</Alert.Heading>
                            <p>
                                Are you trying to sign up? If so, please enter your username.
                            </p>
                        </Alert>
                        : null
                }
                {
                    showUsernameUsedAlert ?
                        <Alert variant="dark" className={styles.signupAlert} onClose={() => setShowUsernameUsedAlert(false)} dismissible>
                            <Alert.Heading>This username is already used</Alert.Heading>
                            <p>
                                Please choose a different username
                            </p>
                        </Alert>
                        : null
                }
            </div>
        </div>
    );
}
