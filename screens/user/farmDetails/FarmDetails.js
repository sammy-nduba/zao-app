import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ScrollableMainContainer, FarmerTypeInput } from '../../../components';
import StyledText from '../../../components/Texts/StyledText';
import { colors } from '../../../config/theme';
import NewFarmerForm from './NewFarmerForm';
import ExperiencedFarmerForm from './ExperiencedFarmerForm';
import { FarmDetailsViewModel } from '../../../viewModel/FarmDetailsViewModel';




const FarmDetails = ({ navigation }) => {
  const [viewModel] = useState(() => new FarmDetailsViewModel());
  const [state, setState] = useState(viewModel.getState());

  useEffect(() => {
    const loadData = async () => {
      await viewModel.loadFarmerData(state.farmerType);
      setState(viewModel.getState());
    };
    loadData();
  }, [state.farmerType]);

  const handleFarmerTypeChange = (type) => {
    viewModel.setFarmerType(type);
    setState(viewModel.getState());
  };

  const handleFormChange = (field, value) => {
    viewModel.updateFormData(field, value);
    setState(viewModel.getState());
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
        value={state.farmerType} 
        onChange={handleFarmerTypeChange} 
      />

      {state.farmerType === 'new' ? (
        <NewFarmerForm 
          viewModel={viewModel}
          formData={state.formData} 
          onFormChange={handleFormChange}
          navigation={navigation}
        />
      ) : (
        <ExperiencedFarmerForm 
          viewModel={viewModel}
          formData={state.formData} 
          onFormChange={handleFormChange}
          navigation={navigation}
        />
      )}
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
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: 217,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey[700],
    marginBottom: 8,
    top: 74,
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey[500],
    fontWeight: '400',
    top: 82,
  },
});

export default FarmDetails;