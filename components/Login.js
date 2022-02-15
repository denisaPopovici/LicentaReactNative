import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert} from 'react-native';
import MainWindow from './MainWindow';
import Tabs from './BottomTabNavigator'

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    credentials: {username: '', password: ''},
  };

  current_user = {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      image: '',
      about: '',
  }

  login = async props => {
      if(this.state.credentials.password !== '' && this.state.credentials.username !== '') {
          // --FETCH
          await fetch('http://localhost:8080/api/custom-user/' + this.state.credentials.username.toString(), {
              method: 'GET',
              headers: {'Content-Type': 'application/json', Accept: 'application/json'},
              // body: JSON.stringify(this.state.credentials.username),
          })
              .then(response => response.json())
              .then(data => {
                  if (data === []) {
                      Alert.alert("A user with this credentials does not exist! ", [{text: "OK"}])
                  } else {
                      this.current_user.first_name = data['first_name']
                      this.current_user.last_name = data['last_name']
                      this.current_user.username = data['username']
                      this.current_user.email = data['email']
                      this.current_user.about = data['about']
                      this.current_user.image = data['image']
                      console.log(this.current_user.username, 'login')
                      this.props.navigation.navigate('Main', {current_user: this.current_user});
                  }
              })
              .catch(err => console.error(err));
      }
      else
          Alert.alert("All fields are required! ", [{text: "OK"}])

  };


  render() {
    return (
      <View>
        <Text style={styles.title}> Login user </Text>
        <Text style={styles.text}> Username:</Text>
        <TextInput
            autoCapitalize='none'
             style={styles.input}
             onChangeText={text => (this.state.credentials.username = text)}
        />
        <Text style={styles.text}> Password:</Text>
        <TextInput
            autoCapitalize='none'
            secureTextEntry={true}
            style={styles.input}
            onChangeText={text => (this.state.credentials.password = text)}
        />
        <Button
          title="LOG IN"
          onPress={() => this.login() }
        />
        <View style={styles.view}>
            <Text style = {{fontSize: 18, marginTop: 8}}> Don't have an account? </Text>
            <Button title="SIGN UP!" onPress={ () => this.props.navigation.navigate('Signup')} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  text: {
    marginTop: 50,
    marginLeft: 10,
  },
  title: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 30,
  },
  view: {
      marginTop: 180,
      flexDirection: 'row',
      justifyContent: 'center',
  },
});

export default Login;
