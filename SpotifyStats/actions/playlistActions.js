import * as types from './actionTypes';
import {beginAjaxCall} from "./ajaxStatusActions";
import getSpotifyApi from '../components/api/SpotifyApi';
import getRestApi from '../components/api/RestApi';

const BASE_URL = 'http://0.0.0.0:3000/api';

export function loadCreatedPlaylistsSuccess(playlists) {
  return {type: types.LOAD_CREATED_PLAYLISTS_SUCCESS, playlists}
}

export function loadCreatedPlaylistsError() {
  return {type: types.LOAD_CREATED_PLAYLISTS_FAILURE}
}

/**
 * Gets the user's created spotify playlists from the db.
 * @return {function(*=): Promise<any>}
 */
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
        .then(res => res.json())
        .then(playlists => dispatch(loadCreatedPlaylistsSuccess(playlists)))
        .catch((err) => {
          dispatch(loadCreatedPlaylistsError());
          console.log(err)
        })
    })
  }
}
