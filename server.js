import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
const app = express()

app.use(express.static('public'))

app.get('/api/bug', (req, res) => {
  bugService.query()
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error('Cannot get bugs', err)
      res.status(500).send('Cannot get bugs')
    })
})

app.get('/api/bug/save', (req, res) => {

    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity: +req.query.severity,
        createAt:req.query.createAt
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    console.log('getting by id from server')
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot load bug')
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {  
    const { bugId } = req.params    
    bugService.remove(bugId)
        .then(() => res.send('Bug removed!'))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

app.get('/cookies', (req, res) => {
    let visitedCount = req.cookies.visitedCount || 0
    visitedCount++
    res.cookie('visitedCount', visitedCount)
    // console.log('visitedCount:', visitedCount)
    // res.send('Hello Puki - ' + visitedCount)
})

app.get('/', (req, res) => res.send('Hello'))

const port = 3030
app.listen(port, () => console.log(`Server ready at http://127.0.0.1:${port}/`))
