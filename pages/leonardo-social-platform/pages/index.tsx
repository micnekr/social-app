import Head from "next/head";
import { useUser } from "../lib/hooks";

import Card from 'react-bootstrap/Card';

export default function Home() {

  // useUser();
  // the actual code

  return (
    <div className="container">
      <Head>
        <title>Feed</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
          </Card.Text>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
      </Card>
    </div>
  );
}
