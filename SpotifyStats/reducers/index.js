import {combineReducers} from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import spotify from './spotifyReducer';


const rootReducer = combineReducers({
  spotify
});

export default rootReducer;