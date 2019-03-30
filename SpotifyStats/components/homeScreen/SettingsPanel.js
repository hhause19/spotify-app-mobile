import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, ScrollView, Button, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';

import SettingsTopBar from './SettingsTopBar';
import {Icon} from 'react-native-elements';
import {ExpoLinksView} from '@expo/samples';
import Colors from "../../constants/Colors";

//const {height} = Dimensions.get('screen');

class SettingsPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.show) {
      this._panel.show();
    }
    else {
      this._panel.hide();
    }
  }

  render() {
    return (
      <SlidingUpPanel allowDragging={false} ref={c => this._panel = c}>
        <SafeAreaView style={styles.panel}>
          <SettingsTopBar toggleSettingsPanel={this.props.toggle}/>
        </SafeAreaView>
      </SlidingUpPanel>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgb(33, 33, 33)',
  },
});

SettingsPanel.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

export default SettingsPanel;