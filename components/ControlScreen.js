import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Animated,
} from "react-native";
import NavigationMenu from "./tools/NavigationMenu";
import { Entypo } from "@expo/vector-icons";
var mqtt = require("@taoqf/react-native-mqtt");
var options = {
  protocol: "mqtts",
  clientId: "User1",
  username: "smart",
  password: "FzSjl27L9Ac9VVlk",
};

export default function ControlScreen({ navigation }) {
  const [press, setpress] = useState(false);
  const [rightAnimation, setrightAnimation] = useState(new Animated.Value(0));

  const control_led = () => {
    setpress(!press);
    startAnimation(press ? 1 : 0);
    var client = mqtt.connect("mqtt://smart.cloud.shiftr.io", options);
    client.on("connect", function () {
      client.subscribe("led", function (err) {
        if (!err) {
          if (press) {
            client.publish("led", "off", { qos: 0, retain: true });
          } else {
            client.publish("led", "on", { qos: 0, retain: true });
          }
        }
      });
    });

    client.on("message", function (topic, message) {
      console.log(message.toString());
      client.end();
    });
  };

  const startAnimation = (value) => {
    Animated.timing(rightAnimation, {
      toValue: value === 1 ? 75 : -2,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    right: {
      transform: [{ translateX: rightAnimation }],
    },
  };

  useEffect(() => {
    var client = mqtt.connect("mqtt://smart.cloud.shiftr.io", options);
    client.subscribe("led");
    var note;

    client.on("message", function (topic, message) {
      note = message.toString();
      if (note == "on") {
        setpress(true);
        startAnimation(1);
      } else {
        setpress(false);
        startAnimation(0);
      }

      client.end();
    });
  }, []);

  return (
    <View style={styles.container}>
      <NavigationMenu></NavigationMenu>
      <View style={styles.container_buttons}>
        <Pressable style={styles.button} onPress={control_led}>
          <Animated.View
            style={[styles.circle, animatedStyle.right]}
          ></Animated.View>
          <Entypo name="light-up" size={35} color="white" />
          <Entypo name="moon" size={35} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: "absolute",
    backgroundColor: "gray",
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 2,
    transform: [{ translateX: -2 }],
  },
  circle_right: {
    position: "absolute",
    backgroundColor: "gray",
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 2,
    transform: [{ translateX: 75 }],
  },

  button: {
    width: 150,
    height: 50,
    backgroundColor: "black",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container_buttons: {
    width: 300,
    height: 600,
    backgroundColor: "gray",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },

  text_machines: {
    fontSize: 25,
    color: "white",
  },
});
