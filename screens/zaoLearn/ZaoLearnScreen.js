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
  import Header  from 'components/newsComponents/Header';
  import  SearchBar from 'components/newsComponents/SearchBar';
  import  { CourseCard } from 'components/zaoLearn/CourseCard'
  import {TabNavigation} from 'components/zaoLearn/TabNavigation';
import { CourseRepository } from 'domain/repository/learn/CoursesRepository';
import { SearchRepository } from 'domain/repository/learn/SearchRepository';
import { CommunityRepository } from 'domain/repository/learn/CommunityRepository'
import { GetCommunityPostsUseCase } from 'domain/UseCases/learn/GetCommunityPostUseCase';
import { GetCoursesUseCase } from 'domain/UseCases/learn/GetCoursesUseCase';
import { SearchUseCase } from 'domain/UseCases/learn/SearchUseCase';
import { SearchItem } from 'components/zaoLearn/SearchItem';
import { CommunityPost } from 'components/zaoLearn/CommunityPost';
import { Course } from 'domain/entities/zaoLearn/Course';


console.log("ZAO learn", CommunityRepository)
  
  // Dependency Injection Container
  class DIContainer {
    constructor() {
      // Repositories
      this.courseRepository = new CourseRepository;
      this.communityRepository = new CommunityRepository;
      this.searchRepository = new SearchRepository;
      
      // Use Cases
      this.getCoursesUseCase = new GetCoursesUseCase(this.courseRepository);
      this.getCommunityPostsUseCase = new GetCommunityPostsUseCase(this.communityRepository);
      this.searchUseCase = new SearchUseCase(this.searchRepository);
    }
  }
  
  const container = new DIContainer();
  
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
        <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector1.png')} style={styles.vector1} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>
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
    vectorContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: -1,
    },
    // vector1: {
    //   position: 'absolute',
    //   width: 130,
    //   height: 128,
    //   top: 100,
    //   left: 250,
    //   opacity: 0.1,
    //   transform: [{ rotate: '-161.18deg' }],
    // },
    vector2: {
      position: 'absolute',
      width: 200,
      height: 200,
      top: 300,
      left: 200,
      opacity: 0.05,
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