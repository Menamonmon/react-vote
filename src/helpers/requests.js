import axios from 'axios';

export function getUserData(APIUrl) {
  const electionsUrl = `${APIUrl}elections/`;
  const votesUrl = `${APIUrl}votes/`;
  const electionsPromise = axios.get(electionsUrl);
  const votesPromise = axios.get(votesUrl);
  return Promise.all([electionsPromise, votesPromise]);
}