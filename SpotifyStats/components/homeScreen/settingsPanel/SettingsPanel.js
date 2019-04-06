import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  SafeAreaView
} from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';

import SettingsTopBar from './SettingsTopBar';
import TimeRange from './TimeRange';
import ResultsLimit from "./ResultsLimit";

class SettingsPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    nextProps.show ? this._panel.show() : this._panel.hide();
  }

  render() {
    const {
      toggle, selectedTimeRange, onSelectTimeRange,
      resultsLimit, onCompleteResultsLimit
    } = this.props;

    return (
      <SlidingUpPanel allowDragging={false} ref={c => this._panel = c}>
        <SafeAreaView style={styles.panel}>
          <SettingsTopBar toggleSettingsPanel={toggle}/>
          <TimeRange/>
          <ResultsLimit resultsLimit={resultsLimit}
                        onCompleteResultsLimit={onCompleteResultsLimit}/>
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
  settingsOptionHeader: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff'
  }
});

SettingsPanel.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selectedTimeRange: PropTypes.object.isRequired,
  resultsLimit: PropTypes.number.isRequired,
  onSelectTimeRange: PropTypes.func.isRequired,
  onCompleteResultsLimit: PropTypes.func.isRequired
};

export default SettingsPanel;