import React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {AppLoading, Asset, Font, Icon} from 'expo';
import {AsyncStorage} from 'react-native';

// Redux
import {createStore, applyMiddleware} from 'redux';
import {Provider, connect} from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';
import initialState from './reducers/initialState';

import getSpotifyToken from './authorization/getSpotifyToken';
import refreshTokens from './authorization/refreshTokens';

import AppNavigator from './navigation/AppNavigator';

// API
import getRestApi from './components/api/RestApi';
import getSpotifyApi from './components/api/SpotifyApi';

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
            <AppNavigator/>
          </View>
        </Provider>
      );
    }
  }

  // //logs in the current user
  // _loginUser = async () => {
  //   const api = await getRestApi();
  //   res = api.post('login', 0);
  //   console.log(res);
  // };

  _getUserSpotifyToken = async () => {
    const api = await getRestApi();
    const spotifyApi = await getSpotifyApi();

    const res = await api.get('spotify_token');
    const {access_token, refresh_token, expiration_time} = res.data;
    console.log(res.data);
    // check that the token is not expired
    if (!expiration_time || new Date().getTime() > expiration_time) {
      console.log('Refresh access token');
      await AsyncStorage.setItem('access_token', await refreshTokens(refresh_token));
    } else {
      console.log('Access token valid');
      await AsyncStorage.setItem('access_token', access_token);
    }

    // get user id, save in storage. If error prompt for spotify auth
    try {
      const userData = await spotifyApi.get('me');
      AsyncStorage.setItem('spotify_user_id', userData.data.id);
    } catch (err) {
      console.log(err);
      console.log('Logging user in');
      await AsyncStorage.setItem('access_token', await getSpotifyToken());
      const userData = await spotifyApi.get('me');
      AsyncStorage.setItem('spotify_user_id', userData.data.id);
    }
  };

  _loadResourcesAsync = async () => {
    return Promise.all([

      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
      await this._getUserSpotifyToken()
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({isLoadingComplete: true});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
