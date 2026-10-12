import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const COURSES = ['Starter', 'Main Course', 'Dessert'];

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Main Course');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  function addMenuItem() {
    if (!dishName.trim() || !description.trim() || !course || !price.trim()) {
      Alert.alert('Missing information', 'Please complete all four fields.');
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      Alert.alert('Invalid price', 'Enter a price greater than R0.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: numericPrice.toFixed(2)
    };

    setMenuItems(currentItems => [newItem, ...currentItems]);
    setDishName('');
    setDescription('');
    setCourse('Main Course');
    setPrice('');
    Alert.alert('Item added', `${newItem.dishName} was added to the menu.`);
  }

  function deleteMenuItem(id) {
    Alert.alert('Delete menu item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setMenuItems(items => items.filter(item => item.id !== id))
      }
    ]);
  }

  function renderMenuItem({ item }) {
    return (
      <View style={styles.menuCard}>
        <View style={styles.itemTop}>
          <View style={styles.itemText}>
            <Text style={styles.dishTitle}>{item.dishName}</Text>
            <Text style={styles.course}>{item.course}</Text>
          </View>
          <Text style={styles.price}>R{item.price}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Pressable style={styles.deleteButton} onPress={() => deleteMenuItem(item.id)}>
          <Text style={styles.deleteButtonText}>Delete item</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>RESTAURANT MENU</Text>
          <Text style={styles.title}>Chef's Menu Manager</Text>
          <Text style={styles.subtitle}>Add a dish and keep your menu in one place.</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Add Menu Item</Text>

          <Text style={styles.label}>Dish Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Chicken Alfredo"
            value={dishName}
            onChangeText={setDishName}
            maxLength={60}
            returnKeyType="next"
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe the dish"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={250}
          />

          <Text style={styles.label}>Course *</Text>
          <View style={styles.courseRow}>
            {COURSES.map(option => (
              <Pressable
                key={option}
                style={[styles.courseOption, course === option && styles.courseOptionSelected]}
                onPress={() => setCourse(option)}
              >
                <Text style={[styles.courseOptionText, course === option && styles.courseOptionTextSelected]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Price (R) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 85.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            maxLength={10}
          />

          <Pressable style={styles.saveButton} onPress={addMenuItem}>
            <Text style={styles.saveButtonText}>Save Item</Text>
          </Pressable>
          <Text style={styles.requiredNote}>* All fields are required.</Text>
        </View>

        <View style={styles.listHeader}>
          <View>
            <Text style={styles.sectionTitle}>All Menu Items</Text>
            <Text style={styles.listSubtitle}>
              {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'} added
            </Text>
          </View>
        </View>

        {menuItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No menu items yet</Text>
            <Text style={styles.emptyText}>Complete the form above and tap Save Item to add your first dish.</Text>
          </View>
        ) : (
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
          />
        )}

        <Text style={styles.footer}>Chef's Menu Manager · Part 2</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f6f3' },
  container: { padding: 18, paddingBottom: 36 },
  header: { paddingTop: 12, paddingBottom: 20 },
  eyebrow: { color: '#46745c', fontSize: 11, fontWeight: '800', letterSpacing: 1.6, marginBottom: 8 },
  title: { color: '#183b2b', fontSize: 28, fontWeight: '800', lineHeight: 34 },
  subtitle: { color: '#617067', fontSize: 14, marginTop: 8, lineHeight: 20 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#e2e9e3', marginBottom: 24 },
  sectionTitle: { color: '#203b2d', fontSize: 20, fontWeight: '800' },
  label: { color: '#344b3d', fontSize: 13, fontWeight: '700', marginTop: 16, marginBottom: 7 },
  input: { backgroundColor: '#f8faf8', borderWidth: 1, borderColor: '#dce5dd', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: '#1f3026' },
  multilineInput: { minHeight: 82 },
  courseRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  courseOption: { borderWidth: 1, borderColor: '#d5e1d7', borderRadius: 9, paddingVertical: 10, paddingHorizontal: 11, backgroundColor: '#f8faf8' },
  courseOptionSelected: { backgroundColor: '#1f6a46', borderColor: '#1f6a46' },
  courseOptionText: { color: '#43564a', fontSize: 12, fontWeight: '600' },
  courseOptionTextSelected: { color: '#ffffff' },
  saveButton: { backgroundColor: '#1f6a46', borderRadius: 11, paddingVertical: 15, alignItems: 'center', marginTop: 22 },
  saveButtonText: { color: '#ffffff', fontWeight: '800', fontSize: 16 },
  requiredNote: { color: '#7a887e', fontSize: 11, marginTop: 10 },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  listSubtitle: { color: '#78857b', fontSize: 12, marginTop: 4 },
  emptyCard: { backgroundColor: '#eaf0eb', borderRadius: 14, padding: 22, alignItems: 'center' },
  emptyTitle: { color: '#284a36', fontSize: 16, fontWeight: '800' },
  emptyText: { color: '#627368', textAlign: 'center', fontSize: 13, lineHeight: 19, marginTop: 6 },
  list: { gap: 12 },
  menuCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e2e9e3', marginBottom: 12 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  itemText: { flex: 1 },
  dishTitle: { color: '#203b2d', fontSize: 17, fontWeight: '800' },
  course: { color: '#548064', fontSize: 12, fontWeight: '700', marginTop: 4 },
  price: { color: '#1f6a46', fontSize: 16, fontWeight: '800' },
  description: { color: '#627067', fontSize: 14, lineHeight: 20, marginTop: 12 },
  deleteButton: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#e5c7c7', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, marginTop: 14 },
  deleteButtonText: { color: '#a43b3b', fontSize: 12, fontWeight: '700' },
  footer: { textAlign: 'center', color: '#8a968d', fontSize: 11, marginTop: 28 }
});
