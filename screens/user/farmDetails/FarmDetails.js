import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {  ScrollableMainContainer,
  FarmerTypeInput } from '../../../components';
  import StyledText from '../../../components/Texts/StyledText';
import { colors } from '../../../config/theme';
import NewFarmerForm from './NewFarmerForm'
import ExperiencedFarmerForm from './ExperiencedFarmerForm';

console.log("Farmer Details", ExperiencedFarmerForm)

const FarmDetails = ( {navigation}) => {
  const [farmerType, setFarmerType] = useState('new');
  const [formData, setFormData] = useState({
    location: '',
    selectedCrops: [],
    farmSize: '0-5 acres (Small Scale)',
    cropAge: '',
    lastManure: '',
    fertilizer: '',
    cropPhase: 'Get Started'
  });


  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFarmerTypeChange = (type) => {
    setFarmerType(type);
    // Reseting relevant form fields when switching types
    if (type === 'new') {
      setFormData(prev => ({
        ...prev,
        cropAge: '',
        lastManure: '',
        fertilizer: ''
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', { farmerType, ...formData });
    navigation.navigate('Login')
  };


  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>

<View style={styles.vectorContainer}>
          <Image 
          source={require('../../../assets/Vector 1.png')} 
          style={styles.vector1}
        />
        <Image 
        source={require('../../../assets/Vector.png')} 
        style={styles.vector2}
      />
    </View>

      <StyledText style={styles.title} bold>Farm Details</StyledText>
      <StyledText style={styles.subtitle}>
        Fill in details about your farm to have a personalised insight page.
      </StyledText>

      <FarmerTypeInput 
        value={farmerType} 
        onChange={handleFarmerTypeChange} 
      />

      {/* Show new farmer form by default */}
      {farmerType === 'new' ? (
        <NewFarmerForm 
          formData={formData} 
          onFormChange={handleFormChange} 
        />
      ) : (
        <ExperiencedFarmerForm 
          formData={formData} 
          onFormChange={handleFormChange} 
        />
      )}
      
      {/* <StyledButton
        title="Save Details"
        onPress={handleSubmit}
        style={styles.saveButton}
        disabled={!formData.location && farmerType === 'new'}
      /> */}
    </ScrollableMainContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 24,
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
    // backgroundColor: '#4CAF500D', // 5% opacity
  },


  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey[700],
    marginBottom: 8,
    top: 74
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey[500],
    fontWeight: '400',
    top: 82
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
  },
});

export default FarmDetails;