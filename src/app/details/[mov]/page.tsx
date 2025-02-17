"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
//---------------------------\\
//Genre Type
type Genre = {
  id: number;
  name: string;
};
//---------------------------\\
//Movie Type
type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  adult: string;
  genres: Genre[];
};
//-----------------------------------\\
//Genre Data
const genresData: Genre[] = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 3, name: "Animation" },
  { id: 4, name: "Biography" },
  { id: 5, name: "Comedy" },
  { id: 6, name: "Crime" },
  { id: 7, name: "Documentary" },
  { id: 8, name: "Drama" },
  { id: 9, name: "Family" },
  { id: 10, name: "Fantasy" },
  { id: 11, name: "Film-Noir" },
  { id: 12, name: "Game-Show" },
  { id: 13, name: "History" },
  { id: 14, name: "Horror" },
  { id: 15, name: "Music" },
  { id: 16, name: "Musical" },
  { id: 17, name: "Mystery" },
  { id: 18, name: "News" },
  { id: 19, name: "Reality-TV" },
  { id: 20, name: "Romance" },
  { id: 21, name: "Sci-Fi" },
  { id: 22, name: "Short" },
  { id: 23, name: "Sport" },
  { id: 24, name: "Talk-Show" },
  { id: 25, name: "Thriller" },
  { id: 26, name: "War" },
  { id: 27, name: "Western" },
];
//-----------------------------------------------------\\
//Api Key
const movieApiKey = "db430a8098715f8fab36009f57dff9fb";

export default function MovieDetails() {
  //----------------------------------------------------------------------------\\
  //Used for Genre Button
  const [isGenreButton, setIsGenreButton] = useState<boolean>(false);
  //----------------------------------------------------------------------------\\
  //Used for Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  //----------------------------------------------------------------------------\\
  //Used for Genres
  const [genres, setGenres] = useState<Genre[]>(genresData);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  //----------------------------------------------------------------------------\\
  //Used for Movie
  const [movie, setMovie] = useState<Movie | null>(null);
  //----------------------------------------------------------------------------\\
  //Used for Loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //----------------------------------------------------------------------------\\
  //Used for showing Errors
  const [error, setError] = useState<string | null>(null);
  //----------------------------------------------------------------------------\\
  const { mov } = useParams<{ mov: string }>();
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  //Used for Credits
  const [credits, setCredits] = useState({
    director: "",
    actors: [],
    writers: [],
  });
  const router = useRouter()
  const searchMovies = async (query: string): Promise<Movie[]> => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${movieApiKey}&language=en-US&page=1&query=${query}`
        );
        const result = await response.json();
        setIsLoading(false);
        return result.results;
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching movies:", error);
        setError("Failed to fetch movies");
        return [];
      }
    };
  
    const handleClickMovie = (_movie: Movie): void => {
      setSearchValue(""); 
    };
  
    const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;
      setSearchValue(value);
    };
  
    useEffect(() => {
      if (searchValue) {
        const fetchMovies = async () => {
          const moviesData = await searchMovies(searchValue);
          setMovies(moviesData);
        };
        fetchMovies();
      } else {
        setMovies([]);  
      }
    }, [searchValue]);
  //------------------------------------------------------------------------\\
  //Trailer
  const getMovieTrailer = async (movieId: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${movieApiKey}&language=en-US`
      );
      const result = await response.json();
      const trailer = result.results.find(
        (video: any) => video.type === "Trailer"
      );
      return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
    } catch (error) {
      console.error("Error fetching movie trailer", error);
      return null;
    }
  };

  const createMovieCards = async (
    containerId: string,
    movieId: number
  ): Promise<void> => {
    const movies: Movie[] = await getSimilarMovies(mov);
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return;
    }

    if (!Array.isArray(movies) || movies.length === 0) {
      container.innerHTML = "<p>No similar movies found.</p>";
      return;
    }

    container.classList.add(
      "grid",
      "grid-cols-5",
      "gap-4",
      "p-4",
      "pb-9",
      "rounded-lg",
      "max-w-5xl",
      "mx-auto"
    );

    container.innerHTML = await (
      await Promise.all(
        movies.slice(0, 10).map(async (movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "./placeholder.png";
          const rating = movie.vote_average
            ? movie.vote_average.toFixed(1)
            : "N/A";
          const movieLink = `/details/${movie.id}`;

          // Fetch the trailer for the movie
          const trailerUrl = await getMovieTrailer(movie.id);

          return `
        <a href="${movieLink}">
          <div class="text-center bg-gray-100">
            <img
              src="${posterUrl}"
              class="w-full h-auto object-cover rounded-md bg-gray-100"
            />
            <div class="width-[36px] bg-gray-100">
              <div class="flex justify-center items-center gap-1">
                <img src="./star.svg" class="w-5 h-5">
                <span class="text-gray-700 font-medium">${rating}</span>
              </div>
              <div class="text-lg font-semibold text-gray-800 mt-1">${
                movie.title
              }</div>
            </div>
            <div>
              <!-- Trigger for Dialog -->
              ${
                trailerUrl
                  ? `
                <Dialog>
                  <DialogTrigger asChild>
                    <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Watch Trailer</button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>${movie.title} - Trailer</DialogTitle>
                    <DialogDescription>
                      <iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              `
                  : ""
              }
            </div>
          </div>
        </a>
      `;
        })
      )
    ).join("");
    createMovieCards("jd", 12345);
  };
  ///movie/${id}/videos?language=en-US

  //------------------------------------------------------------------------\\
  //Similar Movies
  const getSimilarMovies = async (movieId: string): Promise<Movie[]> => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${movieApiKey}&language=en-US&page=1`
      );
      const result = await response.json();
      return result.results;
    } catch (error) {
      console.error("Error fetching similar movies", error);
      return [];
    }
  };
  const createMovieCard = async (
    containerId: string,
    movieId: number
  ): Promise<void> => {
    const movies: Movie[] = await getSimilarMovies(mov);

    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    if (!Array.isArray(movies) || movies.length === 0) {
      container.innerHTML = "<p>No similar movies found.</p>";
      return;
    }

    container.classList.add(
      "grid",
      "grid-cols-5",
      "gap-4",
      "p-4",
      "pb-9",
      "rounded-lg",
      "max-w-5xl",
      "mx-auto"
    );

    container.innerHTML = movies
      .slice(0, 5)
      .map((movie) => {
        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "./placeholder.png";
        const rating = movie.vote_average
          ? movie.vote_average.toFixed(1)
          : "N/A";
        const movieLink = `/details/${movie.id}`;

        return `
          <a href="${movieLink}">
            <div class="text-center bg-gray-100">
              <img
                src="${posterUrl}"
                class="w-full h-auto object-cover rounded-md bg-gray-100"
              />
              <div class="width-[36px] bg-gray-100">
                <div class="flex justify-center items-center gap-1">
                  <img src="../star.svg" class="w-5 h-5">
                  <span class="text-gray-700 font-medium">${rating}</span>
                </div>
                <div class="text-lg font-semibold text-gray-800 mt-1">${movie.title}</div>
              </div>
            </div>
          </a>
        `;
      })
      .join("");
  };

  createMovieCard("similar-movies", 12345);

  // Toggle Genre Button
  const toggleGenreButton = (): void => {
    setIsGenreButton(!isGenreButton);
  };

  // Dark Mode Toggle
  const toggleDarkMode = (): void => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      setIsDarkMode(false);
    }
  }, []);
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Extract Movie ID from URL
  const getMovieIdFromUrl = () => {
    const path = window.location.pathname;
    const pathParts = path.split("/");
    return pathParts[pathParts.length - 1];
  };

  // Fetch Movie Details
  const getMovieDetails = async (movieId: string) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${movieApiKey}&language=en-US`
      );
      const result = await response.json();
      setMovie(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError("Failed to fetch movie details.");
    }
  };

  // Credits for the Movie
  const getMovieCredits = async (movieId: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${movieApiKey}&language=en-US`
      );
      const result = await response.json();

      console.log(result);

      const actors = result.cast
        .slice(0, 3)
        .map((actor: any) => actor.name)
        .join(",   ");

      const writers = result.crew
        .filter((member: any) => member.job === "Writer")
        .slice(0, 3)
        .map((writer: any) => writer.name);

      const director = result.crew.find(
        (member: any) => member.job === "Director"
      );

      console.log("Director:", director);

      setCredits({
        director: director ? director.name : "N/A",
        actors: actors,
        writers: writers,
      });
    } catch (error) {
      console.error("Error fetching movie credits:", error);
      setError("Failed to fetch movie credits.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const movieId = getMovieIdFromUrl();
    if (movieId) {
      getMovieDetails(movieId);
      getMovieCredits(movieId);
    }
  }, []);

  // Display loading message while fetching data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
    className={`min-h-screen ${
      isDarkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
    }`}
  >
    <div
      className={`w-full h-full px-4 ${
        isDarkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
      } items-center sm:inline-flex`}
    >
      <div className="sm:w-[1785px] sm:ml-[320px] w-[640px] h-[59px] items-center inline-flex sm:ml-[320px] flex">
        <a href={`/`}>
        <div className="justify-start items-center gap-2 flex">
          <img
            className="w-5 h-5 relative overflow-hidden sm:w-[20px] sm:h-[20px]"
            src="../film.svg"
          />
          <div
            className={`text-${
              isDarkMode ? "indigo-300" : "indigo-700"
            } text-base font-bold font-['Inter'] leading-tight tracking-tight flex  sm:mr-[330px]`}
          >
            Movie Z
          </div>
        </div>
        </a>
        <div className="relative hidden sm:block">
          <button
            className="w-[97px] h-9 px-4 py-2 bg-white dark:bg-gray-800 dark:text-white rounded-md shadow-sm rounded-lg border border-[#e3e3e7] justify-center items-center gap-2 inline-flex"
            onClick={toggleGenreButton}
          >
            <img
              className={`w-4 h-4 relative overflow-hidden transform ${
                isGenreButton ? "rotate-180" : ""
              }`}
              src="../chevron-down.png"
            />
            <div
              className={`text-${
                isDarkMode ? "white" : "zinc-900"
              } text-sm font-medium font-['Inter'] leading-tight`}
            >
              Genre
            </div>
          </button>
          {isGenreButton && (
            <button onClick={() => router.push(`./Genre/`)}>
            <div className="absolute top-full left-0 w-[577px] mt-2 p-5 bg-white dark:bg-gray-800 border rounded-lg border-[#e3e3e7] flex-col justify-start items-start inline-flex absolute z-10 hidden sm:block">
              <div className="h-[60px] flex-col justify-start items-start gap-1 flex">
                <div
                  className={`self-stretch text-${
                    isDarkMode ? "white" : "zinc-950"
                  } text-2xl font-semibold font-['Inter'] leading-loose`}
                >
                  Genres
                </div>
                <div
                  className={`self-stretch text-${
                    isDarkMode ? "gray-400" : "zinc-950"
                  } text-base font-normal font-['Inter'] leading-normal`}
                >
                  See lists of movies by genre
                </div>
              </div>
              <div className="h-[33px] py-4 flex-col justify-start items-start gap-2.5 inline-flex mt-[10px]">
                <div className="w-[537px] h-px border border-gray-400 dark:border-gray-600" />
              </div>
              <div className="h-[200px] justify-start items-start gap-[5px] flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    className="pl-2.5 pr-1 py-0.5 rounded-full border border-[#e3e3e7] dark:border-gray-600 justify-start items-start gap-2 flex"
                  >
                    <p
                      className={`text-${
                        isDarkMode ? "white" : "zinc-950"
                      } text-xs font-semibold font-['Inter'] leading-none mt-[2px]`}
                    >
                      {genre.name}
                    </p>
                    <img
                      className="w-4 h-4 relative overflow-hidden"
                      src="../chevron-right.svg"
                    />
                  </button>
                ))}
              </div>
            </div>
          </button>
          )}
        </div>
        <div className="ml-[10px] hidden sm:block">
          <input
            value={searchValue}
            onChange={onChange}
            className="w-[390px] h-9 px-3 bg-white rounded-lg border border-[#e3e3e7] justify-start items-center gap-2.5 inline-flex"
            placeholder="Search..."
          />
        </div>

        <div className="w-9 h-9 justify-end items-center gap-3 inline-flex ml-[450px] sm:ml-[550px]">
          <button
            className="w-9 h-9 bg-white dark:bg-gray-800 rounded-[1px] shadow-sm border border-[#e3e3e7] dark:border-gray-600 justify-center items-center gap-2 flex"
            onClick={toggleDarkMode}
          >
            <img
              className="w-[30px] h-[30px] relative overflow-hidden"
              src="../moon.svg"
            />
          </button>
        </div>
      </div>
    </div>
      {/* Upcoming Movie Description */}
      <div className="sm:pl-[180px] pt-[52px]">
        {movie && (
          <>
            <div className="sm:flex">
              <h1
                className={`text-${
                  isDarkMode ? "white" : "zinc-950"
                } text-4xl font-bold font-['Inter'] leading-10 sm:flex`}
              >
                {movie.title}
              </h1>
              <h1 className="ml-[1000px] mt-[7px] hidden sm:block text-zinc-500">Rating</h1>
            </div>
            <div className="flex-nowrap">
              <div
                className={`text-${
                  isDarkMode ? "gray-400" : "zinc-950"
                } text-lg font-normal font-['Inter'] leading-7 flex `}
              >
                {movie.release_date} · {movie.adult ? "PG" : "For Every One"}{" "}
                <div className="flex sm:pl-[920px] pl-[300px] pb-[1px]">
                  <img src="../star.svg" />
                  <p
                    className={`text-${
                      isDarkMode ? "white" : "zinc-950"
                    } text-lg font-semibold font-['Inter'] leading-7`}
                  >
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                    <span className="text-zinc-500 text-base font-normal font-['Inter'] leading-normal">
                      /10
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex">
            <div>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="sm:w-[290px] sm:h-[428px] w-[100px] h-[148px] relative rounded"
              />
            </div>
            <div className="sm:flex sm:gap-2 sm:mt-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="pl-2.5 pr-1 py-0.5 rounded-full border border-[#e3e3e7] dark:border-gray-600 text-xs font-semibold text-zinc-950 dark:text-white"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            </div>
            <div>
              <p
                className={`text-${
                  isDarkMode ? "white" : "zinc-950"
                } text-base font-normal font-['Inter'] leading-normal mt-[10px]`}
              >
                {movie.overview}
              </p>
            </div>
            <div className="flex mt-[40px]">
              <p
                className={`text-${
                  isDarkMode ? "white" : "zinc-950"
                } text-base font-bold font-['Inter'] leading-7`}
              >
                Director
              </p>
              <p
                className={`pl-[53px] text-${
                  isDarkMode ? "gray-400" : "zinc-950"
                } text-base font-normal font-['Inter'] mt-[3px] leading-normal`}
              >
                {credits.director}
              </p>
            </div>
            <div className="border border-[#e3e3e7] block w-[639px] sm:w-[1080px] mt-[10px]" />
            <div className="flex mt-[20px]">
              <p
                className={`text-${
                  isDarkMode ? "white" : "zinc-950"
                } text-base font-bold font-['Inter'] leading-7`}
              >
                Writers
              </p>
              <p
                className={`pl-[53px] text-${
                  isDarkMode ? "gray-400" : "zinc-950"
                } text-base font-normal font-['Inter'] mt-[3px] leading-normal`}
              >
                {credits.writers}
              </p>
            </div>
            <div className="border border-[#e3e3e7] block w-[639px] sm:w-[1080px] mt-[10px]" />
            <div className="flex mt-[20px]">
              <p
                className={`text-${
                  isDarkMode ? "white" : "zinc-950"
                } text-base font-bold font-['Inter'] leading-7`}
              >
                Stars
              </p>
              <p
                className={`pl-[53px] text-${
                  isDarkMode ? "gray-400" : "zinc-950"
                } text-base font-normal font-['Inter'] mt-[3px] leading-normal`}
              >
                {credits.actors}
              </p>
            </div>
            <div className="border border-[#e3e3e7] block w-[639px] sm:w-[1080px] mt-[10px]" />
          </>
        )}
      </div>
      <div className="h-9 justify-between items-start inline-flex sm:pl-[180px] pt-[10px]">
        <div className="w-[198px] text-zinc-950 text-2xl font-semibold font-['Inter'] leading-loose">
          More Like This
        </div>
        <div className="px-4 py-2 bg-white rounded-md justify-center items-center gap-2 flex">
          <div className="text-zinc-950 text-sm font-medium font-['Inter'] leading-tight pl-[300px] mt-[5px] sm:mt-0 sm:pl-[1500px]">
            See More
          </div>
          <img className="w-[16px] h-[16px]" src="../chevron-right.svg" />
        </div>
      </div>
      <div id="similar-movies" />
    </div>
  );
}
