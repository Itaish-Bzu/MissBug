import fs from 'fs'
import http from 'http'
import https from 'https'

export function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}
