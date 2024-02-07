/* eslint-disable prettier/prettier */
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Camera } from 'expo-camera';
import CurrencyConverter from './CurrencyConverter'; // Replace with the correct path
import CurrencyModal from './CurrencyModal'; // Replace with the correct path
import currencyData from './CurrencyData'; // Replace with the correct path



const App = () => {

    const apiKey = 'fca_live_sT5V2xA0sM7b79KKu6knetcS5XAL8nfC8TGOk4On'; // Replace with your actual API key
    const converter = new CurrencyConverter(apiKey);
    const [exchangeRate, setExchangeRate] = useState(1);

    const fetchExchangeRate = async () => {
      try {
        let rate = await converter.getLatestExchangeRate(moeda1Status, moeda2Status);
        setExchangeRate(rate);
        console.log('Latest exchange rate:', exchangeRate);
        // Now you can use the exchange rate as needed
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    const [isCameraFrozen, setIsCameraFrozen] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const cameraRef = useRef(null);

    const [moeda1Status, setMoeda1Status] = useState(null);
    const [moeda2Status, setMoeda2Status] = useState(null);

    const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
    const [selectedMoedaButton, setSelectedMoedaButton] = useState('');

    const toggleFreezeFrame = async () => {
      setIsCameraFrozen(!isCameraFrozen);

      if (cameraRef.current) {
        if (!isCameraFrozen) {
          // Se não estiver congelada, congela a câmera e tira uma foto
          const options = { quality: 0.5, base64: true };
          cameraRef.current.pausePreview();
          const data = await cameraRef.current.takePictureAsync(options);
          setCapturedImage(data.uri);
        } else {
          // Se estiver congelada, retoma a visualização da câmera
          setCapturedImage(null);
          cameraRef.current.resumePreview();

        }
      }
    };

  
    const closeCurrencyModal = () => {
      setIsCurrencyModalVisible(false);
    };

    const handleMoeda1Press = () => {
      setSelectedMoedaButton('moeda1');
      setIsCurrencyModalVisible(true);
    };
  
    const handleMoeda2Press = () => {
      setSelectedMoedaButton('moeda2');
      setIsCurrencyModalVisible(true);
    };

    const handleCurrencySelection = (selectedCurrency) => {
      if (selectedMoedaButton === 'moeda1') {
        setMoeda1Status(selectedCurrency.code);
      } else if (selectedMoedaButton === 'moeda2') {
        setMoeda2Status(selectedCurrency.code);
      }
    
      setIsCurrencyModalVisible(false);
    
      // Check if both moeda1Status and moeda2Status are not null before fetching the exchange rate
      if (moeda1Status !== null && moeda2Status !== null) {
        fetchExchangeRate();
      }
    };

    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.exchangeRateContainer}>
          <Text style={styles.exchangeRateText}>
            Exchange Rate: {exchangeRate}
          </Text>
        </View>
        <View style={styles.exchangeRateContainer}>
          <Text style={styles.exchangeRateText}>
            Camera Status: {isCameraFrozen ? 'Frozen' : 'Unfrozen'}
          </Text>
        </View>


        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.preview} />
        ) : (
          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            captureAudio={false}
          />
        )}

      <View style={styles.topButtonsContainer}>
        {/*Botão Moeda DE*/}
        <TouchableOpacity style={styles.moedaButton} onPress={handleMoeda1Press}>
          <Text style={styles.buttonText}>{moeda1Status || 'Select Currency'}</Text>
        </TouchableOpacity>

        {/*Botão Moeda PARA*/}
        <TouchableOpacity style={styles.moedaButton} onPress={handleMoeda2Press}>
          <Text style={styles.buttonText}>{moeda2Status || 'Select Currency'}</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={toggleFreezeFrame} style={styles.button}>
            <Text style={styles.buttonText}>
              {' '}
              {isCameraFrozen ? 'Unfreeze Frame' : 'Freeze Frame'}{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <CurrencyModal
          isVisible={isCurrencyModalVisible}
          currencies={currencyData.data}
          onSelect={handleCurrencySelection}
          onClose={closeCurrencyModal}
        />
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', backgroundColor: 'black' },
  preview: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },


  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },

  moedaButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    paddingHorizontal: 15,
    marginHorizontal: 40,
  },

  buttonContainer: { flex: 0, flexDirection: 'row', justifyContent: 'center' },

  button: {
    flex: 0,
    backgroundColor: '#fff',
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  buttonText: { fontSize: 14, color: 'black'},

  exchangeRateContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exchangeRateText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },

});

export default App;


