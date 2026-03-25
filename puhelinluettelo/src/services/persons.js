
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => axios.get(baseUrl).then(res => res.data)

const create = (newPerson) => { return axios.post(baseUrl, newPerson).then(response => response.data)}


const remove = (id) => axios.delete(`${baseUrl}/${id}`)

export default { create, getAll, remove }