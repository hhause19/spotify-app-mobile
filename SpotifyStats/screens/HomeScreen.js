import React from 'react';
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
  SafeAreaView,
} from 'react-native';
import {ButtonGroup} from 'react-native-elements'
import {WebBrowser} from 'expo';
import {AuthSession} from 'expo'
import {MonoText} from '../components/StyledText';

import SongListItem from '../components/SongListItem';
 const timeRangeButtons = [{key: 'short_term', value: '4 Weeks'},
      {key: 'medium_term', value: '6 Months'},
      {key: 'long_term', value: 'All Time'}];

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songItems: [],
      timeRange: 'medium_term'
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.getUserTopTracks();
  };

  getUserTopTracks = async () => {
    const access_token = await AsyncStorage.getItem('access_token');
    try {
      const res = await axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/top/tracks',
        params: {
          time_range: this.state.timeRange,
          limit: 50
        },
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      });
      let songs = res.data.items;
      let songItems = songs.map((song, i) => {
        return {
          index: i,
          name: song.name,
          artists: song.artists.map(a => a.name),
          albumCoverSrc: song.album.images[2].url
        };
      });
      this.setState({songItems}, this._scrollView.scrollTo({x: 0}));
    } catch (err) {
      console.log(err)
    }
  };

  onSelectTimeRange = (selectedIndex) => {
    this.setState({
        timeRange: timeRangeButtons[selectedIndex].key
      },
      this.getUserTopTracks)
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ButtonGroup
          onPress={this.onSelectTimeRange}
          selectedIndex={timeRangeButtons.findIndex(b => b.key === this.state.timeRange)}
          buttons={timeRangeButtons.map(b => b.value)}
          containerStyle={{height: 50}}
        />
        <ScrollView ref={el => this._scrollView = el}
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}>

          <FlatList
            data={this.state.songItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <SongListItem index={item.index}
                                                  name={item.name}
                                                  artists={item.artists}
                                                  albumCoverSrc={item.albumCoverSrc}/>}/>
          {/*<View style={styles.welcomeContainer}>*/}
          {/*<Image*/}
          {/*source={*/}
          {/*__DEV__*/}
          {/*? require('../assets/images/robot-dev.png')*/}
          {/*: require('../assets/images/robot-prod.png')*/}
          {/*}*/}
          {/*style={styles.welcomeImage}*/}
          {/*/>*/}
          {/*</View>*/}

          {/*<View style={styles.getStartedContainer}>*/}
          {/*{this._maybeRenderDevelopmentModeWarning()}*/}

            {/*<Text style={styles.getStartedText}>Get started by opening</Text>*/}

            {/*<View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>*/}
              {/*<MonoText style={styles.codeHighlightText}>screens/Hello.js</MonoText>*/}
            {/*</View>*/}

            {/*<Text style={styles.getStartedText}>*/}
              {/*{this.state.name ? `${this.state.name}` : 'Change this text and your app will automatically reload.'}*/}
            {/*</Text>*/}
          {/*</View>*/}

          {/*<View style={styles.helpContainer}>*/}
            {/*<TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>*/}
              {/*<Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>*/}
            {/*</TouchableOpacity>*/}
          {/*</View>*/}
        </ScrollView>

        {/*<View style={styles.tabBarInfoContainer}>*/}
          {/*<Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>*/}

          {/*<View style={[styles.codeHighlightContainer, styles.navigationFilename]}>*/}
            {/*<MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>*/}
          {/*</View>*/}
        {/*</View>*/}
      </SafeAreaView>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
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
