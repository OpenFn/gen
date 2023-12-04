import { http } from '@openfn/language-common';

/**
 * Sends a GET request to a specified URL and returns the response data.
 * 
 * @param {string} url - The URL to send the GET request to.
 * @returns {Promise<any>} - The response data from the GET request.
 */
async function getData(url) {
  try {
    const response = await http.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Internal Server Error');
  }
}