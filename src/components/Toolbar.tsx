import React, { FC, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { usePrevious } from "../hooks/usePrevious";

interface ToolbarProps {
  isFocused: boolean;
  onChangeFocus: (value: boolean) => void;
  onSubmit: (text: string) => void;
  onPressCamera: () => void;
  onPressLocation: () => void;
}

interface ToolbarButton {
  title: string;
  onPress: () => void;
}

const Toolbar: FC<ToolbarProps> = ({
  isFocused,
  onChangeFocus,
  onSubmit,
  onPressCamera,
  onPressLocation,
}) => {
  const [text, setText] = useState("");
  let inputRef = useRef() as React.MutableRefObject<TextInput>;
  const prevIsFocused = usePrevious(isFocused);

  useEffect(() => {
    if (prevIsFocused != isFocused) {
      if (isFocused) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [isFocused]);

  const focusHandler = () => {
    onChangeFocus(true);
  };

  const blurHandler = () => {
    onChangeFocus(false);
  };

  const onChangeTextHandler = (value: string) => {
    setText(value);
  };

  const onSubmitEditingHandler = () => {
    if (!text) return;

    onSubmit(text);
    setText("");
  };

  const ToolbarButton: FC<ToolbarButton> = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.button}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.toolbar}>
      <ToolbarButton title={"📷"} onPress={onPressCamera} />
      <ToolbarButton title={"📍"} onPress={onPressLocation} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          underlineColorAndroid={"transparent"}
          placeholder="Enter text..."
          blurOnSubmit={false}
          value={text}
          onChangeText={onChangeTextHandler}
          onSubmitEditing={onSubmitEditingHandler}
          ref={inputRef}
          onFocus={focusHandler}
          onBlur={blurHandler}
        />
      </View>
    </View>
  );
};

export default Toolbar;

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingLeft: 15,
    backgroundColor: "white",
  },
  button: {
    top: -2,
    marginRight: 12,
    fontSize: 20,
    color: "grey",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    borderColor: "rgba(0,0,0,0.04)",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});
