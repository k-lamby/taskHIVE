import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import GlobalStyles from "../styles/styles";

const ActivityDetailModal = ({ activity, visible, onClose }) => {
  if (!activity) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{activity.type}</Text>

          {/* Uploaded By */}
          <Text style={styles.label}>Uploaded By: {activity.uploadedBy}</Text>

          {/* Timestamp */}
          <Text style={styles.label}>Date: {new Date(activity.timestamp).toLocaleString()}</Text>

          {/* Description */}
          {activity.description ? (
            <Text style={styles.modalText}>{activity.description}</Text>
          ) : (
            <Text style={styles.placeholderText}>No description provided.</Text>
          )}

          {/* Close Button */}
          <TouchableOpacity style={GlobalStyles.secondaryButton} onPress={onClose}>
            <Text style={GlobalStyles.secondaryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ===== Styles ===== //
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#001524",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  modalText: {
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontStyle: "italic",
    marginTop: 10,
  },
  label: {
    color: "#FFA500",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default ActivityDetailModal;