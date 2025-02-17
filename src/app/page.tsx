"use client";

import { useState, JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
//------------------------------------------------------------------------\\
//Movie Type
type Movie = {
  title: string;
  imageUrl: string;
  poster_path: string;
  vote_average: number;
  id: number;
};
//------------------------------------------------------------------------\\
//Genre Type
type Genre = {
  id: number;
  name: string;
};
//------------------------------------------------------------------------\\
//Genre Id
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

export default function App(): JSX.Element {
// Used for Genre Button  
  const [isGenreButton, setIsGenreButton] = useState<boolean>(false);
// Used for Dark Mode  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
// Used for Genre  
  const [genres, setGenres] = useState<Genre[]>(genresData);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const getImageUrl = (path: string, size: string = "w500"): string => {
    return `https://image.tmdb.org/t/p/original/${path}`;
  };
  //------------------------------------------------------------------------\\
  //Movie Api Key
  const movieApiKey = "db430a8098715f8fab36009f57dff9fb";

  //------------------------------------------------------------------------\\
  //Popular Movie
  const getPopularMovies = async (): Promise<Movie[]> => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${movieApiKey}&language=en-US&page=1`
      );
      const result = await response.json();
      return result.results;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };

  const createMovieCard = async (containerId: string): Promise<void> => {
    const movies: Movie[] = await getPopularMovies();

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return;
    }

    container.classList.add(
      "grid",
      "grid-cols-2",
      "sm:grid-cols-5",
      "ml-[150px]",
      "sm:ml-0",
      "mt-[0px]",
      "gap-10",
      "sm:gap-4",
      "sm:p-4",
      "sm:pb-9",
      "rounded-lg",
      "sm:max-w-5xl",
      "sm:w-full",
      "sm:h-full",
      "h-[309px]",
      "w-[350px]",
      "sm:mx-auto"
    );

    container.innerHTML = movies
      .slice(0, 10)
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
          <div class="text-center bg-gray-100 w-[158px] sm:w-full  height-[362px]">
      <img
      src="${posterUrl}"
      class="w-full sm:h-auto h-[234px] sm:object-cover rounded-md bg-gray-100"
      />
      <div class="sm:width-[36px] w-[157px] bg-gray-100 height-[84px]">
      <div class="flex justify-center items-center gap-1">
      <img src="./star.svg" class="w-5 h-5">
      <span class="text-gray-700 font-medium">${rating}</span>
      </div>

      <div class="text-lg font-semibold text-gray-800 mt-1 height-[84px]">${movie.title}</div>
      </div>
      </div>
        </a>
      `;
      })
      .join("");
  };

  const router = useRouter()

  createMovieCard("popular-movies");

  //------------------------------------------------------------------------\\
  //:)
  //------------------------------------------------------------------------\\
  //Upcoming Movies
  const getUpcomingMovies = async (): Promise<Movie[]> => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${movieApiKey}&language=en-US&page=1`
      );
      const result = await response.json();
      console.log(result);

      return result.results;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };

  const createMovieCards = async (containerId: string): Promise<void> => {
    const movies: Movie[] = await getUpcomingMovies();

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found.`);
      return;
    }

    if (movies.length === 0) {
      container.innerHTML = `<p>No upcoming movies found at the moment.</p>`;
      return;
    }

    container.classList.add(
      "grid",
      "grid-cols-2",
      "sm:grid-cols-5",
      "ml-[150px]",
      "sm:ml-0",
      "gap-10",
      "sm:gap-4",
      "sm:p-4",
      "sm:pb-9",
      "rounded-lg",
      "sm:max-w-5xl",
      "sm:w-full",
      "sm:h-full",
      "h-[309px]",
      "w-[350px]",
      "sm:mx-auto"
    );

    console.log(movies.map((m) => m.id));

    container.innerHTML = movies
      .slice(0, 10)
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
          <div class="text-center bg-gray-100 w-[158px] sm:w-full  height-[362px]">
      <img
      src="${posterUrl}"
      class="w-full sm:h-auto h-[234px] sm:object-cover rounded-md bg-gray-100"
      />
      <div class="sm:width-[36px] w-[157px] bg-gray-100 height-[84px]">
      <div class="flex justify-center items-center gap-1">
      <img src="./star.svg" class="w-5 h-5">
      <span class="text-gray-700 font-medium">${rating}</span>
      </div>

      <div class="text-lg font-semibold text-gray-800 mt-1 height-[84px]">${movie.title}</div>
      </div>
      </div>
        </a>
      `;
      })
      .join("");
  };

  createMovieCards("upcoming-movies");
  //------------------------------------------------------------------------\\
  //:)
  //------------------------------------------------------------------------\\
  //Top Rated Movies
  const getTopRatedMovies = async (): Promise<Movie[]> => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${movieApiKey}&language=en-US&page=1`
      );
      const result = await response.json();
      return result.results;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };

  const createMovieCar = async (containerId: string): Promise<void> => {
    const movies: Movie[] = await getTopRatedMovies();

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found.`);
      return;
    }

    container.classList.add(
      "grid",
      "grid-cols-2",
      "sm:grid-cols-5",
      "ml-[150px]",
      "sm:ml-0",
      "gap-10",
      "sm:gap-4",
      "sm:p-4",
      "sm:pb-9",
      "rounded-lg",
      "sm:max-w-5xl",
      "sm:w-full",
      "sm:h-full",
      "h-[309px]",
      "w-[350px]",
      "sm:mx-auto"
    );

    container.innerHTML = movies
      .slice(0, 10)
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
          <div class="text-center bg-gray-100 w-[158px] sm:w-full  height-[362px]">
      <img
      src="${posterUrl}"
      class="w-full sm:h-auto h-[234px] sm:object-cover rounded-md bg-gray-100"
      />
      <div class="sm:width-[36px] w-[157px] bg-gray-100 height-[84px]">
      <div class="flex justify-center items-center gap-1">
      <img src="./star.svg" class="w-5 h-5">
      <span class="text-gray-700 font-medium">${rating}</span>
      </div>

      <div class="text-lg font-semibold text-gray-800 mt-1 height-[84px]">${movie.title}</div>
      </div>
      </div>
      `;
      })
      .join("");
  };

  createMovieCar("top-rated-movies");
  //------------------------------------------------------------------------\\
  //:)
  //------------------------------------------------------------------------\\
  //Currently Playing Movies
  const getCurrentlyPlayingMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${movieApiKey}&language=en-US&page=1`
      );
      const { results } = await response.json();
      console.log(results);
      if (results.length > 0) {
        const firstMovie = results[0];
        return getImageUrl(firstMovie.backdrop_path);
      } else {
        throw new Error("No movies found.");
      }
    } catch (error) {
      console.log("Error fetching movie:", error);
      return null;
    }
  };

  const displaySingleBackdrop = async () => {
    try {
      const backdropUrl = await getCurrentlyPlayingMovies();
      const backdropDiv = document.getElementById("backdrop-container");

      if (backdropUrl && backdropDiv) {
        if (!backdropDiv.querySelector('img[src="' + backdropUrl + '"]')) {
          const imgElement = document.createElement("img");
          imgElement.src = backdropUrl;
          backdropDiv.appendChild(imgElement);
        }
      } else {
        console.log("No backdrop URL found or div not found.");
      }
    } catch (error) {
      console.error("Error displaying movie backdrop:", error);
    }
  };

  displaySingleBackdrop();
  //------------------------------------------------------------------------\\
  //Genre Button
  const toggleGenreButton = (): void => {
    setIsGenreButton(!isGenreButton);
  };
  //------------------------------------------------------------------------\\
  //Dark Mode Function
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
  //------------------------------------------------------------------------\\
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
              src="./film.svg"
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
                src="./chevron-down.png"
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
                        src="./chevron-right.svg"
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
                src="./moon.svg"
                alt="Moon Icon"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="sm:relative static w-full sm:h-[600px] h-[359px] overflow-hidden">
        <div id="backdrop-container" />
        <div className="h-[264px] flex-col justify-start items-start gap-4 inline-flex absolute p-[20px] sm:p-0 sm:bottom-[158px] sm:left-[140px]">
          <div className="flex-col justify-start items-start sm:flex block">
            <div className="w-[404px] text-black sm:text-white font-normal font-['Inter'] leading-normal">
              Now Playing:
            </div>
            <div className="w-[404px] text-black sm:text-white text-4xl font-bold font-['Inter'] leading-10">
              Sonic The Hedgehog
            </div>
            <div className="self-stretch grow-shrink basis-0 justify-start items-center gap-1 inline-flex">
              <div className="self-stretch pt-2 justify-start items-start gap-2.5 flex">
                <img
                  className="w-7 h-7 relative overflow-hidden"
                  src="./star.svg"
                />
              </div>
              <div className="flex-col justify-start items-start inline-flex">
                <div>
                  <span className="sm:text-neutral-50 text-black text-lg font-semibold font-['Inter'] leading-7">
                    7.6/
                  </span>
                  <span className="text-zinc-500 text-base font-normal font-['Inter'] leading-normal">
                    10
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[302px] sm:text-neutral-50 text-black text-xs font-normal font-['Inter'] leading-none">
            Sonic, Knuckles, and Tails reunite against a powerful new adversary,
            Shadow, a mysterious villain with powers unlike anything they have
            faced before. With their abilities outmatched in every way, Team
            Sonic must seek out an unlikely alliance in hopes of stopping Shadow
            and protecting the planet.
          </div>
          <button className="w-[144px] h-[36px] sm:text-zinc-900 text-white text-sm font-medium font-['Inter'] border sm:border-white border-black rounded-[10px] sm:bg-white bg-black leading-tight flex cursor-pointer">
            <img
              className="w-4 h-4 relative overflow-hidden mt-[10px]"
              src="./play.svg"
            />
            <p className="mt-[10px] ml-[10px]">Watch Trailer</p>
          </button>
        </div>
      </div>
      <div className="h-[978px] sm:px-20 flex-col justify-start items-start gap-8 inline-flex mt-[250px] sm:mt-[0px] sm:ml-[300px]">
        <div className="sm:w-[1227px] justify-between items-start inline-flex">
          <div className="text-zinc-950 text-2xl font-semibold font-['Inter'] leading-loose">
            Upcoming{" "}
          </div>
          <button onClick={() => router.push(`./seemore/`)}>
          <div className="px-4 py-2 bg-white rounded-md justify-center items-center gap-2 mt-[10px] ml-[400px] sm:ml-[0px] sm:mt-[0px] flex">
            <div className="text-zinc-950 text-sm font-medium font-['Inter'] leading-tight">
              See More{" "}
            </div>
            <img
              className="w-4 h-4 relative overflow-hidden"
              src="./arrow-right.svg"
            />
          </div>
          </button>
        </div>
        <div id="upcoming-movies"></div>
      </div>
      <div className="h-[978px] sm:px-20 flex-col justify-start items-start gap-8 inline-flex sm:ml-[300px] mt-[1000px]">
        <div className="sm:w-[1227px] justify-between items-start inline-flex">
          <div className="text-zinc-950 text-2xl font-semibold font-['Inter'] leading-loose">
            Popular{" "}
          </div>
          <button onClick={() => router.push(`./seemore2/`)}>
          <div className="px-4 py-2 bg-white rounded-md justify-center items-center gap-2 mt-[10px] ml-[400px] sm:ml-[0px] sm:mt-[0px] flex">
            <div className="text-zinc-950 text-sm font-medium font-['Inter'] leading-tight">
              See More{" "}
            </div>
            <img
              className="w-4 h-4 relative overflow-hidden"
              src="./arrow-right.svg"
            />
          </div>
          </button>
        </div>
        <div id="popular-movies" />
      </div>
      <div className="h-[978px] sm:px-20 flex-col justify-start items-start gap-8 inline-flex sm:ml-[300px] mt-[1000px]">
      <div className="sm:w-[1227px] justify-between items-start inline-flex">
          <div className="text-zinc-950 text-2xl font-semibold font-['Inter'] leading-loose">
            Top Rated{" "}
          </div>
          <button onClick={() => router.push(`./seemore3/`)}>
          <div className="px-4 py-2 bg-white rounded-md justify-center items-center gap-2 mt-[10px] ml-[400px] sm:ml-[0px] sm:mt-[0px] flex">
            <div className="text-zinc-950 text-sm font-medium font-['Inter'] leading-tight">
              See More{" "}
            </div>
            <img
              className="w-4 h-4 relative overflow-hidden"
              src="./arrow-right.svg"
            />
          </div>
          </button>
        </div>
        <div id="top-rated-movies" />
      </div>
      <div className="w-full h-[280px] sm:py-10 sm:px-10  bg-indigo-700 sm:justify-center items-start gap-12 sm:inline-flex pl-[20px] pt-[40px] sm:pt-0 sm:pl-0 mt-[850px] sm:mt-0">
        <div className="sm:grow-shrink basis-0 h-[200px] justify-start items-start sm:gap-[20px] sm:flex">
          <div className="self-stretch sm:flex-col justify-start items-start sm:gap-10 sm:inline-flex">
            <div className="flex-col justify-start items-start sm:gap-3 block sm:flex">
              <div className="justify-start items-center sm:gap-2 block inline-flex">
                <img className="w-5 h-5 relative" src="./n.svg" />
                <div className="text-white text-base font-bold font-['Inter'] leading-tight tracking-tight">
                  Movie Z
                </div>
              </div>
              <div className="text-white text-sm font-normal font-['Inter'] leading-tight pb-[35px]">
                © 2024 Movie Z. All Rights Reserved.
              </div>
            </div>
          </div>
          <div className="basis-0 h-[200px] justify-end items-start sm:gap-24 block sm:flex">
            <div className="h-[200px] flex-col justify-start items-start gap-3 sm:ml-[1200px] inline-flex">
              <div className="self-stretch text-neutral-50 text-sm font-normal font-['Inter'] leading-tight">
                Contact Information
              </div>
              <div className="flex-col justify-start items-start gap-6 flex">
                <div className="justify-start items-center gap-3 inline-flex">
                  <div className="w-4 h-4 relative  overflow-hidden" />
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-neutral-50 text-sm font-medium font-['Inter'] leading-tight">
                      Email:
                    </div>
                    <div className="text-neutral-50 text-sm font-normal font-['Inter'] leading-tight">
                      support@movieZ.com
                    </div>
                  </div>
                </div>
                <div className="justify-start items-center gap-3 inline-flex">
                  <div className="w-4 h-4 relative  overflow-hidden" />
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-neutral-50 text-sm font-medium font-['Inter'] leading-tight">
                      Phone:
                    </div>
                    <div className="text-neutral-50 text-sm font-normal font-['Inter'] leading-tight">
                      +976 (11) 123-4567
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-col justify-start items-start gap-3 block inline-flex ml-[150px]">
              <div className="text-neutral-50 text-sm font-normal font-['Inter'] leading-tight">
                Follow us{" "}
              </div>
              <div className="justify-start items-center gap-3 sm:inline-flex">
                <div className="text-neutral-50 text-sm font-medium font-['Inter'] leading-tight sm:mb-0 mb-[10px]">
                  Facebook
                </div>
                <div className="text-neutral-50 text-sm font-medium font-['Inter'] leading-tight sm:mb-0 mb-[10px]">
                  Instagram
                </div>
                <div className="text-neutral-50 text-sm font-medium font-['Inter'] leading-tight sm:mb-0 mb-[10px]">
                  Twitter
                </div>
                <div className="text-neutral-50 text-sm font-medium font-['Inter'] leading-tight sm:mb-0 mb-[10px]">
                  Youtube
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
