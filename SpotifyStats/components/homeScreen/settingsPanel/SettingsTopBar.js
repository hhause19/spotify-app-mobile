import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, ScrollView, Button, StyleSheet} from 'react-native';

const SettingsTopBar = ({toggleSettingsPanel}) => (
  <View style={styles.container}>
    <Text style={styles.settingsText}>Settings</Text>
    <View style={styles.settingsIcon}>
      <Text onPress={toggleSettingsPanel} style={styles.doneText}>Done</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingTop: 5,
    backgroundColor: 'rgb(33, 33, 33)',
  },
  settingsText: {
    textAlign: 'center',
    fontSize: 24,
    color: '#fff'
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  doneText: {
    color: 'white',
    fontSize: 19,
    fontWeight: '600'
  }
});

SettingsTopBar.propTypes = {
  toggleSettingsPanel: PropTypes.func.isRequired
};

export default SettingsTopBar;