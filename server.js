const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

const users = [
  { username: 'existingUser', email: 'user@example.com' }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/validate', (req, res) => {
  console.log('POST /validate požadavek:', req.body);
  const { username, email, password } = req.body;
  const errors = {};

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.username = 'Uživatelské jméno může obsahovat pouze alfanumerické znaky.';
  } else if (users.some(user => user.username === username)) {
    errors.username = 'Toto uživatelské jméno je již používáno.';
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = 'Email není ve správném formátu (např. aaa@bbb.ccc).';
  } else if (users.some(user => user.email === email)) {
    errors.email = 'Tento email je již používán.';
  }

  const hasLetterOrNumber = /[a-zA-Z\d]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLong = password.length > 15;

  const conditionsMet = [hasLetterOrNumber, hasSpecial, isLong].filter(Boolean).length;

  if (password.length < 8 && !isLong) {
    errors.password = 'Heslo musí být alespoň 8 znaků dlouhé nebo delší než 16 znaků.';
  } else if (conditionsMet < 2) {
    errors.password = 'Heslo musí splňovat alespoň dvě z následujících podmínek: obsahovat písmeno/číslo, speciální znak, nebo být delší než 16 znaků.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  users.push({ username, email });
  return res.status(200).json({ message: 'Registrace proběhla úspěšně!' });
});

app.listen(PORT, () => {
  console.log(`✅ Server běží na http://localhost:${PORT}`);
});
