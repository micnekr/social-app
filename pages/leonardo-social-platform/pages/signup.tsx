import Head from "next/head";

import LoginOrSignup from "../components/LoginOrSignup";

export default function Signup({ getUserDataMutate }) {

    // the actual code
    return (
        <div className="container">
            <Head>
                <title>Sign up</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LoginOrSignup getUserDataMutate={getUserDataMutate} />
        </div>
    );
}
