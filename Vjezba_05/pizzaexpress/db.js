import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config(); // učitava osjetljive podatke iz .env datoteke

let mongoURI = process.env.MONGO_URI;
let db_name = process.env.MONGO_DB_NAME;

console.log("URI postoji?", !!mongoURI);
console.log("DB NAME:", db_name);

async function connectToDatabase() {
  try {
    const client = new MongoClient(mongoURI);
    await client.connect();
    console.log('Uspješno spajanje na bazu podataka');

    let db = client.db(db_name);
    return db;
  } catch (error) {
    console.error('Greška prilikom spajanja na bazu podataka', error);
    throw error;
  }
}

export { connectToDatabase };