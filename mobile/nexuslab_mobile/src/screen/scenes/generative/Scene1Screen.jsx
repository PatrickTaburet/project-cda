import React, { useState, useEffect, useRef} from 'react';
import { Image, SafeAreaView, TouchableOpacity, Text, StyleSheet, Modal, View, TextInput, ActivityIndicator, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { colors } from '../../../utils/colors'
import globalStyles from '../../../utils/styles';
import { Ionicons } from '@expo/vector-icons'; 
import useApi from '../../../services/api/hooks/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import {jwtDecode} from 'jwt-decode';
import MyButton from '../../../components/MyButton';
import config from '../../../config/config'; 

const SaveArtworkModal = ({ visible, onClose, onSubmit, imagePreview }) => {
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const previewUrl = `${config.apiUrl}/images/scene1Img/${imagePreview}`;

  return (
    <Modal visible={visible} transparent animationType="slide" accessible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={[styles.modalHeader, globalStyles.mainTitle]} accessible={true} accessibilityLabel="Save Artwork Header">
            Save my Artwork
          </Text>     
            {imagePreview && (
              <Image 
                source={{ uri: previewUrl }} 
                style={styles.preview}
                accessible={true}
                accessibilityLabel="Artwrk preview image"
                resizeMode="contain" 
              />
            )}     
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            accessible={true}
            accessibilityLabel="Artwork Title"
            accessibilityHint="Enter the title for your artwork"
          />
          <TextInput
            style={styles.input}
            placeholder="Comment"
            value={comment}
            onChangeText={setComment}
            accessible={true}
            accessibilityLabel="Artwork Title"
            accessibilityHint="Enter the title for your artwork"
            multiline
          />
          <View style={styles.buttonContainer}>
            <MyButton
              onPress={() =>{
                onSubmit(title, comment);
                setTitle("");
                setComment("");
              } }
              accessible={true}
              accessibilityLabel="Submit Artwork"
              accessibilityHint="Tap to submit your artwork details"
            >
              Submit
            </MyButton>
            <MyButton
              onPress={onClose}
              isSecondary={true}
              accessible={true}
              accessibilityLabel="Close Modal"
              accessibilityHint="Tap to go back without saving"
            >
              Back
            </MyButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Scene1Screen = ({ navigation }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const webViewRef = useRef(null);
  const {api} = useApi();
  const [initialLoading, setInitialLoading] = useState(true); 
  const [sendingDataLoading, setSendingDataLoading] = useState(false); 
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    async function loadHtmlFile() {
      const htmlAsset = Asset.fromModule(require('../../../assets/webView/SceneG1.html'));
      await htmlAsset.downloadAsync();
      setHtmlContent(htmlAsset.uri);
      setInitialLoading(false);   
    }
    loadHtmlFile();
  }, []);

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    //console.log('Données reçues de la WebView:', data);
    sendDataToBackend(data);
  };

  const sendDataToBackend = async (data) => {
    try {
      setSendingDataLoading(true);
      const token = await AsyncStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const fullData = {
        ...data, 
        userId: userId
      };
      const response = await api.post(`/generative/sendDataG1`, fullData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status !== 200) {
        throw new Error("Error sending data to the API");
      }

      const result = await response.data;
   
      setCurrentSceneId(result.sceneId);
      getImagePreview(result.sceneId);
      setModalVisible(true);
      setSendingDataLoading(false);
    } catch (error) {
      console.error("Error sending data :", error);
      setSendingDataLoading(false); 
    }
  };

  const getImagePreview = async (sceneId) => {
    try {
      const response = await api.post(`/generative/getPreview`, {
        sceneId: sceneId,
        sceneType: "Scene1"
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.data;
      setImagePreview(result.imageName);
     
      if (response.status !== 200) {
        throw new Error("Error getting image preview");
      }
    } catch (error) {
      console.error("Error trying to get image preview:", error);

    }
  }

  const handleSaveArtwork = async (title, comment) => {
    try {
      const response = await api.post(`/saveScene/Scene1/${currentSceneId}`, {
        title : title,
        comment : comment
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(response.data);
      if (response.status !== 200) {
        throw new Error("Error updating the scene");
      }
      setModalVisible(false);
      alert(`Artwork ${title} save in the gallery`);
    } catch (error) {
      console.error("Error trying to update the scene:", error);
    }
  };

  const deleteArtwork = async() => {
    try {
      const response = await api.post(`/artworks/delete/${currentSceneId}/Scene1`);
      // console.log(response.data);
      if (response.status !== 200) {
        throw new Error("Error deleting the scene");
      }
      console.log(`Artwork removed`);
    } catch (error) {
      console.error("Error trying to delete the scene:", error);
    }
  };
  
  const InitialLoadingOverlay = () => (
    <View style={[styles.loadingOverlay, { backgroundColor: colors.purple_dark }]}>
      <ActivityIndicator size="large" color={colors.purple_light} />
    </View>
  );

  const SendingDataLoadingOverlay = () => (
    <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <ActivityIndicator size="large" color={colors.purple_light} />
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/design/background-pannel-mobile.jpg')}
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
        <TouchableOpacity 
          onPress={()=>{navigation.goBack()}}
          style={styles.backButton}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to the previous screen"
        >
          <Ionicons 
            name={"arrow-back"}
            size={23}
            color={'white'}
          />
        </TouchableOpacity>
        <Text style={[styles.text, globalStyles.mainTitle]} accessible={true} accessibilityLabel="Title" accessibilityHint="Title of the artwork">
          Random Line Walkers
        </Text>

        {/* WebView : generative art scene */}

        {htmlContent && (
          <WebView 
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ uri: htmlContent }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={styles.webview}
            onMessage={handleWebViewMessage}
            onLoadStart={() => setInitialLoading(true)}
            onLoadEnd={() => setInitialLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView Error: ', nativeEvent);
            }}
            accessible={true}
            accessibilityLabel="Interactive content area"
            accessibilityHint="This area displays the interactive web content related to the artwork."
          />
        )}

        {/* Saving modale */}
        
        <SaveArtworkModal 
          visible={modalVisible}
          imagePreview={imagePreview}
          onClose={() => {
            setModalVisible(false);
            deleteArtwork();
          }}
          onSubmit={handleSaveArtwork}
        />
        {initialLoading && <InitialLoadingOverlay />}
        {sendingDataLoading && <SendingDataLoadingOverlay />}
      </ImageBackground>
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple_dark,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  text:{
    color:'white',
    textAlign: 'center',
    fontSize: 18,
    margin: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1000,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Modale

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.purple_dark,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 2,
    borderColor: colors.cyan,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colors.lightest
  },
  modalHeader:{
    textAlign: "center",
    marginBottom: 15,
    fontSize: 19,
    height: 40,
    marginTop: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: 5
  },
  preview:{
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.cyan,
    height: 240,
    marginBottom: 25
  }
});

export default Scene1Screen;
