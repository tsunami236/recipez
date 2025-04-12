import { StyleSheet, Image, Platform, View, Text, TouchableOpacity } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function Fridge() {
  return (
    <View style={styles.background}>
      <View style={styles.content}>
        <Text style={styles.heading}>Your Fridge</Text>
        <View style={styles.itemBox}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>Eggs</Text>
            <View style={styles.itemEditContainer}> 
            <Text style={styles.itemAmount}> x10</Text>
            <View style={styles.triangleContainer}>
              <TouchableOpacity onPress={() => {}}>
                <View style={styles.upTriangle} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <View style={styles.downTriangle} />
              </TouchableOpacity>
            </View>
            </View>
          </View>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20
  },
  itemRow: {
    flexDirection: 'row',
    gap: 230,
    justifyContent: 'flex-end',
    alignItems: 'center', 
  },
  itemTitle: {
    fontSize: 20,
    fontFamily: 'Poppins',
    color: '#000000',
  },
  itemAmount: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#000000',
  },
  itemEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  triangleContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  upTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000000',
  },
  downTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000000',
    transform: [{ rotate: '180deg' }],
  },
  addItemBox: {
    backgroundColor: '#DA7635',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginRight: 10
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
    marginRight: 50
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
