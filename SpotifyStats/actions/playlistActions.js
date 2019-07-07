import * as types from './actionTypes';
import {beginAjaxCall} from "./ajaxStatusActions";
import getSpotifyApi from '../components/api/SpotifyApi';
import getRestApi from '../components/api/RestApi';

const BASE_URL = 'http://0.0.0.0:3000/api';

export function loadCreatedPlaylists() {
  return function (dispatch) {
    dispatch(beginAjaxCall());
    return new Promise((resolve, reject) => {
      fetch(`${BASE_URL}/playlists`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }
}
