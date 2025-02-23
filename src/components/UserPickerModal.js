import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useUser } from "../contexts/UserContext";

const { height, width } = Dimensions.get("window");

const UserPickerModal = ({ visible, onClose, onUserSelected, projectUsers }) => {
  console.log("📌 Received projectUsers in UserPickerModal:", projectUsers);

  const { userId, firstName } = useUser();
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(firstName);

  useEffect(() => {
    console.log("📌 Current user:", firstName);

    if (Array.isArray(projectUsers) && userId) {
      const usersArray = projectUsers.map((user) =>
        typeof user === "object"
          ? { id: user.id, name: user.name || "Unknown" }
          : { id: user, name: "Unknown" }
      );

      console.log("📌 Processed Users:", usersArray);

      const sortedUsers = [
        { id: userId, name: firstName || "You" },
        ...usersArray.filter((user) => user.id !== userId),
      ];

      setUserList(sortedUsers);
    }
  }, [projectUsers, userId, firstName]);

  console.log("📌 Selected User:", selectedUser);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select User</Text>

          <View style={styles.pickerContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              snapToInterval={50}
              decelerationRate="fast"
              contentContainerStyle={styles.scrollViewContent}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.y / 50);
                if (userList[index]) {
                  setSelectedUser(userList[index].name || "Unknown"); // ✅ Ensure it's a string
                }
              }}
            >
              {userList.map((user) => (
                <View key={user.id} style={styles.pickerItem}>
                  <Text style={[styles.pickerText, selectedUser === user.name && styles.selectedText]}>
                    {user.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              const selectedUserObject = userList.find((user) => user.name === selectedUser);
              if (selectedUserObject) {
                onUserSelected(selectedUserObject); // ✅ Pass full object
              }
              onClose();
            }}
          >
            <Text style={styles.confirmButtonText}>Select</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ===== Styles ===== //
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: "#001524",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "#FFF",
    marginBottom: 20,
  },
  pickerContainer: {
    height: 90,
    width: "100%",
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: "#00334E",
  },
  scrollViewContent: {
    alignItems: "center",
    paddingVertical: 50,
  },
  pickerItem: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerText: {
    fontSize: 18,
    color: "#BBB",
  },
  selectedText: {
    fontSize: 22,
    color: "#FFA500",
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#FFA500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#001524",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#FFA500",
    fontSize: 16,
  },
});

export default UserPickerModal;