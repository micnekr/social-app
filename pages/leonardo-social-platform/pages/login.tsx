import Head from "next/head";

import LoginOrSignup from "../components/LoginOrSignup";

export default function Login({ getUserDataMutate }) {

    // the actual code

    return (
        <div className="container">
            <Head>
                <title>Log in</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LoginOrSignup getUserDataMutate={getUserDataMutate} isLogin />
        </div>
    );
}
