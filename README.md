# Mongo-Rest-Client

[![npm version](https://img.shields.io/npm/v/mongo-rest-client?logo=npm&logoColor=fff)](https://www.npmjs.com/package/mongo-rest-client)

A MongoDB connector that uses fetch to communicate with DB. Fully type safe rest api based connector. Runs everywhere from NodeJS to Edge runtime.

# Features

- Fully Type-Safe Schema based connector
  - Instead of calling `db.collection("users").insertOne(...)`, you call `db.users.insertOne(UserObject)`
- No Crypto Module requried (Can run in both NodeJS and Edge Network (like Vercel))
- `Framework agnostic` - Run anywhere that runs JS
- Uses `fetch` api under-the-hood. So take advantage of caching in framework like NextJS

## Supported Functions

- [x] Find one document (`findOne`)
- [x] Find many documents (`findMany`)
- [x] Insert One Document (`insertOne`)
- [x] Insert Documents (`insertMany`)
- [x] Update One Document (`updateOne`)
- [x] Update Documents (`updateMany`)
- [x] Delete One Document (`deleteOne`)
- [x] Delete Documents (`deleteMany`)
- [ ] Aggregate Documents (todo)

# Usage

Create a db by passing `baseUrl` (of data api), `apiKey`, `dbName`, and a schemaBuilder (a function that takes db instance and return an object of `db.collection` (add type to this object to take full advantage of it))

```ts
// db.ts file
import { MongoDB } from "mongo-rest-client";
export const db = MongoDB.connect({
  baseUrl: process.env.mongoDBUrl,
  apiKey: process.env.mongoDBApiKey,
  dbName: process.env.mongoDBName,
  schemaBuilder: (db) => ({
    users: db.collection<User>("users"),
    posts: db.collection<Post>("posts"),
  }),
});

// use it anywhere
await db.users.insertOne(...) // typesafe
await db.users.updateOne(...) // typesafe filter and data
const user = db.users.findOne({
    postID: "something..." // Compile-time ERROR: postID does not exists in User
}) // typesafe Filter
const user = db.users.findOne({
  _id: {
    $oid: "valid mongo db id"
  } // MongoDB requires an ObjectID. Dont worry its typesafe
}) // typesafe Filter
```

# Limitations

`mongo-rest-client` uses the `Data API` from MongoDB. Hence, it has all the limitations of DataAPI like transactions. Read more here: https://www.mongodb.com/docs/atlas/app-services/data-api/openapi/
