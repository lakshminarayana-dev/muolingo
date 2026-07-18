import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const CIRCLE_SIZE = 52;
const TAB_HEIGHT = 64;

type TabConfig = {
  label: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
};

const TAB_CONFIGS: Record<string, TabConfig> = {
  home: {
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  learn: {
    label: "Learn",
    activeIcon: "book",
    inactiveIcon: "book-outline",
  },
  "ai-teacher": {
    label: "AI Teacher",
    activeIcon: "sparkles",
    inactiveIcon: "sparkles-outline",
  },
  chat: {
    label: "Chat",
    activeIcon: "chatbubbles",
    inactiveIcon: "chatbubbles-outline",
  },
  profile: {
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
};

export default function CustomTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabWidth = width / state.routes.length;

  const circleX = useSharedValue(
    state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2
  );

  useEffect(() => {
    circleX.value = withTiming(
      state.index * tabWidth + (tabWidth - CIRCLE_SIZE) / 2,
      { duration: 250, easing: Easing.out(Easing.cubic) }
    );
  }, [state.index, tabWidth, circleX]);

  const circleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: circleX.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.row}>
        <Animated.View style={[styles.circle, circleAnimStyle]} />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIGS[route.name];
          if (!config) return null;

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            >
              <Ionicons
                name={isFocused ? config.activeIcon : config.inactiveIcon}
                size={24}
                color={isFocused ? "#ffffff" : "#6b7280"}
              />
              {!isFocused && (
                <Text style={styles.label}>{config.label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    height: TAB_HEIGHT,
    flexDirection: "row",
    position: "relative",
  },
  circle: {
    position: "absolute",
    top: (TAB_HEIGHT - CIRCLE_SIZE) / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#6c4ef5",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  },
});
