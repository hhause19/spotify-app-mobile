import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import {Icon} from 'react-native-elements';

const HomeTopBar = ({timeRange, toggleSettingsPanel}) => (
  <View style={styles.container}>
    <View style={styles.preferencesIcon}>
      <Icon
        onPress={() => {}}
        name='ios-podium'
        size={28}
        type='ionicon'
        underlayColor={'rgb(33, 33, 33)'}
        color='white'/>
    </View>
    <Text style={styles.topSongs}>Top Songs</Text>
    <Text style={styles.timeRange}>{timeRange}</Text>
    <View style={styles.settingsIcon}>
      <Icon
        onPress={toggleSettingsPanel}
        name='ios-settings'
        size={28}
        type='ionicon'
        underlayColor={'rgb(33, 33, 33)'}
        color='white'/>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingTop: 5,
    backgroundColor: 'rgb(33, 33, 33)',
  },
  topSongs: {
    textAlign: 'center',
    fontSize: 24,
    color: '#fff'
  },
  timeRange: {
    textAlign: 'center',
    fontSize: 12,
    color: '#fff'
  },
  preferencesIcon: {
    position: 'absolute',
    height: 50,
    width: 50,
    top: 10,
    left: 0
  },
  settingsIcon: {
    position: 'absolute',
    height: 50,
    width: 50,
    top: 10,
    right: 0
  }
});

HomeTopBar.propTypes = {
  timeRange: PropTypes.string.isRequired,
  toggleSettingsPanel: PropTypes.func.isRequired
};

export default HomeTopBar;