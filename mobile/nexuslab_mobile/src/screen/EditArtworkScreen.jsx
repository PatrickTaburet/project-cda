import { ScrollView, TextInput, ImageBackground, View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, Image, Easing } from 'react-native';
import React, { useState, useEffect } from 'react'
import { CommonActions, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import config from '../config/config'; 
import { colors } from '../utils/colors'
import MyButton from '../components/MyButton';
import globalStyles from '../utils/styles';
import useApi from '../hooks/useApi';
import * as ImagePicker from 'expo-image-picker';
import { checkTokenValidity } from '../services/AuthService';
import * as FileSystem from 'expo-file-system';


const EditArtworkScreen = ({ route, navigation })  => {
  const { idPrefix, sceneId } = route.params;
  const {api} = useApi();
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [error, setError] = useState('');
  const [inputHeight1, setInputHeight1] = useState(40);
  const [inputHeight2, setInputHeight2] = useState(40);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imageName, setImageName] = useState('');

  const fetchArtworkData = async () => {
    console.log('fetch start');
    try {
      const response = await api.get(`/artworks/${sceneId}/${idPrefix}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response :');
      
      console.log(response.data);

      setTitle(response.data.title);
      setComment(response.data.comment);
      setImageName(response.data.imageName);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const HandleUpdateArtwork = async () => {
    const data = { title, comment };
    console.log("-----------");
    console.log(data);

    try {
      const  response = await api.post(`/myArtworks/update/${sceneId}/${idPrefix}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      }); 

      console.log(response.data) 

      if (response.status === 200 ) {
        alert('Update successful!');
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 400 && error.response.data.errors)  {
          const errorMessages = error.response.data.errors.join(', ');
          setError(errorMessages);
        } else {
          const errorMessage = error.response.data.error || 'An error occurred during profile update.';
          setError(errorMessage);
        }
      } else {
        setError('An error occurred during profile update.');
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchArtworkData();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingSafeArea}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const artworkUrl = route ? `${config.apiUrl}/images/${idPrefix}Img/${imageName}` : null; 
  const decorUrl = `${config.apiUrl}/images/design/circle2.png`;


  return (
    <SafeAreaView style={styles.safeArea}> 
      <ImageBackground
        source={require('../assets/design/backgroundProfile.jpg')}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', width:'100%'}}>
        <SafeAreaView style={styles.globalContainer}>
          <View style={styles.container}>
            <Image
              source={{ uri: artworkUrl }}
              style={styles.artworkImage}
            />
            <View style={styles.labelInputContainer}>
              <Text style={styles.textLabel}>Title</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  value={title}
                  onChangeText={text => setTitle(text)}
                  multiline={true} 
                  style={[styles.textInput, { height: inputHeight1 }]}
                  onContentSizeChange={(event) => {
                    setInputHeight1(Math.max(40, event.nativeEvent.contentSize.height));
                  }}
                />
              </View>
            </View>     
            <View style={styles.labelInputContainer}>
              <Text style={styles.textLabel}>Comment</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  value={comment}
                  onChangeText={text => setComment(text)}
                  multiline={true} 
                  style={[styles.textInput, { height: inputHeight2 }]}
                  onContentSizeChange={(event) => {
                    setInputHeight2(Math.max(40, event.nativeEvent.contentSize.height));
                  }}
                />
              </View>
            </View>  
            <View style={styles.globalButtonBox}>
                <MyButton
                  HandlePress={HandleUpdateArtwork}
                  myStyle={styles.submitButton}
                >
                  Update
                </MyButton>
                {error ? <Text style={globalStyles.warning} >{error}</Text> : null}

            </View>
          </View>
        </SafeAreaView>
        </ScrollView>
      </ImageBackground>
  </SafeAreaView>

  );
}

export default EditArtworkScreen

const styles = StyleSheet.create({
  safeArea:{
    flex: 1,
  },
  loadingSafeArea:{
    flex: 1,
    backgroundColor: 'black', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  globalContainer : {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '80%',
    height: '83%',
    borderRadius: 20,
    borderColor: colors.cyan,
    borderWidth: 2,
    marginTop: 30,
  },
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
    marginBottom: 63
  },
  text: {
    fontSize: 15,
    marginBottom: 10,
    color: 'white'
  },
  artworkImage: {
    width: 228,
    height: 228,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.cyan,
    zIndex:2,
    top : 0,
    marginTop: 41,
    resizeMode: 'contain',
    marginBottom: 20
  },
  submitButton:{
    margin: 0,
    marginBottom: 40
  },
  globalButtonBox:{
    display:"flex",
    alignItems:'center',
    marginVertical: 15
  },
  inputContainer:{
    alignItems: "center",
    flexDirection: 'row',
    width: '80%',
    backgroundColor: "white",
    borderRadius:10,
    borderWidth: 1
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 15,
  },
  labelInputContainer:{
    display: 'flex',
    marginVertical: 15
  },
  textLabel:{
    fontSize: 13,
    color: 'white',
  }
})