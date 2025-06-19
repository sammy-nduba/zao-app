import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const CommunityPost = ({ post, onLike, onComment, onShare }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.avatar}>{post.avatar}</Text>
        <Text style={styles.authorName}>{post.author}</Text>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id)}>
          <Text style={styles.actionIcon}>👍</Text>
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onShare(post.id)}>
          <Text style={styles.actionIcon}>↗️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  

  const styles = StyleSheet.create({
    postCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
      },
      postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      },
      avatar: {
        fontSize: 20,
        marginRight: 8,
      },
      authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
      },
      postContent: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
      },
      postActions: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        padding: 4,
      },
      actionIcon: {
        fontSize: 14,
        marginRight: 4,
      },
  });