import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { colors } from 'config/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Header } from '../../components/aiScreen/Header';
import { SearchBar } from '../../components/aiScreen/SearchBar';
import { TabNavigation } from '../../components/aiScreen/TabNavigation';
import { CapabilityCard } from '../../components/aiScreen/CapabilityCard';
import { ChatInput } from '../../components/aiScreen/ChatInput';
import { useZaoAI } from '../../components/aiScreen/useZaoAI';
// import { styles } from '../../config/styles/ZaoAIStyles';

console.log("Zao AI Screen", useZaoAI)

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

  return (
    <SafeAreaView style={styles.container}>


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
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector_leaf.png')} />
      </View>
          <View >
            {/* Replace with your actual logo */}
            <Image source ={require('../../assets/Ai.png')} style={styles.logo}/>
            <View style={styles.logo} />
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
        </View>
      </ScrollView>
      
      <ChatInput style ={styles.chatInput}
        value={chatInput}
        onChangeText={setChatInput}
        onSend={handleSend}
        onAttach={handleAttach}
        onVoice={handleVoice}
        placeholder="Ask anything"
      />
    
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    top: 300,
    left: 200,
    opacity: 0.05,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 22,
    alignItems: 'center',
  },
  // logoContainer: {
  //   width: 80,
  //   height: 80,
  //   borderRadius: 40,
  //   backgroundColor: 'white',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 24,
  //   elevation: 3,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  // },
  logo: {
    top: 20,
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E2F2E',
    marginBottom: 32,
  },
  
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  chatInput: {
    marginBottom: 20,
    
  }
  
  // bottomNav: {
  //   flexDirection: 'row',
  //   backgroundColor: '#10B981',
  //   paddingVertical: 12,
  //   paddingHorizontal: 16,
  // },
  // navButton: {
  //   flex: 1,
  //   alignItems: 'center',
  //   paddingVertical: 8,
  // },
  // navIcon: {
  //   width: 24,
  //   height: 24,
  //   marginBottom: 4,
  // },
  // navText: {
  //   fontSize: 12,
  //   color: 'white',
  //   fontWeight: '500',
  // },
});