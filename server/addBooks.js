const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('./models/Book');

const books = [
  {
    title: 'Wings of Fire',
    author: 'A. P. J. Abdul Kalam',
    price: 250,
    available: true,
    image: ''
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 300,
    available: true,
    image: ''
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 450,
    available: true,
    image: ''
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 350,
    available: true,
    image: ''
  },
  {
    title: 'Ikigai',
    author: 'Hector Garcia',
    price: 280,
    available: true,
    image: ''
  }
];

async function addBooks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Book.insertMany(books);

    console.log('Sample books added successfully!');
  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

addBooks();
