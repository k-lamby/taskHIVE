//================== CustomDataPicker.js ===========================//
// This component displays a modal date picker in a spinner format that allows
// the user to select a date. The modal remains open until the users confirms
// the selection. 
// The selected date is passed back to the parent through the callback
//===============================================================//

import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import GlobalStyles from '../styles/styles';

// https://www.npmjs.com/package/@react-native-community/datetimepicker
const CustomDatePicker = ({ visible, onClose, onDateChange, title }) => {
    // use state to hold the date that is being selected
    const [date, setDate] = useState(new Date());

    // handler for when the user changes the date picker
    const handleDateChange = (event, selectedDate) => {
        // check for the selected date or use the existing state
        const currentDate = selectedDate || date;
        // update the date state with the new value
        setDate(currentDate); 
    };

    // Called when the user hits the done button
    const handleDone = () => {
        // pass the date back to the parent
        onDateChange(date);
        // then close the modal
        onClose();
    };

    // Called when the user hits the cancel button
    const handleCancel = () => {
        // close the modal with no changes to the date
        onClose(); 
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Custom title for the modal */}
                    <Text style={GlobalStyles.headerText}>{title}</Text>
                    <DateTimePicker
                        value={date}
                        mode="date" 
                        display="spinner"
                        // handler for when the date changes
                        onChange={handleDateChange}
                    />
                    {/* Button container */}
                    <View style={styles.buttonContainer}>
                        <Pressable style={GlobalStyles.smallSecondaryButton} onPress={handleDone}>
                            <Text style={GlobalStyles.smallButtonText}>Done</Text>
                        </Pressable>
                        <Pressable style={GlobalStyles.smallPrimaryButton} onPress={handleCancel}>
                            <Text style={GlobalStyles.smallButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#220901', 
        borderRadius: 20,
        padding: 20, 
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
});

export default CustomDatePicker;