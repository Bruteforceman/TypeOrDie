import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ConnectOptions, Mongoose } from 'mongoose';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const mongoose = new Mongoose();


// this should go into process.ENV
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;

const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.cvhon.mongodb.net/?retryWrites=true&w=majority`;
const dbName = 'TypeOrDie';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName
} as ConnectOptions).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log(`Error connecting to MongoDB: ${err}`);
});


// note: the URL should start with http, not https

app.get('/', (req: Request, res: Response) => {
  res.json({
    'name': 'tasmeem reza',
    'school': 'ndc college',
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});