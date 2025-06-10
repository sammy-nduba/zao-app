import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
    StyleSheet,
    SafeAreaView,
  } from 'react-native';
  
  // Dependency Injection Container
  class DIContainer {
    constructor() {
      // Repositories
      this.courseRepository = new CourseRepository();
      this.communityRepository = new CommunityRepository();
      this.searchRepository = new SearchRepository();
      
      // Use Cases
      this.getCoursesUseCase = new GetCoursesUseCase(this.courseRepository);
      this.getCommunityPostsUseCase = new GetCommunityPostsUseCase(this.communityRepository);
      this.searchUseCase = new SearchUseCase(this.searchRepository);
    }
  }
  
  const container = new DIContainer();
  
  // UI Components
  const Header = ({ title, onBack, onNotification }) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={onNotification} style={styles.notificationButton}>
        <Text style={styles.notificationIcon}>🔔</Text>
      </TouchableOpacity>
    </View>
  );
  
  const SearchBar = ({ value, onChangeText, placeholder }) => (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.filterButton}>
        <Text style={styles.filterIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
  
  const TabNavigation = ({ activeTab, onTabChange }) => {
    const tabs = ['Courses', 'My Learning', 'Certificates'];
    
    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => onTabChange(index)}
          >
            <Text style={[
              styles.tabText,
              activeTab === index && styles.activeTabText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const CourseCard = ({ course, onPress }) => (
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
  
  const SearchItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.searchItem} onPress={() => onPress(item)}>
      <View style={styles.searchItemIcon}>
        <Text>{item.icon}</Text>
      </View>
      <Text style={styles.searchItemText}>{item.title}</Text>
      <Text style={styles.searchArrow}>🔍</Text>
    </TouchableOpacity>
  );
  
  const CommunityPost = ({ post, onLike, onComment, onShare }) => (
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
  
  
  
  // Main Screen Component (Presentation Layer)
  const ZaoLearnScreen = () => {
    // State Management
    const [activeTab, setActiveTab] = useState(0);
    const [bottomActiveTab, setBottomActiveTab] = useState(1); // Learn tab active
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [communityPosts, setCommunityPosts] = useState([]);
    const [searchItems, setSearchItems] = useState([]);
    const [loading, setLoading] = useState(true);
  
    // Effects
    useEffect(() => {
      loadData();
    }, []);
  
    useEffect(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchItems([]);
      }
    }, [searchQuery]);
  
    // Event Handlers
    const loadData = async () => {
      try {
        setLoading(true);
        const [coursesData, postsData] = await Promise.all([
          container.getCoursesUseCase.execute(),
          container.getCommunityPostsUseCase.execute(),
        ]);
        setCourses(coursesData);
        setCommunityPosts(postsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSearch = async () => {
      try {
        const results = await container.searchUseCase.execute(searchQuery);
        setSearchItems(results);
      } catch (error) {
        console.error('Error searching:', error);
      }
    };
  
    const handleCoursePress = (course) => {
      console.log('Course pressed:', course.title);
    };
  
    const handleSearchItemPress = (item) => {
      console.log('Search item pressed:', item.title);
    };
  
    const handleLike = (postId) => {
      setCommunityPosts(posts =>
        posts.map(post =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    };
  
    const handleComment = (postId) => {
      console.log('Comment on post:', postId);
    };
  
    const handleShare = (postId) => {
      console.log('Share post:', postId);
    };
  
    if (loading) {
      return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.loadingText}>Loading...</Text>
        </SafeAreaView>
      );
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        
        <Header
          title="Zao Learn"
          onBack={() => console.log('Back pressed')}
          onNotification={() => console.log('Notification pressed')}
        />
  
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Farm"
        />
  
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
  
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Courses Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zao Courses</Text>
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={handleCoursePress}
              />
            ))}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Courses →</Text>
            </TouchableOpacity>
          </View>
  
          {/* Search Section */}
          {searchQuery && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Zao Search</Text>
              <Text style={styles.subsectionTitle}>Search Any Topic</Text>
              {searchItems.map(item => (
                <SearchItem
                  key={item.id}
                  item={item}
                  onPress={handleSearchItemPress}
                />
              ))}
              <TouchableOpacity style={styles.getStartedButton}>
                <Text style={styles.getStartedText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          )}
  
          {/* Community Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zao Community</Text>
            {communityPosts.map(post => (
              <CommunityPost
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>See All Posts →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
  
    
      </SafeAreaView>
    );
  };
  
  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    loadingText: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
      color: '#666',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
    },
    backButton: {
      padding: 8,
    },
    backArrow: {
      fontSize: 20,
      color: '#333',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
    },
    notificationButton: {
      padding: 8,
    },
    notificationIcon: {
      fontSize: 18,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginVertical: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: '#e9ecef',
    },
    searchIcon: {
      fontSize: 16,
      marginRight: 8,
      color: '#666',
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    filterButton: {
      padding: 4,
    },
    filterIcon: {
      fontSize: 16,
      color: '#666',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      paddingHorizontal: 16,
    },
    tab: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginRight: 24,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#4CAF50',
    },
    tabText: {
      fontSize: 16,
      color: '#666',
    },
    activeTabText: {
      color: '#4CAF50',
      fontWeight: '600',
    },
    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginBottom: 16,
    },
    subsectionTitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 12,
    },
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
    searchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    searchItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#f8f9fa',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    searchItemText: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    searchArrow: {
      fontSize: 16,
      color: '#666',
    },
    getStartedButton: {
      backgroundColor: '#4CAF50',
      padding: 16,
      borderRadius: 25,
      alignItems: 'center',
      marginTop: 16,
    },
    getStartedText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
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
    actionText: {
      fontSize: 14,
      color: '#666',
    },
    viewAllButton: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    viewAllText: {
      color: '#4CAF50',
      fontSize: 16,
      fontWeight: '600',
    },
    bottomNav: {
      flexDirection: 'row',
      backgroundColor: '#4CAF50',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    bottomNavItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
    },
    activeBottomNavItem: {
      // Add any active styling if needed
    },
    bottomNavIcon: {
      fontSize: 20,
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: 4,
    },
    activeBottomNavIcon: {
      color: '#fff',
    },
    bottomNavText: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.7)',
    },
    activeBottomNavText: {
      color: '#fff',
      fontWeight: '600',
    },
  });
  
  export default ZaoLearnScreen;