import React, { FC, useState, useEffect } from "react";
import { StyleSheet, Platform, Keyboard, View } from "react-native";

interface KeyboardProps {
  layout: Layout;
  children: any;
}

interface KeyboardState {
  contentHeight: number;
  keyboardHeight: number;
  keyboardVisible: boolean;
  keyboardWillShow: boolean;
  keyboardWillHide: boolean;
  keyboardAnimationDuration: number;
}

interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

const INITIAL_ANIMATION_DURATION = 250;

const KeyboardComponent: FC<KeyboardProps> = ({ layout, children }) => {
  const [keyboard, setKeyboard] = useState<KeyboardState>({
    contentHeight: layout.height,
    keyboardHeight: 0,
    keyboardVisible: false,
    keyboardWillShow: false,
    keyboardWillHide: false,
    keyboardAnimationDuration: INITIAL_ANIMATION_DURATION,
  });

  useEffect(() => {
    let subscribtion: Array<any> = [];

    if (Platform.OS === "ios") {
      subscribtion = [
        Keyboard.addListener("keyboardWillShow", keyboardWillShow),
        Keyboard.addListener("keyboardWillHide", keyboardWillHide),
        Keyboard.addListener("keyboardDidShow", keyboardDidShow),
        Keyboard.addListener("keyboardDidHide", keyboardDidHide),
      ];
    } else {
      subscribtion = [
        Keyboard.addListener("keyboardDidShow", keyboardDidShow),
        Keyboard.addListener("keyboardDidHide", keyboardDidHide),
      ];
    }

    return () => {
      subscribtion.forEach((sub) => sub.remove());
    };
  }, []);

  const keyboardWillShow = (event: any) => {
    setKeyboard({ ...keyboard, keyboardWillShow: true });
    measure(event);
  };

  const keyboardWillHide = (event: any) => {
    setKeyboard({ ...keyboard, keyboardWillHide: true });
    measure(event);
  };

  const keyboardDidShow = (event: any) => {
    setKeyboard({
      ...keyboard,
      keyboardWillShow: false,
      keyboardVisible: true,
    });
    measure(event);
  };

  const keyboardDidHide = (event: any) => {
    setKeyboard({
      ...keyboard,
      keyboardWillHide: false,
      keyboardVisible: false,
    });
  };

  const measure = (event: any) => {
    const {
      endCoordinates: { height, screenY },
      duration = INITIAL_ANIMATION_DURATION,
    } = event;

    setKeyboard({
      ...keyboard,
      contentHeight: screenY - layout.y,
      keyboardHeight: height,
      keyboardAnimationDuration: duration,
    });
  };

  const {
    contentHeight,
    keyboardHeight,
    keyboardVisible,
    keyboardWillShow: willShow,
    keyboardWillHide: willHide,
    keyboardAnimationDuration,
  } = keyboard;

  return children({
    containerHeight: layout.height,
    contentHeight,
    keyboardHeight,
    keyboardVisible,
    willShow,
    willHide,
    keyboardAnimationDuration,
  });
};

export default KeyboardComponent;

const styles = StyleSheet.create({});
