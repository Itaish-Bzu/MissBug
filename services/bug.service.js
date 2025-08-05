import fs from 'fs'
import { makeId, readJsonFile } from './util.service.js'
import { log } from 'console'

const bugs = readJsonFile('data/bug.json')
const PAGE_SIZE = 3

export const bugService = {
  query,
  getById,
  remove,
  save,
}

function query(filterBy, sortBy) {  
  let bugsToReturn = [...bugs]
 
      if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
         bugsToReturn =  bugsToReturn.filter((bug) => regExp.test(bug.title))
      }

      if (filterBy.minSeverity) {
       bugsToReturn = bugsToReturn.filter((bug) => bug.severity >= filterBy.minSeverity)
      }

      if (sortBy.name ==='severity'){
        bugsToReturn = bugsToReturn.sort((bug1,bug2)=> (bug1.severity-bug2.severity)* sortBy.dir)
      }else if (sortBy.name ==='title'){
        bugsToReturn = bugsToReturn.sort((bug1,bug2)=> (bug1.title.localeCompare(bug2.title))* sortBy.dir )
      }else if (sortBy.name==='date'){
          bugsToReturn = bugsToReturn.sort((bug1,bug2)=> (bug1.createdAt - bug2.createdAt) * sortBy.dir)
      }

      if (filterBy.pageIdx !== null){
        const startIdx = filterBy.pageIdx * PAGE_SIZE 
        bugsToReturn= bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
      }

      if (filterBy.labels.length){ 
        bugsToReturn = bugsToReturn.filter(bug=>bug.labels.some(label =>filterBy.labels.includes(label)))  
      }

  return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
  if (bugIdx === -1) return Promise.reject('Cannot find bug - ' + bugId)
  bugs.splice(bugIdx, 1)
  return _saveBugsToFile()
}

function save(bugToSave) {
  if (bugToSave._id) {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id)
    if (bugIdx === -1) return Promise.reject('Cannot find bug - ' + bugId)
    bugs[bugIdx] = bugToSave
  } else {
    bugToSave._id = makeId()
    bugToSave.createAt = Date.now()
    bugToSave.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sit amet libero lacus'
    bugToSave.labels = ['critical', 'need-CR', 'dev-branch']
    bugs.unshift(bugToSave)
  }

  return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4)
    fs.writeFile('data/bug.json', data, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
