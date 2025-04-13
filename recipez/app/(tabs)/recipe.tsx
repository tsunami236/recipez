import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import React, { useState } from "react";

export default function recipe() {
  const [recipes, setRecipes] = useState([
    {
      title: "Chicken Stir Fry",
      subtitle: "Quick-fried chicken with colorful...",
    },
    {
      title: "Grilled Cheese Sandwich",
      subtitle: "Golden, buttery bread stuffed...",
    },
    {
      title: "Baked Lemon Garlic Salmon",
      subtitle: "Flaky salmon fillet baked...",
    },
    {
      title: "Creamy Tomato Pasta",
      subtitle: "Pasta tossed in a rich, creamy...",
    },
  ]);

  /*
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSubtitle, setEditedSubtitle] = useState('');

  const handleEdit = (recipe) => {
    setCurrentRecipe(recipe);
    setEditedTitle(recipe.title);
    setEditedSubtitle(recipe.subtitle);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    const updated = recipes.map((r) =>
      r.title === currentRecipe.title
        ? { ...r, title: editedTitle, subtitle: editedSubtitle }
        : r
    );
    setRecipes(updated);
    setEditModalVisible(false);
  };

  <TouchableOpacity onPress={() => handleEdit(item)}>
                <Ionicons name="pencil" size={20} color="black" style={styles.icon} />
              </TouchableOpacity>

  */

  /* MODAL FOR EDITING
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Edit Recipe</Text>
            <TextInput
              value={editedTitle}
              onChangeText={setEditedTitle}
              style={styles.input}
              placeholder="Title"
            />
            <TextInput
              value={editedSubtitle}
              onChangeText={setEditedSubtitle}
              style={styles.input}
              placeholder="Subtitle"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
              <Button title="Save" onPress={saveEdit} />
            </View>
          </View>
        </View>
      </Modal>
      */

  const handleDelete = (itemToDelete) => {
    setRecipes(recipes.filter((item) => item.title !== itemToDelete.title));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Recipes:</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by:</Text>
        <View style={styles.filterChip}>
          <Text style={styles.filterText}>&lt; newest &gt;</Text>
        </View>
      </View>

      <ScrollView style={styles.recipeList}>
        {recipes.map((item, index) => (
          <TouchableOpacity>
            <View key={index} style={styles.recipeCard}>
              <View>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeSubtitle}>{item.subtitle}</Text>
              </View>

              <View style={styles.icons}>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Ionicons name="trash" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#FFF6F1",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
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
  filterLabel: {
    fontSize: 16,
  },
  filterChip: {
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  recipeList: {
    marginTop: 20,
  },
  recipeCard: {
    backgroundColor: "#FDBFAF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recipeSubtitle: {
    fontSize: 13,
    color: "#444",
  },
  icons: {
    flexDirection: "row",
    gap: 12,
  },
  icon: {
    marginRight: 8,
  },
  fab: {
    backgroundColor: "black",
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    bottom: 70,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  bottomNav: {
    height: 50,
    borderTopWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
});
