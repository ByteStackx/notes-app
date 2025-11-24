import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { CustomButton, CustomInput, ScreenContainer } from '../components';
import { useAuth } from '../context/AuthContext';
import { CategoryType, Note } from '../types';
import * as storage from '../utils/storage';

const categories: CategoryType[] = ['work', 'study', 'personal'];

export default function EditNote() {
  const router = useRouter();
  const { user } = useAuth();
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'work' as CategoryType,
  });
  const [loading, setLoading] = useState(false);
  const [loadingNote, setLoadingNote] = useState(true);
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (user && noteId) {
      storage.getNotesByUserId(user.id).then(notes => {
        const foundNote = notes.find(n => n.id === noteId);
        if (foundNote) {
          setNote(foundNote);
          setForm({
            title: foundNote.title,
            content: foundNote.content,
            category: foundNote.category,
          });
        }
      }).finally(() => setLoadingNote(false));
    } else {
      setLoadingNote(false);
    }
  }, [user, noteId]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!form.title || !form.content) {
      Alert.alert('Validation', 'Title and content are required.');
      return;
    }
    if (!user || !note) {
      Alert.alert('Error', 'You must be logged in.');
      return;
    }
    setLoading(true);
    try {
      const updatedNote: Note = {
        ...note,
        title: form.title,
        content: form.content,
        category: form.category,
        updatedAt: new Date().toISOString(),
      };
      await storage.updateNote(updatedNote);
      Alert.alert('Success', 'Note updated!', [{ text: 'OK', onPress: () => router.replace('/home') }]);
    } catch (e) {
      Alert.alert('Error', 'Failed to update note.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingNote) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!note) {
    return (
      <ScreenContainer scrollable>
        <View style={styles.container}>
          <Text style={styles.errorText}>Note not found</Text>
          <CustomButton
            title="Back to Home"
            onPress={() => router.replace('/home')}
            variant="secondary"
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Note</Text>
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
          style={{ minHeight: 150 }}
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
          title="Update Note"
          onPress={handleUpdate}
          loading={loading}
          style={styles.updateButton}
        />
        <CustomButton
          title="Cancel"
          onPress={() => router.back()}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginVertical: 40,
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
  updateButton: {
    marginTop: 16,
  },
});
