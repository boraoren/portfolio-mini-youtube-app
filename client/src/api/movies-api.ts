import {apiEndpoint} from '../config'
import Axios from 'axios'
import {CreateMovieRequest} from "../types/CreateMovieRequest";
import {Movie} from "../types/Movie";

export async function createMovie(
  idToken: string,
  newMovie: CreateMovieRequest
): Promise<Movie> {
  const response = await Axios.post(`${apiEndpoint}/movies`, JSON.stringify(newMovie), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function getMovies(idToken: string): Promise<Movie[]> {
  console.log('Fetching movies, with token: ' + idToken)

  const headers = idToken === undefined ? {
      'Content-Type': 'application/json',
    } :
    {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }


  const response = await Axios.get(`${apiEndpoint}/movies`, {
    headers
  })
  console.log('Movies:', response.data)
  return response.data.items
}