import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import {Slider} from 'react-native-elements'

const ResultsLimit = ({resultsLimit, onCompleteResultsLimit}) => (
  <View>
    <Text style={styles.settingsOptionHeader}>Results Limit</Text>
    <Text style={styles.resultsNumber}>{resultsLimit}</Text>
    <View style={styles.sliderContainer}>
      <Slider value={resultsLimit}
              onSlidingComplete={onCompleteResultsLimit}
              minimumValue={1}
              maximumValue={50}
              minimumTrackTintColor='#b3b3b3'
              maximumTrackTintColor='#3f3f3f'
              step={1}
              thumbTintColor='white'/>
    </View>
  </View>
);

const styles = StyleSheet.create({
  settingsOptionHeader: {
    paddingTop: 20,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff'
  },
  resultsNumber: {
    padding: 0,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff'
  },
  sliderContainer: {
    padding: 20,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  }
});

ResultsLimit.propTypes = {
  resultsLimit: PropTypes.number.isRequired,
  onCompleteResultsLimit: PropTypes.func.isRequired
};

export default ResultsLimit;