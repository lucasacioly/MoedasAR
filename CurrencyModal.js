/* eslint-disable prettier/prettier */
// CurrencyModal.js
import React from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

const CurrencyModal = ({ isVisible, currencies, onSelect, onClose }) => {
    return (
      <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}> 
        <View style={styles.modalContainer}>
          <FlatList
            data={Object.values(currencies)}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelect(item)}>
                <View style={styles.rowContainer}>
                  <Text style={styles.text}>{item.code}</Text>
                  <Text style={styles.text}>{item.name}</Text>
                  <Text style={styles.text}>{item.symbol_native}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
    modal: {
        paddingTop: 200,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
});

export default CurrencyModal;
