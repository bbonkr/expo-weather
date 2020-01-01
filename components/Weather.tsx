import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { WeatherData } from "../interfaces/WeatherData";
/* 
위치:  35.25839924468175 128.61173432059465
Object {
  "base": "stations",
  "clouds": Object {
    "all": 1,
  },
  "cod": 200,
  "coord": Object {
    "lat": 35.26,
    "lon": 128.61,
  },
  "dt": 1577857245,
  "id": 1841245,
  "main": Object {
    "feels_like": 1.33,
    "humidity": 41,
    "pressure": 1031,
    "temp": 5.57,
    "temp_max": 6,
    "temp_min": 5,
  },
  "name": "Masan",
  "sys": Object {
    "country": "KR",
    "id": 5507,
    "sunrise": 1577831640,
    "sunset": 1577866981,
    "type": 1,
  },
  "timezone": 32400,
  "visibility": 10000,
  "weather": Array [
    Object {
      "description": "clear sky",
      "icon": "01d",
      "id": 800,
      "main": "Clear",
    },
  ],
  "wind": Object {
    "deg": 340,
    "speed": 2.1,
  },
}
*/

interface WeatherOptionItem {
  colors: string[];
  statusbar: "light-content" | "dark-content" | "default";
  icon?: string;
  textColor: string;
  title: string;
  subtitle: string;
  description?: string;
}
interface WeatherOptions {
  [key: string]: WeatherOptionItem;
}

const getWeatherOptions = (data: WeatherData): WeatherOptionItem => {
  const itemDefault: WeatherOptionItem = {
    title: data.main,
    subtitle: data.description,
    colors: [],
    textColor: "#fff",
    statusbar: "light-content"
  };
  switch (data.main.toLowerCase()) {
    case "clear":
      return {
        // clear sky
        ...itemDefault,
        colors: ["#24C6DC", "#514A9D"],
        icon: "weather-sunny",
        description: "clear sky; 맑은 하늘"
      };
    case "clouds":
      return {
        // few clouds
        ...itemDefault,
        colors: ["#2BC0E4", "#EAECC6"],
        statusbar: "dark-content",
        textColor: "#323232",
        icon: "weather-cloudy",
        description: "few clouds; 구름 조금"
      };
    case "thunderstorm":
      return {
        // thunderstorm
        ...itemDefault,
        colors: ["#283048", "#859398"],
        statusbar: "light-content",
        icon: "weather-lightning",
        description: "thunderstorm; 천둥번개"
      };
    case "drizzle":
      return {
        // shower
        ...itemDefault,
        colors: ["#134E5E", "#71B280"],
        statusbar: "light-content",
        icon: "weather-pouring",
        description: "shower rain; 많은 비"
      };
    case "rain":
      return {
        // rain
        ...itemDefault,
        colors: ["#232526", "#414345"],
        statusbar: "light-content",
        icon: "weather-lightning-rainy",
        description: "rain; 비"
      };
    case "snow":
      return {
        // snow
        ...itemDefault,
        colors: ["#5C258D", "#4389A2"],
        statusbar: "light-content",
        icon: "weather-snowy",
        description: "snow; 눈"
      };
    default:
      return {
        // mist
        ...itemDefault,
        colors: ["#757F9A", "#D7DDE8"],
        icon: "weather-pouring",
        description: "mist; 안개"
      };
  }
};

interface WeatherProps {
  temp: number;
  data?: WeatherData;
  loading: boolean;
  onRefresh: () => void;
}

export const Weather: React.FC<WeatherProps> = ({
  temp,
  data,
  loading,
  onRefresh
}) => {
  const {
    colors,
    title,
    subtitle,
    icon,
    statusbar,
    textColor
  } = getWeatherOptions(data);
  return (
    <LinearGradient colors={colors} style={styles.container}>
      <StatusBar barStyle={statusbar} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <View style={styles.halfContainer}>
          <ActivityIndicator size="large" animating={loading} />
          {icon ? (
            <MaterialCommunityIcons size={122} color={textColor} name={icon} />
          ) : (
            <Image
              style={{ width: 150, height: 150 }}
              source={{
                uri: `http://openweathermap.org/img/wn/${data.icon ||
                  "50d"}@2x.png`
              }}
            />
          )}

          <Text
            style={{
              ...styles.tempText,
              color: textColor
            }}
          >{`${Math.round(temp)} ℃`}</Text>
        </View>
        <View style={{ ...styles.halfContainer, ...styles.textContainer }}>
          <Text
            style={{
              ...styles.title,
              color: textColor
            }}
          >
            {title}
          </Text>
          <Text style={{ ...styles.subtitle }}>{subtitle}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch"
  },
  scrollView: {
    flex: 1
  },
  halfContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  tempText: {
    fontSize: 36
  },
  textContainer: {
    paddingHorizontal: 30,
    alignItems: "flex-start"
  },
  title: {
    color: "#fff",
    fontWeight: "300",
    fontSize: 48
  },
  subtitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 32
  }
});
