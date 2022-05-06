import mongoose from 'mongoose';

const connectDB = url => {
  // vraca promise tako da moramo da ga awaitujemo u server.js
  return mongoose.connect(url);
};

export default connectDB;
