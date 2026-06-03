import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../../store';
import { Task, Priority, TaskStatus } from '../../types';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete?: (taskId: string) => void;
  showCheckbox?: boolean;
  compact?: boolean;
}

const PRIORITY_LABEL: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '紧急',
  critical: '严重',
};

const STATUS_ICON: Record<TaskStatus, keyof typeof MaterialIcons.glyphMap> = {
  'todo': 'circle',
  'in-progress': 'play-circle',
  'waiting': 'hourglass-empty',
  'delegated': 'person',
  'completed': 'check-circle',
  'cancelled': 'cancel',
  'on-hold': 'pause-circle',
};

export const TaskCard = React.memo(function TaskCard({
  task,
  onPress,
  onToggleComplete,
  showCheckbox = true,
  compact = false,
}: TaskCardProps) {
  const { theme, categories, tags } = useAppStore();

  const category = categories.find((c) => c.id === task.categoryId);
  const taskTags = tags.filter((t) => task.tags.includes(t.id));

  const getPriorityColor = (priority: Priority): string => {
    const colors = {
      low: theme.colors.priorities.low,
      medium: theme.colors.priorities.medium,
      high: theme.colors.priorities.high,
      urgent: theme.colors.priorities.urgent,
      critical: theme.colors.priorities.critical,
    };
    return colors[priority] || theme.colors.textSecondary;
  };

  const getStatusColor = (status: TaskStatus): string => {
    const colors: Record<string, string> = {
      'todo': theme.colors.status.todo,
      'in-progress': theme.colors.status['in-progress'],
      'waiting': theme.colors.status.waiting,
      'delegated': theme.colors.status.delegated,
      'completed': theme.colors.status.completed,
      'cancelled': theme.colors.status.cancelled,
      'on-hold': theme.colors.status['on-hold'],
    };
    return colors[status] || theme.colors.textSecondary;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date as string | number);
    if (isNaN(d.getTime())) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskDate = new Date(d);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) return '今天';
    if (taskDate.getTime() === tomorrow.getTime()) return '明天';
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const priorityColor = getPriorityColor(task.priority);

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactCard,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`任务：${task.title}，${task.completed ? '已完成' : '未完成'}，优先级：${PRIORITY_LABEL[task.priority]}`}
      >
        {showCheckbox && (
          <TouchableOpacity
            style={[
              styles.checkbox,
              {
                borderColor: task.completed ? theme.colors.success : theme.colors.borderStrong,
                backgroundColor: task.completed ? theme.colors.success : 'transparent',
              },
            ]}
            onPress={() => onToggleComplete?.(task.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.completed }}
            accessibilityLabel={task.completed ? '标记为未完成' : '标记为已完成'}
          >
            {task.completed && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
          </TouchableOpacity>
        )}
        <View style={[styles.priorityStripe, { backgroundColor: priorityColor }]} />
        <View style={styles.compactContent}>
          <Text
            style={[
              styles.compactTitle,
              { color: task.completed ? theme.colors.textTertiary : theme.colors.text },
              task.completed && styles.completed,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          {task.dueDate && (
            <Text
              style={[
                styles.compactDate,
                { color: isOverdue ? theme.colors.error : theme.colors.textTertiary },
              ]}
            >
              {formatDate(task.dueDate)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {showCheckbox && (
        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              borderColor: task.completed ? theme.colors.success : theme.colors.borderStrong,
              backgroundColor: task.completed ? theme.colors.success : 'transparent',
            },
          ]}
          onPress={() => onToggleComplete?.(task.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {task.completed && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            <Text
              style={[
                styles.title,
                {
                  color: task.completed ? theme.colors.textTertiary : theme.colors.text,
                },
                task.completed && styles.completed,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
          </View>
          {task.status !== 'todo' && task.status !== 'completed' && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '14' }]}>
              <MaterialIcons
                name={STATUS_ICON[task.status]}
                size={11}
                color={getStatusColor(task.status)}
                style={{ marginRight: 3 }}
              />
              <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                {task.status === 'in-progress' ? '进行中' : task.status === 'waiting' ? '等待' : task.status === 'delegated' ? '委托' : task.status === 'cancelled' ? '取消' : '暂停'}
              </Text>
            </View>
          )}
        </View>

        {task.description && (
          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        )}

        <View style={styles.meta}>
          {category && (
            <View style={[styles.metaChip, { backgroundColor: category.color + '14' }]}>
              <View style={[styles.metaChipDot, { backgroundColor: category.color }]} />
              <Text style={[styles.metaChipText, { color: category.color }]}>{category.name}</Text>
            </View>
          )}

          {task.priority !== 'medium' && (
            <View style={[styles.metaChip, { backgroundColor: priorityColor + '14' }]}>
              <MaterialIcons
                name="flag"
                size={11}
                color={priorityColor}
                style={{ marginRight: 3 }}
              />
              <Text style={[styles.metaChipText, { color: priorityColor }]}>
                {PRIORITY_LABEL[task.priority]}
              </Text>
            </View>
          )}

          {taskTags.slice(0, 2).map((tag) => (
            <View key={tag.id} style={[styles.metaChip, { backgroundColor: tag.color + '14' }]}>
              <Text style={[styles.metaChipText, { color: tag.color }]}>#{tag.name}</Text>
            </View>
          ))}

          {task.dueDate && (
            <View style={styles.metaChip}>
              <MaterialIcons
                name="schedule"
                size={11}
                color={isOverdue ? theme.colors.error : theme.colors.textTertiary}
                style={{ marginRight: 3 }}
              />
              <Text
                style={[
                  styles.metaChipText,
                  { color: isOverdue ? theme.colors.error : theme.colors.textTertiary },
                ]}
              >
                {formatDate(task.dueDate)}
              </Text>
            </View>
          )}
        </View>

        {(task.subtasks.length > 0 ||
          task.attachments.length > 0 ||
          task.comments.length > 0 ||
          task.estimatedTime) && (
          <View style={styles.footer}>
            {task.subtasks.length > 0 && (
              <View style={styles.footerItem}>
                <MaterialIcons name="checklist" size={13} color={theme.colors.textTertiary} />
                <Text style={styles.footerText}>{task.subtasks.length}</Text>
              </View>
            )}
            {task.attachments.length > 0 && (
              <View style={styles.footerItem}>
                <MaterialIcons name="attach-file" size={13} color={theme.colors.textTertiary} />
                <Text style={styles.footerText}>{task.attachments.length}</Text>
              </View>
            )}
            {task.comments.length > 0 && (
              <View style={styles.footerItem}>
                <MaterialIcons name="chat-bubble-outline" size={13} color={theme.colors.textTertiary} />
                <Text style={styles.footerText}>{task.comments.length}</Text>
              </View>
            )}
            {task.estimatedTime && (
              <View style={styles.footerItem}>
                <MaterialIcons name="timer" size={13} color={theme.colors.textTertiary} />
                <Text style={styles.footerText}>{task.estimatedTime}m</Text>
              </View>
            )}
            {task.isRecurring && (
              <View style={styles.footerItem}>
                <MaterialIcons name="sync" size={13} color={theme.colors.info} />
              </View>
            )}
          </View>
        )}

        {task.progress > 0 && task.progress < 100 && (
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: theme.colors.divider },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${task.progress}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              {task.progress}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    marginVertical: 4,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 3,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  priorityStripe: {
    width: 3,
    height: 24,
    borderRadius: 2,
    marginRight: 10,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    marginTop: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  content: {
    flex: 1,
  },
  compactContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
    gap: 5,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  metaChipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  compactDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
});
