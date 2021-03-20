import Head from "next/head";
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useUser } from "../lib/hooks";

import styles from '../styles/iconButton.module.css'

import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
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
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [isNewTopicPopupShown, setIsNewTopicPopupShown] = useState(false);
    const [newTopicName, setNewTopicName] = useState(topics[0].name);

    const [topicErrorMessage, setTopicErrorMessage] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [currentTopics, setCurrentTopics] = useState([]);

    const router = useRouter()

    useUser();

    async function createLogin(event) {
        event.preventDefault();
        // event.stopPropagation();

        const form = event.currentTarget;

        setValidated(true); // to start showing validation prompts

        if (form.checkValidity() === false) return;

        // send the post
        const topicIds = currentTopics.map((el) => el.id);

        if (topicIds.length === 0) return setTopicErrorMessage("Please, select at least one topic");

        const postData = { title, description, topicIds };
        console.log(postData);

        const response = await fetch("/api/createPost", {
            method: "POST",
            credentials: "same-origin",
            "headers": {

                "content-type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify(postData)
        });
        const res = await response.json(); // parses JSON response into native JavaScript objects
        console.log(res);
        if (res?.done === true) return setIsSuccessful(true);
        // else, we ran into an error
        return setTopicErrorMessage("There was an error, please try later");
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
                    <Form.Control placeholder="Enter a title" required maxLength={100} value={title} onChange={e => setTitle(e?.target?.value)} />
                    <Form.Control.Feedback type="invalid">
                        Please enter a title
                    </Form.Control.Feedback>
                </Form.Group>


                {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}

                <Form.Group controlId="formBasicDescription">
                    <Form.Label>Your description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Enter a description" maxLength={1000} value={description} onChange={e => setDescription(e?.target?.value)} />
                </Form.Group>

                <div className="container">
                    <div className="row">
                        {
                            currentTopics.map((value, index) => {
                                return <Card className="col-md-auto m-1 text-center" key={index}>{value.name}</Card>
                            })
                        }
                        <div className={`col-md-auto m-1 ${styles.iconButton}`} style={{ height: "30px", padding: "10px" }}>
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
                {topicErrorMessage ?
                    <Form.Text className="text-danger">
                        {topicErrorMessage}
                    </Form.Text>
                    : null}

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>

            {/* On success modal */}
            <Modal
                show={isSuccessful}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        The post was created
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Your post was successfully created and you can now leave this page
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => router.back()}>Ok</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
