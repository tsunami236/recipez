import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import addReceipt from "@/hooks/addReceipt";

export default function Fridge() {
  const [items, setItems] = useState([
    { id: 1, name: "eggs", amount: 10 },
    { id: 2, name: "cabbage", amount: 2 },
  ]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  //const [newAmount, setNewAmount] = useState<string>('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const handleEditAmount = (id: number) => {
    setEditingItemId(id);
    const item = items.find((item) => item.id === id);
    if (item) {
      setNewAmount(item.amount.toString());
    }
  };

  const handleSaveAmount = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, amount: parseInt(newAmount) } : item
      )
    );
    setEditingItemId(null);
    setNewAmount("");
  };

  const handleDelete = (idToRemove: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== idToRemove));
  };

  const handleAdd = () => {
    if (!newName.trim() || !newAmount.trim()) return;

    const newItem = {
      id: Date.now(), // simple unique id
      name: newName,
      amount: parseInt(newAmount),
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setNewName("");
    setNewAmount("");
    setShowAddForm(false);
  };

  const [ocrText, setOcrText] = useState<string>("");
  const [imageUris, setImageUris] = useState<string[]>([]);

  const { fetchGemini, loading, response, error } = addReceipt();

  useEffect(() => {
    if (response && !loading && !error) {
      // Convert "milk, eggs, carrots" into individual item objects
      const itemsFromResponse = response
        .split(",")
        .map((name) => name.trim())
        .filter((name) => !!name)
        .map((name) => ({
          id: Date.now() + Math.random(), // unique id
          name,
          amount: 1, // default amount
        }));

      setItems((prevItems) => {
        const updatedItems = [...prevItems];

        itemsFromResponse.forEach((newItem) => {
          const index = updatedItems.findIndex(
            (item) => item.name.toLowerCase() === newItem.name.toLowerCase()
          );

          if (index !== -1) {
            // Item already exists: increment its amount
            updatedItems[index] = {
              ...updatedItems[index],
              amount: updatedItems[index].amount + newItem.amount,
            };
          } else {
            // New item: add it
            updatedItems.push(newItem);
          }
        });

        return updatedItems;
      });

      // Optional: reset OCR text so it doesn’t show again
      //setOcrText('');
    }
  }, [response, loading, error]); // Only runs when response (or related states) change

  const handleImageSelect = async () => {
    // Ask for permissions to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    // Launch image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1], // Optional, to crop images into a square
    });

    if (!pickerResult.canceled) {
      const newImageUri = pickerResult.assets?.[0].uri;
      if (newImageUri) {
        // Update imageUris state to add the new image
        setImageUris((prevUris) => {
          const updatedUris = [...prevUris, newImageUri];
          return updatedUris;
        });

        // Perform OCR on the selected image
        await performOCR(newImageUri);
      }
    }
  };

  const performOCR = async (imageUri: string) => {
    try {
      // Convert the image to Base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Debug: Log the Base64 string to ensure it's correctly formatted
      console.log("Base64 Image String:", base64.substring(0, 100)); // Log a snippet to avoid logging large strings

      // Call Google Vision API to recognize text
      const text = await callGoogleVisionAPI(base64);

      fetchGemini(
        "Write a string that contains all the food items on this receipt in the following format: item1, item2, item3, etc. Omit any brand names and return the most standardized name for each item in all lowercase." +
          text
      );

      // Log the recognized text to check
      console.log("Recognized Text:", text);
    } catch (error) {
      console.error("OCR failed", error);
    }
  };

  const callGoogleVisionAPI = async (base64: string) => {
    const API_KEY = "AIzaSyDS2ywDv7v0x4ufI2T9575HgvpWdRkanno"; // Replace with your actual API key

    const body = {
      requests: [
        {
          image: {
            content: base64,
          },
          features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
        },
      ],
    };

    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      // Debug: Check if the response is valid
      const result = await response.json();
      console.log("API Response:", result);

      return result.responses?.[0]?.fullTextAnnotation?.text || "";
    } catch (error) {
      console.error("Error calling Google Vision API:", error);
      return "";
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.content}>
        <Text style={styles.heading}>Your Fridge</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemBox}>
              <View style={styles.itemRow}>
                <View style={{ flexShrink: 1 }}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                </View>
                <View style={styles.itemEditContainer}>
                  {editingItemId === item.id ? (
                    <>
                      <TextInput
                        style={styles.input}
                        value={newAmount}
                        onChangeText={setNewAmount}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity
                        onPress={() => handleSaveAmount(item.id)}
                      >
                        <Text style={styles.itemAmount}>Save</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.itemAmount}> x{item.amount}</Text>
                      <TouchableOpacity
                        onPress={() => handleEditAmount(item.id)}
                      >
                        <Text style={styles.itemAmount}>Edit Amount</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          {showAddForm && (
            <View style={styles.formBox}>
              <TextInput
                style={styles.input}
                placeholder="Food Name (ex: Eggs)"
                placeholderTextColor="#888"
                value={newName}
                onChangeText={setNewName}
              />
              <TextInput
                style={styles.input}
                placeholder="Amount (ex: 3)"
                placeholderTextColor="#888"
                value={newAmount}
                onChangeText={setNewAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleImageSelect}>
          <View style={styles.addItemBox}>
            <Text style={styles.addItemBoxText}>Add With Receipt</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowAddForm((prev) => !prev)}>
          <View style={styles.plusButton}>
            <Text style={styles.plusText}>+ Add</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.ocrText}>{ocrText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 50,
    fontFamily: "Poppins",
    padding: 20,
  },
  content: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: "#FFFCF8",
  },
  itemBox: {
    backgroundColor: "#FFE2C6",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  itemTitle: {
    fontSize: 20,
    fontFamily: "Poppins",
    color: "#000000",
    justifyContent: "flex-start",
    fontFamily: "Poppins",
    color: "#000000",
    justifyContent: "flex-start",
  },
  itemAmount: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: "#000000",
  },
  itemEditContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  formBox: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontFamily: "Poppins",
    marginBottom: 12,
    fontSize: 16,
    color: "#000",
  },
  addButton: {
    backgroundColor: "#DA7635",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontFamily: "Poppins",
    fontSize: 16,
  },
  addItemBox: {
    backgroundColor: "#DA7635",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginRight: 10,
  },
  addItemBoxText: {
    color: "#FFFCF8",
    fontSize: 20,
    fontFamily: "Poppins",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 100,
    marginRight: 50,
  },
  plusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#DA7635',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFCF8',
    alignSelf: 'center',
  },
  plusText: {
    color: '#DA7635',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
  ocrText: {
    marginTop: 20,
    fontSize: 14,
    color: "gray",
  },
});
