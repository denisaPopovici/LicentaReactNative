import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, TextInput, Button, Alert} from 'react-native';
import MainWindow from './MainWindow';


class Signup extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        credentials: {username: '', password: '', email: '', first_name: '', last_name: ''},
    };

    noHandler = () =>{
        this.state.credentials.username = '';
        this.state.credentials.password = '';
        this.state.credentials.email = '';
        this.state.credentials.first_name = '';
        this.state.credentials.last_name = '';

    };

    signup = async () => {
        if(this.state.credentials.password !== '' && this.state.credentials.username !== '' && this.state.credentials.email !== '' && this.state.credentials.firstName !== '' && this.state.credentials.lastName !== ''){
            // --FETCH
            await fetch('https://0b34-2a02-2f0e-51d-1f00-3150-5a9f-2522-9658.ngrok.io/api/custom-users/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json', Accept: 'application/json'},
                body: JSON.stringify(this.state.credentials),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (String(data.username) === 'A user with that username already exists.') {
                        Alert.alert("This username already exists!", [{text: "OK" }]);
                    } else {
                        if (String(data.email) === 'Enter a valid email address.') {
                            Alert.alert("Please enter a valid email address.!", [{text: "OK"}]);
                        }
                        else
                            this.props.navigation.navigate('Login');
                    }
                })
                .catch(err => console.error(err));
        }
        else {
            Alert.alert("All fields are required!", [{text: "OK" }])
        }

    };

    render() {
        return (
            <View style={{marginTop: 30}}>
                <Text style={styles.title}> Sign up </Text>
                <Text style={styles.text}> Username:</Text>
                <TextInput
                    autoCapitalize='none'
                    defaultValue = {this.state.credentials.username}
                    style={styles.input}
                    onChangeText={text => (this.state.credentials.username = text)}
                />
                <Text style={styles.text}> First name:</Text>
                <TextInput
                    defaultValue = {this.state.credentials.first_name}
                    style={styles.input}
                    onChangeText={text => (this.state.credentials.first_name = text)}
                />
                <Text style={styles.text}> Last name:</Text>
                <TextInput
                    defaultValue = {this.state.credentials.last_name}
                    style={styles.input}
                    onChangeText={text => (this.state.credentials.last_name = text)}
                />
                <Text style={styles.text}> Email address:</Text>
                <TextInput
                    autoCapitalize='none'
                    defaultValue = {this.state.credentials.email}
                    style={styles.input}
                    onChangeText={text => (this.state.credentials.email = text)}
                />
                <Text style={styles.text}> Password:</Text>
                <TextInput
                    autoCapitalize='none'
                    defaultValue = {this.state.credentials.password}
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={text => (this.state.credentials.password = text)}
                />
                <Button title="SIGN UP" onPress={this.signup} />
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
        marginTop: 25,
        marginLeft: 10,
    },
    title: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 30,
    },
});

export default Signup;


