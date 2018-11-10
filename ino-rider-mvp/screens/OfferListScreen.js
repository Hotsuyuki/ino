import _ from 'lodash';
import React from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  LayoutAnimation, UIManager,
} from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { AppLoading } from 'expo';
import { connect } from 'react-redux';

import * as actions from '../actions';


class OfferListScreen extends React.Component {
  async componentWillMount() {
    // Call action creators
    this.props.fetchRiderInfo();
    this.props.fetchOwnReservations();
    this.props.fetchAllOffers();
  }


  componentWillUpdate() {
  // Ease in & Ease out animation
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  LayoutAnimation.easeInEaseOut();
}


  onListItemPress = (selectedItem, isReservation) => {
    // Nvigate to `DetailScreen` with params
    this.props.navigation.navigate('detail', {
      riderId: this.props.riderInfo.id,
      selectedOfferId: selectedItem.offer.id,
      isReservation
    });
  }


  renderOwnReservations() {
    // for debug
    //console.log(`this.props.ownReservations.length = ${this.props.ownReservations.length}`);

    if (this.props.ownReservations.length === 0) {
      return (
        <View style={{ padding: 10 }}>
          <Text style={styles.grayTextStyle}>予約済のオファーはまだありません</Text>
        </View>
      );
    }

    return (
      <View>
        {this.props.ownReservations.map((item, index) => {
          // Trim year(frist 5 characters) and second(last 3 characters),
          // and replace hyphens by slashes
          const trimedDepartureTime = item.offer.departure_time.substring(5, item.offer.departure_time.length - 3).replace(/-/g, '/');

          const isReservation = true;

          return (
            <ListItem
              key={index}
              leftIcon={{ name: 'person', color: 'black' }}
              title={
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: 2 }}>
                    <Text>{`${item.driver.last_name} ${item.driver.first_name}`}</Text>
                    <Text>{`${item.driver.major}`}</Text>
                    <Text>{`${item.driver.grade}`}</Text>
                    <Text>{`${item.driver.car_color} ${item.driver.car_number}`}</Text>
                  </View>

                  <View style={{ flex: 3 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon name='map-marker' type='font-awesome' size={15} />
                      <Text style={{ paddingLeft: 5 }}>{`${item.offer.start}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon name='flag-checkered' type='font-awesome' size={10} />
                      <Text style={{ paddingLeft: 5 }}>{`${item.offer.goal}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon name='timer' size={10} />
                      <Text style={{ paddingLeft: 5 }}>{`${trimedDepartureTime}`}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon name='car' type='font-awesome' size={10} />
                      <Text style={{ paddingLeft: 5 }}>{`${item.reserved_riders.length} / ${item.offer.rider_capacity}人`}</Text>
                    </View>
                  </View>
                </View>
              }
              onPress={() => this.onListItemPress(item, isReservation)}
            />
          );
        })}
      </View>
    );
  }


  renderAllOffers() {
    // for debug
    //console.log(`this.props.allOffers.length = ${this.props.allOffers.length}`);

    if (this.props.allOffers.length === 0) {
      return (
        <View style={{ padding: 10 }}>
          <Text style={styles.grayTextStyle}>受付中のオファーはまだありません</Text>
        </View>
      );
    }

    return (
      <View>
        {this.props.allOffers.map((item, index) => {
          // Trim year(frist 5 characters) and second(last 3 characters),
          // and replace hyphens by slashes
          const trimedDepartureTime = item.offer.departure_time.substring(5, item.offer.departure_time.length - 3).replace(/-/g, '/');

          // Whether this offer(`item`) is reservation or not
          let isReservation = false;
          item.reserved_riders.forEach((reservedRiderId) => {
            if (reservedRiderId === this.props.riderInfo.id) {
              isReservation = true;
            }
          });

          if (!isReservation) {
            return (
              <ListItem
                key={index}
                leftIcon={{ name: 'person', color: 'black' }}
                title={
                  <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 2 }}>
                      <Text>{`${item.driver.last_name} ${item.driver.first_name}`}</Text>
                      <Text>{`${item.driver.major}`}</Text>
                      <Text>{`${item.driver.grade}`}</Text>
                      <Text>{`${item.driver.car_color} ${item.driver.car_number}`}</Text>
                    </View>

                    <View style={{ flex: 3 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name='map-marker' type='font-awesome' size={15} />
                        <Text style={{ paddingLeft: 5 }}>{`${item.offer.start}`}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name='flag-checkered' type='font-awesome' size={10} />
                        <Text style={{ paddingLeft: 5 }}>{`${item.offer.goal}`}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name='timer' size={10} />
                        <Text style={{ paddingLeft: 5 }}>{`${trimedDepartureTime}`}</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name='car' type='font-awesome' size={10} />
                        <Text style={{ paddingLeft: 5 }}>{`${item.reserved_riders.length} / ${item.offer.rider_capacity}人`}</Text>
                      </View>
                    </View>
                  </View>
                }
                onPress={() => this.onListItemPress(item, isReservation)}
              />
            );
          }

          // If it is reservation, render nothing
          return <View key={index} />;
        })}
      </View>
    );
  }


  render() {
    // for debug
    //console.log(`(typeof this.props.riderInfo.id) = ${(typeof this.props.riderInfo.id)}`);
    //console.log(`_.isNull(this.props.allOffers) = ${_.isNull(this.props.allOffers)}`);
    //console.log(`_.isNull(this.props.ownReservations) = ${_.isNull(this.props.ownReservations)}`);

    // Wait to fetch own rider info, own reservations, and all offers
    if ((typeof this.props.riderInfo.id) === 'undefined' ||
        _.isNull(this.props.ownReservations) ||
        _.isNull(this.props.allOffers)) {
      return <AppLoading />;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.grayTextStyle}>予約済</Text>
          </View>

          {this.renderOwnReservations()}

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.grayTextStyle}>受付中</Text>
          </View>

          {this.renderAllOffers()}

        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  grayTextStyle: {
    fontSize: 18,
    color: 'gray',
    padding: 10
  },
  listItemStyle: {
    paddingTop: 5,
    paddingLeft: 20
  },
});


const mapStateToProps = (state) => {
  return {
    riderInfo: state.riderReducer.riderInfo,
    ownReservations: state.riderReducer.ownReservations,
    allOffers: state.riderReducer.allOffers
  };
};


export default connect(mapStateToProps, actions)(OfferListScreen);