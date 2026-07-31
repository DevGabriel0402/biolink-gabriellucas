import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { sweetRecipesData } from '../data/sweetRecipes';

const styles = StyleSheet.create({
  // Cover Page
  coverPage: {
    padding: 35,
    backgroundColor: '#2b2024',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    borderBottomWidth: 6,
    borderBottomColor: '#e74c3c'
  },
  coverHeader: {
    marginTop: 60,
    textAlign: 'center'
  },
  coverTag: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 2
  },
  coverTitle: {
    fontSize: 30,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    lineHeight: 1.5,
    paddingHorizontal: 20
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 20,
    textAlign: 'center',
    marginBottom: 30
  },
  coverFooterName: {
    fontSize: 13,
    color: '#ecf0f1',
    marginBottom: 4
  },
  coverFooterAuthor: {
    fontSize: 11,
    color: '#bdc3c7'
  },

  // Content Pages
  page: {
    padding: 30,
    backgroundColor: '#fdfbf7',
    color: '#333333'
  },
  introCard: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    padding: 14,
    borderRadius: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  introTitle: {
    fontSize: 16,
    color: '#2b2024',
    fontWeight: 'bold',
    marginBottom: 4
  },
  introText: {
    fontSize: 10,
    color: '#555555',
    lineHeight: 1.4
  },

  // Recipe Card
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  recipeBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#e74c3c',
    textTransform: 'uppercase',
    marginBottom: 2
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8e44ad', // Purple
    marginBottom: 10
  },

  // Macro Table
  macroTable: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f5f6fa',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#eaeaea'
  },
  macroCol: {
    alignItems: 'center'
  },
  macroLabel: {
    fontSize: 8,
    color: '#7f8c8d',
    textTransform: 'uppercase',
    marginBottom: 2
  },
  macroVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  macroHighlight: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#e74c3c'
  },

  // Details Section
  detailsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15
  },
  column: {
    flex: 1
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2b2024',
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  bulletText: {
    fontSize: 9.5,
    color: '#444444',
    lineHeight: 1.4,
    marginBottom: 3
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8
  },
  footerText: {
    fontSize: 8.5,
    color: '#7f8c8d'
  }
});

interface SweetRecipesPDFDocumentProps {
  userName?: string;
}

export const SweetRecipesPDFDocument: React.FC<SweetRecipesPDFDocumentProps> = ({ userName }) => (
  <Document title="Ebook 20 Doces Proteicos & Fit" author="Consultor Gabriel Lucas">
    {/* Page 1: Cover Page */}
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverHeader}>
        <Text style={styles.coverTag}>E-BOOK DE DOCES FIT</Text>
        <Text style={styles.coverTitle}>20 DOCES PROTEICOS & FIT</Text>
        <Text style={styles.coverSubtitle}>
          Sobremesas deliciosas, brigadeiros, mousses e sorvetes ricos em proteína para matar a vontade de doce sem sair da dieta.
        </Text>
      </View>

      <View style={styles.coverFooter}>
        <Text style={styles.coverFooterName}>
          Exclusivo para: {userName || 'Atleta VIP'}
        </Text>
        <Text style={styles.coverFooterAuthor}>
          Consultoria Fitness • Consultor Gabriel Lucas
        </Text>
      </View>
    </Page>

    {/* Page 2+: Recipes List */}
    <Page size="A4" style={styles.page}>
      {/* Intro Header */}
      <View style={styles.introCard}>
        <Text style={styles.introTitle}>Guia de Sobremesas Proteicas</Text>
        <Text style={styles.introText}>
          Todas as receitas possuem tabela de macros detalhada (Calorias, Proteínas, Carboidratos e Gorduras). Aproveite sobremesas práticas para encaixar na sua rotina alimentar.
        </Text>
      </View>

      {/* Render 20 Sweet Recipes */}
      {sweetRecipesData.map((rec) => (
        <View key={rec.id} style={styles.recipeCard} wrap={false}>
          <Text style={styles.recipeBadge}>DOCE PROTEICO #{rec.id}</Text>
          <Text style={styles.recipeTitle}>{rec.title}</Text>

          {/* Macro Table */}
          <View style={styles.macroTable}>
            <View style={styles.macroCol}>
              <Text style={styles.macroLabel}>Calorias</Text>
              <Text style={styles.macroVal}>{rec.macros.kcal} kcal</Text>
            </View>
            <View style={styles.macroCol}>
              <Text style={styles.macroLabel}>Proteínas</Text>
              <Text style={styles.macroHighlight}>{rec.macros.prot}g</Text>
            </View>
            <View style={styles.macroCol}>
              <Text style={styles.macroLabel}>Carbos</Text>
              <Text style={styles.macroVal}>{rec.macros.carb}g</Text>
            </View>
            <View style={styles.macroCol}>
              <Text style={styles.macroLabel}>Gorduras</Text>
              <Text style={styles.macroVal}>{rec.macros.gord}g</Text>
            </View>
          </View>

          {/* Ingredients & Prep Columns */}
          <View style={styles.detailsRow}>
            <View style={styles.column}>
              <Text style={styles.sectionHeading}>Ingredientes:</Text>
              {rec.ing.map((item, i) => (
                <Text key={i} style={styles.bulletText}>• {item}</Text>
              ))}
            </View>

            <View style={styles.column}>
              <Text style={styles.sectionHeading}>Modo de Preparo:</Text>
              {rec.prep.map((item, i) => (
                <Text key={i} style={styles.bulletText}>{i + 1}. {item}</Text>
              ))}
            </View>
          </View>
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>
          Consultor Gabriel Lucas • Consultoria Fitness & Treinamento Online • Todos os Direitos Reservados
        </Text>
      </View>
    </Page>
  </Document>
);
