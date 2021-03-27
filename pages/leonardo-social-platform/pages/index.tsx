import Head from "next/head";
import Link from "next/link";

import { useState } from 'react';

import { server } from "../lib/config";

import Card from 'react-bootstrap/Card';

import styles from '../styles/post.module.css'
import { getSession } from "../lib/auth-cookies";
import VoteButton from "../components/VoteButton";

export async function getServerSideProps(context) {
  const user = await getSession(context.req);
  console.log(user);
  console.log("user")

  const topicsRes = await fetch(`${server}/api/getTopics`);
  const topics = await topicsRes.json();

  if (context.query.topic) {
    const res = await fetch(`${server}/api/getPosts?topic=${context.query.topic}&postsNum=10`);
    const posts = (await res.json())?.posts;
    return {
      props: { posts, topics }
    }
  }

  let queryString = `${server}/api/getPosts?postsNum=10&`;
  if (user) queryString += `uid=${user.id}`;
  const res = await fetch(queryString);
  const posts = (await res.json())?.posts;
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

  function voteUp(post) {
    console.log(post)
    console.log("voteUp");
    vote(1, post)
  }

  function voteDown(post) {
    console.log("voteDown");
    vote(-1, post)
  }

  async function vote(score, post) {
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
    const res = await response.json();
    if (score > 0) post.isUp = res.wasVoteAdded; // if upvote, set upvote button
    if (score < 0) post.isDown = res.wasVoteAdded; // if downvote, set downvote button
    post.score = res.newScore;
    console.log(post)
    forceUpdate()
  }

  // the actual code
  console.log(posts);
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
                  <Link href="/post">
                    <a className={styles.clickable}>
                      <Card.Title className={`${styles.overflowText} mb-2`}><strong>{post.title}</strong></Card.Title>
                      <Card.Subtitle className="mb-2">By <span className={`${styles.overflowText} text-muted`}>{post.user.username}</span></Card.Subtitle>
                      <Card.Text className={styles.overflowText}>
                        {post.description}
                      </Card.Text>
                    </a>
                  </Link>
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
    </div>
  );
}
