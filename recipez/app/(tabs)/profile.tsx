import {
  StyleSheet,
  Image,
  Platform,
  Text,
  View,
  ScrollView,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function Profile() {
  const dietaryRestrictions = [
    "Lactose Intolerant",
    "Gluten-Free",
    "Vegetarian",
  ];

  return (
    <View style={styles.background}>
      <View style={styles.content}>
        <Text style={styles.heading}>My Profile</Text>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSection}>
            <Image
              source={require("@/assets/images/gordanramsay.jpg")}
              style={styles.image}
            />
            <Text style={styles.name}>Gordan Ramsay</Text>
            <Text style={styles.profession}>Professional Chef</Text>
          </View>
          <View style={styles.itemBox}>
            <Text style={styles.descriptionHeader}>Dietary Restrictions:</Text>
            {dietaryRestrictions.map((restriction, index) => (
              <Text key={index} style={styles.bulletPoint}>
                <Text style={{ fontSize: 20 }}>• </Text>
                {restriction}
              </Text>
            ))}
          </View>
          <Text style={styles.recipeHeader}>Your Recipes:</Text>
          <View style={styles.recipeContainer}>
            <Image
              source={require("@/assets/images/eggs-beans.png")}
              style={styles.imageRec}
            />
            <Text style={styles.overlayText}>Eggs and Beans</Text>
          </View>
          <View style={styles.recipeContainer}>
            <Image
              source={require("@/assets/images/chickengnocchi.jpg")}
              style={styles.imageRec}
            />
            <Text style={styles.overlayText}>Chicken Gnocchi</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 60,
    fontFamily: "Poppins",
  },
  scrollContainer: {
    padding: 0,
  },
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    flex: 1,
    backgroundColor: "#FFFCF8",
    marginBottom: 100,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 180,
    resizeMode: "cover",
    marginTop: 30,
  },
  name: {
    fontSize: 20,
    color: "#000000",
    marginTop: 10,
    fontFamily: "Poppins",
  },
  profession: {
    fontSize: 16,
    color: "#DA7635",
    marginTop: 10,
    fontFamily: "Poppins",
  },
  itemBox: {
    backgroundColor: "#FFE2C6",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "flex-start",
    alignSelf: "stretch",
    marginTop: 20,
  },
  descriptionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    fontFamily: "Poppins",
    textAlign: "left",
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "Poppins",
    marginTop: 1,
    marginLeft: 10,
    marginBottom: 1,
  },
  recipeHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    fontFamily: "Poppins",
    textAlign: "left",
    marginTop: 15,
  },
  imageRec: {
    width: 360,
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
    marginTop: 10,
  },
  recipeContainer: {
    position: "relative",
    width: 360,
    height: 120,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  overlayText: {
    position: "absolute",
    bottom: 10,
    left: 15,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    fontFamily: "Poppins",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
