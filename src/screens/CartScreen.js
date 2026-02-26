import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Title, Text, Button, Card, Divider, List, IconButton, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { state, dispatch } = useCart();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const subtotal = state.total;
  const tax = subtotal * 0.16; // 16% IVA AEG
  const total = (subtotal + tax).toFixed(2);

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQty = (id, newQty) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQty } });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
          <Title style={{ color: theme.colors.primary }}>Tu Carrito</Title>
        </View>
        <Text variant="bodySmall" style={{ marginLeft: 50 }}>
          {state.items.length} productos escaneados
        </Text>
      </View>

      {state.items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconButton icon="cart-off" size={80} disabled />
          <Text variant="headlineSmall">Carrito vacío</Text>
          <Button mode="contained" onPress={() => navigation.navigate('Scanner')} style={{ marginTop: 20 }}>
            Escanear Productos
          </Button>
        </View>
      ) : (
        <>
          <FlatList
            data={state.items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.name}
                description={`$${parseFloat(item.price).toFixed(2)} c/u`}
                left={props => <List.Icon {...props} icon="barcode" />}
                right={props => (
                  <View style={styles.itemRight}>
                    <View style={styles.qtyControls}>
                      <IconButton icon="minus" size={16} onPress={() => updateQty(item.id, item.quantity - 1)} />
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <IconButton icon="plus" size={16} onPress={() => updateQty(item.id, item.quantity + 1)} />
                    </View>
                    <Text style={styles.itemPrice}>
                      {`$${(parseFloat(item.price) * item.quantity).toFixed(2)}`}
                    </Text>
                    <IconButton icon="delete-outline" size={20} onPress={() => removeItem(item.id)} />
                  </View>
                )}
                style={styles.listItem}
              />
            )}
            ItemSeparatorComponent={Divider}
            contentContainerStyle={[styles.listContent, { paddingBottom: 200 + insets.bottom }]}
          />

          <Card style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            <Card.Content>
              <View style={styles.summaryRow}>
                <Text>{`Subtotal`}</Text>
                <Text>{`$${subtotal.toFixed(2)}`}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>{`IVA (16%)`}</Text>
                <Text>{`$${tax.toFixed(2)}`}</Text>
              </View>
              <Divider style={{ marginVertical: 8 }} />
              <View style={styles.totalRow}>
                <Text variant="titleLarge">{`Total`}</Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                  {`$${total}`}
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.taxNote}>{`Registro Fiscal AEG Scan&Go`}</Text>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                style={styles.checkoutButton}
                onPress={() => navigation.navigate('Receipt', { 
                  orderSummary: { subtotal, tax, total, items: state.items } 
                })}
                icon="credit-card-outline"
              >
                {`Pagar con AEG Pay`}
              </Button>
            </Card.Actions>
          </Card>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 180,
  },
  listItem: {
    backgroundColor: '#fff',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  qtyText: {
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  itemPrice: {
    fontWeight: '600',
    fontSize: 14,
    minWidth: 60,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    elevation: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fff',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  taxNote: {
    textAlign: 'right',
    color: '#999',
    fontSize: 10,
    fontStyle: 'italic',
  },
  checkoutButton: {
    width: '100%',
    marginVertical: 5,
    borderRadius: 12,
    paddingVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
