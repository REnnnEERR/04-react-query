import axios from 'axios';
import type { Movie } from '../types/movie'; 

interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.baseURL = 'https://api.themoviedb.org/3';
axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;

export const fetchMovies = async (query: string, page: number = 1): Promise<FetchMoviesResponse> => {
  const { data } = await axios.get<FetchMoviesResponse>('/search/movie', {
    params: { 
      query: query,
      page: page, 
      language: 'uk-UA',
      include_adult: false
    }
  });
  return data;
};