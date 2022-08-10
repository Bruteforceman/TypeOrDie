import express, { json } from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import router from "./api";
dotenv.config();  // imports .env configs

const app = express();
const port = process.env.PORT;

// this should go into process.ENV
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;

const dbName = 'TypeOrDie';
const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.cvhon.mongodb.net/${dbName}?retryWrites=true&w=majority`;

connect(mongoURI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.log(err));

// note: the URL should start with http, not https

app.get('/', (req, res) => {
  res.send('Welcome to TypeOrDie')
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

app.use('/api', router);
app.use(json());

