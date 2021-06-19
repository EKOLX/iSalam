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
//import * as Location from "expo-location";

import Status from "./src/components/Status";
import MessageList from "./src/components/MessageList";
import Message from "./src/models/Message";
import Toolbar from "./src/components/Toolbar";
import ImageGrid from "./src/components/ImageGrid";
import MeasureLayout from "./src/components/MeasureLayout";
import KeyboardComponent from "./src/components/KeyboardComponent";
import MessagingContainer, {
  InputMethod,
} from "./src/components/MessagingContainer";
import {
  createTextMessage,
  createImageMessage,
  createLocationMessage,
} from "./src/utils/MessageUtil";

export default function App() {
  const [messages, setMessages] = useState([
    createImageMessage("https://unsplash.it/300/300"),
    createTextMessage("Wow"),
    createTextMessage("EL"),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
    }),
  ]);
  const [fullScreenImageId, setFullScreenImageId] =
    useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputMethod, setInputMethod] = useState(InputMethod.NONE);

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

  const onPressCameraHandler = () => {
    setIsInputFocused(false);
    setInputMethod(InputMethod.CUSTOM);
  };

  const onPressLocationHandler = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const {
        coords: { latitude, longitude },
      } = position;
      setMessages([
        createLocationMessage({ latitude, longitude }),
        ...messages,
      ]);
    });
  };

  const onChangeInputMethodHandler = (inputMethod: InputMethod) => {
    setInputMethod(inputMethod);
  };

  const onChangeFocusHandler = (isFocued: boolean) => {
    setIsInputFocused(isFocued);
  };

  const onSubmitHandler = (text: string) => {
    setMessages((currentMessages) => [
      createTextMessage(text),
      ...currentMessages,
    ]);
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
        setIsInputFocused(false);
        setFullScreenImageId(message.id);
      default:
        break;
    }
  };

  const onPressImageHandler = (uri: string) => {
    setMessages([createImageMessage(uri), ...messages]);
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

  const renderInputEditor = () => (
    <View style={styles.inputEditor}>
      <ImageGrid onPressImage={onPressImageHandler} />
    </View>
  );

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <Toolbar
        isFocused={isInputFocused}
        onSubmit={onSubmitHandler}
        onChangeFocus={onChangeFocusHandler}
        onPressCamera={onPressCameraHandler}
        onPressLocation={onPressLocationHandler}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Status />
      <MeasureLayout>
        {(layout: any) => (
          <KeyboardComponent layout={layout}>
            {(keyboardInfo: any) => (
              <MessagingContainer
                {...keyboardInfo}
                inputMethod={inputMethod}
                onChangeInputMethod={onChangeInputMethodHandler}
                renderInputMethodEditor={renderInputEditor}
              >
                {renderMessageList()}
                {renderToolbar()}
              </MessagingContainer>
            )}
          </KeyboardComponent>
        )}
      </MeasureLayout>
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
