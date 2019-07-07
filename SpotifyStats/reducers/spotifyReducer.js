import * as types from "../actions/actionTypes";
import {TIME_RANGES} from "../constants/spotifyConstants";
import initialState from './initialState';

export default function spotifyReducer(state = initialState.spotify, action) {
  switch (action.type) {
    case types.UPDATE_TIME_RANGE:
      return {
        ...state,
        timeRange: TIME_RANGES.find(tr => tr.key === action.timeRangeKey)
      };
    case types.LOAD_CREATED_PLAYLISTS_SUCCESS:
      return {
        ...state,
        playlists: action.playlists
      };
    default:
      return state;
  }
}
