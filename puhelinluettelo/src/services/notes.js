import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/notes'

const getAll = () => axios.get(baseUrl).then(res => res.data)
const create = (newNote) => axios.post(baseUrl, newNote).then(res => res.data)
const update = (id, updateNote) => axios.put(`${baseUrl}/${id}`, updateNote).then(res => res.data)

export default { getAll, create, update }
