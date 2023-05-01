import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../lib/mongodb";

export type Hashtag = {
    _id: string;
    count: number;
}

export async function getHashtags() {
    const client = await clientPromise;
    const db = client.db("twitter");

    const result = db.collection("tweets").aggregate([
        {
            '$unwind': {
                'path': '$entities.hashtags'
            }
        }, {
            '$sortByCount': '$entities.hashtags.text'
        }, {
            '$limit': 10
        }
    ]);
    return result.toArray();
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const result = await getHashtags();
        res.json(result);
    }
    catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
}