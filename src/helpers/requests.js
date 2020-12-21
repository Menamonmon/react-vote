import axios from 'axios';

export function getUserData(APIUrl) {
  const electionsUrl = `${APIUrl}elections/`;
  const votesUrl = `${APIUrl}votes/`;
  const electionsPromise = axios.get(electionsUrl);
  const votesPromise = axios.get(votesUrl);
  return Promise.all([electionsPromise, votesPromise]);
}

export function deleteVote(APIUrl, vote_id) {
  return axios.delete(`${APIUrl}votes/delete/`, { vote_id });
}

export function submitVote(APIUrl, data) {
  return axios.post(`${APIUrl}votes/submit/`, data);
}