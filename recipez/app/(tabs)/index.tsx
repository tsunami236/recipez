import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Button,
  Switch
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db, app, storage } from "../../firebaseConfig";
import { TextInput } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { fetchGeminiResponse } from "../../hooks/useGemini";

export default function HomeScreen() {
  const [dishType, setDishType] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [useRestrictions, setUseRestrictions] = useState(false);
  const [useIngredients, setUseIngredients] = useState(false);

  const router = useRouter();

  const handleGenerate = async () => {
    router.push("/generating");

    let ingredients = "";

    if (useIngredients) {
      try {
        const querySnapshot = await getDocs(collection(db, "Users", "0Qa8zrf8HHb0VKboLAjV", "fridge"));
        const ingredientList: string[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.ingredient) {
            ingredientList.push(data.ingredient);
          }
        });

        console.log("Retrieved ingredients:", ingredientList);
        ingredients = ingredientList.join(", ");
      } catch (error) {
        console.error("Error fetching fridge ingredients:", error);
      }
    }

    const prompt = `Give me a few easy ${dishType} recipes ${useRestrictions ? `that follow these dietary restrictions: ${dietaryRestrictions}` : ""
      } using only the following ingredients: ${ingredients}. return the recipes in the following format: Dish Name\nShort Description\nTime (to cook)\nServings (number)\n
      Cuisine\nList of Ingredients (string array)\nInstructions (string array)\nNutrition Information (in the following format):\n
      Calories\nProtein\nCarbohydrates\nSugar\nFat\nSaturated Fat\nFiber\nSodium\nCalcium\nIron. Remember that for the ingredients make the array with the ingredients and the quantity needed.`;

    try {
      const recipes = await fetchGeminiResponse(prompt); // returns a string[] or structured data
      console.log(recipes);
      router.replace({ pathname: "/recipe", params: { data: JSON.stringify(recipes) } });
    } catch (error) {
      console.error("Error fetching recipes:", error);
      Alert.alert("Error", "Something went wrong generating recipes.");
    }
  };


  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFCF8" }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Recipez 🍳</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
            <Text style={styles.btnText}>Generate Recipe</Text>
          </TouchableOpacity>

          <View style={styles.option}>
            <Text style={styles.title}>Dish Type:</Text>
            <TextInput
              placeholder="Ex. Breakfast"
              value={dishType}
              onChangeText={setDishType}
              style={styles.textbox}
            />
          </View>

          <View style={styles.option}>
            <Text style={styles.header}>Dietary Restrictions:</Text>
            <View style={styles.toggleView}>
              <Text>Use your restrictions</Text>
              <Switch
                trackColor={{ false: "#FFF2EB", true: "#DA7635" }}
                thumbColor={useRestrictions ? "#fff" : "#f4f3f4"}
                onValueChange={() => setUseRestrictions(prev => !prev)}
                value={useRestrictions}
              />
            </View>
            <TextInput
              placeholder="Ex. Vegan"
              value={dietaryRestrictions}
              onChangeText={setDietaryRestrictions}
              style={styles.textbox}
            />
          </View>

          <View style={styles.option}>
            <Text style={styles.header}>Ingredients:</Text>
            <View style={styles.toggleView}>
              <Text>Use all of your ingredients</Text>
              <Switch
                trackColor={{ false: "#FFF2EB", true: "#DA7635" }}
                thumbColor={useIngredients ? "#fff" : "#f4f3f4"}
                onValueChange={() => setUseIngredients(prev => !prev)}
                value={useIngredients}
              />
            </View>
            {!useIngredients && (
              <TouchableOpacity style={styles.fridgeBtn}>
                <Text style={styles.fridgeBtnTxt}>Select from fridge</Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#FFFCF8",
  },
  headerContainer: {
    marginTop: 50,
    marginBottom: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  generateBtn: {
    backgroundColor: "#DA7635",
    borderRadius: 5,
    width: 230,
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#FFFCF8",
    margin: 7
  },
  option: {
    margin: 20,
    gap: 10
  },
  title: {
    fontWeight: "bold",
    fontSize: 20
  },
  textbox: {
    backgroundColor: "#FFF2EB",
    borderRadius: 5,
    height: 50,
    padding: 10
  },
  toggleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  fridgeBtn: {
    backgroundColor: "#DA7635",
    borderRadius: 5,
    width: 230,
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
  },
  fridgeBtnTxt: {
    fontSize: 18,
    color: "#FFFCF8",
    margin: 7
  }
});
