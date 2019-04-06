import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import {AsyncStorage} from 'react-native';

// Redux
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';
import initialState from './reducers/initialState';

import getSpotifyToken from './authorization/getSpotifyToken';
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

  _getUserSpotifyToken = async () => {
    let access_token;
    const api = await getRestApi();
    const res = await api.get('spotify_token');

    // test if the user is still logged in
    const spotifyApi = await getSpotifyApi();
    try {
      const loginTest = await spotifyApi.get('me');
      console.log('spotify already logged in');
      access_token = res.data.access_token;
    } catch (err) {
      access_token = await getSpotifyToken();
    }

    AsyncStorage.setItem('access_token', access_token);
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
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
