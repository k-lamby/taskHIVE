//================== TaskDetailModal.js ===========================//
// This modal is used to display and edit details for a specific task.
// It shows task name, description, assigned user, and due date.
// The modal now also includes the ability to:
// - Add messages and file uploads (documents & images) directly to the task.
// - Preview images/files before uploading.
// - Mark the task as completed with a confirmation prompt.
//========================================================//

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker"; // For file selection
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";
import {
  fetchRecentActivities,
  addActivity,
} from "../services/activityService"; // Import activity functions

const TaskDetailModal = ({ task, visible, onClose, onUpdateTask }) => {
  // Grab user details from context
  const { userId } = useUser();

  // Local state for managing task details
  const [assignedTo, setAssignedTo] = useState(task.owner);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State for managing activities
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch activities when the modal opens
  useEffect(() => {
    if (visible) {
      fetchActivities();
    }
  }, [visible]);

  // Fetch recent activities related to this task
  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const fetchedActivities = await fetchRecentActivities(task.projectId, task.id);
      setActivities(fetchedActivities);
    } catch (error) {
      console.error("TaskDetailModal - Error fetching activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Handle marking task as completed with confirmation
  const handleMarkAsDone = () => {
    Alert.alert(
      "Confirm Completion",
      "Are you sure you want to mark this task as done?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            onUpdateTask({ ...task, status: "completed" });
            onClose();
          },
        },
      ]
    );
  };

  // Handle due date change
  const handleDueDateChange = (_, selectedDate) => {
    if (selectedDate) {
      setDueDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  // Handle adding a new message to the task
  const handleAddMessage = async () => {
    if (!newMessage.trim()) return; // Prevent empty messages

    try {
      await addActivity(task.projectId, task.id, {
        type: "message",
        content: newMessage,
        timestamp: new Date(),
        userId,
      });
      setNewMessage("");
      fetchActivities(); // Refresh the activity list
    } catch (error) {
      console.error("TaskDetailModal - Error adding message:", error);
    }
  };

  // Handle file selection
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: false,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setSelectedFile({ name: file.name, uri: file.uri, type: file.mimeType });
    } catch (error) {
      console.error("TaskDetailModal - Error selecting file:", error);
    }
  };

  // Handle confirming file upload
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await addActivity(task.projectId, task.id, {
        type: "file",
        content: selectedFile.name,
        fileUrl: selectedFile.uri,
        timestamp: new Date(),
        userId,
      });
      setSelectedFile(null);
      fetchActivities(); // Refresh the activity list
    } catch (error) {
      console.error("TaskDetailModal - Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={GlobalStyles.modalContainer}>
        <View style={GlobalStyles.sectionContainer}>
          {/* Task Details */}
          <Text style={GlobalStyles.headerText}>{task.name}</Text>
          <Text style={GlobalStyles.normalText}>{task.description}</Text>

          {/* Assigned To */}
          <Text style={GlobalStyles.subheaderText}>Assigned To: {assignedTo}</Text>

          {/* Due Date */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={GlobalStyles.subheaderText}>Due Date: {dueDate.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker value={dueDate} mode="date" display="default" onChange={handleDueDateChange} />
          )}

          {/* Mark as Done */}
          <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleMarkAsDone}>
            <Text style={GlobalStyles.primaryButtonText}>Mark as Done</Text>
          </TouchableOpacity>

          {/* Upload File Section */}
          <Text style={GlobalStyles.sectionTitle}>Attach a Document/Image</Text>
          <TouchableOpacity style={GlobalStyles.secondaryButton} onPress={handleFileUpload}>
            <Text style={GlobalStyles.secondaryButtonText}>Select File</Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={GlobalStyles.listItem}>
              {selectedFile.type.includes("image") ? (
                <Image source={{ uri: selectedFile.uri }} style={{ width: 100, height: 100, borderRadius: 5 }} />
              ) : (
                <Text style={GlobalStyles.normalText}>{selectedFile.name}</Text>
              )}
              <TouchableOpacity style={GlobalStyles.smallPrimaryButton} onPress={handleConfirmUpload} disabled={uploading}>
                <Text style={GlobalStyles.smallButtonText}>{uploading ? "Uploading..." : "Upload"}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Add New Message */}
          <TextInput
            style={GlobalStyles.textInput}
            placeholder="Add a message..."
            placeholderTextColor="#ccc"
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={GlobalStyles.secondaryButton} onPress={handleAddMessage}>
            <Text style={GlobalStyles.secondaryButtonText}>Send Message</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity style={GlobalStyles.secondaryButton} onPress={onClose}>
            <Text style={GlobalStyles.secondaryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TaskDetailModal;