const express = require('express')
const uuid = require('uuid')
const cors = require('cors')
const PORT = process.env.PORT || 5000;
const server = express();
const users = require('./users')

// Middleware
server.use(express.json())
server.use(cors())

// ***** ENDPOINTS *****
// Main API
server.get('/', (req, res) => {
  res.json({ message: 'API is Live' })
})

// GET	/api/users	Returns an array users.
server.get('/api/users', (req, res) => {
  if(users.length < 1) {
    res.status(500).json({ errorMessage: 'No current users in Database' })
  } else {
    res.status(200).json(users)
  }
})

// GET	/api/users/:id	Returns the user object with the specified id.
server.get('/api/users/:id', (req, res) => {
  const id = req.params.id
  const find = users.find(item => item.id === id)

  if(find) {
    res.status(200).json(find)
  } else {
    res.status(404).json({ errorMessage: `User ID doesn't exist on database` })
  }
})


// POST	/api/users	Creates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {
  const newUser = {
    id: uuid.v4(),
    name: req.body.name,
    bio: req.body.bio
  }
  if(!newUser.name || !newUser.bio && newUser.name.length < 3 || newUser.bio.length < 3) {
    console.log(`Atempted to add user with invalid object:`, newUser)
    res.status(400).json({ errorMessage: 'name and bio fields are required. Min chars 3' })
  } else {
    users.push(newUser)
    res.status(201).json({ newUser })
  }
})

// DELETE	/api/users/:id	Removes the user with the specified id and returns the deleted user.
server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id
  let userIndex = 0;
  const find = users.find((item, index) => {
    if(item.id === id) {
      return userIndex = index
    }
  })

  if(find) {
    users.splice(userIndex,1)
    res.status(200).json(find)
  } else {
    res.status(404).json({ errorMessage: `User ID doesn't exist on database` })
  }
})

// PATCH	/api/users/:id	Updates the user with the specified id using data from the request body. Returns the modified user
server.put('/api/users/:id', (req, res) => {
  const id = `${req.params.id}`;
  let userIndex = 0;
  const editUser = users[userIndex]
  const find = users.find((item, index) => {
    if(`${item.id}` === id) {
      return userIndex = index
    }
  })

  if(find) {
    console.log(`user index`, editUser)
    console.log(`req body`, req.body)
    user = {
      ...editUser,
      ...req.body
    }
    res.status(200).json(editUser)
  } else {
    res.status(404).json({ errorMessage: `User ID doesn't exist on database` })
  }
})


server.listen (PORT, () => {
  console.log(`Server Listening on ${PORT}`)
})