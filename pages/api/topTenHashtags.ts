import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../lib/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("twitter");

        const result = await db.collection("tweets").aggregate([
            {
                '$unwind': {
                    'path': '$entities.hashtags'
                }
            }, {
                '$sortByCount': '$entities.hashtags.text'
            }, {
                '$limit': 10
            }
        ])
            .toArray();

        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
}