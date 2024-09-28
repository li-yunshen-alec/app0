import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { RichText, Toolbar, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export default function EditPrompt() {
  const { id } = useLocalSearchParams(); // Get the prompt ID from the route
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false); // Track if content is loaded

  // Call useEditorBridge at the top level of the component
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: content, // Set content from the state
  });

  useEffect(() => {
    const loadPrompt = async () => {
      const storedPrompts = await AsyncStorage.getItem('prompts');
      const prompts = storedPrompts ? JSON.parse(storedPrompts) : [];

      const prompt = prompts[id]; // Get the specific prompt by ID
      if (prompt) {
        setTitle(prompt.title);
        setContent(prompt.content);
      }

      setIsEditorReady(true); // Mark the editor as ready after loading content
    };

    loadPrompt();
  }, [id]);

  const handleSave = async (text) => {
    try {
      const storedPrompts = await AsyncStorage.getItem('prompts');
      const prompts = storedPrompts ? JSON.parse(storedPrompts) : [];

      // Update the selected prompt
      prompts[id] = { title, content: text };

      // Save updated prompts back to AsyncStorage
      await AsyncStorage.setItem('prompts', JSON.stringify(prompts));
    } catch (error) {
      Alert.alert('Error', 'Failed to update prompt.');
    }
  };

  const text = useEditorContent(editor, { type: 'html', debounceInterval: 100 });
  useEffect(() => {
    // Will render each time text is updated and call onSave
    text && handleSave(text);
  }, [text]);

  return (
    <SafeAreaView style={styles.container}>
      <View className='pb-4 flex flex-row items-center justify-between'>
        <TouchableOpacity className='z-50' onPress={() => router.back()}>
          <Icon name='arrow-back' size={20} color='#FF9C01' />
        </TouchableOpacity>

      </View>
      
      {isEditorReady && (
        <>
          <RichText editor={editor} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <Toolbar editor={editor} />
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  keyboardAvoidingView: {
    position: 'absolute',
    width: 'screen',
    bottom: 0,
    left: 0,
    right: 0
  },
});
