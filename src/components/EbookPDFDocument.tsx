import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register standard fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.2/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.2/fonts/open-sans-700.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 35,
    backgroundColor: '#0d0f12',
    color: '#f8fafc',
    fontFamily: 'Helvetica'
  },
  headerBanner: {
    backgroundColor: '#161b22',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00e5a3'
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    color: '#00e5a3',
    fontWeight: 'bold'
  },
  authorText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 6
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#12161c',
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00e5a3',
    marginBottom: 8
  },
  paragraph: {
    fontSize: 10,
    color: '#cbd5e1',
    lineHeight: 1.5,
    marginBottom: 6
  },
  bulletList: {
    marginTop: 4,
    marginLeft: 6
  },
  bulletItem: {
    fontSize: 9.5,
    color: '#e2e8f0',
    marginBottom: 4,
    lineHeight: 1.4
  },
  bold: {
    fontWeight: 'bold',
    color: '#ffffff'
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 35,
    right: 35,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 10
  },
  footerText: {
    fontSize: 8,
    color: '#64748b'
  }
});

interface EbookPDFProps {
  userName?: string;
}

export const EbookPDFDocument: React.FC<EbookPDFProps> = ({ userName }) => (
  <Document title="Guia da Hipertrofia Acelerada" author="Consultor Gabriel">
    <Page size="A4" style={styles.page}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <Text style={styles.mainTitle}>Guia da Hipertrofia Acelerada</Text>
        <Text style={styles.subtitle}>Os 5 Pilares Definitivos para Ganhar Massa Magra</Text>
        <Text style={styles.authorText}>
          Exclusivo para: {userName || 'Atleta'} | Por: Consultor Gabriel (Consultoria Fitness)
        </Text>
      </View>

      {/* Pillar 1 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pilar 1: Sobrecarga Progressiva & Tensão Mecânica</Text>
        <Text style={styles.paragraph}>
          O músculo só cresce quando é submetido a um estímulo superior ao qual ele já está acostumado. A tensão mecânica é o principal gatilho da hipertrofia.
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Anote suas cargas:</Text> Aumente o peso ou o número de repetições a cada treino.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Cadência controlada:</Text> Execute a fase excêntrica (descida) em 2 a 3 segundos.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Amplitude completa:</Text> Não encurte o movimento em troca de mais peso.</Text>
        </View>
      </View>

      {/* Pillar 2 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pilar 2: Nutrição Estratégica & Aporte Proteico</Text>
        <Text style={styles.paragraph}>
          Sem os blocos de construção adequados, o treino apenas destrói fibras musculares sem capacidade de reconstrução.
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Proteína diária:</Text> Consuma entre 1,8g e 2,2g de proteína por kg corporal.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Superávit Calórico Limpo:</Text> Adicione de 200 a 400 kcal acima do seu gasto metabólico (TDEE).</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Hidratação:</Text> Mínimo de 35ml a 45ml de água por kg de peso corporal diariamente.</Text>
        </View>
      </View>

      {/* Pilar 3 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pilar 3: Descanso & Síntese Proteica Noturna</Text>
        <Text style={styles.paragraph}>
          É durante o sono profundo que o hormônio do crescimento (GH) atinge seu pico de liberação e os músculos se regeneram.
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>7 a 8 horas de sono:</Text> Sono não negociável para máxima regeneração tecidual.</Text>
          <Text style={styles.bulletItem}>• <Text style={styles.bold}>Descanso ativo:</Text> Respeite os dias de descanso (Rest Days) para evitar o overtraining.</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Consultor Gabriel • Consultoria Online de Personal Trainer • Todos os Direitos Reservados
        </Text>
      </View>
    </Page>
  </Document>
);
