import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { StyledButton, ScrollableMainContainer, CropSelection } from '../../../components';
import StyledText from '../../../components/Texts/StyledText';
import StyledTextInput from '../../../components/inputs/StyledTextInput';
import { colors } from '../../../config/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';



const NewFarmerForm = ({ formData, onFormChange }) => {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Farm size options
  const farmSizeOptions = ['0-5 acres (Small Scale)', '5-20 acres (Medium Scale)', '20+ acres (Large Scale)'];

  // Load stored form data on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@ZaoAPP:NewFarmerForm');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          Object.keys(parsedData).forEach((key) => {
            onFormChange(key, parsedData[key]);
            if (key === 'lastManure' && parsedData[key]) {
              // Parse the stored date string back to Date object
              const dateParts = parsedData[key].split('/');
              const date = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
              if (!isNaN(date.getTime())) {
                setSelectedDate(date);
              }
            }
          });
        }
      } catch (error) {
        console.warn('Error loading NewFarmerForm data:', error);
      }
    };
    loadStoredData();
  }, []);

  // Handle crop selection changes
  const handleCropChange = (crop) => {
    const newCrops = formData.selectedCrops.includes(crop)
      ? formData.selectedCrops.filter((item) => item !== crop)
      : [...formData.selectedCrops, crop];
    onFormChange('selectedCrops', newCrops);
  };

  // Handle date picker changes
  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    
    if (date) {
      setSelectedDate(date);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      onFormChange('lastManure', formattedDate);
      
      Toast.show({
        type: 'success',
        text1: 'Date Selected',
        text2: `Last manure date set to ${formattedDate}`,
      });
    }
  };

  const handleMapIconPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Map Feature',
      text2: 'Map allocation feature coming soon!',
    });
  };

  const handleGetStarted = async () => {
    // Validate required fields
    const missingFields = [];
    if (!formData.selectedCrops.length) missingFields.push('crops');
    if (!formData.farmSize) missingFields.push('farm size');
    if (!formData.location) missingFields.push('location');
    if (!formData.cropPhase) missingFields.push('crop phase');
    if (!formData.lastManure) missingFields.push('last manure date');

    if (missingFields.length) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: `Please complete: ${missingFields.join(', ')}`,
      });
      return;
    }

    try {
      // Store form data
      await AsyncStorage.setItem('@ZaoAPP:NewFarmerForm', JSON.stringify(formData));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Form submitted! Welcome to your dashboard.',
      });
      navigation.navigate('Login');
    } catch (error) {
      console.warn('Error storing NewFarmerForm data:', error);
      Toast.show({
        type: 'error',
        text1: 'Storage Error',
        text2: 'Failed to save form data. Please try again.',
      });
    }
  };

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      {/* Crops Section */}
      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>
          What crops are you mostly interested in?
        </StyledText>
        <StyledTextInput
          placeholder="Select crops..."
          value={formData.selectedCrops.join(', ')}
          editable={false}
          style={styles.input}
        />
        <CropSelection
          selectedCrops={formData.selectedCrops}
          toggleCropSelection={handleCropChange}
        />
      </View>

      {/* Farm Size Section */}
      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>
          How many acres do you intend to farm on?
        </StyledText>
        <StyledTextInput
          placeholder={farmSizeOptions[0]}
          value={formData.farmSize}
          editable={false}
          style={styles.input}
        />
        <View style={styles.optionsContainer}>
          {farmSizeOptions.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.option, formData.farmSize === size && styles.selectedOption]}
              onPress={() => onFormChange('farmSize', size)}
            >
              <StyledText style={styles.optionText}>{size}</StyledText>
              {formData.farmSize === size && (
                <MaterialCommunityIcons name="check" size={20} color={colors.grey[600]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>Where is your farm located?</StyledText>
        <View style={styles.inputContainer}>
          <StyledTextInput
            placeholder="Enter location"
            value={formData.location}
            onChangeText={(text) => onFormChange('location', text)}
            style={[styles.input, styles.locationInput]}
          />
          <TouchableOpacity style={styles.iconButton} onPress={handleMapIconPress}>
            <MaterialCommunityIcons name="map-marker" size={24} color={colors.grey[600]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Manure Section */}
      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>When was the last time you applied manure?</StyledText>
        <View style={styles.inputContainer}>
          <StyledTextInput
            placeholder="Select date..."
            value={formData.lastManure}
            editable={false}
            style={[styles.input, styles.dateInput]}
            onPressIn={() => setShowDatePicker(true)}
            testID="date-input"
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowDatePicker(true)}
            testID="date-picker-icon"
          >
            <MaterialCommunityIcons name="calendar" size={24} color={colors.grey[600]} />
          </TouchableOpacity>
        </View>
        
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            themeVariant="light"
            textColor={colors.grey[600]}
            testID="date-picker"
          />
        )}
      </View>

      {/* Crop Phase Section */}
      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>What is the current phase of your crop?</StyledText>
        <StyledTextInput
          placeholder="Enter crop phase (e.g., Vegetative)"
          value={formData.cropPhase}
          onChangeText={(text) => onFormChange('cropPhase', text)}
          style={styles.input}
        />
      </View>

      {/* Get Started Button */}
      <StyledButton
        title="Get Started"
        onPress={handleGetStarted}
        style={styles.getStartedButton}
      />
    </ScrollableMainContainer>
  );
};

// Default form data
NewFarmerForm.defaultProps = {
  formData: {
    selectedCrops: [],
    farmSize: '',
    location: '',
    cropPhase: '',
    lastManure: '',
  },
  onFormChange: () => {},
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 8,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    elevation: 3,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey[800],
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    fontFamily: 'Roboto',
    color: colors.grey[600],
  },
  locationInput: {
    paddingRight: 48,
  },
  dateInput: {
    paddingRight: 48,
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
  },
  selectedOption: {
    borderColor: colors.primary[600],
    backgroundColor: colors.tint,
  },
  optionText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.grey[600],
    marginRight: 8,
  },
  getStartedButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
    marginTop: 16,
    marginBottom: 40,
    alignSelf: 'center',
  },
});

export default NewFarmerForm;