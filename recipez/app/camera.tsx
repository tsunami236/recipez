import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { GOOGLEAPIKEY } from "./apiKey";

export default function CameraScreen() {
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [ocrText, setOcrText] = useState<string>("");

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

      // Update state with OCR text
      setOcrText(text);

      // Log the recognized text to check
      console.log("Recognized Text:", text);
    } catch (error) {
      console.error("OCR failed", error);
    }
  };

  const callGoogleVisionAPI = async (base64: string) => {
    const API_KEY = GOOGLEAPIKEY; // Replace with your actual API key

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
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageButton} onPress={handleImageSelect}>
        <Text style={styles.imgbtntext}>+</Text>
      </TouchableOpacity>
      {imageUris.map((uri, index) => (
        <View key={index} style={styles.imageWrapper}>
          <Image source={{ uri }} style={styles.imagePreview} />
        </View>
      ))}
      <Text style={styles.ocrText}>{ocrText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageButton: {
    borderColor: "#4A3228",
    borderWidth: 2.5,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginRight: 10,
  },
  imgbtntext: {
    color: "#4A3228",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageWrapper: {
    marginRight: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  ocrText: {
    marginTop: 20,
    fontSize: 14,
    color: "gray",
  },
});
