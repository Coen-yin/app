import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

import {useTheme} from '../context/ThemeContext';

const TypingIndicator = () => {
  const {theme} = useTheme();
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.4)).current;
  const dot3Anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animateDots = () => {
      const createAnimation = (animValue, delay) =>
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0.4,
            duration: 400,
            useNativeDriver: true,
          }),
        ]);

      Animated.loop(
        Animated.parallel([
          createAnimation(dot1Anim, 0),
          createAnimation(dot2Anim, 200),
          createAnimation(dot3Anim, 400),
        ])
      ).start();
    };

    animateDots();
  }, [dot1Anim, dot2Anim, dot3Anim]);

  return (
    <View style={styles.container}>
      <View style={styles.messageRow}>
        {/* AI Avatar */}
        <View style={[styles.avatar, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
          <Text style={[styles.avatarText, {color: theme.accentPrimary}]}>T</Text>
        </View>

        {/* Typing Bubble */}
        <View style={[styles.typingBubble, {backgroundColor: theme.bgPrimary, borderColor: theme.borderLight}]}>
          <Text style={[styles.typingText, {color: theme.textSecondary}]}>
            Talkie Gen is thinking
          </Text>
          
          <View style={styles.dotsContainer}>
            <Animated.View
              style={[
                styles.dot,
                {
                  backgroundColor: theme.accentPrimary,
                  opacity: dot1Anim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  backgroundColor: theme.accentPrimary,
                  opacity: dot2Anim,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  backgroundColor: theme.accentPrimary,
                  opacity: dot3Anim,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 32,
  },
  typingText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});

export default TypingIndicator;