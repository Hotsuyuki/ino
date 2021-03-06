import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon, Button } from 'react-native-elements';
import { Provider } from 'react-redux';

import store from './store';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import OfferListScreen from './screens/OfferListScreen';
import OfferScreen from './screens/OfferScreen';
import DetailScreen from './screens/DetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';


export default class App extends React.Component {
  render() {
    const headerNavigationOptions = {
      headerStyle: {
        backgroundColor: 'gray',
        marginTop: Platform.OS === 'android' ? 24 : 0
      },
      headerTitleStyle: { color: 'white' },
      headerTintColor: 'white',
    };


    const LoginStack = createStackNavigator({
      login: {
        screen: LoginScreen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: 'ログイン',
          headerBackTitle: ' '
        }
      },
      signup: {
        screen: SignupScreen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: '新規登録',
        }
      }
    }, {
      initialRouteName: 'login',
    });


    const MainStack = createStackNavigator({
      offerList: {
        screen: OfferListScreen,
        navigationOptions: ({ navigation }) => ({
          ...headerNavigationOptions,
          headerLeft: (
            <View style={{ paddingLeft: 10 }}>
              <Icon
                name='person'
                color='white'
                onPress={() => navigation.navigate('profile')}
              />
            </View>
          ),
          headerRight: (
            <View style={{ paddingRight: 10 }}>
              <Icon
                name='plus'
                type='font-awesome'
                color='white'
                onPress={() => navigation.navigate('offer')}
              />
            </View>
          ),
          headerTitle: 'ino',
          headerBackTitle: ' '
        })
      },
      offer: {
        screen: OfferScreen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: 'オファー',
        }
      },
      detail: {
        screen: DetailScreen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: '詳細',
        }
      },
      profile: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
          ...headerNavigationOptions,
          headerTitle: 'プロフィール',
          headerRight: (
            <Button
              title="編集"
              color="white"
              buttonStyle={{ backgroundColor: 'transparent' }}
              onPress={() => navigation.navigate('editProfile')}
            />
          ),
        })
      }
    }, {
      initialRouteName: 'offerList',
    });


    const RootStack = createStackNavigator({
      main: {
        screen: MainStack
      },
      editProfile: {
        screen: EditProfileScreen,
      }
    }, {
      mode: 'modal',
      headerMode: 'none',
    });


    const NavigatorTab = createBottomTabNavigator({
      login: {
        screen: LoginStack
      },
      root: {
        screen: RootStack
      }
    }, {
      navigationOptions: { tabBarVisible: false },
      initialRouteName: 'login',
      //lazy: true,
    });


    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <NavigatorTab />
        </View>
      </Provider>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
  },
});
