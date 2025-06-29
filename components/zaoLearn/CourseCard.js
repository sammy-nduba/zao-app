import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';

// Local image imports
const courseImages = [
  require('../../assets/onBoarding/1.png'),
  require('../../assets/onBoarding/2.jpeg'),
  require('../../assets/onBoarding/5.jpeg'),
];

export const CourseCard = ({ course, onPress }) => {
  // For now we'll use local images, but later switch to course.images from backend
  const imagesToUse = course.images ? course.images : courseImages;

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {imagesToUse.map((image, index) => (
        <TouchableOpacity 
          key={index} 
          onPress={() => onPress(course)}
          style={styles.cardContainer}
          activeOpacity={0.8}
        >
          <ImageBackground
            source={typeof image === 'string' ? { uri: image } : image}
            style={styles.courseCard}
            imageStyle={styles.imageStyle}
          >
            <View style={styles.textOverlay}>
              <Text style={styles.courseEmoji}>🌱</Text>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.bottomRow}>
                <Text style={styles.courseDuration}>⏱️ {course.duration || '4 weeks'}</Text>
                <TouchableOpacity style={styles.learnButton}>
                  <Text style={styles.learnButtonText}>Learn →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 8,
  },
  cardContainer: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  courseCard: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 12,
  },
  textOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: 12,
  },
  courseEmoji: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseDuration: {
    fontSize: 14,
    color: '#fff',
  },
  learnButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  learnButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});