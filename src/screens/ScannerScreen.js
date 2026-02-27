import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Vibration } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, IconButton, useTheme, Snackbar, Text, List, Divider, Card } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

export default function ScannerScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useCart();

  const subtotal = state.total;
  const tax = subtotal * 0.16;
  const total = (subtotal + tax).toFixed(2);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom, backgroundColor: '#000', justifyContent: 'center' }]}>
        <Text style={{ textAlign: 'center', color: '#fff' }}>Necesitamos permiso para usar la cámara</Text>
        <Button mode="contained" onPress={requestPermission} style={{ marginTop: 20, alignSelf: 'center' }}>
          Solicitar Permiso
        </Button>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    setLastScanned(data);
    Vibration.vibrate(100);
    
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
    }, 1500);
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQty = (id, newQty) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQty } });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Sección Superior: Cámara */}
      <View style={styles.cameraContainer}>
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
              {scanned ? '¡Añadido!' : 'Escanear producto'}
            </Text>
          </View>
        </View>
        <IconButton
          icon="close"
          size={24}
          iconColor="#fff"
          style={[styles.closeButton, { top: Math.max(insets.top, 10) }]}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Sección Inferior: Carrito Integrado */}
      <View style={styles.cartContainer}>
        <View style={styles.cartHeader}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Tu Compra</Text>
          <Text variant="bodySmall">{state.items.length} items</Text>
        </View>

        {state.items.length === 0 ? (
          <View style={styles.emptyCart}>
            <IconButton icon="barcode-scan" size={40} alpha={0.5} />
            <Text variant="bodyMedium" style={{ color: '#888' }}>Escanea productos para empezar</Text>
          </View>
        ) : (
          <FlatList
            data={state.items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.name}
                description={`$${parseFloat(item.price).toFixed(2)} c/u`}
                right={props => (
                  <View style={styles.itemRight}>
                    <View style={styles.qtyControls}>
                      <IconButton icon="minus" size={14} onPress={() => updateQty(item.id, item.quantity - 1)} />
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <IconButton icon="plus" size={14} onPress={() => updateQty(item.id, item.quantity + 1)} />
                    </View>
                    <IconButton icon="delete-outline" size={18} onPress={() => removeItem(item.id)} />
                  </View>
                )}
                style={styles.listItem}
              />
            )}
            ItemSeparatorComponent={Divider}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Resumen y Botón de Pago */}
        {state.items.length > 0 && (
          <Card style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <View style={styles.totalRow}>
              <View>
                <Text variant="bodySmall">Total con IVA (16%)</Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                  ${total}
                </Text>
              </View>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Receipt', { 
                  orderSummary: { subtotal, tax, total, items: state.items } 
                })}
                style={styles.payButton}
                contentStyle={{ height: 50 }}
              >
                Pagar
              </Button>
            </View>
          </Card>
        )}
      </View>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={1000}
        style={styles.snackbar}
      >
        Añadido: {lastScanned.slice(-8)}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    height: '35%',
    backgroundColor: '#000',
  },
  cartContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    overflow: 'hidden',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedContainer: {
    width: 200,
    height: 100,
    alignSelf: 'center',
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  listItem: {
    paddingVertical: 0,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
  },
  qtyText: {
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 15,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderRadius: 0,
    elevation: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payButton: {
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  snackbar: {
    marginBottom: 110,
  },
  cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#fff' },
  cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTopWidth: 3, borderRightWidth: 3, borderColor: '#fff' },
  cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#fff' },
  cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#fff' },
});
