/* eslint-disable prettier/prettier */
// Exemplo de OverlayPrice
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {useWindowDimensions } from 'react-native';


const OverlayPrice = ({ pricesAndPositions, exchangeRate, dimensions }) => {
  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = useWindowDimensions();

  // Check if pricesAndPositions is null or undefined
  if (!pricesAndPositions) {
    return null; // Render nothing if pricesAndPositions is null or undefined
  }

  return (
    <View style={styles.overlay}>
      {Object.entries(pricesAndPositions).map((priceAndPosition) => {
        console.log(priceAndPosition)
        let price = priceAndPosition[1][0];
        const { x, y } = priceAndPosition[1][1];
        console.log(price)
        console.log([x, y])
        // Adjust the position based on the original dimensions
        //console.log(typeof price);
        price = parseFloat(price) * parseFloat(exchangeRate);
        price = price.toFixed(2);
        //console.log(dimensions.width);
        //console.log(typeof dimensions.width);
        //const adjustedX = (x / dimensions.width) * (WINDOW_WIDTH); // Adjust to your needs
        //const adjustedY = (y / dimensions.height) * (WINDOW_HEIGHT-300); // Adjust to your needs
        const adjustedX = x // Adjust to your needs
        const adjustedY = y
        console.log([adjustedX, adjustedY]);
        console.log([adjustedX, adjustedY]);
        return (
          <Text
            key={price}
            style={{ position: 'absolute', 
                      left: adjustedX, 
                      top: adjustedY, 
                      color: '#e1e3e6',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      fontSize: 20,
                      padding: 5,
                      borderRadius: 10
                    }}
          >
            {price}
          </Text>
        );
      })}
    </View>
  );
};


// Exemplo de estilos para o OverlayComponent
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  exchangeRateText: { fontSize: 18, color: '#0000FF', fontWeight: 'bold' },

  // Outros estilos conforme necessário
});

export default OverlayPrice;
