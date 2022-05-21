import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable } from "react-native";
import NavigationMenu from "./tools/NavigationMenu";

export default function DevicesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <NavigationMenu></NavigationMenu>
      <Pressable onPress={() => navigation.navigate("home")}>
        <Text>Dispositivos</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
