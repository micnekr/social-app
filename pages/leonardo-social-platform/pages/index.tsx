import Head from "next/head";

import { server } from "../lib/config";

import Card from 'react-bootstrap/Card';

import styles from '../styles/post.module.css'
import { getSession } from "../lib/auth-cookies";

export async function getServerSideProps(context) {
  const user = await getSession(context.req);
  console.log(user);


  const topicsRes = await fetch(`${server}/api/getTopics`);
  const topics = await topicsRes.json();

  if (user) { // show interesting topics if logged in
    const res = await fetch(`${server}/api/getAllPosts?postsNum=10`);
    const posts = (await res.json())?.posts;
    return {
      props: { posts, topics }
    }
  } else { // show all topics if not
    const res = await fetch(`${server}/api/getAllPosts?postsNum=10`);
    const posts = (await res.json())?.posts;
    return {
      props: { posts, topics }
    }
  }
}

export default function Home({ posts, topics }) {
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
              return <Card key={index} style={{ width: '18rem' }} className="col-3 m-2">
                <Card.Body>
                  <Card.Title className={`${styles.overflowText} mb-2`}><strong>{post.title}</strong></Card.Title>
                  <Card.Subtitle className="mb-2">By <span className={`${styles.overflowText} text-muted`}>{post.user.username}</span></Card.Subtitle>
                  <Card.Text className={styles.overflowText}>
                    {post.description}
                  </Card.Text>
                  {/* <Card.Link href="#">Card Link</Card.Link>
              <Card.Link href="#">Another Link</Card.Link> */}
                  <div className="container">
                    <div className="row">
                      {
                        // for each topic that is included
                        topics.filter(topic => post.topics.includes(topic.id)).map((topic, index) => {
                          return <Card className="col-md-auto m-1 text-center" key={index}>{topic.name}</Card>
                        })
                      }
                    </div>
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
