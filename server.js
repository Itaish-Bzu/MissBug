import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')


app.get('/api/bug', (req, res) => {
  const filterBy = {
    txt: req.query.txt,
    minSeverity:req.query.minSeverity,
  }
  const sortBy=req.query.sortBy||''

  console.log(sortBy);
  

  bugService.query( filterBy ,sortBy )
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Cannot get bugs', err)
      res.status(500).send('Cannot get bugs')
    })
})


app.put('/api/bug/:bugId', (req, res) => {
  const bugToSave = {
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    severity: +req.body.severity,
    createAt: +req.body.createAt || 0,
  }

  bugService
    .save(bugToSave)
    .then((savedBug) =>res.send(savedBug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(500).send('Cannot save bug')
    })
})

app.post('/api/bug', (req, res) => {
  const bugToSave = {
    title: req.body.title,
    severity: +req.body.severity,
  }

  bugService.save(bugToSave)
    .then((savedBug) => res.send(savedBug))
    .catch((err) => {
      loggerService.error('Cannot save bug', err)
      res.status(500).send('Cannot save bug')
    })
})


app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  let visitedBugs = req.cookies.visitedBugs || []

  if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
  if (visitedBugs.length > 3) return res.status(401).send('Wait for a bit')

  bugService
    .getById(bugId)
    .then((bug) => {
      res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
      res.send(bug)
    })
    .catch((err) => {
      loggerService.error('Cannot get bug', err)
      res.status(500).send('Cannot load bug')
    })
})


app.delete('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params
  bugService
    .remove(bugId)
    .then(() => res.send('Bug removed!'))
    .catch((err) => {
      loggerService.error('Cannot remove bug', err)
      res.status(500).send('Cannot remove bug')
    })
})

app.get('/', (req, res) => res.send('Hello'))

const port = 3030
app.listen(port, () => console.log(`Server ready at http://127.0.0.1:${port}/`))
