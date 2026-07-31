import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { recipesData } from '../data/recipes';

const styles = StyleSheet.create({
  // Pages & Cover
  coverPage: {
    padding: 35,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  coverHeader: {
    marginTop: 60,
    textAlign: 'center'
  },
  coverTag: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 2
  },
  coverTitle: {
    fontSize: 32,
    color: '#ef4444',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 1.5,
    paddingHorizontal: 20
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 20,
    textAlign: 'center',
    marginBottom: 30
  },
  coverFooterName: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 4
  },
  coverFooterAuthor: {
    fontSize: 11,
    color: '#64748b'
  },

  // Content Pages
  page: {
    padding: 30,
    backgroundColor: '#f8fafc',
    color: '#1e293b'
  },
  introCard: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    padding: 14,
    borderRadius: 6,
    marginBottom: 20
  },
  introTitle: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 4
  },
  introText: {
    fontSize: 10,
    color: '#475569',
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
    color: '#ef4444',
    textTransform: 'uppercase',
    marginBottom: 2
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10
  },

  // Macro Table
  macroTable: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    justifyContent: 'space-around'
  },
  macroCol: {
    alignItems: 'center'
  },
  macroLabel: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2
  },
  macroVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a'
  },
  macroHighlight: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ef4444'
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
    color: '#0f172a',
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  bulletText: {
    fontSize: 9.5,
    color: '#334155',
    lineHeight: 1.4,
    marginBottom: 3
  },

  // Page Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 8
  },
  footerText: {
    fontSize: 8.5,
    color: '#64748b'
  }
});

interface RecipesPDFDocumentProps {
  userName?: string;
}

export const RecipesPDFDocument: React.FC<RecipesPDFDocumentProps> = ({ userName }) => (
  <Document title="Ebook 20 Receitas Fit & Anabólicas" author="Consultor Gabriel Silva">
    {/* Page 1: Cover Page */}
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverHeader}>
        <Text style={styles.coverTag}>E-BOOK DE NUTRIÇÃO</Text>
        <Text style={styles.coverTitle}>20 RECEITAS FIT & ANABÓLICAS</Text>
        <Text style={styles.coverSubtitle}>
          Pratos práticos, saborosos e ricos em proteína para potencializar seus resultados sem passar fome.
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
        <Text style={styles.introTitle}>Guia Culinário Fitness</Text>
        <Text style={styles.introText}>
          Abaixo estão 20 opções balanceadas de refeições doces e salgadas. Todas possuem a tabela nutricional de macros (Calorias, Proteínas, Carboidratos e Gorduras).
        </Text>
      </View>

      {/* Render 20 Recipes */}
      {recipesData.map((rec) => (
        <View key={rec.id} style={styles.recipeCard} wrap={false}>
          <Text style={styles.recipeBadge}>RECEITA #{rec.id}</Text>
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
          Consultor Gabriel • Consultoria Fitness & Treinamento Online • Todos os Direitos Reservados
        </Text>
      </View>
    </Page>
  </Document>
);
