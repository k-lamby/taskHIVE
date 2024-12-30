import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomDatePicker = ({ visible, onClose, onDateChange }) => {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const handleDone = () => {
        onDateChange(date); // Pass the selected date back to the parent
        onClose(); // Close the modal after selecting a date
    };

    const handleCancel = () => {
        onClose(); // Close the modal without making changes
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                    />
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.doneButton} onPress={handleDone}>
                            <Text style={styles.doneText}>Done</Text>
                        </Pressable>
                        <Pressable style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#220901', // Background color
        borderRadius: 20, // Rounded edges
        padding: 20,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    doneButton: {
        backgroundColor: '#688e26',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: '#Bc3908', // Optional: A different color for cancel
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
    },
    doneText: {
        color: 'white',
        textAlign: 'center',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default CustomDatePicker;