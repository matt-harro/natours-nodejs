import { timeout } from './timeout';

const REQUEST_TIMEOUT_SEC = 5;

export const useFetch = async (url, uploadData = null) => {
  try {
    const req = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData)
        })
      : fetch(url);

    const res = await Promise.race([req, timeout(REQUEST_TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch')
      err.message = `Unable to reach the server. Please check your internet connection...`;
    throw err;
  }
};
