import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // useRouter from expo-router
import { useEffect, useState } from "react";

interface Recipe {
  ["Dish Name"]: string;
  ["Short Description"]: string;
  ["List of Ingredients"]: {
    ingredient: string;
    quantity: string;
  }[];
  ["Instructions"]: string[];
}


export default function Recipes() {
  const { data } = useLocalSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter(); // useRouter hook for navigation

  useEffect(() => {
    if (!data) return;

    const rawResponse = data as string;

    // Extract the JSON block between the ```json and closing ```
    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);

    if (jsonMatch) {
      try {
        // Clean up the JSON string: Remove escape characters like \", \n, etc.
        const cleanedJson = jsonMatch[1]
          .replace(/\\"/g, '"') // Replace escaped quotes with normal quotes
          .replace(/\\n/g, '')  // Remove newlines
          .replace(/\\t/g, '')  // Remove tabs
          .replace(/\\r/g, ''); // Remove carriage returns

        // Parse the cleaned JSON string
        const parsed = JSON.parse(cleanedJson);

        if (Array.isArray(parsed)) {
          // Filter out any recipes with "Unknown" as the dish name
          const validRecipes = parsed.filter(
            (r: any) => r["Dish Name"] && r["Dish Name"] !== "Unknown Dish"
          );
          setRecipes(validRecipes);
        }
      } catch (err) {
        console.error("Failed to parse cleaned JSON:", err);
      }
    }
  }, [data]);

  const truncate = (text: string, limit: number) =>
    text.length > limit ? text.slice(0, limit) + "..." : text;

  const handlePress = (recipe: Recipe) => {
    // Replace navigation.navigate with router.replace
    router.replace({ pathname: "/recipeDetails", params: { data: JSON.stringify([recipe]) } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {recipes.map((recipe, index) => (
        <TouchableOpacity key={index} style={styles.card} onPress={() => handlePress(recipe)}>
          <Text style={styles.title}>{recipe["Dish Name"]}</Text>
          <Text style={styles.description}>
            {truncate(recipe["Short Description"], 20)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFFCF8",
  },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFF2EB",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
