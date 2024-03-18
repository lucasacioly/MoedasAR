/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import CurrencyConverter from './CurrencyConverter'; // Replace with the correct path
import CurrencyModal from './CurrencyModal'; // Replace with the correct path
import currencyData from './CurrencyData'; // Replace with the correct path
import OverlayPrice from './OverlayPrice'; // Importe o componente de sobreposição

import { NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const playIcon = <Icon name="play" size={35} color="#000" />;
const pauseIcon = <Icon name="pause" size={35} color="#000" />;
const arrow = <Icon name="arrow-right" size={20} color="#fff" />;


const App = () => {
 
    console.log("App reloaded!")
    const apiKey = 'fca_live_sT5V2xA0sM7b79KKu6knetcS5XAL8nfC8TGOk4On'; // Replace with your actual API key
    const [exchangeRate, setExchangeRate] = useState(1);
    const [moeda1Status, setMoeda1Status] = useState("USD");
    const [moeda2Status, setMoeda2Status] = useState("BRL");
    const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
    const [selectedMoedaButton, setSelectedMoedaButton] = useState('');


    const [dimentions, setDimentions] = useState({'width':200, 'height':700});
    const [pricesAndPositions, setPricesAndPositions] = useState([]);

    const cameraRef = useRef(null);

    const [isCameraFrozen, setIsCameraFrozen] = useState(false); // Novo estado para controlar o congelamento da câmera

    const toggleFreezeFrame = () => {
      let cameraFrozen = isCameraFrozen;
      if (cameraFrozen) {
        cameraRef.current.resumePreview(); // Retomar a visualização da câmera
      } else {
          cameraRef.current.pausePreview(); // Pausar a visualização da câmera
      }
      setIsCameraFrozen(!isCameraFrozen); // Inverte o estado da câmera entre congelado e descongelado
    };

    useEffect(() => {
      if (moeda1Status !== null && moeda2Status !== null) {
        fetchExchangeRate();
      }
    }, [moeda1Status, moeda2Status, fetchExchangeRate]);

    const fetchExchangeRate = useCallback(async () => {
      try {
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


    const onTextRecognized = (textRecognizedEvent) => {
      const { textBlocks } = textRecognizedEvent;
      // Handle detected text here*/
      let texto = "";

      textBlocks.forEach(block => {
        // Verifica se o block tem a chave "value" e se seu valor é uma string
        if (block.hasOwnProperty("value") && typeof block.value === "string") {
            // Concatena o valor do block com um espaço em branco
            texto += block.value + " ";
        }
      });


      const regex = /\d+[.,]\d{0,2}[ \n]/g; // Expressão regular para encontrar textos relevantes
      let textosRelevantes = [];

      // Procura por correspondências na string concatenada usando a expressão regular
      const matches = texto.match(regex);
      
      if (!matches) {
        setPricesAndPositions(null);
        return;
      }

      // Se houver correspondências, adiciona-as à lista de textos relevantes
      textosRelevantes = matches.map(match => match.trim());
      console.log(textosRelevantes);



      let pricesPositions = [];

      // Itera sobre cada texto relevante
      textosRelevantes.forEach(textoRelevante => {
          // Itera sobre cada block para encontrar as coordenadas correspondentes
          textBlocks.forEach(block => {
              if (block.hasOwnProperty('value') && typeof block.value === "string") {
                  const value = block.value;
                  if (
                      value === textoRelevante ||
                      textoRelevante.includes(value) ||
                      value.includes(textoRelevante)
                  ) {
                      const position = {
                          x: block.bounds.origin.x,
                          y: block.bounds.origin.y,
                      };
                      console.log([textoRelevante, position])
                      pricesPositions.push([textoRelevante, position]);
                      // Para o texto relevante atual, encontrou uma correspondência, então podemos pular para o próximo texto relevante
                      return;
                  }
              }
          });
      });
      console.log(pricesPositions);

      setPricesAndPositions(pricesPositions);

    };


    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.exchangeRateContainer}>
          <Text style={styles.exchangeRateText}>
            Exchange Rate: {exchangeRate.toPrecision(3)}
          </Text>
        </View>

          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            captureAudio={false}
            pauseAfterCapture={false}
            onTextRecognized={onTextRecognized}
             // Defina o estado da câmera com base no valor de isCameraFrozen
             autoFocus={isCameraFrozen ? RNCamera.Constants.AutoFocus.off : RNCamera.Constants.AutoFocus.on}
             flashMode={isCameraFrozen ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.auto}
          />

        <OverlayPrice pricesAndPositions={pricesAndPositions} exchangeRate={exchangeRate} dimentions={dimentions} />

        <View style={styles.topButtonsContainer}>
          {/*Botão Moeda DE*/}
          <TouchableOpacity style={styles.moedaButton} onPress={handleMoeda1Press}>
            <Text style={styles.buttonText}>{moeda1Status || 'c1'}</Text>
          </TouchableOpacity>
          {arrow}
          {/*Botão Moeda PARA*/}
          <TouchableOpacity style={styles.moedaButton} onPress={handleMoeda2Press}>
            <Text style={styles.buttonText}>{moeda2Status || 'c2'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFreezeFrame} style={styles.playPause}>
              {(isCameraFrozen) ? (
                playIcon
              ) : (
                pauseIcon
              )}
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
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    bottom: 0, // Define a posição inferior como 0 para posicionar na parte inferior da tela
    left: 0, // Define a posição esquerda como 0 para alinhar à esquerda
    right: 0, // Define a posição direita como 0 para alinhar à direita
    zIndex: 1, // Define a ordem de empilhamento para garantir que esta View esteja acima dos outros elementos
  },


  playPause: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 100
  },

  moedaButton: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 10
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    position: 'absolute',
    top: 0, // Define a posição inferior como 0 para posicionar na parte inferior da tela
    left: 0, // Define a posição esquerda como 0 para alinhar à esquerda
    right: 0, // Define a posição direita como 0 para alinhar à direita
    zIndex: 1, // Define a ordem de empilhamento para garantir que esta View esteja acima dos outros elementos
  },
  exchangeRateText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },

});

export default App;


