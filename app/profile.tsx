import { Redirect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { CustomButton, CustomInput, ScreenContainer } from '../components';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateUsername } from '../utils/validation';

export default function Profile() {
  const router = useRouter();
  const { user, isLoading, updateProfile, logout } = useAuth();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      username: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || '';
    }

    // Validate username
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error || '';
    }

    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // Validate new password if provided
    if (formData.newPassword) {
      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.error || '';
      }

      // Validate confirm password
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await updateProfile(
        formData.email,
        formData.username,
        formData.currentPassword,
        formData.newPassword || undefined
      );
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }));
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Update Failed',
        error instanceof Error ? error.message : 'An error occurred while updating profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            router.replace('/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile Settings</Text>
          <Text style={styles.subtitle}>Update your account information</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <CustomInput
            label="Username"
            value={formData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="Enter your username"
            autoCapitalize="none"
            error={errors.username}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Change Password</Text>
          <Text style={styles.sectionSubtitle}>
            Leave blank if you don't want to change your password
          </Text>

          <CustomInput
            label="Current Password"
            value={formData.currentPassword}
            onChangeText={(text) => handleInputChange('currentPassword', text)}
            placeholder="Enter current password"
            secureTextEntry
            error={errors.currentPassword}
          />

          <CustomInput
            label="New Password (Optional)"
            value={formData.newPassword}
            onChangeText={(text) => handleInputChange('newPassword', text)}
            placeholder="Enter new password"
            secureTextEntry
            error={errors.newPassword}
          />

          {formData.newPassword ? (
            <CustomInput
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              placeholder="Confirm new password"
              secureTextEntry
              error={errors.confirmPassword}
            />
          ) : null}

          <CustomButton
            title="Update Profile"
            onPress={handleUpdateProfile}
            loading={loading}
            style={styles.updateButton}
          />

          <CustomButton
            title="Back to Home"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backButton}
          />

          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            style={styles.logoutButton}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  updateButton: {
    marginTop: 8,
  },
  backButton: {
    marginTop: 12,
  },
  logoutButton: {
    marginTop: 12,
  },
});
