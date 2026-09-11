import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

const COURSES = ['Starter', 'Main', 'Dessert'];

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  const validate = () => {
    const newErrors = {};

    if (!dishName.trim()) {
      newErrors.dishName = 'Dish name is required.';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (!course) {
      newErrors.course = 'Please select a course.';
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Enter a valid price greater than 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!validate()) {
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: Number(price).toFixed(2),
    };

    setMenuItems((prevItems) => [...prevItems, newItem]);

    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setErrors({});

    Alert.alert('Success', `"${newItem.dishName}" was added to the menu.`);
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.dishName}</Text>
        <Text style={styles.coursePill}>{item.course}</Text>
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardPrice}>R{item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>Chef's Menu Manager</Text>
          <Text style={styles.subHeader}>Add a new menu item below</Text>

          <View style={styles.formSection}>
            <Text style={styles.label}>Dish Name</Text>
            <TextInput
              style={[styles.input, errors.dishName && styles.inputError]}
              placeholder="e.g. Grilled Salmon"
              value={dishName}
              onChangeText={setDishName}
            />
            {errors.dishName && (
              <Text style={styles.errorText}>{errors.dishName}</Text>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              placeholder="Short description of the dish"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            <Text style={styles.label}>Course</Text>
            <View style={styles.courseRow}>
              {COURSES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.courseButton,
                    course === c && styles.courseButtonSelected,
                  ]}
                  onPress={() => setCourse(c)}
                >
                  <Text
                    style={[
                      styles.courseButtonText,
                      course === c && styles.courseButtonTextSelected,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.course && (
              <Text style={styles.errorText}>{errors.course}</Text>
            )}

            <Text style={styles.label}>Price (R)</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              placeholder="e.g. 149.99"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}

            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>Add Menu Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listSection}>
            <Text style={styles.listHeader}>
              Menu Items ({menuItems.length})
            </Text>

            {menuItems.length === 0 ? (
              <Text style={styles.emptyText}>
                No menu items have been added yet. Use the form above to add
                your first dish.
              </Text>
            ) : (
              <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                renderItem={renderMenuItem}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E2A26',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: '#7A7268',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A352F',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D9D3C7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#2E2A26',
    backgroundColor: '#FDFCFA',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#C0392B',
  },
  errorText: {
    color: '#C0392B',
    fontSize: 12,
    marginTop: 4,
  },
  courseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D9D3C7',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#FDFCFA',
  },
  courseButtonSelected: {
    backgroundColor: '#8B5E3C',
    borderColor: '#8B5E3C',
  },
  courseButtonText: {
    color: '#3A352F',
    fontWeight: '500',
    fontSize: 13,
  },
  courseButtonTextSelected: {
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#8B5E3C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  listSection: {
    marginTop: 4,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E2A26',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#7A7268',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E2A26',
    flexShrink: 1,
  },
  coursePill: {
    backgroundColor: '#F1E7DA',
    color: '#8B5E3C',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardDescription: {
    fontSize: 13,
    color: '#5C564D',
    marginTop: 6,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B5E3C',
    marginTop: 8,
  },
});