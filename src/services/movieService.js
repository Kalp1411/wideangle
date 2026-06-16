import { publicApi } from "@/api/axiosInstance";

export const ApiForFetchMovies = async (params = {}) => {
  try {    
    const response = await publicApi.get("get-movies",{
      params,
    });    
    return response.data;
  } catch (error) {
    throw error
  }
};

export const ApiForFetchMovieCategories = async (params = {}) => {
  try {
    const response = await publicApi.get("get-moviecategories", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ApiForFetchMovieTrailers = async (params = {}) => {
  try {
    const response = await publicApi.get("get-movie-trailers", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ApiForFetchSingleMovieDetail = async (movieSlug) => {
  try {
    const response = await publicApi.get(`get-single-movie-details/${movieSlug}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ApiForFetchAvailableShowtimes = async ({ movie_id, date }) => {
  try {
    const response = await publicApi.get(`get-movie-shows`, {
      params: { movie_id, date }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ApiForFetchSeatOfShowtime = async (id) => {
  try {
    const response = await publicApi.get(`screen-layout-by-screen-assign_id/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};