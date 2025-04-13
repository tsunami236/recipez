import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Fridge() {
  const [items, setItems] = useState([
    { id: 1, name: 'Eggs', amount: 10 },
    { id: 2, name: 'Cabbage', amount: 2 },
  ]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [newAmount, setNewAmount] = useState<string>('');

  const handleEditAmount = (id: number) => {
    setEditingItemId(id);
    const item = items.find((item) => item.id === id);
    if (item) {
      setNewAmount(item.amount.toString());
    }
  };

  const handleSaveAmount = (id: number) => {
    setItems(prevItems =>
      prevItems.map(item => 
        item.id === id ? { ...item, amount: parseInt(newAmount) } : item
      )
    );
    setEditingItemId(null);  
    setNewAmount('');       
  };

  const handleDelete = (idToRemove: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
  };

  return (
    <View style={styles.background}>
      <View style={styles.content}>
        <Text style={styles.heading}>Your Fridge</Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemBox}>
              <View style={styles.itemRow}>
                <View>
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
                      <TouchableOpacity onPress={() => handleSaveAmount(item.id)}>
                        <Text style={styles.itemAmount}>Save</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.itemAmount}> x{item.amount}</Text>
                      <TouchableOpacity onPress={() => handleEditAmount(item.id)}>
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
        </ScrollView>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.addItemBox}>
            <Text style={styles.addItemBoxText}>Add With Receipt</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.plusButton}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 50,
    fontFamily: 'Poppins',
    padding: 20,
  },
  content: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#FFFCF8',
  },
  itemBox: {
    backgroundColor: '#FFE2C6',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  itemTitle: {
    fontSize: 20,
    fontFamily: 'Poppins',
    color: '#000000',
    justifyContent: 'flex-start',
  },
  itemAmount: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#000000',
  },
  itemEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    width: 60,
    textAlign: 'center',
  },
  addItemBox: {
    backgroundColor: '#DA7635',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginRight: 10,
  },
  addItemBoxText: {
    color: '#FFFCF8',
    fontSize: 20,
    fontFamily: 'Poppins',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 100,
    marginRight: 50,
  },
  plusButton: {
    backgroundColor: '#FFFCF8',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  plusText: {
    color: '#000000',
    fontSize: 36,
    lineHeight: 36,
    fontWeight: 'bold',
  },
});
