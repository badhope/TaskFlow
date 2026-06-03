import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Button } from './Button';
import { useAppStore } from '../../store';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

// App-level error boundary. A render error in any screen would otherwise
// blank the whole navigator with no way to recover; this catches it and
// shows a fallback with the stack so the user can report it (and retry).
// Kept dumb on purpose: no remote logging, no AsyncStorage dump — we
// don't have either and silent error storage is worse than console.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  // Class components can't use hooks, so the fallback reads theme via
  // getState() (a direct store call, not a hook) at render time. This
  // is the documented Zustand pattern for non-hook contexts.
  render(): React.ReactNode {
    if (!this.state.error) return this.props.children;

    const { theme } = useAppStore.getState();
    const err = this.state.error;

    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          页面出了点问题
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          应用已自动恢复，你可以继续使用其他功能。
        </Text>
        <ScrollView style={styles.traceBox} contentContainerStyle={styles.traceContent}>
          <Text
            style={[styles.trace, { color: theme.colors.text }]}
            selectable
            accessibilityLabel="错误详情"
          >
            {err.name}: {err.message}
            {Platform.OS === 'web' && err.stack ? `\n\n${err.stack}` : ''}
          </Text>
        </ScrollView>
        <Button title="重试" onPress={this.reset} fullWidth />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 20, lineHeight: 20 },
  traceBox: { flex: 1, marginBottom: 20, maxHeight: 280 },
  traceContent: {
    padding: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  trace: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    lineHeight: 18,
  },
});
