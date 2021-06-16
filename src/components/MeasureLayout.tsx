import React, { FC, useState } from "react";
import { StyleSheet, Platform, View } from "react-native";

interface MeasureLayoutProps {
  children: any;
}

const MeasureLayout: FC<MeasureLayoutProps> = ({ children }) => {
  const [layout, setLayout] = useState(null);

  const layoutHandler = (event: any) => {
    const {
      nativeEvent: { layout },
    } = event;

    setLayout({
      ...layout,
      y: layout.y + (Platform.OS === "android" ? 44 : 0),
    });
  };

  if (!layout) {
    return <View onLayout={layoutHandler} style={styles.container}></View>;
  }

  return children(layout);
};

export default MeasureLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
