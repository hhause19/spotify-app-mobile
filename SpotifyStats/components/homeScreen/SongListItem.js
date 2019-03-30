import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';

import {ListItem} from 'react-native-elements'

const SongListItem = ({index, name, artists, albumCoverSrc}) => {
  return <ListItem
    containerStyle={{backgroundColor: 'rgb(49, 48, 49)'}}
    title={<Text style={{fontSize: 16, color: '#fff'}}
                 numberOfLines={1}>{name}</Text>}
    subtitle={<Text style={{fontSize: 12, color: '#fff'}}
                    numberOfLines={1}>{artists.join(', ')}</Text>}
    leftAvatar={{
      rounded: false,
      source: {uri: albumCoverSrc},
    }}
    leftElement={
      <Text style={{width: 20, color: '#fff'}}>{index + 1}.</Text>
    }
  />
};

SongListItem.propTypes = {
  name: PropTypes.string
};

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});

export default SongListItem;

