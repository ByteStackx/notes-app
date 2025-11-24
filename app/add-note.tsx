import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { CustomButton, CustomInput, ScreenContainer } from '../components';
import { useAuth } from '../context/AuthContext';
import { CategoryType, Note } from '../types';
import { saveNote } from '../utils/storage';

const categories: CategoryType[] = ['work', 'study', 'personal'];

export default function AddNote() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'work' as CategoryType,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      Alert.alert('Validation', 'Title and content are required.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }
    setLoading(true);
    try {
      const note: Note = {
        id: Date.now().toString(),
        userId: user.id,
        title: form.title,
        content: form.content,
        category: form.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveNote(note);
      Alert.alert('Success', 'Note added!', [{ text: 'OK', onPress: () => router.replace('/home') }]);
    } catch (e) {
      Alert.alert('Error', 'Failed to save note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        <Text style={styles.title}>Add Note</Text>
        <CustomInput
          label="Title"
          value={form.title}
          onChangeText={text => handleChange('title', text)}
          placeholder="Enter note title"
        />
        <CustomInput
          label="Content"
          value={form.content}
          onChangeText={text => handleChange('content', text)}
          placeholder="Enter note content"
          multiline
          style={{ minHeight: 75, marginBottom: 16 }}
        />
        <View style={styles.categorySection}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {categories.map(cat => (
              <View key={cat} style={styles.radioOption}>
                <View
                  style={[
                    styles.radioCircle,
                    form.category === cat ? styles.radioCircleSelected : null,
                  ]}
                >
                  {form.category === cat ? <View style={styles.radioInnerCircle} /> : null}
                </View>
                <Text
                  style={styles.radioLabel}
                  onPress={() => handleChange('category', cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <CustomButton
          title="Save Note"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
        <CustomButton
          title="Cancel"
          onPress={() => router.replace('/home')}
          variant="secondary"
          style={{ marginTop: 12 }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  categorySection: {
    marginTop: 16,
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: '#007AFF',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 16,
  },
});
