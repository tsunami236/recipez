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
  Switch,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import { BlurView } from "expo-blur";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Checkbox } from "expo-checkbox";

import React, { memo, useCallback, useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db, app, storage } from "../firebaseConfig";
import { TextInput } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { fetchGeminiResponse } from "../../hooks/useGemini";

export default function HomeScreen() {
  const [dishType, setDishType] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [useRestrictions, setUseRestrictions] = useState(false);
  const [useIngredients, setUseIngredients] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const db = getFirestore(app);

  type FridgeItem = {
    id: string;
    ingredient: string;
    quantity: number;
    selected: boolean;
  };

  const useFridgeItems = (userId: string) => {
    const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);

    useEffect(() => {
      const retrieveFridge = async () => {
        const fridgeRef = collection(db, "Users", userId, "fridge");

        try {
          const snapshot = await getDocs(fridgeRef);

          const items = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ingredient: data.ingredient,
              quantity: data.quantity,
              selected: false, // add default selected boolean
            };
          });

          setFridgeItems(items);
        } catch (error) {
          console.error("Error fetching fridge data:", error);
        }
      };

      retrieveFridge();
    }, [userId]);

    return [fridgeItems, setFridgeItems] as const;
  };

  const [fridgeItems, setFridgeItems] = useFridgeItems("0Qa8zrf8HHb0VKboLAjV");

  const toggleSelection = useCallback((id: string) => {
    setFridgeItems((prev) =>
      prev.map(
        (item) =>
          item.id === id ? { ...item, selected: !item.selected } : item // keep reference for unchanged items
      )
    );
  }, []);

  // 1. Memoized FridgeItem component
  const FridgeItem = memo(({ item, onToggle }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Checkbox
          value={item.selected}
          onValueChange={() => onToggle(item.id)}
          color={item.selected ? "#DA7635" : undefined}
        />
        <Text style={styles.item}>{item.ingredient.toLowerCase()}</Text>
      </View>
    );
  });

  const FridgePopup = ({ visible, onClose, fridgeItems, toggleSelection }) => {
    // 2. Memoize the toggleSelection wrapper
    const handleToggle = useCallback(
      (id) => {
        toggleSelection(id);
      },
      [toggleSelection]
    );

    return (
      <Modal transparent animationType="fade" visible={visible}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={onClose} />
          <View style={styles.modalContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={styles.ingredientsTitle}>Ingredients</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {/* Render memoized items */}
            {fridgeItems.map((item) => (
              <FridgeItem key={item.id} item={item} onToggle={handleToggle} />
            ))}
          </View>
        </BlurView>
      </Modal>
    );
  };

  const router = useRouter();

  const handleGenerate = async () => {
    router.push("/generating");

    let ingredients = "";

    if (useIngredients) {
      try {
        const querySnapshot = await getDocs(
          collection(db, "Users", "0Qa8zrf8HHb0VKboLAjV", "fridge")
        );
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

    const prompt = `Give me a few easy ${dishType} recipes ${
      useRestrictions
        ? `that follow these dietary restrictions: ${dietaryRestrictions}`
        : ""
    } using only the following ingredients: ${ingredients}. return the recipes in the following format: Dish Name\nShort Description\nTime (to cook)\nServings (number)\n
    const prompt = `Give me a few easy ${dishType} recipes ${useRestrictions ? `that follow these dietary restrictions: ${dietaryRestrictions}` : ""
      } using only the following ingredients: ${ingredients}. return the recipes in the following format (e.g. Dish Name: Scrambled Eggs\nShort Description: Hearty meal, etc.): Dish Name\nShort Description\nTime (to cook)\nServings (number)\n
      Cuisine\nList of Ingredients (string array)\nInstructions (string array)\nNutrition Information (in the following format):\n
      Calories\nProtein\nCarbohydrates\nSugar\nFat\nSaturated Fat\nFiber\nSodium\nCalcium\nIron. Remember that for the ingredients make the array with the ingredients and the quantity needed. Give in JSON format.`;

    try {
      const recipes = await fetchGeminiResponse(prompt); // returns a string[] or structured data
      console.log(recipes);
      router.replace({ pathname: "/generatedRecipes", params: { data: JSON.stringify(recipes.slice(1)) } });
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
                onValueChange={() => setUseRestrictions((prev) => !prev)}
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
                onValueChange={() => {
                  setUseIngredients((prev) => {
                    const next = !prev;

                    // Set fridgeItems to all selected: true
                    if (next == true) {
                      setFridgeItems((prevItems) =>
                        prevItems.map((item) => ({ ...item, selected: true }))
                      );
                    } else {
                      setFridgeItems((prevItems) =>
                        prevItems.map((item) => ({ ...item, selected: false }))
                      );
                    }
                    return next;
                  });
                }}
                value={useIngredients}
              />
            </View>
            {!useIngredients && (
              <TouchableOpacity
                style={styles.fridgeBtn}
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Text style={styles.fridgeBtnTxt}>Select from fridge</Text>
              </TouchableOpacity>
            )}
            <FridgePopup
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              fridgeItems={fridgeItems}
              toggleSelection={toggleSelection}
            />
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
    fontSize: 20,
    fontFamily: "Poppins",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Poppins",
  },
  generateBtn: {
    backgroundColor: "#DA7635",
    borderRadius: 5,
    width: 230,
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    fontFamily: "Poppins",
  },
  btnText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#FFFCF8",
    margin: 7,
    fontFamily: "Poppins",
  },
  option: {
    margin: 20,
    gap: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    fontFamily: "Poppins",
  },
  textbox: {
    backgroundColor: "#FFF2EB",
    borderRadius: 5,
    height: 50,
    padding: 10,
    fontFamily: "Poppins",
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
    width: 300,
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    height: 50,
  },
  fridgeBtnTxt: {
    fontSize: 25,
    color: "#FFFCF8",
    margin: 8,
    fontFamily: "Poppins",
  },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  openButton: {
    backgroundColor: "#4A3228",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold", fontFamily: "Poppins" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    marginTop: "auto",
    marginBottom: "auto",
    marginHorizontal: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  item: {
    paddingVertical: 4,
    fontSize: 16,
    marginLeft: 5,
    fontFamily: "Poppins",
  },
  itemWrapper: {
    marginBottom: 10,
  },
  ingredientsTitle: {
    fontFamily: "Poppins",
    fontWeight: "bold",
    fontSize: 20,
    paddingBottom: 10,
  },
  checkbox: {
    marginLeft: 10,
    fontSize: 20,
    borderColor: "#DA7635",
    borderWidth: 2,
  },
});
