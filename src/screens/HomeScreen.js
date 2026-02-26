import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Title, Text, Button, Card, Avatar, useTheme, IconButton, Surface } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const QuickAction = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <Surface style={styles.actionIconContainer} elevation={1}>
        <IconButton icon={icon} size={28} iconColor={theme.colors.primary} />
      </Surface>
      <Text variant="labelMedium" style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: '#f8f9fa' }]}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <IconButton icon="bell-outline" size={24} onPress={() => {}} />
          <Avatar.Text size={36} label="CA" style={styles.avatar} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text variant="headlineSmall" style={styles.greetingText}>{`Hola, Carlos`}</Text>
          <Text variant="bodyMedium" style={styles.subtitleText}>{`¿Qué deseas escanear hoy?`}</Text>
        </View>

        {/* Hero Banner / Primary CTA */}
        <Card style={styles.hostCard}>
          <Surface style={styles.hostSurface} elevation={4}>
            <View style={styles.hostContent}>
              <View style={styles.hostTextContent}>
                <Title style={styles.hostTitle}>{`Scan & Go`}</Title>
                <Text style={styles.hostSubtitle}>{`Escaneo rápido con el respaldo de AEG Fiscal.`}</Text>
              </View>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Scanner')}
                style={styles.mainScanButton}
                contentStyle={styles.mainScanButtonContent}
                labelStyle={styles.mainScanButtonLabel}
                icon="barcode-scan"
              >
                {`ESCANEAR AHORA`}
              </Button>
            </View>
          </Surface>
        </Card>

        {/* Quick Actions Grid */}
        <View style={styles.actionsGrid}>
          <QuickAction icon="cart" label={`Mi Carrito`} onPress={() => navigation.navigate('Cart')} />
          <QuickAction icon="history" label={`Historial`} onPress={() => {}} />
          <QuickAction icon="map-marker" label={`Tiendas`} onPress={() => {}} />
          <QuickAction icon="help-circle" label={`Soporte`} onPress={() => {}} />
        </View>

        {/* Partners Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>{`Nuestras Tiendas Aliadas`}</Title>
            <Button compact labelStyle={{ fontSize: 12 }}>{`Ver todas`}</Button>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.shopScroll}
            contentContainerStyle={styles.shopScrollContent}
          >
            {[
              { name: 'AEG Concept Store', sub: 'Flagship Store', rating: '5.0' },
              { name: 'Supermercado Sol', sub: 'Descuento AEG Pay', rating: '4.8' },
              { name: 'Ferretería Central', sub: 'Aliado Oficial', rating: '4.7' }
            ].map((shop, index) => (
              <Card key={index} style={styles.shopCard} mode="elevated">
                <Card.Cover source={{ uri: `https://picsum.photos/seed/${index+20}/400/200` }} />
                <Card.Content style={styles.shopContent}>
                  <View style={styles.shopHeaderRow}>
                    <Text variant="titleMedium" style={styles.shopName}>{`${shop.name}`}</Text>
                    <View style={styles.ratingBadge}>
                      <IconButton icon="star" size={12} iconColor="#EAB308" style={styles.ratingIcon} />
                      <Text style={styles.ratingText}>{`${shop.rating}`}</Text>
                    </View>
                  </View>
                  <Text variant="bodySmall" style={styles.shopSub}>{`${shop.sub}`}</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* Footer info */}
        <View style={[styles.footerInfo, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <Text variant="labelSmall" style={styles.footerText}>{`AEG Fiscal - Tecnología que Avanza`}</Text>
          <Text variant="labelSmall" style={styles.versionText}>{`v1.2.0 • 2024`}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    width: 100,
    height: 40,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#eee',
    marginLeft: 10,
  },
  welcomeSection: {
    padding: 25,
    paddingBottom: 15,
  },
  greetingText: {
    fontWeight: 'bold',
    color: '#333',
  },
  subtitleText: {
    color: '#666',
    marginTop: 5,
  },
  hostCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  hostSurface: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 25,
  },
  hostContent: {
    justifyContent: 'space-between',
  },
  hostTextContent: {
    marginBottom: 20,
  },
  hostTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  hostSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 5,
  },
  mainScanButton: {
    borderRadius: 12,
    backgroundColor: '#22d3ee', // Bright Cyan for contrast
  },
  mainScanButtonContent: {
    height: 54,
  },
  mainScanButtonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 25,
    paddingHorizontal: 10,
  },
  actionItem: {
    alignItems: 'center',
    width: 80,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    color: '#333',
    fontWeight: '500',
  },
  section: {
    marginTop: 10,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  shopScroll: {
    paddingLeft: 20,
  },
  shopScrollContent: {
    paddingRight: 20,
    paddingVertical: 10, // Avoid shadow clipping
  },
  shopCard: {
    width: 240,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },
  shopContent: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  shopHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopName: {
    fontWeight: '700',
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingIcon: {
    margin: 0,
    padding: 0,
    width: 14,
    height: 14,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#854D0E',
    marginLeft: 2,
  },
  shopSub: {
    color: '#666',
    marginTop: 4,
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 20,
  },
  footerText: {
    color: '#aaa',
    fontWeight: '600',
    letterSpacing: 1,
  },
  versionText: {
    color: '#ccc',
    marginTop: 5,
  },
});
