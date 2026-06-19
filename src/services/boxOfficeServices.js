import { privateApi, publicApi } from "@/api/axiosInstance";

export const getNowPlayingMovie = async () => {
  try {
    const response = await publicApi.get("movies/now-playing");
    return response.data;
  } catch (error) {
    throw new Error(error || "Unable to fetch now playing movies. Please try again later.");
  }
};

export const holdBoxOfficeTicketPost = async (data) => {      
  const response = await publicApi.post('ticket-hold-seats',data);  
  return response.data;
};

export const ApiForGetHoldBoxOfficeTicket = async (data) => {      
  const response = await publicApi.post('get-movie-ticket-from-hold_token',data);  
  return response.data;
};


export const releaseHoldTicketApi = async (hold_token) => {  
  const response = await publicApi.post('release-hold',hold_token);
  return response.data;
};

export const getBookedTicketsApi = async () => {  
  try {
    const response = await privateApi.get('my_tickets');
    return response.data;
  } catch (error) {
    throw new Error(error || "Unable to fetch booked tickets. Please try again later.");
  }
};

export const getSingleBookedTicketsApi = async (id) => {  
  try {
    const response = await privateApi.get(`my_tickets/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error || "Unable to fetch booked ticket. Please try again later.");
  }
};

export const apiForDownloadBookedTicket = async (id) => {
  try {
    const response = await privateApi.get(`download-ticket/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error || "Unable to fetch download ticket. Please try again later.");
  }
};

export const fetchBookedTicketFileDownload = async (id) => {
  try {
    const response = await privateApi.get(`download-ticket/${id}`, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};