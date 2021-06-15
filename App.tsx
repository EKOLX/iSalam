import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  View,
  TouchableHighlight,
  Image,
  BackHandler,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import * as messageUtil from "./src/utils/MessageUtil";
import Status from "./src/components/Status";
import MessageList from "./src/components/MessageList";
import Message from "./src/models/Message";

export default function App() {
  const [messages, setMessages] = useState([
    messageUtil.createImageMessage("https://unsplash.it/300/300"),
    messageUtil.createTextMessage("Wow"),
    messageUtil.createTextMessage("EL"),
    messageUtil.createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
    }),
  ]);
  const [fullScreenImageId, setFullScreenImageId] =
    useState<string | null>(null);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (fullScreenImageId) {
          dismissFullScreenImage();
          return true;
        }

        return false;
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const dismissFullScreenImage = () => {
    setFullScreenImageId(null);
  };

  const onPressMessageHandler = (message: Message) => {
    switch (message.type) {
      case "text":
        Alert.alert(
          "Delete message?",
          "Are you sure you want to permanently delete this message?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                let filtered = messages.filter((m) => m.id !== message.id);
                setMessages(filtered);
              },
            },
          ]
        );
        break;
      case "image":
        setFullScreenImageId(message.id);
      default:
        break;
    }
  };

  const renderMessageList = () => (
    <View style={styles.content}>
      <MessageList messages={messages} onPressMessage={onPressMessageHandler} />
    </View>
  );

  const renderFullScreenImage = () => {
    if (!fullScreenImageId) return null;

    const image = messages.find((m) => m.id === fullScreenImageId);

    if (!image) return null;

    return (
      <TouchableHighlight
        style={styles.fullScreenOverlay}
        onPress={dismissFullScreenImage}
      >
        <Image style={styles.fullScreenImage} source={{ uri: image.uri }} />
      </TouchableHighlight>
    );
  };

  const renderInputEditor = () => <View style={styles.inputEditor}></View>;

  const renderToolbar = () => <View style={styles.toolbar}></View>;

  return (
    <View style={styles.container}>
      <Status />
      {renderMessageList()}
      {renderToolbar()}
      {renderInputEditor()}
      {renderFullScreenImage()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  inputEditor: {
    flex: 1,
    backgroundColor: "white",
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.4)",
    backgroundColor: "white",
  },
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 2,
  },
  fullScreenImage: {
    flex: 1,
    resizeMode: "contain",
  },
});
