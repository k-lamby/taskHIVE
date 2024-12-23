import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchTasks, createTask } from '../services/taskService';

const ProjectDetailScreen = () => {
  const route = useRoute();
  const { projectId } = route.params; // Get projectId from navigation params
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Fetch tasks when the component mounts
  useEffect(() => {
    const getTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(projectId);
        fetchedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    getTasks();
  }, [projectId]);

  // Handle adding a new task
  const handleAddTask = async () => {
    try {
      await createTask(projectId, taskName, new Date(dueDate), 'userId'); // Replace 'userId' with actual user ID
      setTaskName('');
      setDueDate('');
      // Re-fetch tasks
      const updatedTasks = await fetchTasks(projectId);
      updatedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Project Tasks</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        required
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.name} - Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, marginBottom: 20 },
  input: { borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
  taskItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default ProjectDetailScreen;