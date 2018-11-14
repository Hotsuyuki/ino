import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Alert,
  LayoutAnimation, UIManager, AsyncStorage, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Header, Button, FormLabel, FormInput } from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';
import { AppLoading } from 'expo';
import { connect } from 'react-redux';

import * as actions from '../actions';


const INITIAL_STATE = {
  // for driver info
  initialDriverInfo: {
    id: 0,
    first_name: '---',
    last_name: '---',
    grade: '---',
    major: '---',
    car_color: '---',
    car_number: '---',
    mail: '---',
    phone: '---',
  },
  editedDriverInfo: {
    id: 0,
    first_name: '---',
    last_name: '---',
    grade: '---',
    major: '---',
    car_color: '---',
    car_number: '---',
    mail: '---',
    phone: '---',
  },
};


class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }


  async componentWillMount() {
    // Call action creators
    this.props.getDriverInfo();

    const driverInfo = this.props.driverInfo;
    // Trim "@stu.kanazawa-u.ac.jp" // TODO: Make it more robust
    driverInfo.mail = driverInfo.mail.replace('@stu.kanazawa-u.ac.jp', '');

    this.setState({
      initialDriverInfo: driverInfo,
      editedDriverInfo: driverInfo,
    });
  }


  componentWillUpdate() {
    // Ease in & Ease out animation
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }


  renderGradePicker() {
    let index = 0;
    const data = [
      { key: index++, label: '学部1年' },
      { key: index++, label: '学部2年' },
      { key: index++, label: '学部3年' },
      { key: index++, label: '学部4年' },

      { key: index++, label: '修士1年' },
      { key: index++, label: '修士2年' },

      { key: index++, label: '博士1年' },
      { key: index++, label: '博士2年' },
      { key: index++, label: '博士3年' },
    ];

    return (
      <ModalSelector
        data={data}
        initValue={this.state.initialDriverInfo.grade}
        onChange={(itemValue) => this.setState({
          editedDriverInfo: {
            ...this.state.editedDriverInfo,
            grade: itemValue.label
          },
        })}
        selectTextStyle={{ fontSize: 12, color: 'gray' }}
        cancelText="キャンセル"
        //animationType="fade"
        backdropPressToClose
      />
    );
  }


  renderMajorPicker() {
    let index = 0;
    let data = [];

    const gradeCourse = this.state.editedDriverInfo.grade.slice(0, 2);
    if (gradeCourse === '学部') {
      data = [
        { key: index++, label: '人文学類' },
        { key: index++, label: '法学類' },
        { key: index++, label: '経済学類' },
        { key: index++, label: '学校教育学類' },
        { key: index++, label: '地域創造学類' },
        { key: index++, label: '国際学類' },

        { key: index++, label: '数物科学類' },
        { key: index++, label: '物質化学類' },
        { key: index++, label: '機械工学類' },
        { key: index++, label: 'フロンティア工学類' },
        { key: index++, label: '電子情報通信学類' },
        { key: index++, label: '地球社会基盤学類' },
        { key: index++, label: '生命理工学類' },

        { key: index++, label: '医学類' },
        { key: index++, label: '薬学類・創薬科学類' },
        { key: index++, label: '保険学類' },

        { key: index++, label: 'その他' },
      ];
    } else if (gradeCourse === '修士') {
      data = [
        { key: index++, label: '人文学専攻' },
        { key: index++, label: '法学・政治学専攻' },
        { key: index++, label: '経済学専攻' },
        { key: index++, label: '地域創造学専攻' },
        { key: index++, label: '国際学専攻' },

        { key: index++, label: '数物科学専攻' },
        { key: index++, label: '物質化学専攻' },
        { key: index++, label: '機械科学専攻' },
        { key: index++, label: '電子情報科学専攻' },
        { key: index++, label: '環境デザイン学専攻' },
        { key: index++, label: '自然システム学専攻' },
        { key: index++, label: '融合科学共同専攻' },

        { key: index++, label: '医科学専攻' },
        { key: index++, label: '創薬科学・薬学専攻' },
        { key: index++, label: '保険学専攻' },

        { key: index++, label: '先進予防医学研究科' },
        { key: index++, label: '連合小児発達学研究科' },
        { key: index++, label: '法務研究科（法科大学院）' },
        { key: index++, label: '教職実践研究科' },

        { key: index++, label: 'その他' },
      ];
    } else if (gradeCourse === '博士') {
      data = [
        { key: index++, label: '人文学コース' },
        { key: index++, label: '法学・政治学コース' },
        { key: index++, label: '社会経済学コース' },

        { key: index++, label: '数物科学専攻' },
        { key: index++, label: '物質化学専攻' },
        { key: index++, label: '機械科学専攻' },
        { key: index++, label: '電子情報科学専攻' },
        { key: index++, label: '環境デザイン学専攻' },
        { key: index++, label: '自然システム学専攻' },
        { key: index++, label: '融合科学共同専攻' },

        { key: index++, label: '医科学専攻' },
        { key: index++, label: '創薬科学・薬学専攻' },
        { key: index++, label: '保険学専攻' },

        { key: index++, label: '先進予防医学研究科' },
        { key: index++, label: '連合小児発達学研究科' },
        { key: index++, label: '法務研究科（法科大学院）' },
        { key: index++, label: '教職実践研究科' },

        { key: index++, label: 'その他' },
      ];
    } else {
      data = [
        { key: index++, label: '学年が正しく選択されているか確認して下さい' },
      ];
    }

    return (
      <ModalSelector
        data={data}
        initValue={this.state.initialDriverInfo.major}
        //initValue={this.state.editedDriverInfo.major}
        onChange={(itemValue) => this.setState({
          editedDriverInfo: {
            ...this.state.editedDriverInfo,
            major: itemValue.label
          },
        })}
        selectTextStyle={{ fontSize: 12, color: 'gray' }}
        cancelText="キャンセル"
        //animationType="fade"
        backdropPressToClose
      />
    );
  }


  renderCarColorPicker() {
    let index = 0;
    const data = [
      { key: index++, label: '白系' },
      { key: index++, label: '黒系' },
      { key: index++, label: '銀系' },
      { key: index++, label: '青系' },
      { key: index++, label: '赤系' },
      { key: index++, label: '茶系' },
      { key: index++, label: '灰系' },
      { key: index++, label: '黄系' },
      { key: index++, label: '緑系' },
      { key: index++, label: 'ｵﾚﾝｼﾞ系' },
      { key: index++, label: 'ﾊﾟｰﾌﾟﾙ系' },

      { key: index++, label: 'その他' },
    ];

    return (
      <ModalSelector
        data={data}
        initValue={this.state.initialDriverInfo.car_color}
        onChange={(itemValue) => this.setState({
          editedDriverInfo: {
            ...this.state.editedDriverInfo,
            car_color: itemValue.label
          },
        })}
        selectTextStyle={{ fontSize: 12, color: 'gray' }}
        cancelText="キャンセル"
        //animationType="fade"
        backdropPressToClose
      />
    );
  }


  onDoneButtonPress = () => {
    Alert.alert(
      '編集内容を保存しますか？',
      '',
      [
        { text: 'キャンセル' },
        {
          text: 'はい',
          onPress: async () => {
            const editedDriverInfo = this.state.editedDriverInfo;
            // Elace hyphens (just in case)
            editedDriverInfo.phone = editedDriverInfo.phone.replace(/-/g, '');
            // Add "@stu.kanazawa-u.ac.jp" // TODO: Make it more robust
            editedDriverInfo.mail = `${editedDriverInfo.mail}@stu.kanazawa-u.ac.jp`;

            console.log(`JSON.stringify(editedDriverInfo) = ${JSON.stringify(editedDriverInfo)}`);

            // PUT the edited profile
            try {
              let response = await fetch(`https://inori.work/drivers/${editedDriverInfo.id}`, {
                method: 'PUT',
                headers: {},
                body: JSON.stringify(editedDriverInfo),
              });

              let responseJson = await response.json();

              try {
                await AsyncStorage.setItem('driverInfo', JSON.stringify(responseJson.driver));
              } catch (error) {
                console.warn(error);
              }

              // Reflesh `this.props.driverInfo` in `ProfileScreen` and `this.props.ownOffers` in `OfferScreen`
              // and make `ProfileScreen` and `OfferScreen` rerender by calling an action creator
              this.props.getDriverInfo();
              this.props.fetchOwnOffers();
              this.props.navigation.pop();

            // If cannot access drivers api,
            } catch (error) {
              console.error(error);
              console.log('Cannot access drivers api...');

              Alert.alert(
                '電波の良いところで後ほどお試しください。',
                '編集内容は保存されていません。',
                [
                  { text: 'OK' },
                ]
              );
            }
          }
        }
      ],
      { cancelable: false }
    );
  }


  renderDoneButton() {
    // `this.state.editedDriverInfo` is default or not
    let isDefault = true;
    // If at least one of `editedDriverInfo` is NOT default value,
    Object.keys(this.state.editedDriverInfo).forEach((key) => {
      if (this.state.editedDriverInfo[key] !== this.state.initialDriverInfo[key]) {
        isDefault = false;
      }
    });

    const doneButtonTitle = '完了';

    // If `this.state.editedDriverInfo` is not default,
    if (!isDefault) {
      return (
        // Activate the offer button
        <View style={{ padding: 20 }}>
          <Button
            title={doneButtonTitle}
            color="white"
            buttonStyle={{ backgroundColor: 'rgb(0,122,255)' }}
            onPress={this.onDoneButtonPress}
          />
        </View>
      );
    }

    return (
      <View style={{ padding: 20 }}>
        <Button
          title={doneButtonTitle}
          color="white"
        />
      </View>
    );
  }


  render() {
    // Wait to fetch own driver info
    if ((typeof this.props.driverInfo.id) === 'undefined') {
      return <AppLoading />;
    }

    return (
      <View style={{ flex: 1 }}>
        <Header
          statusBarProps={{ barStyle: 'light-content' }}
          backgroundColor="gray"
          leftComponent={{
            icon: 'close',
            color: 'white',
            onPress: () => {
              Alert.alert(
                'プロフィール編集を中止しますか？',
                '入力された内容は保存されません。',
                [
                  { text: 'いいえ' },
                  {
                    text: 'はい',
                    onPress: () => this.props.navigation.pop(),
                    style: 'destructive'
                  }
                ],
                { cancelable: false }
              );
            }
          }}
          centerComponent={{ text: 'プロフィール編集', style: styles.headerStyle }}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 /*, justifyContent: 'center'*/ }}
          behavior={Platform.OS === 'ios' ? 'padding' : ''}
        >
          <ScrollView style={{ flex: 1 }}>
            <FormLabel>姓：</FormLabel>
            <FormInput
              autoCapitalize="none"
              value={this.state.editedDriverInfo.last_name}
              onChangeText={(inputValue) => {
                this.setState({
                  editedDriverInfo: {
                    ...this.state.editedDriverInfo,
                    last_name: inputValue
                  }
                });
              }}
            />

            <FormLabel>名：</FormLabel>
            <FormInput
              autoCapitalize="none"
              value={this.state.editedDriverInfo.first_name}
              onChangeText={(inputValue) => {
                this.setState({
                  editedDriverInfo: {
                    ...this.state.editedDriverInfo,
                    first_name: inputValue
                  }
                });
              }}
            />

            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10, paddingRight: 20 }}>
              <FormLabel>学年：</FormLabel>
              <View style={{ flex: 1 }}>
                {this.renderGradePicker()}
              </View>
            </View>

            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10, paddingRight: 20 }}>
              <FormLabel>学類/専攻：</FormLabel>
              <View style={{ flex: 1 }}>
                {this.renderMajorPicker()}
              </View>
            </View>

            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10, paddingRight: 20 }}>
              <FormLabel>車の色：</FormLabel>
              <View style={{ flex: 1 }}>
                {this.renderCarColorPicker()}
              </View>
            </View>

            <FormLabel>車のナンバー(4桁以下)：</FormLabel>
            <FormInput
              autoCapitalize="none"
              keyboardType="numeric"
              value={this.state.editedDriverInfo.car_number}
              onChangeText={(inputValue) => {
                this.setState({
                  editedDriverInfo: {
                    ...this.state.editedDriverInfo,
                    car_number: inputValue
                  }
                });
              }}
            />

            <FormLabel>メールアドレス：</FormLabel>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 3 }}>
                <FormInput
                  autoCapitalize="none"
                  value={this.state.editedDriverInfo.mail}
                  onChangeText={(inputValue) => {
                    this.setState({
                      editedDriverInfo: {
                        ...this.state.editedDriverInfo,
                        mail: inputValue
                      }
                    });
                  }}
                />
              </View>
              <View style={{ flex: 2, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 12 }}>@stu.kanazawa-u.ac.jp</Text>
              </View>
            </View>

            <FormLabel>電話番号（ハイフンなし）：</FormLabel>
            <FormInput
              autoCapitalize="none"
              keyboardType="numeric"
              value={this.state.editedDriverInfo.phone}
              onChangeText={(inputValue) => {
                this.setState({
                  editedDriverInfo: {
                    ...this.state.editedDriverInfo,
                    phone: inputValue
                  }
                });
              }}
            />

            {this.renderDoneButton()}

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  headerStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
});


const mapStateToProps = (state) => {
  return {
    driverInfo: state.driverReducer.driverInfo,
    ownOffers: state.driverReducer.ownOffers,
  };
};


export default connect(mapStateToProps, actions)(EditProfileScreen);
