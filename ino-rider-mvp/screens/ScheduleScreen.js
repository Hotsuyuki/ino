import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Alert,
  LayoutAnimation, UIManager, Platform,
} from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';
import { AppLoading, Notifications } from 'expo';
import { connect } from 'react-redux';

import * as actions from '../actions';


const SUN = 0;
const MON = 1;
const TUE = 2;
const WED = 3;
const THU = 4;
const FRI = 5;
const SAT = 6;

const TOKO = 0;
const GEKO = 1;

const scheduleTemplate = [
  {
    day: SUN,
    toko: { start: -1, end: -1 },
    geko: { start: -1, end: -1 }
  },
  {
    day: MON,
    toko: { start: -1, end: -1 },
    geko: { start: -1, end: -1 }
  },
  {
    day: TUE,
    toko: { start: -1, end: -1 },
    geko: { start: -1, end: -1 }
  },
  {
    day: WED,
    toko: { start: -1, end: -1 },
    geko: { start: -1, end: -1 }
  },
  {
    day: THU,
    toko: { start: -1, end: -1 },
    geko: { start: -1, end: -1 }
  },
  {
    day: FRI,
    toko: { start: -1, end: -1 },
    geko: { start: -1, end: -1 }
  },
  {
    day: SAT,
    toko: { start: -1, end: -1 },
    geko: { start: -1, end: -1 }
  },
];

const INITIAL_STATE = {
  initialSchedule: JSON.parse(JSON.stringify(scheduleTemplate)), // deep copy without reference
  editedSchedule: scheduleTemplate,
};


class ScheduleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }


  componentWillMount() {
    // Reset the badge number to zero (iOS only)
    Notifications.setBadgeNumberAsync(0);

    //this.props.getRiderInfo();

    // This is not an acntion creator
    // Just GET the demand schedule from the server and store into `this.state`
    this.fetchDemandSchedule();

    // Reflesh `this.props.ownReservations` and `this.props.allOffers` in `OfferListScreen`
    // and make `OfferListScreen` rerender by calling action creators
    this.props.fetchOwnReservations();
    this.props.fetchAllOffers();
  }


  componentWillUpdate() {
    // On Android, UIManager animation will affect ModalSelector
    // https://github.com/moschan/react-native-simple-radio-button/issues/83#issuecomment-428003428
    if (Platform.OS === 'ios') {
      // Ease in & Ease out animation
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
      LayoutAnimation.easeInEaseOut();
    }
  }


  async fetchDemandSchedule() {
    // GET the own demand schedule
    try {
      let demandResponse = await fetch(`https://inori.work/demand/${this.props.riderInfo.id}`);

      // If succeed to GET the own demand schedule,
      if (parseInt(demandResponse.status / 100, 10) === 2) {
        let demandResponseJson = await demandResponse.json();

        // Sort `demandResponseJson.schedule` by `day`
        demandResponseJson.schedule.sort((a, b) => {
          if (a.day < b.day) {
            return -1;
          }
          if (a.day > b.day) {
            return 1;
          }
          return 0;
        });

        this.setState({
          initialSchedule: JSON.parse(JSON.stringify(demandResponseJson.schedule)), // deep copy without reference
          editedSchedule: demandResponseJson.schedule
        });

      // If failed to GET the own demand schedule,
      } else if (parseInt(demandResponse.status / 100, 10) === 4 ||
                 parseInt(demandResponse.status / 100, 10) === 5) {
        console.log('Failed to GET the demand schedule...');

        const tmpSchedule = [
          {
            day: SUN,
            toko: { start: 0, end: 0 },
            geko: { start: 0, end: 0 }
          },
          {
            day: MON,
            toko: { start: 0, end: 0 },
            geko: { start: 0, end: 0 }
          },
          {
            day: TUE,
            toko: { start: 0, end: 0 },
            geko: { start: 0, end: 0 }
          },
          {
            day: WED,
            toko: { start: 0, end: 0 },
            geko: { start: 0, end: 0 }
          },
          {
            day: THU,
            toko: { start: 0, end: 0 },
            geko: { start: 0, end: 0 }
          },
          {
            day: FRI,
            toko: { start: 0, end: 0 },
            geko: { start: 0, end: 0 }
          },
          {
            day: SAT,
            toko: { start: 0, end: 0 },
            geko: { start: 0, end: 0 }
          },
        ];

        // Sort `tmpSchedule` by `day`
        tmpSchedule.sort((a, b) => {
          if (a.day < b.day) {
            return -1;
          }
          if (a.day > b.day) {
            return 1;
          }
          return 0;
        });

        this.setState({
          initialSchedule: JSON.parse(JSON.stringify(tmpSchedule)), // deep copy without reference
          editedSchedule: tmpSchedule
        });
      }

    // If cannot access demand api,
    } catch (error) {
      console.error(error);
      console.log('Cannot access demand api...');
    }
  }


  dayId2Text(dayId) {
    switch (dayId) {
      case MON:
        return '(月)';

      case TUE:
        return '(火)';

      case WED:
        return '(水)';

      case THU:
        return '(木)';

      case FRI:
        return '(金)';

      default:
        return null;
    }
  }


  timeId2String(timeId) {
    // `timeId` = 11 ---> `hours` = 2
    const hours = Math.floor(timeId / 4);

    // `timeId` = 11 ---> `minutes` = 45
    const minutes = (timeId % 4) * 15;

    // `hours` = 2, `minutes` = 45 ---> `timeString` = "2:45"
    const timeString = `${hours}:${minutes === 0 ? '00' : minutes}`;

    return timeString;
  }


  timeString2Id(timeString) {
    // `timeString` = "2:45" ---> `timeArray` = [2, 45]
    const timeArray = timeString.split(':');

    // `timeArray` = [2, 45] ---> `timeId` = 11
    const timeId = (timeArray[0] * 4) + (timeArray[1] / 15);

    return timeId;
  }


  chooseTimeRange(direction, borderTimeId) {
    let index = 0;
    let data = [];
    const selectedData = [];

    switch (direction) {
      case TOKO:
        data = [
          { key: index++, label: '8:00', timeId: this.timeString2Id('8:00') },
          { key: index++, label: '8:15', timeId: this.timeString2Id('8:15') },
          { key: index++, label: '8:30', timeId: this.timeString2Id('8:30') },
          { key: index++, label: '8:45', timeId: this.timeString2Id('8:45') },
          { key: index++, label: '9:00', timeId: this.timeString2Id('9:00') },
          { key: index++, label: '9:15', timeId: this.timeString2Id('9:15') },
          { key: index++, label: '9:30', timeId: this.timeString2Id('9:30') },
          { key: index++, label: '9:45', timeId: this.timeString2Id('9:45') },
          { key: index++, label: '10:00', timeId: this.timeString2Id('10:00') },
          { key: index++, label: '10:15', timeId: this.timeString2Id('10:15') },
          { key: index++, label: '10:30', timeId: this.timeString2Id('10:30') },
          { key: index++, label: '10:45', timeId: this.timeString2Id('10:45') },
          { key: index++, label: '11:00', timeId: this.timeString2Id('11:00') },
          { key: index++, label: '11:15', timeId: this.timeString2Id('11:15') },
          { key: index++, label: '11:30', timeId: this.timeString2Id('11:30') },
          { key: index++, label: '11:45', timeId: this.timeString2Id('11:45') },
          { key: index++, label: '12:00', timeId: this.timeString2Id('12:00') },
          { key: index++, label: '12:15', timeId: this.timeString2Id('12:15') },
          { key: index++, label: '12:30', timeId: this.timeString2Id('12:30') },
          { key: index++, label: '12:45', timeId: this.timeString2Id('12:45') },
          { key: index++, label: '13:00', timeId: this.timeString2Id('13:00') },
          { key: index++, label: '13:15', timeId: this.timeString2Id('13:15') },
          { key: index++, label: '13:30', timeId: this.timeString2Id('13:30') },
          { key: index++, label: '13:45', timeId: this.timeString2Id('13:45') },
          { key: index++, label: '14:00', timeId: this.timeString2Id('14:00') },
          { key: index++, label: '14:15', timeId: this.timeString2Id('14:15') },
          { key: index++, label: '14:30', timeId: this.timeString2Id('14:30') },
          { key: index++, label: '14:45', timeId: this.timeString2Id('14:45') },
        ];
        break;

      case GEKO:
        data = [
          { key: index++, label: '12:00', timeId: this.timeString2Id('12:00') },
          { key: index++, label: '12:15', timeId: this.timeString2Id('12:15') },
          { key: index++, label: '12:30', timeId: this.timeString2Id('12:30') },
          { key: index++, label: '12:45', timeId: this.timeString2Id('12:45') },
          { key: index++, label: '13:00', timeId: this.timeString2Id('13:00') },
          { key: index++, label: '13:15', timeId: this.timeString2Id('13:15') },
          { key: index++, label: '13:30', timeId: this.timeString2Id('13:30') },
          { key: index++, label: '13:45', timeId: this.timeString2Id('13:45') },
          { key: index++, label: '14:00', timeId: this.timeString2Id('14:00') },
          { key: index++, label: '14:15', timeId: this.timeString2Id('14:15') },
          { key: index++, label: '14:30', timeId: this.timeString2Id('14:30') },
          { key: index++, label: '14:45', timeId: this.timeString2Id('14:45') },
          { key: index++, label: '15:00', timeId: this.timeString2Id('15:00') },
          { key: index++, label: '15:15', timeId: this.timeString2Id('15:15') },
          { key: index++, label: '15:30', timeId: this.timeString2Id('15:30') },
          { key: index++, label: '15:45', timeId: this.timeString2Id('15:45') },
          { key: index++, label: '16:00', timeId: this.timeString2Id('16:00') },
          { key: index++, label: '16:15', timeId: this.timeString2Id('16:15') },
          { key: index++, label: '16:30', timeId: this.timeString2Id('16:30') },
          { key: index++, label: '16:45', timeId: this.timeString2Id('16:45') },
          { key: index++, label: '17:00', timeId: this.timeString2Id('17:00') },
          { key: index++, label: '17:15', timeId: this.timeString2Id('17:15') },
          { key: index++, label: '17:30', timeId: this.timeString2Id('17:30') },
          { key: index++, label: '17:45', timeId: this.timeString2Id('17:45') },
          { key: index++, label: '18:00', timeId: this.timeString2Id('18:00') },
          { key: index++, label: '18:15', timeId: this.timeString2Id('18:15') },
          { key: index++, label: '18:30', timeId: this.timeString2Id('18:30') },
          { key: index++, label: '18:45', timeId: this.timeString2Id('18:45') },
        ];
        break;

      default:
        break;
    }

    data.forEach((option) => {
      if (borderTimeId <= option.timeId) {
        selectedData.push(option);
      }
    });

    return selectedData;
  }


  onDoneButtonPress = () => {
    Alert.alert(
      '',
      '編集内容を保存しますか？',
      [
        { text: 'キャンセル' },
        {
          text: 'はい',
          onPress: async () => {
            // Initialize the schedule (deep copy without reference)
            const editedSchedule = this.state.editedSchedule;
            this.setState({
              initialSchedule: JSON.parse(JSON.stringify(editedSchedule))
            });

            // for debug
            console.log(`JSON.stringify(this.state.initialSchedule) = ${JSON.stringify(this.state.initialSchedule)}`);
            console.log(`JSON.stringify(this.state.editedSchedule) = ${JSON.stringify(this.state.editedSchedule)}`);

            /*
            const demand = {
              rider_id: this.props.riderInfo.id,
              schedule: this.state.editedSchedule
            };

            // TODO: POST or PUT `this.state.editedSchedule` to the server
            try {
              let response = await fetch('https://inori.work/demand', {
                method: 'POST',
                //method: 'PUT',
                headers: {},
                body: JSON.stringify(demand),
              });

              // If failed to PUT the edited driver info,
              if (parseInt(response.status / 100, 10) === 4 ||
                  parseInt(response.status / 100, 10) === 5) {
                Alert.alert(
                  '電波の良いところで後ほどお試しください。',
                  '編集内容は保存されていません。',
                  [
                    { text: 'OK' },
                  ]
                );
              }

            // If cannot access demand api,
            } catch (error) {
              console.error(error);
              console.log('Cannot access demand api...');

              Alert.alert(
                '電波の良いところで後ほどお試しください。',
                '編集内容は保存されていません。',
                [
                  { text: 'OK' },
                ]
              );
            }
            */
          }
        }
      ],
      { cancelable: false }
    );
  }


  renderDoneButton() {
    // `this.state.editedSchedule` is default or not
    let isDefault = true;
    // If at least one of `this.state.editedSchedule` is NOT default value,
    this.state.editedSchedule.forEach((item) => {
      if (
        item.toko.start !== this.state.initialSchedule[item.day].toko.start ||
        item.toko.end !== this.state.initialSchedule[item.day].toko.end ||
        item.geko.start !== this.state.initialSchedule[item.day].geko.start ||
        item.geko.end !== this.state.initialSchedule[item.day].geko.end
      ) {
        isDefault = false;
      }
    });

    return (
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Button
          // If `this.state.editedRiderInfo` is default or one of the forms is invalid,
          // inactivate the button
          disabled={isDefault}
          title="完了"
          color="white"
          buttonStyle={{ backgroundColor: 'rgb(0,122,255)' }}
          onPress={this.onDoneButtonPress}
        />
      </View>
    );
  }


  render() {
    // `this.state.initialSchedule` is default or not
    let isDefault = true;
    // If at least one of `this.state.initialSchedule` is NOT default value,
    this.state.initialSchedule.forEach((item) => {
      if (
        item.toko.start !== INITIAL_STATE.initialSchedule[item.day].toko.start ||
        item.toko.end !== INITIAL_STATE.initialSchedule[item.day].toko.end ||
        item.geko.start !== INITIAL_STATE.initialSchedule[item.day].geko.start ||
        item.geko.end !== INITIAL_STATE.initialSchedule[item.day].geko.end
      ) {
        isDefault = false;
      }
    });

    // Wait to GET the own demand schedule
    if (isDefault) {
      return <AppLoading />;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {this.state.editedSchedule.map((item, index) => {
            // If the item is Sunday or Saturday, render nothing
            if (item.day === SUN || item.day === SAT) {
              return <View key={index} />;
            }

            return (
              <ListItem
                key={index}
                title={this.dayId2Text(item.day)}
                subtitle={
                  <View>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingTop: 10 }}>
                      <Text style={styles.grayTextStyle}>登校：</Text>
                      <View style={{ flex: 1 }}>
                        <ModalSelector
                          data={this.chooseTimeRange(TOKO, this.timeString2Id('8:00'))}
                          initValue={this.timeId2String(item.toko.start)}
                          onChange={(option) => {
                            const editedSchedule = this.state.editedSchedule;
                            editedSchedule[item.day].toko.start = this.timeString2Id(option.label);
                            if (item.toko.end < editedSchedule[item.day].toko.start) {
                              editedSchedule[item.day].toko.end = this.timeString2Id(option.label);
                            }
                            this.setState({ editedSchedule });
                          }}
                          selectTextStyle={{ fontSize: 12, color: 'gray' }}
                          cancelText="キャンセル"
                          backdropPressToClose
                        />
                      </View>
                      <Text style={styles.grayTextStyle}> ~ </Text>
                      <View style={{ flex: 1 }}>
                        <ModalSelector
                          data={this.chooseTimeRange(TOKO, item.toko.start)}
                          initValue={this.timeId2String(item.toko.end)}
                          onChange={(option) => {
                            const editedSchedule = this.state.editedSchedule;
                            editedSchedule[item.day].toko.end = this.timeString2Id(option.label);
                            this.setState({ editedSchedule });
                          }}
                          selectTextStyle={{ fontSize: 12, color: 'gray' }}
                          cancelText="キャンセル"
                          backdropPressToClose
                        />
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingTop: 10 }}>
                      <Text style={styles.grayTextStyle}>下校：</Text>
                      <View style={{ flex: 1 }}>
                        <ModalSelector
                          data={this.chooseTimeRange(GEKO, this.timeString2Id('12:00'))}
                          initValue={this.timeId2String(item.geko.start)}
                          onChange={(option) => {
                            const editedSchedule = this.state.editedSchedule;
                            editedSchedule[item.day].geko.start = this.timeString2Id(option.label);
                            if (item.geko.end < editedSchedule[item.day].geko.start) {
                              editedSchedule[item.day].geko.end = this.timeString2Id(option.label);
                            }
                            this.setState({ editedSchedule });
                          }}
                          selectTextStyle={{ fontSize: 12, color: 'gray' }}
                          cancelText="キャンセル"
                          backdropPressToClose
                        />
                      </View>
                      <Text style={styles.grayTextStyle}> ~ </Text>
                      <View style={{ flex: 1 }}>
                        <ModalSelector
                          data={this.chooseTimeRange(GEKO, item.geko.start)}
                          initValue={this.timeId2String(item.geko.end)}
                          onChange={(option) => {
                            const editedSchedule = this.state.editedSchedule;
                            editedSchedule[item.day].geko.end = this.timeString2Id(option.label);
                            this.setState({ editedSchedule });
                          }}
                          selectTextStyle={{ fontSize: 12, color: 'gray' }}
                          cancelText="キャンセル"
                          backdropPressToClose
                        />
                      </View>
                    </View>
                  </View>
                }
                hideChevron
              />
            );
          })}
        </ScrollView>

        {this.renderDoneButton()}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  grayTextStyle: {
    color: 'gray',
    padding: 10,
  },
});


const mapStateToProps = (state) => {
  return {
    riderInfo: state.riderReducer.riderInfo,
    ownReservations: state.riderReducer.ownReservations,
    allOffers: state.riderReducer.allOffers
  };
};


export default connect(mapStateToProps, actions)(ScheduleScreen);
