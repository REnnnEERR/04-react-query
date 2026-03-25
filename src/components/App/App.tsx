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

export default function App() {
  const [query, setQuery] = useState<string>(''); // Стан для тексту пошуку
  const [page, setPage] = useState<number>(1); // Стан для сторінки
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Головний хук React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page], // Ключ залежить від запиту і сторінки
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '', // Не робимо запит, поки порожньо
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim() === '') {
      toast.error("Please enter something!");
      return;
    }
    setQuery(newQuery);
    setPage(1); // При новому пошуку скидаємо на 1 сторінку
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  // Витягуємо дані з об'єкта, який повернув React Query
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      
      {isError && <ErrorMessage />}
      
      {isLoading && <Loader />}
      
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {/* Пагінація з ТЗ */}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages > 500 ? 500 : totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
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