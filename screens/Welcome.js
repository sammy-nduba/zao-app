import { useContext, useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { onBoardingData } from '../config/data';
import StyledText from '../components/Texts/StyledText';
import { colors } from '../config/theme';
import { ScreenWidth } from '../config/constants';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { storeData } from '../utils/storage';
import { onBoardingContext } from '../utils/context';

// console.log({ StyledText, MaterialCommunityIcons, Feather, onBoardingContext });

const Welcome = ({ route }) => {
  const navigation = useNavigation();
  const [activeScreen, setActiveScreen] = useState(route.params?.activeScreen || 1);
  const [completingOnboarding, setCompletingOnboarding] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { setIsZaoAppOnboarded } = useContext(onBoardingContext);
  const onLastScreen = activeScreen === onBoardingData.length;

  useEffect(() => {
    onBoardingData.forEach((item) => {
      if (item.image?.uri) {
        Image.prefetch(item.image.uri).catch((err) => console.error('Prefetch failed:', err));
      }
    });
  }, []);

  const completeOnboarding = async () => {
    try {
      setCompletingOnboarding(true);
      await storeData('@ZaoAPP:Onboarding', true);
      setTimeout(() => {
        setIsZaoAppOnboarded(true);
        setCompletingOnboarding(false);
        navigation.navigate('Home');
      }, 500);
    } catch (error) {
      console.warn(error);
      setCompletingOnboarding(false);
    }
  };

  const handleNext = () => {
    if (onLastScreen) {
      completeOnboarding();
    } else {
      setActiveScreen(activeScreen + 1);
    }
  };

  const currentImage = onBoardingData[activeScreen - 1]?.image;
  if (!currentImage) {
    console.error(`Image undefined for activeScreen: ${activeScreen}`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        {imageLoading && <ActivityIndicator size="large" color={colors.primary[600]} />}
        <Image
          source={currentImage }
          style={styles.image}
          resizeMode="contain"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => console.error(`Failed to load image for screen ${activeScreen}`)}
        />
        <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
          <StyledText style={styles.skipText}>Skip</StyledText>
        </TouchableOpacity>
      </View>
      <View style={styles.contentCard}>
        <StyledText style={styles.title}>
          {onBoardingData[activeScreen - 1]?.title || 'No Title'}
        </StyledText>
        <StyledText style={styles.summary}>
          {onBoardingData[activeScreen - 1]?.summary || 'No Summary'}
        </StyledText>
      </View>
      <View style={styles.bottomContent}>
        <View style={styles.pageIndicators}>
          {onBoardingData.map((item) => (
            <MaterialCommunityIcons
              name={
                item.id === activeScreen
                  ? 'checkbox-blank-circle'
                  : 'checkbox-blank-circle-outline'
              }
              size={15}
              color={colors.primary[600]}
              key={item.id}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.floatingButton, onLastScreen && styles.getStartedButton]}
          disabled={completingOnboarding}
          onPress={handleNext}
        >
          {onLastScreen ? (
            <StyledText style={styles.getStartedText}>Get Started</StyledText>
          ) : (
            <Feather name="arrow-right" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  imageView: {
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    // width: ScreenWidth,
    height: '100%',
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    left: ScreenWidth - 120,
    width: 100,
    height: 48,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  skipText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: colors.grey[800],
  },
  contentCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 24,
    paddingTop: 30,
    flex: 1,
    marginTop: -50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 28,
    color: colors.primary[600],
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'left',
  },
  summary: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    color: colors.grey[600],
    textAlign: 'left',
    lineHeight: 20,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 70,
  },
  pageIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  getStartedButton: {
    width: 120,
    height: 56,
    borderRadius: 32,
  },
  getStartedText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default Welcome;