// import AsyncStorage from "@react-native-async-storage/async-storage";


// export const storeData = async (key, value) => {
//     try {
//         const stringValue = JSON.stringify(value);
//         await AsyncStorage.setItem(key, stringValue);
       

//     } catch(error){
//         throw error;
//     }
    
// }
// // console.log("Data:", stringValue)


// export const getData = async (key) => {
//     try {
//         const stringValue = await AsyncStorage.getItem(key);
//         return stringValue != null ? JSON.parse(stringValue) : null;

//     } catch(error){
//         throw error;
//     }
    
// }