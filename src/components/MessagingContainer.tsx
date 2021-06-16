import React, { FC, ReactNode } from "react";
import {
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
  BackHandler,
  View,
} from "react-native";

export enum InputMethod {
  NONE = "NONE",
  KEYBOARD = "KEYBOARD",
  CUSTOM = "CUSTOM",
}

interface MessagingContainerProps {
  // From `KeyboardComponent`
  containerHeight: number;
  contentHeight: number;
  keyboardHeight: number;
  keyboardVisible: boolean;
  keyboardWillShow: boolean;
  keyboardWillHide: boolean;
  keyboardAnimationDuration: number;
  // Managing the IME type
  inputMethod: InputMethod;
  onChangeInputMethod: (input: InputMethod) => void;
  // Rendering content
  children: any;
  renderInputMethodEditor: () => ReactNode;
}

class MessagingContainer extends React.Component<MessagingContainerProps> {
  subscription: any = null;

  constructor(props: MessagingContainerProps) {
    super(props);

    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    this.subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const { onChangeInputMethod, inputMethod } = this.props;
        if (inputMethod === InputMethod.CUSTOM) {
          onChangeInputMethod(InputMethod.NONE);
          return true;
        }
        return false;
      }
    );
  }

  componentWillReceiveProps(nextProps: MessagingContainerProps) {
    const { onChangeInputMethod } = this.props;

    if (!this.props.keyboardVisible && nextProps.keyboardVisible) {
      // Keyboard shown
      onChangeInputMethod(InputMethod.KEYBOARD);
    } else if (
      // Keyboard hidden
      this.props.keyboardVisible &&
      !nextProps.keyboardVisible &&
      this.props.inputMethod !== InputMethod.CUSTOM
    ) {
      onChangeInputMethod(InputMethod.NONE);
    }

    const { keyboardAnimationDuration } = nextProps;
    const animation = LayoutAnimation.create(
      keyboardAnimationDuration,
      Platform.OS === "android"
        ? LayoutAnimation.Types.easeInEaseOut
        : LayoutAnimation.Types.keyboard,
      LayoutAnimation.Properties.opacity
    );
    LayoutAnimation.configureNext(animation);
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    const {
      children,
      renderInputMethodEditor,
      inputMethod,
      containerHeight,
      contentHeight,
      keyboardHeight,
      keyboardWillShow,
      keyboardWillHide,
    } = this.props;

    const useContentHeight =
      keyboardWillShow || inputMethod === InputMethod.KEYBOARD;

    const containerStyle = {
      height: useContentHeight ? contentHeight : containerHeight,
    };

    const showCustomInput =
      inputMethod === InputMethod.CUSTOM && !keyboardWillShow;

    const inputStyle = {
      height: showCustomInput ? keyboardHeight || 250 : 0,
    };

    return (
      <View style={containerStyle}>
        {children}
        <View style={inputStyle}>{renderInputMethodEditor()}</View>
      </View>
    );
  }
}

export default MessagingContainer;
