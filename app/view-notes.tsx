import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CustomButton, ScreenContainer } from '../components';
import { useAuth } from '../context/AuthContext';
import { Note } from '../types';
import * as storage from '../utils/storage';

export default function ViewNotes() {
  const { user } = useAuth();
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user && noteId) {
      storage.getNotesByUserId(user.id).then(notes => {
        const foundNote = notes.find(n => n.id === noteId);
        setNote(foundNote || null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, noteId]);

  if (loading) {
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
            style={styles.backButton}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        <Text style={styles.title}>Note Details</Text>
        
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>{note.title}</Text>
          <Text style={styles.noteCategory}>{note.category.toUpperCase()}</Text>
          
          <View style={styles.contentSection}>
            <Text style={styles.contentLabel}>Content:</Text>
            <Text style={styles.noteContent}>{note.content}</Text>
          </View>
          
          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>Created: <Text style={styles.dateValue}>{new Date(note.createdAt).toLocaleString()}</Text></Text>
            <Text style={styles.dateLabel}>Updated: <Text style={styles.dateValue}>{new Date(note.updatedAt).toLocaleString()}</Text></Text>
          </View>
        </View>

        <CustomButton
          title="Edit Note"
          onPress={() => router.push({ pathname: '/edit-note', params: { noteId: note.id } })}
          variant="primary"
        />
        <CustomButton
          title="Back to Home"
          onPress={() => router.replace('/home')}
          variant="secondary"
          style={styles.backButton}
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
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  noteCategory: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 16,
  },
  contentSection: {
    marginBottom: 16,
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  dateSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: {
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginVertical: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 16,
  },
});
