import { View, StyleSheet, Text } from "react-native";
import LottieView from "lottie-react-native";


export default function Generating() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/cooking-animation.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.text}>Generating recipes...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  animation: {
    width: 300,
    height: 200
  },
  text: {
    marginTop: 30,
    fontSize: 18,
    color: "#333",
    fontStyle: "italic"
  },
})