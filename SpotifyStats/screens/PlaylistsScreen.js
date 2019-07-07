import React, {Fragment} from 'react';
import axios from 'axios';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {ButtonGroup} from 'react-native-elements'
import {WebBrowser} from 'expo';
import {AuthSession} from 'expo'
import {MonoText} from '../components/StyledText';
import {Icon} from 'react-native-elements';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import {loadCreatedPlaylists} from '../actions/playlistActions';

import getSpotifyApi from '../components/api/SpotifyApi';
import getRestApi from '../components/api/RestApi';

import HomeTopBar from '../components/homeScreen/HomeTopBar';
import SettingsPanel from '../components/homeScreen/settingsPanel/SettingsPanel';
import SongListItem from '../components/homeScreen/SongListItem';
import Colors from '../constants/Colors';

class PlaylistsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: []
    };
  }

  componentDidMount() {
  }

  getPlaylists = async () => {

  };

  render() {
    return (
      <Fragment>
        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"
        />
        <SafeAreaView style={styles.topSafeView}/>
        <SafeAreaView style={styles.container}>

        </SafeAreaView>
      </Fragment>
    )
  };
};

const mapStateToProps = (state) => {
  return {
    timeRange: state.spotify.timeRange
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({}, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistsScreen);

const styles = StyleSheet.create({
  topSafeView: {
    flex: 0,
    backgroundColor: 'rgb(33, 33, 33)',
  },
});