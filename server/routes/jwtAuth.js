const router = require('express').Router()
const pool = require('../db')
const bcrypt = require('bcrypt')
const jwtGenerator = require('../utils/jwtGenerator')

// register route
router.post('/register', async (req, res) => {
  try {
    // destructure data from req.body
    const { name, email, password } = req.body

    // check if user exists
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email])

    if (user.rows.length !== 0) {
      return res.status(401).send('User already exists')
    }

    // bcrypt the password
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const bcryptPassword = await bcrypt.hash(password, salt)

    // insert new user into database, here RETURNING clause returns a DB row immediately after updating
    const newUser = await pool.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', [name, email, bcryptPassword])

    // generate jwt token
    const token = jwtGenerator(newUser.rows[0].user_id)

    res.json({ token })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

// login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // check if user doesn't exist
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email])

    if (user.rows[0].length === 0) {
      return res.status(401).json('Incorrect email or password')
    }

    // check if password is valid
    const validPassword = await bcrypt.compare(password, user.rows[0].user_password)

    if (!validPassword) {
      return res.status(401).json('Incorrect email or password')
    }

    // generate jwt token
    const token = jwtGenerator(user.rows[0].user_id)

    res.json({ token })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
