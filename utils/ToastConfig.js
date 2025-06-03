import { StyleSheet } from 'react-native';
import { colors } from '../config/theme';
import { View } from 'react-native';


export const ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.successToast}>
      <Text style={styles.text1}>{text1}</Text>
      <Text style={styles.text2}>{text2}</Text>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={styles.errorToast}>
      <Text style={styles.text1}>{text1}</Text>
      <Text style={styles.text2}>{text2}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  successToast: {
    height: 60,
    width: '90%',
    backgroundColor: colors.primary[600],
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
  },
  errorToast: {
    height: 60,
    width: '90%',
    backgroundColor: '#FF0000',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
  },
  text1: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.background,
  },
  text2: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.background,
  },
});