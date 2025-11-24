import { Redirect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomButton } from '../components';
import { useAuth } from '../context/AuthContext';
import { Note } from '../types';
import * as storage from '../utils/storage';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setLoadingNotes(false);
    }
  }, [user]);

  const loadNotes = async () => {
    if (user) {
      const userNotes = await storage.getNotesByUserId(user.id);
      setNotes(userNotes);
      setLoadingNotes(false);
    }
  };

  const handleDeleteNote = (noteId: string, noteTitle: string) => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${noteTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.deleteNote(noteId);
              await loadNotes();
              Alert.alert('Success', 'Note deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  if (isLoading || loadingNotes) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user.username}!</Text>
        <Text style={styles.subtitle}>Your Notes</Text>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any notes yet.</Text>
          <Text style={styles.emptySubtext}>Create your first note to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.noteCard}
              onPress={() => router.push({ pathname: '/view-notes', params: { noteId: item.id } })}
              activeOpacity={0.7}
            >
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(item.id, item.title);
                }}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../assets/images/delete-icon.png')}
                  style={styles.deleteIcon}
                />
              </TouchableOpacity>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteCategory}>{item.category.toUpperCase()}</Text>
              <Text style={styles.noteContent} numberOfLines={2}>{item.content}</Text>
              <Text style={styles.noteDate}>{new Date(item.createdAt).toLocaleString()}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.notesList}
        />
      )}

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Add Note"
          onPress={() => router.push('/add-note')}
          variant="primary"
        />
        <CustomButton
          title="View Profile"
          onPress={() => router.push('/profile')}
          variant="secondary"
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  notesList: {
    paddingBottom: 20,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 1,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  noteCategory: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
});
