import { ImageBackground, View, Text, Button, StyleSheet, SafeAreaView, Image, ActivityIndicator, FlatList} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react'
import useApi from '../hooks/useApi';
import {  useIsFocused } from '@react-navigation/native';
import config from '../config/config'; 
import { colors } from '../utils/colors';
import Likes from '../components/LikesManager';
import {Picker} from '@react-native-picker/picker';
import CustomSelect from '../components/CustomSelect';

const ITEM_HEIGHT = 300; 

const SceneCard = ({ item }) => {
  const idPrefix = item.id.split('_')[0]; 
  const sceneId = item.id.split('_')[1]; 
  const imagePath = `${config.apiUrl}/images/${idPrefix}Img/${item.imageName}`;
  return (
    <View style={styles.card}> 
      <Image 
        source={{ uri: imagePath }} 
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.comment}>{item.comment}</Text>
        <Text style={styles.username}>{item.user ? item.user.username : 'Unknown'}</Text>
        <Text style={styles.date}>{item.updatedAt}</Text>
        <Likes
          userId= {item.user.id}
          sceneId= {sceneId}
          likesNum= {item.likes}
          entity= {idPrefix}
          isLikedByUser= {item.isLiked}
        />
      </View> 
    </View> 
  )
};

const GalleryScreen = ({ navigation })  => {
  const {api} = useApi();
  const [scenes, setScenes] = useState([]);
  const [page, setPage] = useState(1);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");

  const fetchScenes = useCallback(async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      console.log('111111111');
      const response = await api.get(`/gallery?page=${page}&limit=10`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      //console.log('API response:', response.data); 


      const newScenes = response.data;
      if (newScenes.length > 0) {
        setScenes(prevScenes => {
          const prevScenesMap = new Map(prevScenes.map(scene => [scene.id, scene]));
          newScenes.forEach(scene => {
            prevScenesMap.set(scene.id, scene);
          });
          return Array.from(prevScenesMap.values());
        });
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }    

    } catch (error) {
      console.error('Error fetching scenes:', error);
    } finally {
      setLoading(false); 
    }
  }, [api, page, loading, hasMore]);

  useEffect(() => {
    if (isFocused) {
      fetchScenes();
    }
  }, [isFocused]);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  return (
    <View  style={styles.globalContainer}>
 
      <ImageBackground
        source={require('../assets/design/hexagonal-background.jpg')}
        style={styles.backgroundImage} 
        resizeMode="cover"
      >
        <View style={styles.selectContainer}>
          <CustomSelect
            data={[
              { value: "date", label: "Date" },
              { value: "likes", label: "Like" },
            ]}
            onChange={(item) => {setSelectedOption(item.value)}}
            placeholder="Sort by .."
          />
        </View>
        
        {/* <Picker
          selectedValue={selectedOption}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedOption(itemValue)
          }
          style={pickerStyles.picker} 
          itemStyle={selectedOption === "" ? pickerStyles.placeholderStyle : pickerStyles.picker}
        >
          <Picker.Item label="Sort by ..." value="" enabled={false} />
          <Picker.Item label="Date" value="date" />
          <Picker.Item label="Likes" value="likes" />
        </Picker> */}
      <FlatList
        data={scenes}
        renderItem={({ item }) => <SceneCard item={item} />}
        keyExtractor={item => item.id}
        onEndReached={fetchScenes}
        onEndReachedThreshold={0.5} 
        ListFooterComponent={renderFooter}
        initialNumToRender={5} 
        maxToRenderPerBatch={5}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
      </ImageBackground>
    </View>

  );
}

export default GalleryScreen

const styles = StyleSheet.create({
  globalContainer:{
    marginTop: 25,
    display:'flex',
    alignItems: 'center',

  },
  backgroundImage: {
    paddingTop:60
  },
  card: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 1.5,
    borderColor: colors.cyan,
    overflow: 'hidden',
    marginHorizontal: 20,
    backgroundColor: 'hsla(216, 50%, 16%, 0.8)', 

  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',

  },
  comment: {
    fontSize: 14,
    marginTop: 5,
    color: 'white',

  },
  username: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: 'white',
  },
  likes: {
    fontSize: 15,
    color: 'black',
    color: 'white', 

  },
  loader: {
    marginVertical: 20,
    alignItems: 'center',
  },
  inputIcon:{
    color:'white'
  },
  selectContainer:{
    position:'absolute',
    alignItems: 'flex-start',
    marginLeft: 0,
    marginTop: 0,
    zIndex:10
  }
})
const pickerStyles = StyleSheet.create({
  // inputIOS: {
  //   fontSize: 16,
  //   paddingHorizontal: 10,
  //   paddingVertical: 8,
  //   borderWidth: 0.5,
  //   borderColor: 'gray',
  //   borderRadius: 8,
  //   color: 'black',
  //   paddingRight: 30,
  //   marginBottom: 15,
  //   backgroundColor: 'white',
  // },
  // inputAndroid: {
  //   width: '40%',
  //   borderColor: 'gray',
  //   color: 'black',
  //   marginLeft: 15,
  //   marginTop:70,
  //   backgroundColor: 'white',
  //   zIndex: 2,
  
  // },
  // viewContainer: {
  //   display:'flex',
  //   justifyContent:'center',
  //   alignItems:'center'
  // },
  picker: {
    width: 150,
    height: 20,
    backgroundColor: 'white',
    marginTop: 70,
    marginBottom: 15,
    marginLeft: 15,
  },
  pickerItem: {
    color: 'black',
    fontSize: 12,
  },
  placeholderStyle:{
    color:'grey'
  }
});

