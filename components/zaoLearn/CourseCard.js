import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const CourseCard = ({ course, onPress }) => (
    <TouchableOpacity style={styles.courseCard} onPress={() => onPress(course)}>
      <View style={styles.courseContent}>
        <Text style={styles.courseEmoji}>🌱</Text>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <TouchableOpacity style={styles.learnButton}>
          <Text style={styles.learnButtonText}>Learn More →</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.courseIcon}>📊</Text>
    </TouchableOpacity>
  );
  

  const styles = StyleSheet.create({
    courseCard: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      courseContent: {
        flex: 1,
      },
      courseEmoji: {
        fontSize: 32,
        marginBottom: 8,
      },
      courseTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 16,
      },
      learnButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
      },
      learnButtonText: {
        color: '#4CAF50',
        fontWeight: '600',
      },
      courseIcon: {
        fontSize: 24,
      },
  })