import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Recipes() {
  const { data } = useLocalSearchParams();
  const recipes: string[] = JSON.parse(data as string);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipes.map((recipe, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.recipe}>{recipe}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFCF8",
  },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFF2EB",
    borderRadius: 10,
  },
  recipe: {
    fontSize: 16,
    color: "#333",
  },
});