import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type SortOrder = 'asc' | 'desc' | 'none';

interface SortButtonProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  style?: object;
}

export default function SortButton({ sortOrder, onSortChange, style }: SortButtonProps) {
  const handlePress = () => {
    if (sortOrder === 'none') {
      onSortChange('desc');
    } else if (sortOrder === 'desc') {
      onSortChange('asc');
    } else {
      onSortChange('desc');
    }
  };

  const getSortLabel = () => {
    if (sortOrder === 'asc') return 'Date: Oldest First';
    if (sortOrder === 'desc') return 'Date: Newest First';
    return 'Sort by Date';
  };

  const getArrowIcon = () => {
    if (sortOrder === 'asc') return '↑';
    if (sortOrder === 'desc') return '↓';
    return '⇅';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.label}>{getSortLabel()}</Text>
        <Text style={styles.arrow}>{getArrowIcon()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
