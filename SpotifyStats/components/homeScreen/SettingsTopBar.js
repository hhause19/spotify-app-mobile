import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, ScrollView, Button, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';

class HomeTopBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.settingsText}>Settings</Text>
        <View style={styles.settingsIcon}>
          <Text onPress={this.props.toggleSettingsPanel} style={styles.doneText}>Done</Text>
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
  settingsText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#fff'
  },
  settingsIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  doneText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700'
  }
});

HomeTopBar.propTypes = {
  toggleSettingsPanel: PropTypes.func.isRequired
};

export default HomeTopBar;