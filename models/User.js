import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    select: false,
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

// pre save hook koji ce da se pokrene pre nego sto kreiramo model usera i pre nego sto ovaj password ode u bazu podataka na monogoDB
// mora da bude funkcijska deklaracija zato sto cemo da koristimo THIS (arrow funkcije prilikom izvrsavanja ne dobijaju this varijablu)
// pre svakog kreiranja skime usera u bazu pokretace se ova pre() funkcija koja ce za nas da hashuje password.
UserSchema.pre('save', async function () {
  // ovaj salt ce da generise neke radnom brojeve i slova
  // sto veci broj prosledimo genSalt() funkciji to biti bolje zasticen password medjutim s druge strane trebace vise vremena da se to odradi!
  const salt = await bcrypt.genSalt(10);
  // this.password ce zapravo da bude password koji smo prosledili sa klijentske strane
  this.password = await bcrypt.hash(this.password, salt);
});

// kreirmao metodu instance userSchema (ovo createJWT mozemo da nazovemo kako god zelimo) koja ce za nas da kreira token. Ovu metodu pozivamo u register kontroleru i saljemo ga useru.
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// pravimo jos jednu custom metodu ove instance UserSchema gde proveravamo password koji dobijamo sa frontenda sa onim koje imamo u bazi! Funkcija vraca true ili false
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default mongoose.model('User', UserSchema);
