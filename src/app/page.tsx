"use client";
import { useState, JSX, useEffect } from "react";

export default function App(): JSX.Element {
  const [isGenreButton, setIsGenreButton] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const movieApiKey = "db430a8098715f8fab36009f57dff9fb";
  const getPopularMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${movieApiKey}&language=en-US&page=1`
      );
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  getPopularMovies();

  const getCurrentlyPlayingMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${movieApiKey}&language=en-US&page=1`
      );
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  getCurrentlyPlayingMovies();

  const getUpcomingMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${movieApiKey}&language=en-US&page=1`
      );
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  getUpcomingMovies();

  const getTopRatedMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${movieApiKey}&language=en-US&page=1`
      );
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  getTopRatedMovies();

  const toggleGenreButton = (): void => {
    setIsGenreButton(!isGenreButton);
  };

  const toggleDarkMode = (): void => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`w-full h-[59px] px-4 ${
        isDarkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
      } items-center inline-flex`}
    >
      <div className="w-[1785px] h-9 items-center inline-flex ml-[320px]">
        <div className="justify-start items-center gap-2 flex">
          <img className="w-5 h-5 relative overflow-hidden" src="./film.svg" />
          <div
            className={`text-${
              isDarkMode ? "indigo-300" : "indigo-700"
            } text-base font-bold font-['Inter'] leading-tight tracking-tight mr-[330px]`}
          >
            Movie Z
          </div>
        </div>
        <div className="relative">
          <button
            className="w-[97px] h-9 px-4 py-2 bg-white rounded-md shadow-sm rounded-lg border border-[#e3e3e7] justify-center items-center gap-2 inline-flex"
            onClick={toggleGenreButton}
          >
            <img
              className={`w-4 h-4 relative overflow-hidden transform ${
                isGenreButton ? "rotate-180" : ""
              }`}
              src="./chevron-down.png"
            />
            <div className="text-zinc-900 text-sm font-medium font-['Inter'] leading-tight">
              Genre
            </div>
          </button>
          {isGenreButton && (
            <div className="absolute top-full left-0 w-[577px] mt-2 p-5 bg-white border rounded-lg border-[#e3e3e7] flex-col justify-start items-start inline-flex">
              <div className="h-[60px] flex-col justify-start items-start gap-1 flex">
                <div className="self-stretch text-zinc-950 text-2xl font-semibold font-['Inter'] leading-loose">
                  Genres
                </div>
                <div className="self-stretch text-zinc-950 text-base font-normal font-['Inter'] leading-normal">
                  See lists of movies by genre
                </div>
              </div>
              <div className="h-[33px] py-4 flex-col justify-start items-start gap-2.5 inline-flex mt-[10px]">
                <div className="w-[537px] h-px border border-gray-400" />
              </div>
              <div className="h-[200px] justify-start items-start gap-4 inline-flex">
                <button className="pl-2.5 pr-1 py-0.5 rounded-full border border-[#e3e3e7] justify-start items-start gap-2 flex">
                  <p className="text-zinc-950 text-xs font-semibold font-['Inter'] leading-none mt-[2px]">
                    Action
                  </p>
                  <img
                    className="w-4 h-4 relative overflow-hidden"
                    src="./chevron-right.svg"
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-[379px] h-9 px-3 bg-white rounded-[10px] border border-[#e3e3e7] justify-start items-center gap-2.5 inline-flex ml-[20px]">
          <img
            className="w-4 h-4 relative opacity-50 overflow-hidden"
            src="./glass.png"
          />
          <div className="py-2 justify-start items-center gap-2.5 flex">
            <input
              className="w-[355px] h-8 text-zinc-500 text-sm font-normal font-['Inter'] leading-tight"
              placeholder="Search..."
              type="text"
            />
          </div>
        </div>
        <div className="w-9 h-9 justify-end items-center gap-3 inline-flex ml-[550px]">
          <button
            className="w-9 h-9 bg-white rounded-[1px] shadow-sm border border-[#e3e3e7] justify-center items-center gap-2 flex"
            onClick={toggleDarkMode}
          >
            <img
              className="w-[30px] h-[30px] relative overflow-hidden"
              src="./moon.svg"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
