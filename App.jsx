/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Camera } from 'expo-camera';
import CurrencyConverter from './CurrencyConverter'; // Replace with the correct path
import CurrencyModal from './CurrencyModal'; // Replace with the correct path
import currencyData from './CurrencyData'; // Replace with the correct path

import { NativeModules } from 'react-native';

const App = () => {
 
    console.log("App reloaded!")
   
    const { TextRecognizer } = NativeModules;

    TextRecognizer.exampleMethod(
      'Party',
      result => {
        console.log(result);
      },
    );


    const apiKey = 'fca_live_sT5V2xA0sM7b79KKu6knetcS5XAL8nfC8TGOk4On'; // Replace with your actual API key
    const [exchangeRate, setExchangeRate] = useState(1);
    const [tentouConverter, setTentouConverter] = useState( 'n');

    
    /*const fetchExchangeRate = async (m1, m2) => {

      try {cameraRef
        setTentouConverter('s');
        const rate = await converter.getLatestExchangeRate(moeda1Status, moeda2Status);
        setExchangeRate(rate);
        console.log('Latest exchange rate:', exchangeRate);
      } catch (error) {
        setExchangeRate(-1);
      }
    };*/

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
          takeAndProcessPicture();
      }
    };

    const takeAndProcessPicture = async () => {
      if (cameraRef.current) {
        const options = { quality: 0.5, base64: true };
        const data = await cameraRef.current.takePictureAsync(options);
        TextRecognizer.processImage(
          data.uri,
          (result, error) => {
            if (error) {
              console.error("error", error);
            } else {
              console.log("processing", result);
              const regex = /\d+[\., ]\d{0,2}[\ \n]/g;
              const reg_result = result.match(regex);
              console.log("depois do regex", reg_result);
            }
          }
        );
        cameraRef.resumePreview()
        setCapturedImage(data.uri);
      }
    };

    const fetchExchangeRate = useCallback(async () => {
      try {
        setTentouConverter('s');
        const converter = new CurrencyConverter(apiKey);
        const rate = await converter.getLatestExchangeRate(moeda1Status, moeda2Status);
        setExchangeRate(rate);
        //console.log('Latest exchange rate:', exchangeRate);
      } catch (error) {
        setExchangeRate(-1);
      }
    }, [moeda1Status, moeda2Status]);
    
    const handleCurrencySelection = (selectedCurrency) => {
      if (selectedMoedaButton === 'moeda1') {
        setMoeda1Status(selectedCurrency.code);
      } else if (selectedMoedaButton === 'moeda2') {
        setMoeda2Status(selectedCurrency.code);
      }
    
      setIsCurrencyModalVisible(false);
    };
    
    useEffect(() => {
      if (moeda1Status !== null && moeda2Status !== null) {
        fetchExchangeRate();
      }
    }, [moeda1Status, moeda2Status, fetchExchangeRate]);

  
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

    /*const handleCurrencySelection = (selectedCurrency) => {
      if (selectedMoedaButton === 'moeda1') {
        setMoeda1Status(selectedCurrency.code);
        //console.log('moeda 1 atualizada {}', moeda1Status);
        //console.log('moeda 2 atualizada {}', moeda2Status);
      } else if (selectedMoedaButton === 'moeda2') {
        setMoeda2Status(selectedCurrency.code);
        //console.log('moeda 2 atualizada {}', moeda2Status);
      }
    
      setIsCurrencyModalVisible(false);
    
      // Check if both moeda1Status and moeda2Status are not null before fetching the exchange rate
      if (moeda1Status !== null && moeda2Status !== null) {
        console.log('entrou');
        fetchExchangeRate();
      }
    };*/

    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.exchangeRateContainer}>
          <Text style={styles.exchangeRateText}>
            Exchange Rate: {exchangeRate}
          </Text>
        </View>
                <View style={styles.exchangeRateContainer}>
          <Text style={styles.exchangeRateText}>
            Tentou?: {tentouConverter}
          </Text>
        </View>

        <View style={styles.exchangeRateContainer}>
          <Text style={styles.exchangeRateText}>
            Moeda1: {moeda1Status}
          </Text>
        </View>
        <View style={styles.exchangeRateContainer}>
          <Text style={styles.exchangeRateText}>
            Moeda2: {moeda2Status}
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
            pauseAfterCapture={false}
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


