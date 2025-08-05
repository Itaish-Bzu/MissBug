const { useState, useEffect } = React

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'

export function BugIndex() {
  const [bugs, setBugs] = useState(null)
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const [sortBy, setSortBy] = useState({ name: 'title', dir: 1 })

  useEffect(loadBugs, [filterBy, sortBy])

  function loadBugs() {
    bugService
      .query(filterBy, sortBy)
      .then(setBugs)
      .catch((err) => showErrorMsg(`Couldn't load bugs - ${err}`))
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
        setBugs(bugsToUpdate)
        showSuccessMsg('Bug removed')
      })
      .catch((err) => showErrorMsg(`Cannot remove bug`, err))
  }

  function onAddBug() {
    const bug = {
      title: prompt('Bug title?', 'Bug ' + Date.now()),
      severity: +prompt('Bug severity?', 3),
    }

    bugService
      .save(bug)
      .then((savedBug) => {
        setBugs([...bugs, savedBug])
        showSuccessMsg('Bug added')
      })
      .catch((err) => showErrorMsg(`Cannot add bug`, err))
  }

  function onEditBug(bug) {
    const severity = +prompt('New severity?', bug.severity)
    const bugToSave = { ...bug, severity }

    bugService
      .save(bugToSave)
      .then((savedBug) => {
        const bugsToUpdate = bugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        )

        setBugs(bugsToUpdate)
        showSuccessMsg('Bug updated')
      })
      .catch((err) => showErrorMsg('Cannot update bug', err))
  }

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }))
  }

  function onChangePage(diff) {
    setFilterBy((prevFilter) => {
      let nextPageIdx = prevFilter.pageIdx + diff
      if (nextPageIdx < 0) nextPageIdx = 0
      return { ...prevFilter, pageIdx: nextPageIdx }
    })
  }

  function onchangeSort({ target }) {
    setSortBy((prevSort) => ({ ...prevSort, name: target.value }))
  }
  function onchangeDir() {
    setSortBy((prevSort) => {
      return {...prevSort,dir: prevSort.dir === 1? -1 : 1,}
    })
}


  return (
    <section className='bug-index main-content'>
      <section></section>

      <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
      <section>
        <button onClick={() => onChangePage(-1)}>-</button>
        <span>{filterBy.pageIdx + 1}</span>
        <button onClick={() => onChangePage(1)}>+</button>

        <label htmlFor='name'> Sort by:</label>
        <select onChange={onchangeSort} name='name' id='name'>
          <option value='title'>Title</option>
          <option value='severity'>Severity</option>
          <option value='date'>Date</option>
        </select>

        <label htmlFor='dir'>descending</label>
        <input type='checkbox' name='dir' id='dir' onClick={onchangeDir} />
      </section>
      <header>
        <h3>Bug List</h3>
        <button onClick={onAddBug}>Add Bug</button>
      </header>

      <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
    </section>
  )
}
