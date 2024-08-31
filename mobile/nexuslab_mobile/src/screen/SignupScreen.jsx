import { ScrollView, TextInput, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { colors } from '../utils/colors'
import globalStyles from '../utils/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../components/MyButton';
import { Checkbox } from 'react-native-paper';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker';

const SignupScreen = () => {

  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.uri);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    if (profilePicture) {
      formData.append('profilePicture', {
        uri: profilePicture,
        type: profilePicture.type,
        name: profilePicture.fileName,
      });
    }

    try {
      const response = await api.post('/users', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        alert('Registration successful!');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.navigate('Welcome')}
      >
      <Ionicons name={"arrow-back-circle"} color={colors.lightest} size={50} />
      </TouchableOpacity>
      <ScrollView  contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 100}}>


        {/* Form */}

        <View style={styles.formContainer}>
          <Text style={[styles.mainText, globalStyles.text3]}>SIGN UP</Text>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"person-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput 
              placeholder='Username'
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"mail-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput 
              placeholder='Email'
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"lock-closed-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput 
              placeholder='Password'
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />          
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"lock-closed-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TextInput 
              placeholder='Confirm Password'
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons 
            name={"person-circle-outline"}
            size={20}
            style={styles.inputIcon}
            />
            <TouchableOpacity onPress={handleSelectImage} style={styles.imagePicker}>
              <Text>Select Profile Picture</Text>
            </TouchableOpacity>
            {profilePicture && (
              <Image source={{ uri: profilePicture }} style={styles.image} />
            )}
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
              uncheckedColor={"white"}
              color={"rgb(217, 0, 255)"}
            />
            <Text style={styles.checkboxText}>Agree terms</Text>
          </View>
          <MyButton
            HandlePress={handleRegister}
            myStyle={styles.submitButton}
          >
            Register
          </MyButton>
        </View>
      </ScrollView>
    </View>
  )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.web_black,
      padding: 20,
    },
    backButton: {
      position: 'absolute',
      top: 45,
      left : 20,
      backgroundColor: 'transparent',
      borderRadius: 25,
      zIndex: 3,
    },
    mainText:{
      color: "rgb(217, 0, 255)",
      marginBottom: 30,
    },
    text:{
      color: "white"
    },
    formContainer : {
      marginTop: 95,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#222',
      width: '100%',
      paddingVertical: 30
    },
    inputContainer:{
      marginVertical: 15,
      alignItems: "center",
      flexDirection: 'row',
      width: '80%',
      height:40,
      backgroundColor: "white",
      borderRadius:10,
      borderWidth: 1
    },    
    inputIcon:{
      margin:7
    },
    submitButton:{
      marginTop: 40,
      fontSize: 20
    },
    checkboxContainer:{
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxText:{
      color: "white",
    },
})