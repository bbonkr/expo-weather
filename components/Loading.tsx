import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Alert, StatusBar } from "react-native";

interface LoadingProps {
  onLoad: (backgroundColor: string) => void;
}

export const Loading: React.FC<LoadingProps> = ({ onLoad }) => {
  useEffect(() => {
    if (onLoad) {
      onLoad(styles.container.backgroundColor);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.blankView}></View>
      <View style={styles.contentView}>
        <Text style={styles.text}>Getting</Text>
        <Text style={styles.text}>the weather</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6AA",
    alignSelf: "stretch"
  },
  blankView: {
    flex: 4
  },
  contentView: {
    flex: 1,
    padding: 20
  },
  text: {
    color: "#3f3f3f",
    fontSize: 36,
    fontWeight: "bold"
  }
});
