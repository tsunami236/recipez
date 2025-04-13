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

import React, { useEffect, useState } from "react";
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

  const toggleSelection = (id: string) => {
    setFridgeItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const FridgePopup = ({ visible, onClose, fridgeItems, toggleSelection }) => {
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
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity>
            </View>
            {fridgeItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.itemWrapper,
                  { flexDirection: "row", alignItems: "center" },
                ]}
              >
                <Checkbox
                  value={item.selected}
                  onValueChange={() => toggleSelection(item.id)}
                  color={item.selected ? "#DA7635" : undefined}
                />
                <Text style={styles.item}>{item.ingredient}</Text>
              </View>
            ))}
          </View>
        </BlurView>
      </Modal>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFCF8" }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Recipez 🍳</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
          <TouchableOpacity style={styles.generateBtn}>
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
    margin: 7,
  },
  option: {
    margin: 20,
    gap: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  textbox: {
    backgroundColor: "#FFF2EB",
    borderRadius: 5,
    height: 50,
    padding: 10,
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
    margin: 7,
  },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  openButton: {
    backgroundColor: "#4A3228",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold" },
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
