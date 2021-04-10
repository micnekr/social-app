import { createHandlers } from "../../lib/rest-utils";

import type { NextApiRequest, NextApiResponse } from "next";

import { connectToDatabase } from "../../lib/mongodbUtils";

const handlers = {
  GET: async (req, res) => {
    res.status(200).json(await getTopics());
  },
};

export async function getTopics() {
  // await connectToDatabase();
  return [
    { id: 1, name: "travel" },
    { id: 2, name: "school" },
    { id: 3, name: "work" },
    { id: 4, name: "hobby" },
    { id: 5, name: "pets" },
    { id: 6, name: "art" },
    { id: 7, name: "games" },
    { id: 8, name: "films" },
    { id: 9, name: "sport" },
    { id: 10, name: "outdoor activities" },
    { id: 11, name: "photography" },
    { id: 12, name: "books" },
    { id: 13, name: "music" },
  ];
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const handler = createHandlers(handlers);
  return handler(req, res);
};
