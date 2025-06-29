import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from 'config/theme';
import MainContainer from '../../components/container/MainContainer';
import ScrollableMainContainer from '../../components/container/ScrollableMainContainer';
import { Header } from '../../components/aiScreen/Header';
import { SearchBar } from '../../components/aiScreen/SearchBar';
import { TabNavigation } from '../../components/aiScreen/TabNavigation';
import { CapabilityCard } from '../../components/aiScreen/CapabilityCard';
import { ChatInput } from '../../components/aiScreen/ChatInput';
import { useZaoAI } from '../../components/aiScreen/useZaoAI';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const ZaoAIScreen = () => {
  const {
    searchText,
    setSearchText,
    activeTab,
    setActiveTab,
    chatInput,
    setChatInput,
    capabilities,
    tabs,
    handleBackPress,
    handleNotificationPress,
    handleFilterPress,
    handleSend,
    handleAttach,
    handleVoice,
  } = useZaoAI();


  const tabBarHeight = useBottomTabBarHeight();

  return (
    <MainContainer>
      {/* Fixed Header Section */}
      <View style={styles.headerSection}>
        <Header
          title="Zao AI"
          onBackPress={handleBackPress}
          onNotificationPress={handleNotificationPress}
        />
        
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onFilterPress={handleFilterPress}
          placeholder="Farm"
        />
        
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      </View>

      {/* Content Area - properly constrained below header */}
      <View style={styles.contentWrapper}>
        {/* Background Vector */}
        <Image 
          source={require('../../assets/Vector_leaf.png')} 
          style={styles.backgroundVector}
        />
        
        {/* Scrollable Content - constrained to remaining space */}
        <ScrollableMainContainer 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: tabBarHeight + 100 } // Space for chat input and padding
          ]}
        >
          <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector_leaf.png')} />
      </View>

          <View style={styles.logoContainer}>
            <Image source={require('../../assets/Ai.png')} style={styles.logo}/>
          </View>
          
          <Text style={styles.title}>Zao AI Capabilities</Text>
          
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={index}
              title={capability.title}
              description={capability.description}
            />
          ))}
          <Text style={styles.footerText}>
            These are just a few examples of what I can do.
          </Text>
          </ScrollableMainContainer>
          </View>
        
     

      {/* Fixed Chat Input */}
      <View style={[styles.chatInputContainer, { bottom: tabBarHeight }]}>
        <ChatInput
          value={chatInput}
          onChangeText={setChatInput}
          onSend={handleSend}
          onAttach={handleAttach}
          onVoice={handleVoice}
          placeholder="Ask anything"
        />
      </View>
      
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: colors.background,
    zIndex: 10, // Ensure header stays above other content
  },
  contentWrapper: {
    flex: 1,
    // height: 500,
    position: 'relative',
  },
  backgroundVector: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
    zIndex: -1,
  },
  
  vectorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  vectorImage: {
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  chatInputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    marginBottom: 5,
    marginBottom: 10,
    backgroundColor: colors.background,
  },
});