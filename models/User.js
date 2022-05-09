import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'lastName',
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'my city',
  },
});

// pre save hook koji ce da se pokrene pre nego sto kreiramo model usera
// mora da bude funkcijska deklaracija zato sto cemo da koristimo THIS (arrow funkcije prilikom izvrsavanja ne dobijaju this varijablu)
// pre svakog kreiranja skime usera u bazu pokretace se ova pre() funkcija koja ce za nas da hashuje password.
UserSchema.pre('save', async function () {
  // ovaj salt ce da generise neke radnom brojeve i slova
  const salt = await bcrypt.genSalt(10);
  // this.password ce zapravo da bude password koji smo prosledili sa klijentske strane
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', UserSchema);
