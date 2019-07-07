import * as types from "./actionTypes";
import SpotifyApi from '../components/api/SpotifyApi';

export function updateTimeRange(timeRangeKey) {
  return {type: types.UPDATE_TIME_RANGE, timeRangeKey}
}