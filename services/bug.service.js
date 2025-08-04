import fs from 'fs'
import {makeId,readJsonFile } from "./util.service.js";

const bugs = readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save,
}

function query() {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(carId) {
    const carIdx = cars.findIndex(car => car._id === carId)
    if (carIdx === -1) return Promise.reject('Cannot find bug - ' + carId)
    cars.splice(carIdx, 1)
    return _saveCarsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        if (bugIdx === -1) return Promise.reject('Cannot find bug - ' + bugId)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = makeId()
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