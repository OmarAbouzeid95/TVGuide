import { baseUrl, apiKey } from "../info";


export const searchMovies = async (text, mode) => {
    const res = await fetch(`${baseUrl}/search/${mode}?api_key=${apiKey}&language=en-US&query=${text}`);
    const data = await res.json();
    return data.results;
}
