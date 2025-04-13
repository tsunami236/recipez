import { View, Text, StyleSheet, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // useRouter for navigating

export default function RecipeDetails() {
  const { data } = useLocalSearchParams(); // Access the data parameter passed via router
  const recipe = data ? JSON.parse(data)[0] : null; // Parse the data (assuming you passed an array with one recipe)
  const router = useRouter(); // Access the router

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Recipe Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe["Dish Name"]}</Text>
      <Text style={styles.description}>{recipe["Short Description"]}</Text>

      <Text style={styles.heading}>Ingredients:</Text>
      <View style={styles.ingredientsContainer}>
        {recipe["List of Ingredients"].map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            {ingredient}
          </Text>
        ))}
      </View>

      <Text style={styles.heading}>Instructions:</Text>
      <View style={styles.ingredientsContainer}>
        {recipe["Instructions"].map((instruction, index) => (
          <Text key={index} style={styles.instruction}>
            {instruction}
          </Text>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFCF8",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  ingredient: {
    fontSize: 16,
    color: "#333",
  },
  instruction: {
    fontSize: 16,
    color: "#333",
  },
});
