import { Alert, AsyncStorage } from 'react-native';

import {
  GET_RIDER_INFO,
  FETCH_OWN_RESERVATIONS,
  FETCH_ALL_OFFERS,
  FETCH_SELECTED_OFFER,
  RESET_SELECTED_OFFER,
} from './types';


// Below are action creators...
// (a function that will return an action)
export const getRiderInfo = () => {
  // For an async flow like Ajax,
  // action creator function returns another function (not an action),
  // and the returned fucntion dispatch an action
  // when the async procedure is done.
  // This is whta Redux Thunk does.
  return async (dispatch) => {
    let riderInfo = {};

    // Get stored rider info
    try {
      let stringifiedRiderInfo = await AsyncStorage.getItem('riderInfo');
      riderInfo = JSON.parse(stringifiedRiderInfo);

    // If cannot get stored rider info,
    } catch (error) {
      console.warn(error);
      console.log('Cannot get stored rider info...');
    }

    dispatch({ type: GET_RIDER_INFO, payload: riderInfo });
  };
};


export const fetchOwnReservations = () => {
  // For an async flow like Ajax,
  // action creator function returns another function (not an action),
  // and the returned fucntion dispatch an action
  // when the async procedure is done.
  // This is whta Redux Thunk does.
  return async (dispatch) => {
    const ownReservations = [];

    // Get stored rider info
    try {
      let stringifiedRiderInfo = await AsyncStorage.getItem('riderInfo');
      let riderInfo = JSON.parse(stringifiedRiderInfo);

      // GET own reservations
      try {
        let reservationResponse = await fetch(`https://inori.work/reservations?rider_id=${riderInfo.id}`);

        if (parseInt(reservationResponse.status / 100, 10) === 2) {
          let reservationResponseJson = await reservationResponse.json();

          // Reset the local notifications list if own offers array is empty
          if (reservationResponseJson.reservations.length === 0) {
            const localNotifications = [];
            await AsyncStorage.setItem('localNotifications', JSON.stringify(localNotifications));
          }

          const promiseArray = reservationResponseJson.reservations.map(async (reservation) => {
            // GET corresponding offer
            try {
              let offerResponse = await fetch(`https://inori.work/offers/${reservation.offer_id}`);

              if (parseInt(offerResponse.status / 100, 10) === 2) {
                let offerResponseJson = await offerResponse.json();

                const eachItem = offerResponseJson;
                /**********************************
                eachItem: {
                  offer: {
                    id:,
                    driver_id:, start:, goal:,
                    departure_time:, rider_capacity:
                  },
                  reserved_riders: [`id1`, `id2`, ...]
                }
                **********************************/

                // GET corresponding driver info
                try {
                  let driverResponse = await fetch(`https://inori.work/drivers/${eachItem.offer.driver_id}`);

                  if (parseInt(driverResponse.status / 100, 10) === 2) {
                    let driverResponseJson = await driverResponse.json();

                    eachItem.driver = driverResponseJson.driver;
                    /**********************************
                    eachItem: {
                      driver:{
                        id:,
                        first_name:, last_name:,
                        grade:, major:,
                        mail:, phone:,
                        car_color:, car_number:
                      },
                      offer: {
                        id:,
                        driver_id:, start:, goal:,
                        departure_time:, rider_capacity:
                      },
                      reserved_riders: [`id1`, `id2`, ...]
                    }
                    **********************************/

                    ownReservations.push(eachItem);

                  // If failed to GET the correesponding driver info,
                  } else if (
                    parseInt(driverResponse.status / 100, 10) === 4 ||
                    parseInt(driverResponse.status / 100, 10) === 5
                  ) {
                    console.log('GETting driver info failed...');

                    Alert.alert(
                      'エラーが発生しました。',
                      '電波の良いところで後ほどお試しください。',
                      [{ text: 'OK' }]
                    );
                  }

                // If cannot access drivers api,
                } catch (error) {
                  console.error(error);
                  console.log('Cannot access drivers api...');

                  Alert.alert(
                    'エラーが発生しました。',
                    '電波の良いところで後ほどお試しください。',
                    [{ text: 'OK' }]
                  );
                }

              // If failed to GET the corresponding offer,
              } else if (
                parseInt(offerResponse.status / 100, 10) === 4 ||
                parseInt(offerResponse.status / 100, 10) === 5
              ) {
                Alert.alert(
                  'エラーが発生しました。',
                  '電波の良いところで後ほどお試しください。',
                  [{ text: 'OK' }]
                );
              }

            // If cannot access offers api,
            } catch (error) {
              console.error(error);
              console.log('Cannot access offers api...');

              Alert.alert(
                'エラーが発生しました。',
                '電波の良いところで後ほどお試しください。',
                [{ text: 'OK' }]
              );
            }
          });

          await Promise.all(promiseArray);

          // Sort `allOffers` in chronological order
          ownReservations.sort((a, b) => {
            if (a.offer.departure_time < b.offer.departure_time) {
              return -1;
            }
            if (a.offer.departure_time > b.offer.departure_time) {
              return 1;
            }
            return 0;
          });

        // If failed to GET own reservations,
        } else if (
          parseInt(reservationResponse.status / 100, 10) === 4 ||
          parseInt(reservationResponse.status / 100, 10) === 5
        ) {
          Alert.alert(
            'エラーが発生しました。',
            '電波の良いところで後ほどお試しください。',
            [{ text: 'OK' }]
          );
        }

      // If cannot access reservations api,
      } catch (error) {
        console.error(error);
        console.log('Cannot access reservations api...');
      }
    // If cannot get stored rider info,
    } catch (error) {
      console.warn(error);
      console.log('Cannot get stored rider info...');
    }

    dispatch({ type: FETCH_OWN_RESERVATIONS, payload: ownReservations });
  };
};


export const fetchAllOffers = () => {
  // For an async flow like Ajax,
  // action creator function returns another function (not an action),
  // and the returned fucntion dispatch an action
  // when the async procedure is done.
  // This is whta Redux Thunk does.
  return async (dispatch) => {
    const allOffers = [];

    // GET all offers
    try {
      let offerResponse = await fetch('https://inori.work/offers');

      if (parseInt(offerResponse.status / 100, 10) === 2) {
        let offerResponseJson = await offerResponse.json();
        //console.log('JSON.stringify(offerResponseJson) = ' + JSON.stringify(offerResponseJson));

        const promiseArray = offerResponseJson.offers.map(async (item) => {
          const eachItem = item;
          /**********************************
          eachItem: {
            offer: {
              id:,
              driver_id:, start:, goal:,
              departure_time:, rider_capacity:
            },
            reserved_riders: [`id1`, `id2`, ...]
          }
          **********************************/

          // GET corresponding driver info
          try {
            let driverResponse = await fetch(`https://inori.work/drivers/${eachItem.offer.driver_id}`);

            if (parseInt(driverResponse.status / 100, 10) === 2) {
              let driverResponseJson = await driverResponse.json();

              eachItem.driver = driverResponseJson.driver;
              /**********************************
              eachItem: {
                driver:{
                  id:,
                  first_name:, last_name:,
                  grade:, major:,
                  mail:, phone:,
                  car_color:, car_number:
                },
                offer: {
                  id:,
                  driver_id:, start:, goal:,
                  departure_time:, rider_capacity:
                },
                reserved_riders: [`id1`, `id2`, ...]
              }
              **********************************/

              allOffers.push(eachItem);

            // If failed to GET the correesponding driver info,
            } else if (
              parseInt(driverResponse.status / 100, 10) === 4 ||
              parseInt(driverResponse.status / 100, 10) === 5
            ) {
              Alert.alert(
                'エラーが発生しました。',
                '電波の良いところで後ほどお試しください。',
                [{ text: 'OK' }]
              );
            }

          // If cannot access drivers api,
          } catch (error) {
            console.error(error);
            console.log('Cannot access drivers api...');

            Alert.alert(
              'エラーが発生しました。',
              '電波の良いところで後ほどお試しください。',
              [{ text: 'OK' }]
            );
          }
        });

        await Promise.all(promiseArray);

        // Sort `allOffers` in chronological order
        allOffers.sort((a, b) => {
          if (a.offer.departure_time < b.offer.departure_time) {
            return -1;
          }
          if (a.offer.departure_time > b.offer.departure_time) {
            return 1;
          }
          return 0;
        });

      // If failed to GET all offers,
      } else if (
        parseInt(offerResponse.status / 100, 10) === 4 ||
        parseInt(offerResponse.status / 100, 10) === 5
      ) {
        Alert.alert(
          'エラーが発生しました。',
          '電波の良いところで後ほどお試しください。',
          [{ text: 'OK' }]
        );
      }

    // If cannot access offers api,
    } catch (error) {
      console.error(error);
      console.log('Cannot access offers api...');

      Alert.alert(
        'エラーが発生しました。',
        '電波の良いところで後ほどお試しください。',
        [{ text: 'OK' }]
      );
    }

    dispatch({ type: FETCH_ALL_OFFERS, payload: allOffers });
  };
};


export const fetchSelectedOffer = (selectedOfferId, isReservation) => {
  // For an async flow like Ajax,
  // action creator function returns another function (not an action),
  // and the returned fucntion dispatch an action
  // when the async procedure is done.
  // This is whta Redux Thunk does.
  return async (dispatch) => {
    let selectedOffer = {};

    // GET the selected item
    try {
      let offerResponse = await fetch(`https://inori.work/offers/${selectedOfferId}`);

      // If succeeded to GET the selected offer,
      if (parseInt(offerResponse.status / 100, 10) === 2) {
        let offerResponseJson = await offerResponse.json();
        selectedOffer = offerResponseJson;
        /**********************************
        selectedOffer: {
          offer: {
            id:,
            driver_id:, start:, goal:,
            departure_time:, rider_capacity:
          },
          reserved_riders: [`id1`, `id2`, ...]
        }
        **********************************/

        // GET corresponding driver info
        try {
          let driverResponse = await fetch(`https://inori.work/drivers/${selectedOffer.offer.driver_id}`);

          if (parseInt(driverResponse.status / 100, 10) === 2) {
            let driverResponseJson = await driverResponse.json();

            selectedOffer.driver = driverResponseJson.driver;
            /**********************************
            selectedOffer: {
              driver:{
                id:,
                first_name:, last_name:,
                grade:, major:,
                mail:, phone:,
                car_color:, car_number:
              },
              offer: {
                id:,
                driver_id:, start:, goal:,
                departure_time:, rider_capacity:
              },
              reserved_riders: [`id1`, `id2`, ...]
            }
            **********************************/

            // GET corresponding reserved riders info
            const reservedRidersInfo = [];

            const promiseArray = selectedOffer.reserved_riders.map(async (reservedRiderId) => {
              try {
                let riderResponse = await fetch(`https://inori.work/riders/${reservedRiderId}`);

                if (parseInt(riderResponse.status / 100, 10) === 2) {
                  let riderResponseJson = await riderResponse.json();

                  reservedRidersInfo.push(riderResponseJson.rider);

                // If failed to GET reserved rider info
                } else if (
                  parseInt(riderResponse.status / 100, 10) === 4 ||
                  parseInt(riderResponse.status / 100, 10) === 5
                ) {
                  Alert.alert(
                    'エラーが発生しました。',
                    '電波の良いところで後ほどお試しください。',
                    [{ text: 'OK' }]
                  );
                }

              // If cannot access riders api,
              } catch (error) {
                console.error(error);
                console.log('Cannot access riders api...');

                Alert.alert(
                  'エラーが発生しました。',
                  '電波の良いところで後ほどお試しください。',
                  [{ text: 'OK' }]
                );
              }
            });

            await Promise.all(promiseArray);

            selectedOffer.reserved_riders = reservedRidersInfo;
            selectedOffer.isCanceld = false;
            selectedOffer.isReservation = isReservation;
            /**********************************
            selectedOffer: {
              driver:{
                id:,
                first_name:, last_name:,
                grade:, major:,
                mail:, phone:,
                car_color:, car_number:
              },
              offer: {
                id:,
                driver_id:, start:, goal:,
                departure_time:, rider_capacity:
              },
              reserved_riders: [
                {
                  id: `id1`,
                  first_name:, last_name:,
                  grade:, major:,
                  mail:, phone:
                },
                {
                  id: `id2`,
                  first_name:, last_name:,
                  grade:, major:,
                  mail:, phone:
                },
                ...
              ],
              isCanceld: false,
              isReservation: true or false,
            }
            **********************************/

          // If failed to GET the corresponding driver info
          } else if (
            parseInt(driverResponse.status / 100, 10) === 4 ||
            parseInt(driverResponse.status / 100, 10) === 5
          ) {
            Alert.alert(
              'エラーが発生しました。',
              '電波の良いところで後ほどお試しください。',
              [{ text: 'OK' }]
            );
          }

        // If cannot access drivers api,
        } catch (error) {
          console.error(error);
          console.log('Cannot access drivers api...');
        }

      // If failed to GET the selected offer,
      // (e.g. the driver has already canceled the selected offer)
      } else if (
        parseInt(offerResponse.status / 100, 10) === 4 ||
        parseInt(offerResponse.status / 100, 10) === 5
      ) {
        console.log('[rider_action] Failed to GET the selected offer...');

        selectedOffer.isCanceld = true;
        /**********************************
        selectedOffer: {
          isCanceld: true,
        }
        **********************************/
      }

    // If cannot access offers api,
    } catch (error) {
      console.error(error);
      console.log('Cannot access offers api...');
    }

    dispatch({ type: FETCH_SELECTED_OFFER, payload: selectedOffer });
  };
};


export const resetSelectedOffer = () => {
  const selectedOffer = null;
  return { type: RESET_SELECTED_OFFER, payload: selectedOffer };
};
