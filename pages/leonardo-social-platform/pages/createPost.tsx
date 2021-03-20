import Head from "next/head";
import Image from 'next/image'

import { useUser } from "../lib/hooks";

import styles from '../styles/iconButton.module.css'

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useState } from "react";

import { server } from "../lib/config";

export async function getStaticProps(context) {
    const res = await fetch(`${server}/api/getTopics`);
    const topics = await res.json()
    return {
        props: { topics },
    }
}

export default function CreatePost({ topics }) {
    const [validated, setValidated] = useState(false);
    const [isNewTopicPopupShown, setIsNewTopicPopupShown] = useState(false);
    const [newTopicName, setNewTopicName] = useState(topics[0].name);

    const [topicErrorMessage, setTopicErrorMessage] = useState("");

    const [currentTopics, setCurrentTopics] = useState([]);

    useUser();

    async function createLogin(event) {
        event.preventDefault();
        // event.stopPropagation();

        const form = event.currentTarget;

        setValidated(true); // to start showing validation prompts

        if (form.checkValidity() === false) return;

        // send the post
        const postData = {};
        console.log(postData);
    }

    function addTopic() {
        setIsNewTopicPopupShown(false);

        console.log(newTopicName);
        const newTopic = topics.find(el => el.name === newTopicName);
        console.log(newTopic);

        // if not recognized, return
        if (!newTopic) return;

        // if already used, return
        if (currentTopics.includes(newTopic)) return setTopicErrorMessage("This topic has already been added");

        setCurrentTopics(currentTopics.concat([newTopic])); // can not use push because it is not reactive
        setTopicErrorMessage("");
    }

    // the actual code
    return (
        <div className="container">
            <Head>
                <title>Create a post</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Form noValidate validated={validated} onSubmit={createLogin}>
                <Form.Group controlId="formBasicTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control placeholder="Enter a title" required maxLength="100" />
                    <Form.Control.Feedback type="invalid">
                        Please enter a title
                    </Form.Control.Feedback>
                </Form.Group>


                {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}

                <Form.Group controlId="formBasicDescription">
                    <Form.Label>Your description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Enter a description" maxLength="1000" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>

            <div className="container">
                <div className="row">
                    {
                        currentTopics.map((value, index) => {
                            return <Card className="col-md-auto m-1 text-center" key={index}>{value.name}</Card>
                        })
                    }
                    <div className={`col-md-auto m-1 ${styles.iconButton}`} style={{ height: "20px" }}>
                        <OverlayTrigger
                            trigger="click"
                            placement="bottom"
                            rootClose
                            onToggle={e => setIsNewTopicPopupShown(e)}
                            show={isNewTopicPopupShown}
                            overlay={
                                <Popover id="popover-positioned-bottom">
                                    <Popover.Title as="h3">Add a topic</Popover.Title>
                                    <Popover.Content>
                                        <Form.Control as="select" value={newTopicName} onChange={params => setNewTopicName(params?.target?.value)}>
                                            {topics.map((value, index) => {
                                                return <option key={index}>{value.name}</option>
                                            })}
                                        </Form.Control>
                                        <Button className="mt-2" variant="primary" onClick={addTopic}>
                                            Add
                                        </Button>
                                    </Popover.Content>
                                </Popover>
                            }
                        >
                            <Image
                                src="/plus-circle.svg"
                                alt="Add a topic"
                                layout="fill"
                            />
                        </OverlayTrigger>

                    </div>
                </div>
            </div>
            { topicErrorMessage ?
                <Form.Text className="text-danger">
                    {topicErrorMessage}
                </Form.Text>
                : null}
        </div>
    );
}
