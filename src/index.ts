export * from "./MongoDB";
export * from "./MongoCollection";
export * from "./MongoConfig";
export * from "./models/WithId";
export * from "./models/FilterOf";
export * from "./models/UpdateOf";

// import { MongoDB } from "./MongoDB";
//
// const tryOut = async () => {
//   type User = {
//     name: string;
//     age: number;
//     email: string;
//   };
//   type POST = {
//     title: string;
//     content: string;
//   };
//   const db = MongoDB.connect({
//     apiKey: "",
//     dbName: "",
//     baseUrl: "",
//     schemaBuilder(db) {
//       return {
//         users: db.collection<User>("users"),
//         posts: db.collection<POST>("posts"),
//       };
//     },
//   });

//   const newUser = await db.users.insertOne({ name: "", age: 0, email: "" });
//   await db.users.updateOne({
//     filter: {
//       _id: {
//         $oid: newUser._id,
//       },
//     },
//     update: { $set: { name: "new name" } },
//   });
// };
