import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  theme: any;
  headerRight?: React.ReactNode;
  /** 紧凑模式：减少 padding */
  compact?: boolean;
}

export function CollapsibleSection({
  title,
  subtitle,
  icon,
  iconColor,
  defaultExpanded = true,
  children,
  theme,
  headerRight,
  compact = false,
}: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rotateAnim = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 180,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [expanded, rotateAnim]);

  const toggle = () => {
    if (Platform.OS !== 'web') {
      try {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      } catch (_) {
        // LayoutAnimation may not be available on all platforms
      }
    }
    setExpanded((v) => !v);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        compact && styles.containerCompact,
      ]}
    >
      <TouchableOpacity
        style={[styles.header, compact && styles.headerCompact]}
        onPress={toggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${expanded ? '折叠' : '展开'} ${title}`}
      >
        {icon && (
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: (iconColor || theme.colors.primary) + '14' },
            ]}
          >
            <MaterialIcons
              name={icon as any}
              size={compact ? 14 : 16}
              color={iconColor || theme.colors.primary}
            />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.title,
              { color: theme.colors.text },
              compact && styles.titleCompact,
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {headerRight}
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <MaterialIcons
            name="expand-more"
            size={20}
            color={theme.colors.textTertiary}
          />
        </Animated.View>
      </TouchableOpacity>
      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  containerCompact: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  headerCompact: {
    paddingVertical: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  titleCompact: {
    fontSize: 13,
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
