import DirectionType from "./DirectionType";
import React from "react";
import { StyleSheet, Image, View } from "react-native";
import Files from "../Files";
import SpriteView from "./SpriteView";
//import * as firebase from "firebase";

import Sprite from "./Sprite";
import Character from "./Character";

global.document = global.document || {};
console.ignoredYellowBox = ["THREE.WebGLRenderer", "THREE.WebGLProgram"];

import DPad from "./DPad";

const defVelocity = {
  [DirectionType.left]: { dx: -1 },
  [DirectionType.right]: { dx: 1 },
  [DirectionType.up]: { dy: 1 },
  [DirectionType.down]: { dy: -1 }
};

const firebaseConfig = {
  apiKey: "AIzaSyAnLn3oIAgMHiIhjDqen0Cu99FHz2Je_4U",
  authDomain: "sheeple-1139b.firebaseapp.com",
  databaseURL: "https://sheeple-1139b.firebaseio.com",
  projectId: "sheeple-1139b",
  storageBucket: "sheeple-1139b.appspot.com",
  messagingSenderId: "876180208094"
};

function setupFirebase() {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (e) {
    console.log("got error");
    console.log(e);
  }

  let database = firebase.database();
  database.ref("characterPos").on('value', function(snapshot){
    console.log(snapshot.val());
    console.log(snapshot.val().x);

    // this.node.position.x = sdf;
  });
}

function updatePositionFirebase(x, y) {
  let database = firebase.database();
  database.ref("characterPos").set({
    x,
    y,
  });
}

export default class Game extends React.Component {
  constructor() {
    super();
    //TODO
    //setupFirebase();
  }

  state = { width: 0, height: 0 };

  renderDPad = () => (
    <DPad
      style={{ position: "absolute", bottom: 8, left: 8 }}
      onPressOut={() => {
        if (this.node) {
          this.node.setSelectedSpriteKey(null);
          this.node.setVelocity();
        }
        this.selected = null;
      }}
      onPress={id => {
        if (this.node) {
          this.node.setSelectedSpriteKey(id);
          this.node.setVelocity(defVelocity[id]);
        }
        this.selected = id;
      }}
    />
  );

  render() {
    return (
      <View
        onLayout={({ nativeEvent: { layout: { width, height } } }) =>
          this.setState({ width, height })}
        style={StyleSheet.absoluteFill}
      >
        <Image
          source={Files.map}
          style={StyleSheet.flatten([
            {
              width: this.state.width,
              height: this.state.height,
              resizeMode: "cover"
            }
          ])}
        />

        <SpriteView
          touchDown={({ x, y }) => {}}
          touchMoved={({ x, y }) => {}}
          touchUp={({ x, y }) => {}}
          update={currentTime => {
            this.node.update(currentTime);
            //TODO
            //updatePositionFirebase(this.node.position.x, this.node.position.y);
          }}
          onSetup={async ({ scene, camera }) => {
            let textures = [
              { key: "down", texture: Files.hero["0"] },
              { key: "left", texture: Files.hero["1"] },
              { key: "up", texture: Files.hero["2"] },
              { key: "right", texture: Files.hero["3"] }
            ];

            let sprites = {};

            let keys = Object.keys(textures);
            for (let i in keys) {
              const { key, texture } = textures[i];

              const size = {
                width: 32 * 3,
                height: 64 * 3
              };
              const sprite = new Sprite();
              await sprite.setup({
                image: texture,
                tilesHoriz: 6,
                tilesVert: 1,
                numTiles: 6,
                tileDispDuration: 75,
                size
              });
              sprites[key] = sprite;
            }

            this.node = new Character({
              sprites,
              speed: 3
            });
            scene.add(this.node);
          }}
        />
        {this.renderDPad()}
      </View>
    );
  }
}
