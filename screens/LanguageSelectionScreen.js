import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { languages } from '../config/Languages';
import { colors } from '../config/theme';


const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('English');


  const handleContinue = () => {
    navigation.navigate('Welcome');
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F5F5F5']}
      style={styles.container}
    >
      <View style={styles.vectorContainer}>
        <Image source={require('../assets/Vector 1.png')} style={styles.vector1} />
        <Image source={require('../assets/Vector.png')} style={styles.vector2} />
      </View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Languages</Text>
        <Text style={styles.subtitle}>Choose the language you want to use in Zao App</Text>
      </View>

      {/* Language List */}
      <View style={styles.languageList}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageItem,
              selectedLanguage === language.name && styles.selectedLanguageItem
            ]}
            onPress={() => setSelectedLanguage(language.name)}
          >
            <View style={styles.languageContent}>
              <Image source={language.flag} style={styles.flag} />
              <Text style={styles.languageName}>{language.name}</Text>
            </View>
            {selectedLanguage === language.name && (
              <Image 
                source={require('../assets/checkmark.png')} 
                style={styles.checkmark} 
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

    
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: colors.background
  },
  header: {
    marginTop: 75,
    // marginBottom: 32,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginBottom: 30
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[500],
    fontWeight: '400',
    
  },
  languageList: {
    marginVertical: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    backgroundColor: colors.primary[300],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary[100],
    elevation: 1,
  },
  selectedLanguageItem: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0F9F1',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 32,
    height: 24,
    marginRight: 16,
    borderRadius: 4,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
  },
  checkmark: {
    width: 20,
    height: 20,
    tintColor: '#4CAF50',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
    elevation: 2,
    marginBottom: 100
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1, 
  },
  // vector1: {
  //   position: 'absolute',
  //   width: 130.41,
  //   height: 128.5,
  //   top: 2065.92,
  //   left: 272.59,
  //   transform: [{ rotate: '-161.18deg' }],
  //   backgroundColor: '#FFCD381A', // 10% opacity
  // },
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: 217,
  },
});

export default LanguageSelectionScreen;