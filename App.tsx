import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';

// Available menu courses
const COURSES = ['Starter', 'Main Course', 'Dessert'];

// Menu item structure
type MenuItem = {
  id: string;
  dishName: string;
  description: string;
  course: string;
  price: string;
};

// Form error structure
type FormErrors = Partial<
  Record<'dishName' | 'description' | 'course' | 'price', string>
>;

export default function App() {

  // Form states
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [price, setPrice] = useState('');

  // Menu states
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);


  // VALIDATE FORM

  const validate = () => {

    const newErrors: FormErrors = {};

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
    } else if (
      !/^\d+(\.\d{1,2})?$/.test(price.trim()) ||
      Number(price) <= 0
    ) {
      newErrors.price = 'Enter a valid price greater than 0.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // CLEAR FORM

  const clearForm = () => {

    setDishName('');
    setDescription('');
    setCourse('');
    setPrice('');
    setErrors({});
    setEditingId(null);

  };


  // ADD OR UPDATE MENU ITEM

  const handleSaveItem = () => {

    Keyboard.dismiss();

    if (!validate()) {
      return;
    }

    if (editingId !== null) {

      // Update existing item

      setMenuItems((previousItems) =>
        previousItems.map((item) =>
          item.id === editingId
            ? {
                ...item,
                dishName: dishName.trim(),
                description: description.trim(),
                course,
                price: Number(price).toFixed(2),
              }
            : item
        )
      );

      Alert.alert(
        'Success',
        `"${dishName.trim()}" was updated successfully.`
      );

    } else {

      // Add new item

      const newItem: MenuItem = {
        id: Date.now().toString(),
        dishName: dishName.trim(),
        description: description.trim(),
        course,
        price: Number(price).toFixed(2),
      };

      setMenuItems((previousItems) => [
        ...previousItems,
        newItem,
      ]);

      Alert.alert(
        'Success',
        `"${newItem.dishName}" was added successfully.`
      );

    }

    clearForm();

  };


  // EDIT MENU ITEM

  const handleEditItem = (item: MenuItem) => {

    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);

    setEditingId(item.id);

    setErrors({});

    Keyboard.dismiss();

  };


  // DELETE MENU ITEM

  const handleDeleteItem = (item: MenuItem) => {

    Alert.alert(

      'Delete Menu Item',

      `Are you sure you want to delete "${item.dishName}"?`,

      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: () => {

            setMenuItems((previousItems) =>
              previousItems.filter(
                (menuItem) => menuItem.id !== item.id
              )
            );

            if (editingId === item.id) {
              clearForm();
            }

            Alert.alert(
              'Deleted',
              'Menu item deleted successfully.'
            );

          },
        },
      ]

    );

  };


  // SEARCH AND FILTER MENU ITEMS

  const filteredItems = menuItems.filter((item) => {

    const matchesSearch = item.dishName
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    const matchesCourse =
      selectedCourse === 'All' ||
      item.course === selectedCourse;

    return matchesSearch && matchesCourse;

  });


  // CLEAR SEARCH AND FILTERS

  const clearFilters = () => {

    setSearchQuery('');
    setSelectedCourse('All');

  };


  // MENU STATISTICS

  const totalItems = menuItems.length;

  const totalPrice = menuItems.reduce(
    (total, item) => total + Number(item.price),
    0
  );

  const averagePrice = totalItems > 0
    ? totalPrice / totalItems
    : 0;


  // COUNT ITEMS PER COURSE

  const courseCounts = COURSES.map((itemCourse) => ({

    name: itemCourse,

    count: menuItems.filter(
      (item) => item.course === itemCourse
    ).length,

  }));


  // MAIN APPLICATION INTERFACE

  return (

    <SafeAreaView style={styles.safeArea}>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        {/* SCROLLABLE APPLICATION CONTENT */}

        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >

          {/* HEADER */}

          <View style={styles.headerSection}>

            <Text style={styles.header}>
              Chef's Menu Manager
            </Text>

            <Text style={styles.subHeader}>
              Restaurant Menu Management System
            </Text>

          </View>


          {/* MENU STATISTICS */}

          <Text style={styles.sectionHeading}>
            Menu Overview
          </Text>

          <View style={styles.statisticsContainer}>

            <View style={styles.statCard}>

              <Text style={styles.statNumber}>
                {totalItems}
              </Text>

              <Text style={styles.statLabel}>
                Total Menu Items
              </Text>

            </View>


            <View style={styles.statCard}>

              <Text style={styles.statNumber}>
                R{averagePrice.toFixed(2)}
              </Text>

              <Text style={styles.statLabel}>
                Average Price
              </Text>

            </View>

          </View>


          {/* COURSE STATISTICS */}

          <View style={styles.courseStatistics}>

            <Text style={styles.sectionHeading}>
              Items Per Course
            </Text>

            {courseCounts.map((item) => (

              <View
                key={item.name}
                style={styles.courseStatRow}
              >

                <Text style={styles.courseStatName}>
                  {item.name}
                </Text>

                <Text style={styles.courseStatCount}>
                  {item.count}
                </Text>

              </View>

            ))}

          </View>


          {/* ADD AND EDIT FORM */}

          <View style={styles.formSection}>

            <Text style={styles.sectionHeading}>

              {editingId !== null
                ? 'Edit Menu Item'
                : 'Add New Menu Item'}

            </Text>


            {/* DISH NAME */}

            <Text style={styles.label}>
              Dish Name
            </Text>

            <TextInput
              style={[
                styles.input,
                errors.dishName && styles.inputError,
              ]}
              placeholder="e.g. Grilled Salmon"
              placeholderTextColor="#A69C90"
              value={dishName}
              onChangeText={setDishName}
              returnKeyType="next"
            />

            {errors.dishName && (
              <Text style={styles.errorText}>
                {errors.dishName}
              </Text>
            )}


            {/* DESCRIPTION */}

            <Text style={styles.label}>
              Description
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                errors.description && styles.inputError,
              ]}
              placeholder="Describe the dish"
              placeholderTextColor="#A69C90"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {errors.description && (
              <Text style={styles.errorText}>
                {errors.description}
              </Text>
            )}


            {/* COURSE SELECTION */}

            <Text style={styles.label}>
              Course
            </Text>

            <View style={styles.courseRow}>

              {COURSES.map((c) => (

                <TouchableOpacity
                  key={c}
                  style={[
                    styles.courseButton,
                    course === c && styles.courseButtonSelected,
                  ]}
                  onPress={() => {
                    setCourse(c);
                    setErrors((previous) => ({
                      ...previous,
                      course: undefined,
                    }));
                  }}
                  activeOpacity={0.8}
                >

                  <Text
                    style={[
                      styles.courseButtonText,
                      course === c &&
                      styles.courseButtonTextSelected,
                    ]}
                  >
                    {c}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>

            {errors.course && (
              <Text style={styles.errorText}>
                {errors.course}
              </Text>
            )}


            {/* PRICE */}

            <Text style={styles.label}>
              Price (R)
            </Text>

            <TextInput
              style={[
                styles.input,
                errors.price && styles.inputError,
              ]}
              placeholder="e.g. 149.99"
              placeholderTextColor="#A69C90"
              value={price}
              onChangeText={(text) =>
                setPrice(text.replace(',', '.'))
              }
              keyboardType="decimal-pad"
            />

            {errors.price && (
              <Text style={styles.errorText}>
                {errors.price}
              </Text>
            )}

          </View>


          {/* SEARCH AND FILTER SECTION */}

          <View style={styles.listSection}>

            <Text style={styles.sectionHeading}>
              Manage Menu Items
            </Text>


            {/* SEARCH */}

            <Text style={styles.label}>
              Search by Dish Name
            </Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Search menu items..."
              placeholderTextColor="#A69C90"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />


            {/* COURSE FILTER */}

            <Text style={styles.label}>
              Filter by Course
            </Text>

            <View style={styles.filterRow}>

              {['All', ...COURSES].map((c) => (

                <TouchableOpacity
                  key={c}
                  style={[
                    styles.filterButton,
                    selectedCourse === c &&
                    styles.filterButtonSelected,
                  ]}
                  onPress={() => setSelectedCourse(c)}
                >

                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedCourse === c &&
                      styles.filterButtonTextSelected,
                    ]}
                  >
                    {c}
                  </Text>

                </TouchableOpacity>

              ))}

            </View>


            {/* CLEAR FILTERS */}

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
            >

              <Text style={styles.clearButtonText}>
                Clear Search and Filters
              </Text>

            </TouchableOpacity>


            <Text style={styles.resultsText}>
              Showing {filteredItems.length} of {totalItems} menu items
            </Text>


            {/* DISPLAY MENU ITEMS */}

            {filteredItems.length === 0 ? (

              <Text style={styles.emptyText}>

                {menuItems.length === 0
                  ? 'No menu items added yet. Add your first dish above.'
                  : 'No matching menu items found.'}

              </Text>

            ) : (

              filteredItems.map((item) => (

                <View
                  key={item.id}
                  style={styles.card}
                >

                  <View style={styles.cardHeader}>

                    <Text style={styles.cardTitle}>
                      {item.dishName}
                    </Text>

                    <Text style={styles.coursePill}>
                      {item.course}
                    </Text>

                  </View>

                  <Text style={styles.cardDescription}>
                    {item.description}
                  </Text>

                  <Text style={styles.cardPrice}>
                    R{item.price}
                  </Text>


                  {/* EDIT AND DELETE */}

                  <View style={styles.actionRow}>

                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditItem(item)}
                    >

                      <Text style={styles.actionButtonText}>
                        Edit
                      </Text>

                    </TouchableOpacity>


                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteItem(item)}
                    >

                      <Text style={styles.actionButtonText}>
                        Delete
                      </Text>

                    </TouchableOpacity>

                  </View>

                </View>

              ))

            )}

          </View>

        </ScrollView>


        {/* FIXED BOTTOM SAVE BUTTON */}

        <View style={styles.footer}>

          {editingId !== null && (

            <TouchableOpacity
              style={styles.footerCancelButton}
              onPress={() => {
                Keyboard.dismiss();
                clearForm();
              }}
            >

              <Text style={styles.footerCancelText}>
                Cancel
              </Text>

            </TouchableOpacity>

          )}

          <TouchableOpacity
            style={styles.footerSaveButton}
            onPress={handleSaveItem}
            activeOpacity={0.8}
          >

            <Text style={styles.footerSaveText}>
              {editingId !== null
                ? 'Update Menu Item'
                : 'Save Menu Item'}
            </Text>

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>

  );

}


// APPLICATION STYLES

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },

  keyboardContainer: {
    flex: 1,
  },

  mainScroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },

  headerSection: {
    marginBottom: 22,
  },

  header: {
    fontSize: 27,
    fontWeight: '700',
    color: '#2E2A26',
    textAlign: 'center',
  },

  subHeader: {
    fontSize: 14,
    color: '#7A7268',
    textAlign: 'center',
    marginTop: 5,
  },

  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E2A26',
    marginBottom: 12,
  },

  statisticsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },

  statNumber: {
    fontSize: 21,
    fontWeight: '700',
    color: '#8B5E3C',
  },

  statLabel: {
    fontSize: 12,
    color: '#7A7268',
    marginTop: 6,
    textAlign: 'center',
  },

  courseStatistics: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 22,
    elevation: 2,
  },

  courseStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1E7DA',
  },

  courseStatName: {
    fontSize: 14,
    color: '#3A352F',
  },

  courseStatCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5E3C',
  },

  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
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
    paddingVertical: 12,
    fontSize: 15,
    color: '#2E2A26',
    backgroundColor: '#FDFCFA',
  },

  textArea: {
    minHeight: 75,
    textAlignVertical: 'top',
  },

  inputError: {
    borderColor: '#C0392B',
  },

  errorText: {
    color: '#C0392B',
    fontSize: 12,
    marginTop: 5,
  },

  courseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  courseButton: {
    flex: 1,
    minWidth: '28%',
    borderWidth: 1,
    borderColor: '#D9D3C7',
    borderRadius: 8,
    paddingVertical: 12,
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

  listSection: {
    marginTop: 4,
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D3C7',
    borderRadius: 9,
    padding: 13,
    fontSize: 14,
    color: '#2E2A26',
  },

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },

  filterButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D3C7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  filterButtonSelected: {
    backgroundColor: '#8B5E3C',
    borderColor: '#8B5E3C',
  },

  filterButtonText: {
    fontSize: 12,
    color: '#3A352F',
    fontWeight: '600',
  },

  filterButtonTextSelected: {
    color: '#FFFFFF',
  },

  clearButton: {
    backgroundColor: '#F1E7DA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 14,
  },

  clearButtonText: {
    color: '#8B5E3C',
    fontWeight: '700',
    fontSize: 13,
  },

  resultsText: {
    fontSize: 12,
    color: '#7A7268',
    marginVertical: 14,
  },

  emptyText: {
    fontSize: 14,
    color: '#7A7268',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
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
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },

  cardDescription: {
    fontSize: 13,
    color: '#5C564D',
    marginTop: 8,
    lineHeight: 19,
  },

  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5E3C',
    marginTop: 10,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#8B5E3C',
    borderRadius: 7,
    paddingVertical: 11,
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#C0392B',
    borderRadius: 7,
    paddingVertical: 11,
    alignItems: 'center',
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // FIXED BOTTOM BUTTON AREA

  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 12 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EAE2D8',
    gap: 10,
    elevation: 8,
  },

  footerSaveButton: {
    flex: 1,
    backgroundColor: '#8B5E3C',
    borderRadius: 9,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerSaveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  footerCancelButton: {
    backgroundColor: '#F1E7DA',
    borderRadius: 9,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerCancelText: {
    color: '#8B5E3C',
    fontWeight: '700',
  },

});