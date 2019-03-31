import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  FlatList
} from 'react-native';

import {ListItem, Icon} from 'react-native-elements'

const timeRanges = [{key: 'short_term', val: 'Past 4 Weeks'},
  {key: 'medium_term', val: 'Past 6 Months'},
  {key: 'long_term', val: 'All Time'}];

const TimeRange = ({selectedTimeRange, onSelectTimeRange}) => (
  <View>
    <Text style={styles.settingsOptionHeader}>Time Range</Text>
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={timeRanges}
      extraData={selectedTimeRange.val}
      renderItem={
        ({item}) => <ListItem
          containerStyle={styles.listItem}
          style={styles.listItem}
          title={
            <Text style={{fontSize: 16, color: '#fff'}}
                  numberOfLines={1}>{item.val}</Text>
          }
          onPress={() => onSelectTimeRange(item)}
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
  onSelectTimeRange: PropTypes.func.isRequired
};

export default TimeRange;