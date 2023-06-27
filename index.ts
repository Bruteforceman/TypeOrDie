import express, { json } from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import api from "./api";
import session from 'express-session';
import path from 'path';

dotenv.config();  // imports .env configs

const app = express();
const port = process.env.PORT || 8080;

// this should go into process.ENV
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;

const dbName = 'TypeOrDie';
const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.cvhon.mongodb.net/${dbName}?retryWrites=true&w=majority`;

connect(mongoURI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.log(err));


// extending express-session

declare module 'express-session' { // not sure why module works but namespace doesn't
  interface SessionData {
    username?: string | null;  // stores the username, null if no user is logged in
  }
}

app.use(json());
app.use(session(
  {
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true
  }
));

// note: the URL should start with http, not https

app.use('/api', api);

const reactPath = path.resolve(__dirname, '..', 'client', 'build');
app.use(express.static(reactPath));
console.log(reactPath);

app.get('*', (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"))
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
