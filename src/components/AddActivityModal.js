import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { selectFile, uploadFile } from "../services/storageService";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

const AddActivityModal = ({ visible, onClose, projectId }) => {
  const [activityType, setActivityType] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const user = auth.currentUser;

  // ✅ Handle text message submission
  const handleAddMessage = async () => {
    if (!user) {
      setError("You must be logged in to add an activity.");
      return;
    }
    if (!message.trim()) {
      setError("Message cannot be empty!");
      return;
    }

    setUploading(true);
    try {
      await addDoc(collection(db, "projects", projectId, "activities"), {
        type: "message",
        content: message,
        timestamp: new Date(),
        userId: user.uid,
      });
      setMessage("");
      onClose();
    } catch (err) {
      console.error("❌ Error adding message:", err);
      setError("Failed to add message. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Handle file selection and upload
  const handleFileUpload = async (mediaType) => {
    setUploading(true);
    setError("");

    try {
      const file = await selectFile(mediaType);
      if (!file) {
        setUploading(false);
        return;
      }

      const filePath = `activities/${projectId}/${Date.now()}_${file.fileName}`;
      const downloadURL = await uploadFile(file.uri, filePath, (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });

      await addDoc(collection(db, "projects", projectId, "activities"), {
        type: mediaType === "image" ? "image" : "document",
        content: downloadURL,
        fileName: file.fileName,
        timestamp: new Date(),
        userId: user.uid,
      });
    } catch (err) {
      console.error("❌ File upload failed:", err);
      setError("File upload failed. Please try again.");
    }

    setUploading(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Activity</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {!activityType && (
            <>
              <TouchableOpacity onPress={() => setActivityType("message")} style={styles.optionButton}>
                <Text style={styles.optionText}>Add Message</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFileUpload("image")} style={styles.optionButton}>
                <Text style={styles.optionText}>Upload Image</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFileUpload("document")} style={styles.optionButton}>
                <Text style={styles.optionText}>Upload Document</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {uploading && <ActivityIndicator size="large" color="#1E90FF" />}
        </View>
      </View>
    </Modal>
  );
};

// ✅ Add the missing `styles` object
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FF0000",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default AddActivityModal;