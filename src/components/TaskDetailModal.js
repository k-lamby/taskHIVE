import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "../contexts/UserContext";
import GlobalStyles from "../styles/styles";

const TaskDetailModal = ({ task, visible, onClose, onUpdateTask }) => {
  const { userId } = useUser();
  const [assignedTo, setAssignedTo] = useState(task.owner);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isOwner = task.owner === userId;
  const isAssignedToUser = task.owner === userId;

  const handleMarkAsDone = () => {
    onUpdateTask({ ...task, status: "completed" });
    onClose();
  };

  const handleDueDateChange = (_, selectedDate) => {
    if (selectedDate) {
      setDueDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{task.name}</Text>
          <Text style={styles.modalText}>{task.description}</Text>

          {/* Assigned To */}
          <Text style={styles.label}>Assigned To: {assignedTo}</Text>

          {/* Due Date */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.label}>Due Date: {dueDate.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker value={dueDate} mode="date" display="default" onChange={handleDueDateChange} />
          )}

          {/* Mark as Done */}

            <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleMarkAsDone}>
              <Text style={GlobalStyles.primaryButtonText}>Mark as Done</Text>
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

// ===== Styles ===== //
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#15616D",
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
  },
  label: {
    color: "#FFA500",
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default TaskDetailModal;