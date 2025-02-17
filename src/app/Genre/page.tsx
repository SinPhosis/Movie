"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

type Genre = {
  id: number;
  name: string;
};

const movieApiKey = "db430a8098715f8fab36009f57dff9fb";

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

export default function GenrePage() {
  const [isGenreButton, setIsGenreButton] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [genres, setGenres] = useState<Genre[]>(genresData);
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const toggleGenreButton = (): void => {
    setIsGenreButton(!isGenreButton);
  };

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setSearchValue(value);
  };

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
        <div className="sm:w-[1785px] sm:ml-[320px] w-[640px] h-[59px] items-center inline-flex sm:ml-[200px] flex">
          <a href={`/`}>
            <div className="justify-start items-center gap-2 flex">
              <img
                className="w-5 h-5 relative overflow-hidden sm:w-[20px] sm:h-[20px]"
                src="../film.svg"
              />
              <div
                className={`text-${
                  isDarkMode ? "indigo-300" : "indigo-700"
                } text-base font-bold font-['Inter'] leading-tight tracking-tight flex w-[100px] sm:mr-[300px]`}
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
      <div className="text-zinc-950 text-3xl font-semibold font-['Inter'] pl-[80px] pt-[52px] leading-9">Search filter</div>
    </div>
  );
}
