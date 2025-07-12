// require('dotenv').config();
// const express = require("express");
// const app = express();

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
// const cron = require("node-cron");
// const { MongoClient } = require("mongodb");

// // Use environment variables from .env
// const MONGO_URI = process.env.MONGO_URI;
// const DB_NAME = "newsbot";
// const COLLECTION_NAME = "news";
// const API_KEY = process.env.API_KEY;
// const API_URL = process.env.API_URL;
// const PORT = process.env.PORT || 5000;

// // List of UPSC-relevant topics to cache (as an array)
// const TOPICS = [
//   "polity",
//   "economy",
//   "governance",
//   "schemes",
//   "social issues",
//   "upsc",
//   "india",
//   "government",
//   "tech & science",
//   "international relations",
//   "environment",
// ];

// // Daily news query with all tags
// const DAILY_NEWS_QUERY = [
//   "india",
//   "government",
//   "policy",
//   "economy",
//   "tech & science",
//   "international relations",
//   "environment",
//   "governance",
//   "schemes",
//   "social issues",
//   "upsc"
// ].join(" OR ");


// // Fetch and cache news for all topics and daily news
// async function fetchAllTopicsNews() {
//   const client = new MongoClient(MONGO_URI);
//   try {
//     await client.connect();
//     const db = client.db(DB_NAME);
//     var collection = db.collection(COLLECTION_NAME);
    
//     // Fetch for each topic
//     for (const topic of TOPICS) {
//       const q = topic;
//       const url = `${API_URL}?apiKey=${API_KEY}&q=${encodeURIComponent(q)}&page=1&pageSize=50&language=en&sortBy=publishedAt`;
//       try {
//         const res = await fetch(url);
//         const data = await res.json();
//         if (data.articles) {
//           await collection.updateOne(
//             { topic: topic.toLowerCase() },
//             { $set: { topic: topic.toLowerCase(), articles: data.articles, updatedAt: new Date() } },
//             { upsert: true }
//           );
//           console.log(`[${new Date().toISOString()}] News updated for topic "${topic}" (${data.articles.length} articles)`);
//         } else {
//           await collection.updateOne(
//             { topic: topic.toLowerCase() },
//             { $set: { topic: topic.toLowerCase(), articles: [], updatedAt: new Date() } },
//             { upsert: true }
//           );
//         }
//       } catch (err) {
//         console.error(`Error fetching news for topic "${topic}":`, err);
//         await collection.updateOne(
//           { topic: topic.toLowerCase() },
//           { $set: { topic: topic.toLowerCase(), articles: [], updatedAt: new Date() } },
//           { upsert: true }
//         );
//       }
//     }

//     // Fetch for daily news (broad UPSC-relevant query)
//     const dailyUrl = `${API_URL}?apiKey=${API_KEY}&q=${encodeURIComponent(DAILY_NEWS_QUERY)}&page=1&pageSize=50&language=en&sortBy=publishedAt`;
//     try {
//       const res = await fetch(dailyUrl);
//       const data = await res.json();
//       if (data.articles) {
//         await collection.updateOne(
//           { topic: "daily" },
//           { $set: { topic: "daily", articles: data.articles, updatedAt: new Date() } },
//           { upsert: true }
//         );
//         console.log(`[${new Date().toISOString()}] Daily news updated (${data.articles.length} articles)`);
//       } else {
//         await collection.updateOne(
//           { topic: "daily" },
//           { $set: { topic: "daily", articles: [], updatedAt: new Date() } },
//           { upsert: true }
//         );
//       }
//     } catch (err) {
//       console.error("Error fetching daily news:", err);
//       await collection.updateOne(
//         { topic: "daily" },
//         { $set: { topic: "daily", articles: [], updatedAt: new Date() } },
//         { upsert: true }
//       );
//     }
//   } finally {
//     await client.close();
//   }
// }

// // Schedule fetch every hour
// cron.schedule("0 * * * *", fetchAllTopicsNews);

// // Initial fetch on server start
// fetchAllTopicsNews();

// // Serve cached news for a topic or all topics
// app.get("/news", async (req, res) => {
//   const client = new MongoClient(MONGO_URI);
//   try {
//     await client.connect();
//     const db = client.db(DB_NAME);
//     const collection = db.collection(COLLECTION_NAME);
//     const { topic } = req.query;
//     if (topic) {
//       const t = topic.toLowerCase();
//       const doc = await collection.findOne({ topic: t });
//       if (doc && doc.articles) {
//         res.json(doc.articles);
//       } else {
//         res.json([]);
//       }
//     } else {
//       // Return all topics as an object (like the old JSON file)
//       const docs = await collection.find({}).toArray();
//       const allNews = {};
//       docs.forEach(doc => {
//         allNews[doc.topic] = doc.articles;
//       });
//       res.json(allNews);
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Database error", details: err.message });
//   } finally {
//     await client.close();
//   }
// });

// app.listen(PORT, () => {
//   console.log(`News bot running at http://localhost:${PORT}/news`);
// });