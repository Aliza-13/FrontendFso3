
import { useState, useEffect } from 'react'
import personService from './services/persons.js'
import './App.css'


const Filter = ({ filter, handleFilterChange }) => (
  <div>
    Filter:
    <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name:
      <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number:
      <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <button type="submit">add</button>
  </form>
)

const Persons = ({ persons, handleDelete }) => (
  <>
    {persons.map((person) => (
      <p key={person.id}>
        {person.name} {person.number}{' '}
        <button onClick={() => handleDelete(person.id, person.name)}>Delete</button>
        <button onClick={() => console.log('persons state now:', persons)}>Check persons</button>
      </p>
    ))}
  </>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  console.log('persons state:', persons)
  console.log('is array:', Array.isArray(persons))

  //Hae data palvelimelta

  useEffect(() => {
    personService.getAll().then(data => {
      setPersons(data)
    })
  }, [])

  //Notification
  const showNotification = (message, type = 'success', duration = 5000) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), duration)
  }

  //lisätään tyyppi
  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = Array.isArray(persons) &&
      persons.some 
      person => (person.name && person.name.toLowerCase().trim() === newName.toLowerCase().trim())
  

    if (nameExists) {
      alert(`${newName} is already on the phonebook`)
      return
    }

    const personObject = {
      name: newName.trim(),
      number: newNumber.trim()
    }

    personService.create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`${returnedPerson.name} added successfully!`)
      })
      .catch(error => {
        console.log(error.response.data.error)
        showNotification(error.response.data.error, 'error')
      })
  }

  //poistetaan tyyppi
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`${name} deleted successfully!`)
        })
        .catch(error => {
          console.error(error)
          showNotification(`${name} was already removed`, 'error')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }


  const personsToShow = Array.isArray(persons)
    ? persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())
    )
    : []

  return (
    <div>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h2>Phonebook</h2>

      <button onClick={() => console.table(persons)}>Check persons table</button>

      <Filter filter={filter} handleFilterChange={e => setFilter(e.target.value)} />

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={e => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={e => setNewNumber(e.target.value)}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App