import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, ScrollView, Button, StyleSheet, TouchableHighlight} from 'react-native';
import {Icon} from 'react-native-elements';
import {ExpoLinksView} from '@expo/samples';
import Colors from "../../constants/Colors";

class HomeTopBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.topSongs}>Top Songs</Text>
        <Text style={styles.timeRange}>{this.props.timeRange}</Text>
        <View style={styles.settingsIcon}>
          <Icon
            onPress={this.props.toggleSettingsPanel}
            name='ios-cog'
            size={28}
            type='ionicon'
            underlayColor={'rgb(33, 33, 33)'}
            color='white'/>
        </View>
      </View>
    );
  }
}

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
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
  }
});

HomeTopBar.propTypes = {
  timeRange: PropTypes.string.isRequired,
  toggleSettingsPanel: PropTypes.func.isRequired
};

export default HomeTopBar;