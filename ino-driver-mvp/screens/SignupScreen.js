import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, Image,
  LayoutAnimation, UIManager, AsyncStorage, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Button, FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';
import { Permissions, ImagePicker } from 'expo';


const INITIAL_STATE = {
  // for driver info
  driverInfo: {
    first_name: '',
    last_name: '',
    grade: '学年を選択して下さい',
    major: '学類/専攻を選択して下さい',
    car_color: '車の色を選択して下さい',
    car_number: '',
    mail: '',
    phone: '',
    image_url: '',
  }
};

const FACE_IMAGE_SIZE = 120;

// for form validation
const formValidation = {
  isCarNumberValid: null,
  //isMailValid: null, // TODO: Create email address validaiton
  isPhoneValid: null,
};


class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
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


  onImagePress = async () => {
    let cameraRollPermission = await AsyncStorage.getItem('cameraRollPermission');

    if (cameraRollPermission !== 'granted') {
      let permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (permission.status !== 'granted') {
        return;
      }

      await AsyncStorage.setItem('cameraRollPermission', permission.status);
    }

    let imageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true
    });

    if (!imageResult.cancelled) {
      // Rerender with the new uploaded face image
      this.setState({
        driverInfo: {
          ...this.state.driverInfo,
          image_url: imageResult.uri
        }
      });
    }
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
        initValue={INITIAL_STATE.driverInfo.grade}
        onChange={(option) => this.setState({
          driverInfo: {
            ...this.state.driverInfo,
            grade: option.label
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

    const gradeCourse = this.state.driverInfo.grade.slice(0, 2);
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
        { key: index++, label: '法務研究科(法科大学院)' },
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
        { key: index++, label: '法務研究科(法科大学院)' },
        { key: index++, label: '教職実践研究科' },

        { key: index++, label: 'その他' },
      ];
    } else {
      data = [
        { key: index++, label: INITIAL_STATE.driverInfo.major },
      ];
    }

    return (
      <ModalSelector
        data={data}
        initValue={INITIAL_STATE.driverInfo.major}
        onChange={(option) => this.setState({
          driverInfo: {
            ...this.state.driverInfo,
            major: option.label
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
      { key: index++, label: 'オレンジ系' },
      { key: index++, label: 'ベージュ系' },
      { key: index++, label: 'ピンク系' },
      { key: index++, label: 'パープル系' },

      { key: index++, label: 'その他' },
    ];

    return (
      <ModalSelector
        data={data}
        initValue={INITIAL_STATE.driverInfo.car_color}
        onChange={(option) => this.setState({
          driverInfo: {
            ...this.state.driverInfo,
            car_color: option.label
          },
        })}
        selectTextStyle={{ fontSize: 12, color: 'gray' }}
        cancelText="キャンセル"
        //animationType="fade"
        backdropPressToClose
      />
    );
  }


  renderCarNumberValid() {
    const carNumber = this.state.driverInfo.car_number;
    const regex = /[^0-9]/g;

    if (carNumber !== INITIAL_STATE.driverInfo.car_number) {
      if (!regex.test(carNumber) && carNumber.length <= 4) {
        formValidation.isCarNumberValid = true;
        return;
      }

      formValidation.isCarNumberValid = false;
      return (
        <FormValidationMessage>4桁以下の数字で入力して下さい</FormValidationMessage>
      );
    }
  }


  /*
  renderMailValid() {
    // TODO: Create email address validaiton
  }
  */


  renderPhoneValid() {
    const phone = this.state.driverInfo.phone;
    const regex = /0[789]0[0-9]{4}[0-9]{4}/;

    if (phone !== INITIAL_STATE.driverInfo.phone) {
      if (regex.test(phone) && phone.length === 11) {
        formValidation.isPhoneValid = true;
        return;
      }

      formValidation.isPhoneValid = false;
      return (
        <FormValidationMessage>070/080/090から始まる11桁の数字で入力して下さい</FormValidationMessage>
      );
    }
  }


  onSignupButtonPress = () => {
    Alert.alert(
      'この内容で登録しますか？',
      `
      氏名：${this.state.driverInfo.last_name} ${this.state.driverInfo.first_name} \n
      学年：${this.state.driverInfo.grade} \n
      学類/専攻：${this.state.driverInfo.major} \n
      車の色とナンバー：${this.state.driverInfo.car_color} ${this.state.driverInfo.car_number}\n
      メールアドレス：${this.state.driverInfo.mail}@stu.kanazawa-u.ac.jp \n
      電話番号：${this.state.driverInfo.phone.replace(/[^0-9]/g, '')} \n
      `,
      [
        { text: 'キャンセル' },
        {
          text: 'はい',
          onPress: async () => {
            // Deep copy without reference
            const driverInfo = JSON.parse(JSON.stringify(this.state.driverInfo));
            // Add temporary `id`
            driverInfo.id = 0;
            // Truncate whitespaces and add "@stu.kanazawa-u.ac.jp" // TODO: Make it more robust
            driverInfo.mail = `${driverInfo.mail.replace(/\s/g, '').replace(/@stu.kanazawa-u.ac.jp/g, '').toLowerCase()}@stu.kanazawa-u.ac.jp`;
            // Elace hyphens (just in case)
            driverInfo.phone = driverInfo.phone.replace(/[^0-9]/g, '');
            // Add local image path for convenience
            driverInfo.image_url = this.state.driverInfo.image_url;

            // First, POST the input profile
            try {
              let profileResponse = await fetch('https://inori.work/drivers/signup', {
                method: 'POST',
                headers: {},
                body: JSON.stringify(driverInfo),
              });

              // If succeeded to POST the input driver info,
              if (parseInt(profileResponse.status / 100, 10) === 2) {
                let profileResponseJson = await profileResponse.json();

                driverInfo.id = profileResponseJson.id;

                // Then, POST the input face image
                try {
                  const formData = new FormData();
                  formData.append('face_image', {
                    type: 'image/jpeg',
                    name: 'face_image.jpg',
                    uri: this.state.driverInfo.image_url,
                  });

                  let imageResponse = await fetch(`https://inori.work/drivers/${driverInfo.id}/image`, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                  });

                  // If succeeded to POST the input face image,
                  if (parseInt(imageResponse.status / 100, 10) === 2) {
                    let imageResponseJson = await imageResponse.json();

                    driverInfo.image_url = imageResponseJson.image_url;
                    await AsyncStorage.setItem('driverInfo', JSON.stringify(driverInfo));

                    // for debug
                    let stringifiedDriverInfo = AsyncStorage.getItem('driverInfo');
                    console.log(`stringifiedDriverInfo = ${stringifiedDriverInfo}`);

                    console.log('Manual signup with the input driver info is succeeded!!!');
                    this.props.navigation.pop();
                    this.props.navigation.navigate('offerList');

                  // If failed to POST the input face image,
                  } else if (parseInt(imageResponse.status / 100, 10) === 4 ||
                             parseInt(imageResponse.status / 100, 10) === 5) {
                    console.log('Failed to POST the input face image...');
                    console.log(`imageResponse.status = ${imageResponse.status}`);

                    Alert.alert(
                      '画像のアップロードに失敗しました。',
                      '同じ画像で何度も失敗する場合は、他の画像をお試しください。もしくは一度スクショを撮ってスクショの方の画像をアップロードください。(特にAndroidはカメラで撮った画像だとよく失敗します...)',
                      [{ text: 'OK' }]
                    );
                  }
                } catch (error) {
                  console.warn(error);
                  console.log('Cannot access drivers image api...');

                  Alert.alert(
                    '電波の良いところで後ほどお試しください。',
                    '編集内容は保存されていません。',
                    [{ text: 'OK' }]
                  );
                }

              // If failed to POST the input driver info,
              } else if (parseInt(profileResponse.status / 100, 10) === 4 ||
                         parseInt(profileResponse.status / 100, 10) === 5) {
                console.log('Manual signup with the input driver info failed...');

                Alert.alert(
                  'エラーが発生しました。',
                  '編集内容は保存されていません。電波の良いところで後ほどお試しください。',
                  [
                    { text: 'OK' },
                  ]
                );
              }
            // If cannot access the signup api,
            } catch (error) {
              console.error(error);
              console.log('Cannot access the signup api...');

              Alert.alert(
                'エラーが発生しました。',
                '編集内容は保存されていません。電波の良いところで後ほどお試しください。',
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


  renderSignupButton() {
    // `this.state.driverInfo` is completed or not
    let isCompleted = true;
    // If at least one of `this.state.driverInfo` is default value,
    Object.keys(this.state.driverInfo).forEach((key) => {
      if (this.state.driverInfo[key] === INITIAL_STATE.driverInfo[key]) {
        isCompleted = false;
      }
    });

    // All forms are valid or invalid,
    let isValid = true;
    // If at least one of `formValidation` is false,
    Object.keys(formValidation).forEach((key) => {
      if (formValidation[key] === false) {
        isValid = false;
      }
    });

    return (
      // Activate the offer button
      <View style={{ padding: 20 }}>
        <Button
          // If `this.state.riderInfo` is not completed or one of the forms is invalid,
          // inactivate the button
          disabled={!isCompleted || !isValid}
          title="新規登録"
          color="white"
          buttonStyle={{ backgroundColor: 'rgb(0,122,255)' }}
          onPress={this.onSignupButtonPress}
        />
      </View>
    );
  }


  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 /*, justifyContent: 'center'*/ }}
        behavior="padding"
      >
          <ScrollView style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ alignItems: 'center', padding: 10 }}
              onPress={() => this.onImagePress()}
            >
              <Image
                style={{
                  width: FACE_IMAGE_SIZE,
                  height: FACE_IMAGE_SIZE,
                  borderRadius: FACE_IMAGE_SIZE / 2
                }}
                source={
                  this.state.driverInfo.image_url === '' ?
                  require('../assets/face_image_placeholder.png') :
                  { uri: this.state.driverInfo.image_url }
                }
              />
              <Text style={styles.itemTextStyle}>顔写真を選択</Text>
            </TouchableOpacity>

            <FormLabel>姓：</FormLabel>
            <FormInput
              autoCapitalize="none"
              value={this.state.driverInfo.last_name}
              onChangeText={(inputValue) => {
                this.setState({
                  driverInfo: {
                    ...this.state.driverInfo,
                    last_name: inputValue
                  }
                });
              }}
              //containerStyle={{ borderBottomWidth: 1, borderBottomColor: 'gray' }}
            />

            <FormLabel>名：</FormLabel>
            <FormInput
              autoCapitalize="none"
              value={this.state.driverInfo.first_name}
              onChangeText={(inputValue) => {
                this.setState({
                  driverInfo: {
                    ...this.state.driverInfo,
                    first_name: inputValue
                  }
                });
              }}
              //containerStyle={{ borderBottomWidth: 1, borderBottomColor: 'gray' }}
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
              value={this.state.driverInfo.car_number}
              onChangeText={(inputValue) => {
                this.setState({
                  driverInfo: {
                    ...this.state.driverInfo,
                    car_number: inputValue
                  }
                });
              }}
              //containerStyle={{ borderBottomWidth: 1, borderBottomColor: 'gray' }}
            />
            {this.renderCarNumberValid()}

            <FormLabel>メールアドレス：</FormLabel>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 3 }}>
                <FormInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={this.state.driverInfo.mail}
                  onChangeText={(inputValue) => {
                    this.setState({
                      driverInfo: {
                        ...this.state.driverInfo,
                        mail: inputValue
                      }
                    });
                  }}
                  //containerStyle={{ borderBottomWidth: 1, borderBottomColor: 'gray' }}
                />
              </View>
              <View style={{ flex: 2, justifyContent: 'center' }}>
                <Text style={{ fontSize: 12 }}>@stu.kanazawa-u.ac.jp</Text>
              </View>
            </View>
            {/*this.renderMailValid() TODO: Create email address validaiton */}

            <FormLabel>電話番号（ハイフンなし）：</FormLabel>
            <FormInput
              autoCapitalize="none"
              keyboardType="numeric"
              value={this.state.driverInfo.phone}
              onChangeText={(inputValue) => {
                this.setState({
                  driverInfo: {
                    ...this.state.driverInfo,
                    phone: inputValue
                  }
                });
              }}
              //containerStyle={{ borderBottomWidth: 1, borderBottomColor: 'gray' }}
            />
            {this.renderPhoneValid()}

            {this.renderSignupButton()}

          </ScrollView>
      </KeyboardAvoidingView>

    );
  }
}


const styles = StyleSheet.create({
  itemTextStyle: {
    color: 'gray',
    padding: 10,
  },
});


export default SignupScreen;
