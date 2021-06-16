import React, { FC } from "react";
import {
  StyleSheet,
  Dimensions,
  ListRenderItem,
  FlatList,
  PixelRatio,
} from "react-native";

export interface RenderItemProps {
  uri: string;
  index: number;
  size: number;
  marginLeft: number;
  marginTop: number;
}

interface GridProps {
  data: any;
  numColumns?: number;
  itemMargin?: number;
  renderItem: (props: RenderItemProps) => JSX.Element;
  keyExtractor: (key: any) => string;
  onEndReached: any;
}

const Grid: FC<GridProps> = ({
  data,
  numColumns = 4,
  itemMargin = StyleSheet.hairlineWidth,
  renderItem,
  keyExtractor,
  onEndReached,
}) => {
  const renderGridItem: ListRenderItem<RenderItemProps> = ({ item }) => {
    const { width } = Dimensions.get("window");
    const size = PixelRatio.roundToNearestPixel(
      (width - itemMargin * (numColumns - 1)) / numColumns
    );
    const marginLeft = item.index % numColumns === 0 ? 0 : itemMargin;
    const marginTop = item.index < numColumns ? 0 : itemMargin;

    return renderItem({ ...item, size, marginLeft, marginTop });
  };

  return (
    <FlatList
      data={data}
      numColumns={numColumns}
      renderItem={renderGridItem}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
    ></FlatList>
  );
};

export default Grid;

const styles = StyleSheet.create({});
