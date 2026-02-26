import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, IconButton, useTheme, Snackbar, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

export default function ScannerScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { dispatch } = useCart();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <Text style={{ textAlign: 'center', color: '#fff' }}>{`Necesitamos permiso para usar la cámara`}</Text>
        <Button mode="contained" onPress={requestPermission} style={{ marginTop: 20 }}>
          {`Solicitar Permiso`}
        </Button>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    setLastScanned(data);
    
    const mockProduct = {
      id: data,
      name: `Producto AEG ${data.slice(-4)}`,
      price: (Math.random() * 100 + 10).toFixed(2),
      barcode: data
    };
    
    dispatch({ type: 'ADD_ITEM', payload: mockProduct });
    setVisible(true);

    setTimeout(() => {
      setScanned(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "code128"],
        }}
      />
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>
        <View style={styles.focusedContainer}>
          <View style={[styles.cornerTopLeft, { borderColor: scanned ? theme.colors.primary : '#fff' }]}></View>
          <View style={[styles.cornerTopRight, { borderColor: scanned ? theme.colors.primary : '#fff' }]}></View>
          <View style={[styles.cornerBottomLeft, { borderColor: scanned ? theme.colors.primary : '#fff' }]}></View>
          <View style={[styles.cornerBottomRight, { borderColor: scanned ? theme.colors.primary : '#fff' }]}></View>
        </View>
        <View style={styles.unfocusedContainer}>
          <Text style={styles.instructionText}>
            {scanned ? `¡Producto Añadido!` : `Alinea el código de barras aquí`}
          </Text>
        </View>
      </View>
      
      <IconButton
        icon="close"
        size={30}
        iconColor="#fff"
        style={[styles.closeButton, { top: Math.max(insets.top, 20) }]}
        onPress={() => navigation.goBack()}
      />

      <Button 
        mode="contained" 
        icon="cart" 
        onPress={() => navigation.navigate('Cart')}
        style={[styles.viewCartButton, { bottom: Math.max(insets.bottom, 20) }]}
      >
        {`Ver Carrito`}
      </Button>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={1500}
        action={{
          label: 'Ver',
          onPress: () => navigation.navigate('Cart'),
        }}
      >
        {`Añadido: ${lastScanned}`}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedContainer: {
    width: 280,
    height: 180,
    alignSelf: 'center',
    borderColor: 'transparent',
    borderWidth: 2,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  viewCartButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: '60%',
  },
  // Corner markers
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#fff' },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#fff' },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#fff' },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#fff' },
});
