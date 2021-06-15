import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const renderMessageList = () => <View style={styles.content}></View>;

  const renderInputEditor = () => <View style={styles.inputEditor}></View>;

  const renderToolbar = () => <View style={styles.toolbar}></View>;

  return (
    <View style={styles.container}>
      {renderMessageList()}
      {renderToolbar()}
      {renderInputEditor()}
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
});
