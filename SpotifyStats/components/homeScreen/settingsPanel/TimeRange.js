import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';

import {ListItem, Icon} from 'react-native-elements';
import {TIME_RANGES} from '../../../constants/spotifyConstants'

import * as spotifyActions from '../../../actions/spotifyActions';

const TimeRange = ({selectedTimeRange, actions}) => (
  <View>
    <Text style={styles.settingsOptionHeader}>Time Range</Text>
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={TIME_RANGES}
      extraData={selectedTimeRange.val}
      renderItem={
        ({item}) => <ListItem
          containerStyle={styles.listItem}
          style={styles.listItem}
          title={
            <Text style={{fontSize: 16, color: '#fff'}}
                  numberOfLines={1}>{item.val}</Text>
          }
          onPress={() => actions.updateTimeRange(item.key)}
          rightElement={
            selectedTimeRange.key === item.key && <Icon name='ios-checkmark'
                                                        type='ionicon'
                                                        size={26}
                                                        color='white'/>
          }/>
      }/>
  </View>
);


const styles = StyleSheet.create({
  settingsOptionHeader: {
    padding: 20,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff'
  },
  listItem: {
    backgroundColor: 'rgb(49, 48, 49)',
    height: 44
  }
});

TimeRange.propTypes = {
  selectedTimeRange: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    updateTimeRange: PropTypes.func.isRequired
  })
};

const mapStateToProps = (state) => {
  return {
    selectedTimeRange: state.spotify.timeRange
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(spotifyActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeRange);