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
import {connect} from 'react-redux';

import * as playlistActions from '../actions/playlistActions';

import getSpotifyApi from '../components/api/SpotifyApi';
import getRestApi from '../components/api/RestApi';

import HomeTopBar from '../components/homeScreen/HomeTopBar';
import SettingsPanel from '../components/homeScreen/settingsPanel/SettingsPanel';
import SongListItem from '../components/homeScreen/SongListItem';
import Colors from '../constants/Colors';

// for development
import {songItemsData} from '../testData/songItemData';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songItems: songItemsData,
      resultsLimit: 25,
      showSettingsPanel: false
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    this.spotifyApi = await getSpotifyApi();
    this.restApi = await getRestApi();

    this.props.actions.loadCreatedPlaylists();
    this.getUserTopTracks(this.props.timeRange);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.timeRange.key !== this.props.timeRange.key) {
      this.getUserTopTracks(nextProps.timeRange);
    }
  }

  getUserTopTracks = async (timeRange) => {
    try {
      const res = await this.spotifyApi.get('me/top/tracks', {
        params: {
          time_range: timeRange.key,
          limit: this.state.resultsLimit
        }
      });
      let songs = res.data.items;
      let songItems = songs.map((song, i) => {
        return {
          index: i,
          name: song.name,
          artists: song.artists.map(a => a.name),
          albumCoverSrc: song.album.images[2].url,
          uri: song.uri
        };
      });
      this.setState({songItems}, this._scrollView.scrollTo({x: 0}));
    } catch (err) {
      console.log(err)
    }
  };

  // Creates a new playlist in spotify and adds songs.
  createPlaylist = async () => {
    let userId = await AsyncStorage.getItem('spotify_user_id');
    const songURIs = this.state.songItems.map(s => s.uri);
    try {
      let res = await this.spotifyApi.post(`users/${userId}/playlists`, {
        name: `Top Songs ${this.props.timeRange.val}`
      });
      let playlistId = res.data.id;
      this.insertPlaylist(res.data);
      console.log(res.data);

      // inserts songs to playlist
      try {
        res = await this.spotifyApi.post(`playlists/${playlistId}/tracks`, {
          uris: songURIs
        })
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    }
  };

  // Inserts a newly created playlist into the DB.
  insertPlaylist = async (playlist) => {
    const _data = {
      id: playlist.id,
      uri: playlist.uri,
      name: `Top Songs ${this.props.timeRange.val}`,
      time_range: this.props.timeRange.key,
      href: playlist.href,
      collaborative: playlist.collaborative,
      _public: playlist.public
    };
    try {
      let res = await this.restApi.post('playlists', _data)
    } catch (err) {
      console.log(err);
    }
  };

  onCompleteResultsLimit = (resultsLimit) => {
    if (resultsLimit !== this.state.resultsLimit)
      this.setState({resultsLimit}, () => this.getUserTopTracks(this.props.timeRange))
  };

  toggleSettingsPanel = () => {
    this.setState((prevState) => ({
      showSettingsPanel: !prevState.showSettingsPanel
    }))
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
          <HomeTopBar
            timeRange={this.props.timeRange.val}
            toggleSettingsPanel={this.toggleSettingsPanel}
          />
          <ScrollView
            ref={el => this._scrollView = el}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <FlatList
              data={this.state.songItems}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <SongListItem
                  index={item.index}
                  name={item.name}
                  artists={item.artists}
                  albumCoverSrc={item.albumCoverSrc}
                />
              )}/>
          </ScrollView>
          <TouchableOpacity
            style={styles.addButtonStyle}
            onPress={this.createPlaylist}
          >
            <Icon
              name='ios-add'
              size={28}
              type='ionicon'
              color='#fff'
            />
          </TouchableOpacity>
        </SafeAreaView>
        <SettingsPanel
          show={this.state.showSettingsPanel}
          toggle={this.toggleSettingsPanel}
          selectedTimeRange={this.props.timeRange}
          resultsLimit={this.state.resultsLimit}
          onCompleteResultsLimit={this.onCompleteResultsLimit}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    timeRange: state.spotify.timeRange,
    playlists: state.spotify.playlists
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({},
      playlistActions
    ), dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  addButtonStyle: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 50,
  },
  topSafeView: {
    flex: 0,
    backgroundColor: 'rgb(33, 33, 33)',
  },
  container: {
    flex: 1,
    paddingBottom: 30,
    backgroundColor: 'rgb(49, 48, 49)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 0,
    backgroundColor: 'rgb(49, 48, 49)',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
