//================== TaskDetailModal.js ===========================//
// This modal is used to display and edit details for a specific task.
// It shows task name, description, assigned user, and due date.
// The modal now also includes the ability to:
// - Add messages and file uploads (documents & images) directly to the task.
// - Preview images/files before uploading.
// - Mark the task as completed with a confirmation prompt.
// - Improved modal styling to match the login modal.
// - Enhanced UX for attaching documents, images, and messages.
// - Icons for file, image, and message upload instead of buttons (using Font Awesome).
//========================================================//

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker"; // For file selection
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";
import { FontAwesome } from "@expo/vector-icons"; // Font Awesome Icons
import {
  fetchRecentActivities,
  addActivity,
} from "../services/activityService"; // Import activity functions

const TaskDetailModal = ({ task, visible, onClose, onUpdateTask }) => {
  // If task is undefined, show a loading state
  if (!task) {
    return (
      <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={GlobalStyles.headerText}>Loading Task...</Text>
            <ActivityIndicator size="large" color="orange" />
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Grab user details from context
  const { userId } = useUser();

  // Local state for managing task details
  const [assignedTo, setAssignedTo] = useState(task.owner);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle marking task as completed with confirmation
  const handleMarkAsDone = () => {
    Alert.alert(
      "Confirm Completion",
      "Are you sure you want to mark this task as done?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => { onUpdateTask({ ...task, status: "completed" }); onClose(); } },
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

  // Handle file selection
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*", multiple: false });
      if (result.canceled) return;
      const file = result.assets[0];
      setSelectedFile({ name: file.name, uri: file.uri, type: file.mimeType });
    } catch (error) {
      console.error("TaskDetailModal - Error selecting file:", error);
    }
  };

  // Handle image selection
  const handleImageUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*", multiple: false });
      if (result.canceled) return;
      const file = result.assets[0];
      setSelectedFile({ name: file.name, uri: file.uri, type: file.mimeType });
    } catch (error) {
      console.error("TaskDetailModal - Error selecting image:", error);
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
    } catch (error) {
      console.error("TaskDetailModal - Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={GlobalStyles.headerText}>{task.name}</Text>
          <Text style={GlobalStyles.normalText}>{task.description}</Text>
          <Text style={GlobalStyles.normalText}>Assigned To: {assignedTo}</Text>

          {/* Due Date */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={GlobalStyles.normalText}>Due Date: {dueDate.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker value={dueDate} mode="date" display="default" onChange={handleDueDateChange} />
          )}

          {/* Upload Options */}
          <View style={styles.uploadOptions}>
            <TouchableOpacity onPress={handleFileUpload} style={styles.uploadIcon}>
              <FontAwesome name="paperclip" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImageUpload} style={styles.uploadIcon}>
              <FontAwesome name="image" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadIcon} disabled={true}>
              <FontAwesome name="comment" size={30} color="gray" />
            </TouchableOpacity>
          </View>

          {/* File Preview */}
          {selectedFile && (
            <View style={styles.filePreview}>
              {selectedFile.type.includes("image") ? (
                <Image source={{ uri: selectedFile.uri }} style={styles.imagePreview} />
              ) : (
                <Text style={GlobalStyles.normalText}>{selectedFile.name}</Text>
              )}
            </View>
          )}

          {/* Upload Button */}
          <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleConfirmUpload} disabled={!selectedFile || uploading}>
            <Text style={GlobalStyles.primaryButtonText}>{uploading ? "Uploading..." : "Upload"}</Text>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ===== Page-Specific Styles ===== //
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    backgroundColor: "#001524",
    borderRadius: 10,
    alignItems: "center",
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginVertical: 10,
  },
  uploadIcon: {
    padding: 10,
  },
  filePreview: {
    marginTop: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  closeButton: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
});

export default TaskDetailModal;