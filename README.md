# SP3
The actual database part of this assignment was pretty straight-forward. It's been a while since I've worked with React, I've only done Next.js one time in a previous assignment, and I've never worked with TypeScript before.

## Setup
The sharding cluster is set up locally using incrementing ports. It would be nicer to use Docker, but I don't know how to do that yet. Below are the ports I used.

- `mongos`: 27021
- `config`: 27022
- `mongod`: 27023-27025

I only used a single server per shard replica set for simplicitiy's sake, and I ran 3 shards.

I used Next.js because we'd already used it a previous exercise and it enabled me to make a full-stack application, so I didn't have to worry about setting up both backend and frontend separately.

## Actual answers to questions in the assignment.
1. *What is sharding in mongoDB?*

Sharding is when you distribute the contents of the database across several different servers. It's useful if you have a lot of data and keeping all of it on the same server would stretch the limitations of the hardware. You can then scale horizontally and add more servers that share the load.

2. *What are the different components required to implement sharding?*

You need shard servers. `mongod` instances with the `--shardsvr` option. They also need to be a part of a replica set, but they can be the only member.

Then you need a config server to manage the instances running on different hosts.

Lastly, you need a `mongos` instance, the router, which is the entry point for interacting with the shard cluster.

3. *Explain architecture of sharding in mongoDB?*

I cannot. I'm not entirely sure what it is you expect from this question. But I'll try.

If you mean the architecture of the server instances, the shard servers contain chunks of the data, and the config contains metadata and configuration data. You interact with the `mongos` router which figures out where to send the data or retrieve it from.

Mongo uses a balancer to evenly distribute the chunks across the shards.

You can use **hashed sharding** where the shard keys are hashed. data close in similarity has no reason to also be close in hash. As a result, data is more evenly distributed.

**Ranged sharding** doesn't use a hash to decide which chunk data belongs in, but instead a range of the shard key. Data will be less evenly distributed but data closer in similarity is more likely to be in the same chunk. You can probably setup regional distribution this way.

4. *Provide implementation of map and reduce function.*

Map-reduce is deprecated, and I'm not sure how this is question is different from the next.

5. *Provide execution command for running MapReduce or the aggregate way of doing the same.*

Aggregation pipelines are how you do grouping and aggregations in MongoDB. Below is the pipeline I constructed. It's pretty simple.

```javascript
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
```

A tweet can have more than one hashtag, so we `$unwind` the array so that each element of the array becomes its own document going into the next stage. Then use a convenient stage called `sortByCount`. It's an easy way to combine `$group` with the `$count` accumulator, followed a `$sort` descending. We group by the text of the hashtag because the indices didn't seem consistent across tweets. Finally, we `$limit` the results to 10.

6. *Provide top 10 recorded out of the sorted result. (hint: use sort on the result returned by MapReduce or the aggregate way of doing the same).*

I had to spin up all the servers again for this.

```
{
  "_id": "FCBLive",
  "count": 27
}

{
  "_id": "AngularJS",
  "count": 21
}

{
  "_id": "nodejs",
  "count": 20
}

{
  "_id": "LFC",
  "count": 19
}

{
  "_id": "EspanyolFCB",
  "count": 18
}

{
  "_id": "IWCI",
  "count": 16
}

{
  "_id": "webinar",
  "count": 16
}

{
  "_id": "GlobalMoms",
  "count": 14
}

{
  "_id": "javascript",
  "count": 14
}

{
  "_id": "RedBizUK",
  "count": 12
}
```

7. *Explain how you could introduce redundancy to the setup above.*

Like previously mentioned, I only used 1 server per shard replica set. You can use more for reduncancy so that if the primary goes down, another can take over. This improves uptime in case a server dies.

You can do the same with config servers. There can also be multiple of these in a replica set.

**FIN**

Below is the original README from the Next.js MongoDB example.

***

## Example app using MongoDB

[MongoDB](https://www.mongodb.com/) is a general purpose, document-based, distributed database built for modern application developers and for the cloud era. This example will show you how to connect to and use MongoDB as your backend for your Next.js app.

If you want to learn more about MongoDB, visit the following pages:

- [MongoDB Atlas](https://mongodb.com/atlas)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Deploy your own

Once you have access to the environment variables you'll need, deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?project-name=with-mongodb&repository-name=with-mongodb&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-mongodb&integration-ids=oac_jnzmjqM10gllKmSrG0SGrHOH)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example with-mongodb with-mongodb-app
```

```bash
yarn create next-app --example with-mongodb with-mongodb-app
```

```bash
pnpm create next-app --example with-mongodb with-mongodb-app
```

## Configuration

### Set up a MongoDB database

Set up a MongoDB database either locally or with [MongoDB Atlas for free](https://mongodb.com/atlas).

### Set up environment variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

- `MONGODB_URI` - Your MongoDB connection string. If you are using [MongoDB Atlas](https://mongodb.com/atlas) you can find this by clicking the "Connect" button for your cluster.

### Run Next.js in development mode

```bash
npm install
npm run dev

# or

yarn install
yarn dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000)! If it doesn't work, post on [GitHub discussions](https://github.com/vercel/next.js/discussions).

You will either see a message stating "You are connected to MongoDB" or "You are NOT connected to MongoDB". Ensure that you have provided the correct `MONGODB_URI` environment variable.

When you are successfully connected, you can refer to the [MongoDB Node.js Driver docs](https://mongodb.github.io/node-mongodb-native/3.4/tutorials/collections/) for further instructions on how to query your database.

## Deploy on Vercel

You can deploy this app to the cloud with [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

#### Deploy Your Local Project

To deploy your local project to Vercel, push it to GitHub/GitLab/Bitbucket and [import to Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example).

**Important**: When you import your project on Vercel, make sure to click on **Environment Variables** and set them to match your `.env.local` file.

#### Deploy from Our Template

Alternatively, you can deploy using our template by clicking on the Deploy button below.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?project-name=with-mongodb&repository-name=with-mongodb&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-mongodb&integration-ids=oac_jnzmjqM10gllKmSrG0SGrHOH)
