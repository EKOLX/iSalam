import React, { FC, useEffect, useState } from "react";
import { StyleSheet, Platform, View, StatusBar, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const Status: FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);

      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const backgroundColor = isConnected ? "white" : "red";

  const statusBar = (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={isConnected ? "dark-content" : "light-content"}
      animated={false}
    />
  );

  const messageContainer = (
    <View style={styles.messageContainer} pointerEvents={"none"}>
      {statusBar}
      {!isConnected && (
        <View style={styles.bubble}>
          <Text style={styles.text}>No network connection</Text>
        </View>
      )}
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <View style={[styles.status, { backgroundColor }]}>
        {messageContainer}
      </View>
    );
  }

  return null;
};

export default Status;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: 44,
  },
  messageContainer: {
    zIndex: 1,
    position: "absolute",
    top: 44 + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: "center",
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "red",
  },
  text: {
    color: "white",
  },
});
