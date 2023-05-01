import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../lib/mongodb";

export async function postPost(post) {
    const client = await clientPromise;
    const db = client.db("twitter");

    const result = await db.collection("posts").insertOne(post);
    return result;
}

export async function getPosts() {
    const client = await clientPromise;
    const db = client.db("twitter");

    const result = await db.collection("posts").find().sort({ createdAt: -1 }).toArray();
    return result;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        let result;
        if (req.method === "GET") {
            result = await getPosts();
        }
        else if (req.method === "POST") {
            const user = req.body;
            result = await postPost(user);
        }
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
}