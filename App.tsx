import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  RefreshControl,
  ScrollView
} from "react-native";
import Constants from "expo-constants";
import { getCurrentPositionAsync, PermissionStatus } from "expo-location";
import { askAsync, getAsync, LOCATION } from "expo-permissions";
import axios from "axios";
import { Loading } from "./components/Loading";
import { Weather } from "./components/Weather";
import { WeatherData } from "./interfaces/WeatherData";

const API_KEY = "089a2ad3ec5df192f8f0271396e8d593";

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export default function App() {
  const [backgroundColor, setBackgroundColor] = useState("#fff");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [temp, setTemp] = useState(0);
  const [weatherData, setWeatherData] = useState<WeatherData>();

  const getLocation = async () => {
    let hasPermission = false;
    const { status } = await getAsync(LOCATION);

    hasPermission = status === PermissionStatus.GRANTED;

    if (!hasPermission) {
      await askAsync(LOCATION);
      const { status: status2nd } = await getAsync(LOCATION);
      hasPermission = status2nd === PermissionStatus.GRANTED;
    }

    // console.log("권한 확인", hasPermission);
    if (hasPermission) {
      getCurrentPositionAsync()
        .then(data => {
          const { coords } = data;
          // console.log("위치: ", coords.latitude, coords.longitude);

          return getWeather(coords.latitude, coords.longitude);
        })
        .catch(error => {
          console.error(error);
          Alert.alert("Could not access your location.");
        });
    }
  };

  const getWeather = async (latitude, longitude) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    const { data } = await axios.get(url);

    // console.log(data);
    setTemp(data.main.temp);
    setWeatherData(data.weather[0]);
    setLoading(false);
    setRefreshing(false);

    // wait(1000).then(() => {
    //   setLoading(false);
    //   setRefreshing(false);
    // });
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleBackgroundColor = (color: string) => {
    setBackgroundColor(color || "#fff");
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(refreshing);
    getLocation();
  }, [loading]);

  return (
    <View style={styles.container}>
      {/* <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      ></ScrollView> */}
      {loading ? (
        <Loading onLoad={handleBackgroundColor} />
      ) : (
        <Weather
          temp={temp}
          data={weatherData}
          loading={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // paddingTop: Constants.statusBarHeight
  },
  scrollView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
