import React, { FC, useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  ListRenderItem,
  TouchableOpacity,
} from "react-native";
import * as Permissions from "expo-permissions";
import CameraRoll from "@react-native-community/cameraroll";

import Grid, { RenderItemProps } from "./Grid";

interface ImageGridProps {
  onPressImage: (uri: string) => void;
}

const ImageGrid: FC<ImageGridProps> = ({ onPressImage }) => {
  const [images, setImages] = useState<any>();

  let loading: boolean = false;
  let cursor: any = null;
  let imageCallback = () => {};

  useEffect(() => {
    getImages();
  }, []);

  useEffect(() => {
    imageCallback();
  }, [images]);

  const getImages = async (after: any = null) => {
    if (loading) return;

    loading = true;

    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      console.log("Camera roll permission denied");
      return;
    }

    const results = await CameraRoll.getPhotos({ first: 20, after });
    const {
      edges,
      page_info: { has_next_page, end_cursor },
    } = results;

    const loadedImages = edges.map((item) => item.node.image);
    const imageCopy = loadedImages.concat([...images]);

    imageCallback = () => {
      loading = false;
      cursor = has_next_page ? end_cursor : null;
    };
    setImages(imageCopy);
  };

  const getNextImages = () => {
    if (!cursor) return;

    getImages(cursor);
  };

  const renderItem = (item: RenderItemProps) => {
    const style = {
      width: item.size,
      height: item.size,
      marginLeft: item.marginLeft,
      marginTop: item.marginTop,
    };

    return (
      <TouchableOpacity
        style={style}
        key={item.uri}
        activeOpacity={0.75}
        onPress={() => onPressImage(item.uri)}
      >
        <Image style={styles.image} source={{ uri: item.uri }} />
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: RenderItemProps) => item.uri;

  return (
    <Grid
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={getNextImages}
    />
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  image: {},
});
