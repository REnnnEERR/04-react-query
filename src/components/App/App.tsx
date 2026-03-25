import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieServices'; 
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal'; 
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './App.module.css';


const Paginate = (ReactPaginate as unknown as { default: typeof ReactPaginate }).default || ReactPaginate;

export default function App() {
  const [query, setQuery] = useState<string>(''); 
  const [page, setPage] = useState<number>(1); 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page], 
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '', 
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim() === '') {
      toast.error("Please enter something!");
      return;
    }
    setQuery(newQuery);
    setPage(1); 
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

 return (
  <div className={css.container}>
    <SearchBar onSubmit={handleSearch} />

    {totalPages > 1 && (
      <Paginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }: { selected: number }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />
    )}

    {isError && <ErrorMessage />}

    {isLoading && <Loader />}

    {movies.length > 0 && (
      <MovieGrid movies={movies} onSelect={handleSelectMovie} />
    )}

      {!isLoading && movies.length === 0 && !isError && query !== '' && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          No movies found. Try another search.
        </p>
      )}

      {!query && !isLoading && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Please enter a search term to find movies.
        </p>
      )}
      
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}