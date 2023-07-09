import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';


export default function App() {
  let cameraRef = useRef();

  const [isPermitted, setIsPermitted] = useState();
  const [isMediaPermitted, setIsMediaPermitted] = useState();
  const [photo, setPhoto] = useState();
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaPermission = await MediaLibrary.requestPermissionsAsync();

      setIsPermitted(cameraPermission.status === "granted");
      setIsMediaPermitted(mediaPermission.status === "granted")

    })();
  }, []);


  if (isPermitted === undefined) {
    return <Text>Permission is granting ..... </Text>
  }
  if (!isPermitted) {
    return <Text> Give the Permission to take pictures ... </Text>
  }

  const onPressHandler = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    }

    let newPic = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPic);
  }

  if (photo) {
    let sendPic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      }
      )
    }

    let savePic = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => { setPhoto(undefined) }
      )
    }

    return (
      <SafeAreaView style={styles.container2}>
        <Image source={{ uri: "data:image/jpg;base64," + photo.base64 }} style={styles.image} />
        <View style={styles.newView}>
          <TouchableOpacity style={styles.view2} onPress={sendPic}>
            <Text style={styles.text}>
              Share
            </Text>
          </TouchableOpacity>
          {isMediaPermitted ? <TouchableOpacity onPress={savePic} style={styles.view2}>
            <Text style={styles.text}>
              Save
            </Text>
          </TouchableOpacity> : undefined}
          <TouchableOpacity onPress={() => setPhoto(undefined)} style={styles.view2}>
            <Text style={styles.text}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.view}>
        <Pressable onPress={onPressHandler}>
          <Image source={require('./assets/camera.png')} style={{
            width: 50, height: 50, borderRadius: 100
          }}></Image>
        </Pressable>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  container2: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  view: {
    alignSelf: 'flex-end',
    marginBottom: 30
  },
  view2: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 38,
    borderRightColor: 'green',
    borderLeftColor: 'green',
    borderTopColor: 'red',
    borderWidth: 2,
    fontSize: 20,
    backgroundColor: 'transparent'
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
  },
  newView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    paddingBottom: 0,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 20,
    color: 'red',
    fontStyle: 'normal',
    fontWeight: '500'
  }

});
