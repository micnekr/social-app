import Head from "next/head";
import Link from "next/link";

import { useState } from 'react';

import { server } from "../lib/config";

import Card from 'react-bootstrap/Card';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import styles from '../styles/post.module.css'
import { getSession } from "../lib/auth-cookies";
import VoteButton from "../components/VoteButton";

import { jsonOrErrorText } from "../lib/rest-utils";

export async function getServerSideProps(context) {
  const user = await getSession(context.req);
  console.log(user);

  const topicsRes = await fetch(`${server}/api/getTopics`);
  const topics = await jsonOrErrorText(topicsRes);

  if (context.query.topic) {
    let queryString = `${server}/api/getPosts?topic=${context.query.topic}&postsNum=10000&`;
    if (user) queryString += `uid=${user.id}`;
    const res = await fetch(queryString);
    const posts = (await jsonOrErrorText(res))?.posts;
    return {
      props: { posts, topics }
    }
  }

  let queryString = `${server}/api/getPosts?postsNum=10000&`;
  if (user) queryString += `uid=${user.id}`;
  const res = await fetch(queryString);
  const posts = (await jsonOrErrorText(res))?.posts;
  return {
    props: { posts, topics }
  }

}

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

export default function Home({ posts, topics, userData }) {
  const forceUpdate = useForceUpdate();

  const [needsToBeLoggedInModalShow, setNeedsToBeLoggedInModalShow] = useState(false);

  function voteUp(post) {
    vote(1, post)
  }

  function voteDown(post) {
    vote(-1, post)
  }

  async function vote(score, post) {
    console.log(userData)
    if (!userData?.user) return setNeedsToBeLoggedInModalShow(true) // if not logged in, show the error message

    const postId = post.pubId;
    const response = await fetch("/api/vote", {
      method: "POST",
      credentials: "same-origin",
      "headers": {

        "content-type": "application/json",
        "accept": "application/json",
      },
      body: JSON.stringify({ score, post: "a", postId })
    });
    const res = await jsonOrErrorText(response);
    if (response.status !== 200) return;
    if (score > 0) post.isUp = res.wasVoteAdded; // if upvote, set upvote button
    if (score < 0) post.isDown = res.wasVoteAdded; // if downvote, set downvote button
    post.score = res.newScore;
    forceUpdate()
  }

  // the actual code
  return (
    <div className="container">
      <Head>
        <title>Feed</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div className="row">
          {
            posts.map((post, index) => {
              return <Card key={index} style={{ width: '18rem' }} className="col-lg-3 col-12 m-2">
                <Card.Body>
                  <Link href={`/post?id=${post.pubId}`}>
                    <a className={styles.clickable}>
                      <Card.Title className={`${styles.overflowText} mb-2`}><strong>{post.title}</strong></Card.Title>
                    </a>
                  </Link>
                  <Card.Subtitle className="mb-2">By <span className={`${styles.overflowText} text-muted`}>{post.user.username}</span></Card.Subtitle>
                  <Card.Text className={styles.overflowText}>
                    {post.description}
                  </Card.Text>
                  <div className="container">
                    <div className="row">
                      {
                        // for each topic that is included
                        topics.filter(topic => post.topics.includes(topic.id)).map((topic, index) => {
                          return <Link href={`/?topic=${topic.id}`} key={index}>
                            <a className={styles.clickable}>
                              <Card className="col-md-auto m-1 text-center">{topic.name}</Card>
                            </a>
                          </Link>
                        })
                      }
                    </div>
                  </div>
                  {/*  */}

                  <div className="row mt-3">
                    <VoteButton className="col-auto" iconPath={`/thumbs-up${post.isUp ? "-fill" : ""}.svg`} onClick={() => voteUp(post)} alt="Like" height="10px" />
                    <div className={`${styles.likesNum} col-auto`}>{post.score}</div>
                    <VoteButton className="col-auto" iconPath={`/thumbs-down${post.isDown ? "-fill" : ""}.svg`} onClick={() => voteDown(post)} alt="Dislike" height="10px" />
                  </div>

                </Card.Body>
              </Card>
            })
          }
        </div>
      </div>

      {/* Needs to be logged in modal */}
      <Modal
        show={needsToBeLoggedInModalShow}
        onHide={() => setNeedsToBeLoggedInModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>You are not logged in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You need to be logged in to vote on posts
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setNeedsToBeLoggedInModalShow(false)}>
            Close
          </Button>
          <Link href="/login">
            <Button variant="primary">Go to login page</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
