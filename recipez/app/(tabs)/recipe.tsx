import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function recipe() {
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.hello}>Hello</Text>
      </View>
      <View style={styles.titleGreen}>
        <Text style={styles.hello}>Hello</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "yellow",
  },
  titleGreen: {
    backgroundColor: "green",
  },
  hello: {
    marginTop: 20,
    marginRight: 50,
    fontSize: 100,
    color: "purple",
  },
});
