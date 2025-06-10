import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../../components/aiScreen/Header';
import { SearchBar } from '../../components/aiScreen/SearchBar';
import { TabNavigation } from '../../components/aiScreen/TabNavigation';
import { CapabilityCard } from '../../components/aiScreen/CapabilityCard';
import { ChatInput } from '../../components/aiScreen/ChatInput';
// import { BottomNavigation } from '../../components/aiScreen/BottomNavigation';
import { useZaoAI } from '../../components/aiScreen/useZaoAI';
import { styles } from '../../config/styles/ZaoAIStyles';

export const ZaoAIScreen = () => {
  const {
    searchText,
    setSearchText,
    activeTab,
    setActiveTab,
    chatInput,
    setChatInput,
    bottomNavTab,
    setBottomNavTab,
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
          <View style={styles.logoContainer}>
            {/* Replace with your actual logo */}
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
      
      <ChatInput
        value={chatInput}
        onChangeText={setChatInput}
        onSend={handleSend}
        onAttach={handleAttach}
        onVoice={handleVoice}
        placeholder="Ask anything"
      />
      
      {/* <BottomNavigation
        activeTab={bottomNavTab}
        onTabPress={setBottomNavTab}
      /> */}
    </SafeAreaView>
  );
};