import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react'

const SceneD2Screen = ({ navigation })  => {


  return (
      <View style={styles.container}>
        <Text style={styles.text}>Bienvenue sur SceneD2Screen!</Text>
      </View>
  )
}

export default SceneD2Screen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },


})