import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
// import ReactPaginate from 'react-paginate';
import Pagination from '../Pagination/Pagination';

import type { Movie } from '../../types/movie';
import { fetchMovies, type FetchMoviesResponse } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isError, isSuccess, isFetching } = useQuery<FetchMoviesResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== '',
    placeholderData: keepPreviousData,
  });

  // 🔹 Toast для "не знайдено фільмів"
  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast('Фільми не знайдено', { icon: '⚠️' });
    }
  }, [isSuccess, data]);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim() === '') {
      toast.error('Please enter something!');
      return;
    }
    setQuery(newQuery);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  console.log(data, data);
      console.log (totalPages, totalPages);
  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      
      {/* {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )} */}

      {totalPages > 1 && (
  <Pagination 
    totalPages={totalPages > 500 ? 500 : totalPages} 
    currentPage={page} 
    onPageChange={(nextPage) => setPage(nextPage)} 
  />
)}

      {isError && <ErrorMessage />}
      {isFetching && <Loader />}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {!isFetching && movies.length === 0 && !isError && query.trim() !== '' && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {/* Повідомлення залишаємо для випадку, якщо toast закрився */}
        </p>
      )}

      {!query && !isFetching && (
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