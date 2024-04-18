import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList, TextInput, Button, Alert,
} from 'react-native';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Task 1', status: 'todo', deadline: '2024-04-30' },
    { id: 2, title: 'Task 2', status: 'todo', deadline: '2024-05-05' },
    { id: 3, title: 'Task 3', status: 'progress', deadline: '2024-04-25' },
    { id: 4, title: 'Task 4', status: 'done', deadline: '2024-04-20' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  const addNewTask = () => {
    const newTask = {
      id: tasks.length + 1,
      title: newTaskTitle,
      status: 'todo',
      deadline: newTaskDeadline
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDeadline('');
  };

  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const selectStatus = (task) => {
    Alert.alert(
      "Move Task",
      "Select the status you want to move the task to or delete the task:",
      [
        { text: "To Do", onPress: () => moveTask(task.id, "todo") },
        { text: "In Progress", onPress: () => moveTask(task.id, "progress") },
        { text: "Done", onPress: () => moveTask(task.id, "done") },
        { text: "Delete Task", onPress: () => deleteTask(task.id), style: "destructive" },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new task"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter deadline (YYYY-MM-DD)"
          value={newTaskDeadline}
          onChangeText={setNewTaskDeadline}
        />
        <Button title="Add Task" onPress={addNewTask} disabled={!newTaskTitle || !newTaskDeadline} />
      </View>
      {['todo', 'progress', 'done'].map(status => (
        <TaskColumn key={status} status={status} tasks={tasks} selectStatus={selectStatus} />
      ))}
    </ScrollView>
  );
};

const TaskColumn = ({ status, tasks, selectStatus }) => {
  return (
    <View style={[styles.column, { borderColor: colors[status] }]}>
      <Text style={styles.columnTitle}>{status.toUpperCase()}</Text>
      <FlatList
        data={tasks.filter(task => task.status === status)}
        renderItem={({ item }) => (
          <TaskItem task={item} selectStatus={selectStatus} />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const TaskItem = ({ task, selectStatus }) => (
  <TouchableOpacity
    style={[styles.taskItem, { borderColor: colors[task.status] }]}
    onPress={() => selectStatus(task)}
  >
    <Text style={styles.taskText}>{task.title}</Text>
    <Text style={styles.taskDeadline}>Deadline: {task.deadline}</Text>
  </TouchableOpacity>
);

const colors = {
  todo: '#f28b82',
  progress: '#fbbc04',
  done: '#ccff90'
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  column: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 2,
  },
  taskText: {
    fontSize: 16,
  },
  taskDeadline: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});

export default KanbanBoard;
