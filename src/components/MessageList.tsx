import React, { FC } from "react";
import {
  StyleSheet,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Message from "../models/Message";

interface MessageListProps {
  messages: Array<Message>;
  onPressMessage: (message: Message) => void;
}

const MessageList: FC<MessageListProps> = ({ messages, onPressMessage }) => {
  const keyExtractor = (message: Message) => message.id;

  const renderMessageItem: ListRenderItem<Message> = ({ item }) => {
    return (
      <View key={item.id} style={styles.messageRow}>
        <TouchableOpacity onPress={() => onPressMessage(item)}>
          {renderMessageBody(item)}
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessageBody = (message: Message) => {
    const coordinate = {
      latitude: message.coordinate?.latitude ?? 0,
      longitude: message.coordinate?.longitude ?? 0,
    };
    const region = {
      ...coordinate,
      latitudeDelta: 0.08,
      longitudeDelta: 0.04,
    };

    switch (message.type) {
      case "text":
        return (
          <View style={styles.messageBubble}>
            <Text style={styles.text}>{message.text}</Text>
          </View>
        );
      case "image":
        return <Image style={styles.image} source={{ uri: message.uri }} />;
      case "location":
        return (
          <MapView style={styles.map} initialRegion={region}>
            <Marker coordinate={coordinate} />
          </MapView>
        );
      default:
        return null;
    }
  };

  return (
    <FlatList
      style={styles.container}
      inverted
      data={messages}
      renderItem={renderMessageItem}
      keyExtractor={keyExtractor}
      keyboardShouldPersistTaps={"handled"}
    />
  );
};

export default MessageList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "visible",
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
    marginRight: 10,
    marginLeft: 50,
  },
  messageBubble: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgb(16,135,255)",
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  map: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
});
