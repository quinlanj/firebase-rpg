import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as firebase from "firebase";
import { Constants } from "expo";

const firebaseConfig = {
  apiKey: "AIzaSyAnLn3oIAgMHiIhjDqen0Cu99FHz2Je_4U",
  authDomain: "sheeple-1139b.firebaseapp.com",
  databaseURL: "https://sheeple-1139b.firebaseio.com",
  projectId: "sheeple-1139b",
  storageBucket: "sheeple-1139b.appspot.com",
  messagingSenderId: "876180208094"
};

const username = Constants.deviceName;

function setupFirebase() {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (e) {
    console.log("got error");
    console.log(e);
  }

  let database = firebase.database();
  database.ref("users").on('value', function(snapshot){
    console.log(snapshot.val());
  });

  updateUserData();
}

function updateUserData() {
  let database = firebase.database();
  database.ref("users/" + username).set({
    highscore: 123
  });
}

export default class App extends React.Component {
  constructor() {
    super();
    setupFirebase();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
