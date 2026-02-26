import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Text, Button, Card, Divider, IconButton, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

export default function ReceiptScreen({ route, navigation }) {
  const { orderSummary } = route.params;
  const { dispatch } = useCart();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const date = new Date().toLocaleString();

  const handleFinish = () => {
    dispatch({ type: 'CLEAR_CART' });
    navigation.popToTop();
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f0f0f0' }]}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { 
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 20) 
          }
        ]}
      >
        <Card style={styles.receiptCard}>
          <Card.Content>
            <View style={styles.receiptHeader}>
              <Title style={styles.brand}>{`AEG FISCAL`}</Title>
              <Text variant="labelSmall">{`SCAN & GO PARTNER`}</Text>
              <Text variant="labelSmall">{`RIF: J-00000000-1`}</Text>
              <Text variant="labelSmall">{`${date}`}</Text>
            </View>

            <Divider style={styles.divider} />

            {orderSummary.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={{ flex: 2 }}>
                  <Text variant="bodyMedium" style={{ fontWeight: '500' }}>{`${item.name}`}</Text>
                  <Text variant="bodySmall">{`${item.quantity} x $${parseFloat(item.price).toFixed(2)}`}</Text>
                </View>
                <Text style={styles.itemTotal}>
                  {`$${(parseFloat(item.price) * item.quantity).toFixed(2)}`}
                </Text>
              </View>
            ))}

            <Divider style={styles.divider} />

            <View style={styles.totalContainer}>
              <View style={styles.totalRow}>
                <Text variant="bodyMedium">{`SUBTOTAL`}</Text>
                <Text variant="bodyMedium">{`$${orderSummary.subtotal.toFixed(2)}`}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text variant="bodyMedium">{`IVA (16%)`}</Text>
                <Text variant="bodyMedium">{`$${orderSummary.tax.toFixed(2)}`}</Text>
              </View>
              <View style={[styles.totalRow, { marginTop: 10 }]}>
                <Title style={styles.grandTotal}>{`TOTAL`}</Title>
                <Title style={[styles.grandTotal, { color: theme.colors.primary }]}>
                  {`$${orderSummary.total}`}
                </Title>
              </View>
            </View>

            <Divider style={styles.divider} />
            
            <View style={styles.qrContainer}>
              <View style={styles.mockQR}>
                <IconButton icon="qrcode-scan" size={100} iconColor="#000" />
                <Text variant="labelSmall">{`ESCANEAR PARA VALIDAR SALIDA`}</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.serial}>{`SERIAL FISCAL: AEG-SG-2024-X99`}</Text>
              <Text style={styles.fiscalMsg}>{`*** FACTURA FISCAL DIGITAL ***`}</Text>
              <Text variant="bodySmall" style={{ marginTop: 10, color: '#aaa' }}>
                {`Gracias por confiar en AEG Pay`}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button 
          mode="contained" 
          onPress={handleFinish}
          style={styles.doneButton}
          icon="check-circle"
        >
          {`Finalizar y Volver al Inicio`}
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  receiptCard: {
    width: '100%',
    padding: 5,
    backgroundColor: '#fff',
    elevation: 4,
    borderRadius: 0,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  brand: {
    fontWeight: 'bold',
    letterSpacing: 3,
    color: '#000',
  },
  divider: {
    marginVertical: 15,
    height: 1,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemTotal: {
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1,
  },
  grandTotal: {
    fontWeight: '900',
    fontSize: 22,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  mockQR: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#eee',
    alignItems: 'center',
    borderRadius: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  serial: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  fiscalMsg: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 12,
  },
  doneButton: {
    marginTop: 30,
    width: '100%',
    borderRadius: 8,
    paddingVertical: 5,
  },
});
