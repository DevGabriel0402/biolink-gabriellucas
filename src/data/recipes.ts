export interface Recipe {
  id: number;
  title: string;
  macros: {
    kcal: number;
    prot: number;
    carb: number;
    gord: number;
  };
  ing: string[];
  prep: string[];
}

export const recipesData: Recipe[] = [
  {
    id: 1,
    title: "Panqueca Suprema de Whey e Aveia",
    macros: { kcal: 210, prot: 24, carb: 14, gord: 6 },
    ing: [
      "1 ovo inteiro",
      "2 colheres de sopa de farelo de aveia",
      "1 scoop de whey protein",
      "Água aos poucos para dar o ponto"
    ],
    prep: [
      "Bata o ovo levemente em uma tigela",
      "Misture a aveia e o whey protein",
      "Adicione água aos poucos até obter massa homogênea",
      "Doure dos dois lados em frigideira antiaderente pré-aquecida"
    ]
  },
  {
    id: 2,
    title: "Crepioca Dourada Recheada de Frango",
    macros: { kcal: 250, prot: 32, carb: 14, gord: 7 },
    ing: [
      "1 ovo inteiro",
      "1 colher de sopa de goma de tapioca",
      "Pitada de sal",
      "100g de peito de frango desfiado e temperado"
    ],
    prep: [
      "Bata bem o ovo, a tapioca e o sal",
      "Despeje na frigideira antiaderente aquecida",
      "Espere firmar e vire o lado",
      "Adicione o recheio de frango, dobre ao meio e sirva"
    ]
  },
  {
    id: 3,
    title: "Omelete Verde Rústico com Cottage",
    macros: { kcal: 240, prot: 26, carb: 4, gord: 14 },
    ing: [
      "3 ovos inteiros",
      "1 xícara de espinafre fresco picado",
      "2 colheres de sopa de queijo cottage",
      "Sal e pimenta-do-reino a gosto"
    ],
    prep: [
      "Bata os ovos com o sal e a pimenta",
      "Misture o espinafre picado",
      "Despeje na frigideira e cozinhe em fogo baixo",
      "Adicione o cottage no centro antes de dobrar"
    ]
  },
  {
    id: 4,
    title: "Mingau Proteico Conforto de Aveia",
    macros: { kcal: 230, prot: 25, carb: 20, gord: 4 },
    ing: [
      "3 colheres de sopa de aveia em flocos",
      "1 xícara de água",
      "1 scoop de whey protein",
      "Canela em pó a gosto"
    ],
    prep: [
      "Cubra a aveia com a água em uma tigela",
      "Leve ao micro-ondas por 2 minutos",
      "Retire e misture o whey protein rapidamente para não empelotar",
      "Polvilhe canela em pó por cima"
    ]
  },
  {
    id: 5,
    title: "Mousse Cremoso de Cacau e Abacate",
    macros: { kcal: 220, prot: 23, carb: 8, gord: 11 },
    ing: [
      "1 scoop de whey protein sabor chocolate",
      "1 colher de sopa de cacau 100%",
      "2 colheres de sopa de abacate amassado",
      "Água gelada aos poucos"
    ],
    prep: [
      "Coloque todos os ingredientes no liquidificador ou mixer",
      "Adicione água bem gelada aos poucos",
      "Bata até obter um creme consistente e aveludado",
      "Leve à geladeira por 30 minutos antes de servir"
    ]
  },
  {
    id: 6,
    title: "Taça Grega Turbinada com Oleaginosas",
    macros: { kcal: 260, prot: 16, carb: 12, gord: 16 },
    ing: [
      "1 pote de iogurte grego zero açúcar",
      "1 colher de sopa de sementes de chia",
      "15g de amêndoas trituradas"
    ],
    prep: [
      "Coloque o iogurte grego na base da taça",
      "Adicione a chia e misture levemente",
      "Cubra com as amêndoas trituradas por cima"
    ]
  },
  {
    id: 7,
    title: "Muffin Proteico de Caneca Express",
    macros: { kcal: 190, prot: 28, carb: 5, gord: 6 },
    ing: [
      "1 ovo inteiro",
      "1 colher de sopa de cacau 100%",
      "1 scoop de whey protein",
      "1 colher de café de fermento em pó"
    ],
    prep: [
      "Bata o ovo diretamente na caneca",
      "Adicione o cacau e o whey protein e misture bem",
      "Incorpore o fermento delicadamente",
      "Leve ao micro-ondas por 1 minuto"
    ]
  },
  {
    id: 8,
    title: "Smoothie Refrescante de Abacate e Baunilha",
    macros: { kcal: 210, prot: 24, carb: 6, gord: 10 },
    ing: [
      "1 scoop de whey protein sabor baunilha",
      "2 colheres de sopa de abacate",
      "200ml de leite de amêndoas sem açúcar",
      "Pedras de gelo"
    ],
    prep: [
      "Coloque todos os ingredientes no liquidificador",
      "Bata em velocidade alta até triturar completamente o gelo",
      "Sirva em um copo bem gelado"
    ]
  },
  {
    id: 9,
    title: "Rolinhos Práticos de Queijo e Peru",
    macros: { kcal: 180, prot: 22, carb: 2, gord: 9 },
    ing: [
      "3 fatias de queijo minas frescal",
      "3 fatias de peito de peru defumado",
      "Orégano a gosto"
    ],
    prep: [
      "Estique as fatias de peito de peru em uma tábua",
      "Coloque uma fatia de queijo por cima de cada uma",
      "Salpique orégano e enrole firmemente"
    ]
  },
  {
    id: 10,
    title: "Ovos de Ouro com Pasta de Amendoim",
    macros: { kcal: 320, prot: 23, carb: 4, gord: 24 },
    ing: [
      "3 ovos inteiros",
      "1 colher de sopa de pasta de amendoim integral"
    ],
    prep: [
      "Cozinhe os ovos em água fervente por 10 minutos",
      "Descasque e tempere com pitada de sal",
      "Consuma a pasta de amendoim como sobremesa para aporte calórico"
    ]
  },
  {
    id: 11,
    title: "Peito de Frango Crocante com Castanhas",
    macros: { kcal: 340, prot: 40, carb: 6, gord: 16 },
    ing: [
      "150g de filé de peito de frango",
      "1 ovo batido",
      "30g de castanhas de caju trituradas",
      "Sal e pimenta a gosto"
    ],
    prep: [
      "Tempere os filés de frango a gosto",
      "Passe os filés no ovo batido e em seguida na farinha de castanha",
      "Disponha em assadeira e asse a 200°C por 20 minutos"
    ]
  },
  {
    id: 12,
    title: "Salmão Assado ao Toque de Limão e Aspargos",
    macros: { kcal: 310, prot: 34, carb: 4, gord: 18 },
    ing: [
      "150g de filé de salmão",
      "Suco de 1/2 limão",
      "Sal e pimenta-do-reino",
      "1 maço de aspargos frescos",
      "1 colher de chá de azeite de oliva"
    ],
    prep: [
      "Tempere o salmão com limão, sal e pimenta",
      "Coloque na assadeira ao lado dos aspargos",
      "Regue os aspargos com o azeite",
      "Asse a 200°C por 15 minutos"
    ]
  },
  {
    id: 13,
    title: "Escondidinho Fit de Patinho e Couve-Flor",
    macros: { kcal: 280, prot: 42, carb: 10, gord: 8 },
    ing: [
      "150g de patinho moído",
      "150g de couve-flor cozida no vapor",
      "Alho, cebola e sal a gosto"
    ],
    prep: [
      "Refogue o patinho moído com alho, cebola e temperos",
      "Amasse a couve-flor até formar um purê bem liso",
      "Em um refratário, coloque a carne e cubra com o purê",
      "Gratine no forno por 10 minutos"
    ]
  },
  {
    id: 14,
    title: "Estrogonofe Leve de Frango com Iogurte",
    macros: { kcal: 260, prot: 38, carb: 8, gord: 7 },
    ing: [
      "150g de peito de frango em cubos",
      "2 colheres de sopa de iogurte natural desnatado",
      "1 colher de chá de mostarda dijon",
      "2 colheres de sopa de purê de tomate",
      "Cebola picada"
    ],
    prep: [
      "Doure a cebola e o frango na frigideira",
      "Adicione o purê de tomate e a mostarda",
      "Desligue o fogo e misture o iogurte delicadamente",
      "Sirva em seguida"
    ]
  },
  {
    id: 15,
    title: "Burger Artesanal de Frango com Salada",
    macros: { kcal: 220, prot: 36, carb: 4, gord: 6 },
    ing: [
      "150g de peito de frango moído/triturado",
      "Páprica defumada e sal a gosto",
      "Mix de folhas verdes para acompanhar"
    ],
    prep: [
      "Tempere o frango triturado com a páprica e sal",
      "Modele em formato de hambúrguer artesanal",
      "Grelhe na frigideira antiaderente por 4 min de cada lado",
      "Sirva sobre a cama de folhas verdes"
    ]
  },
  {
    id: 16,
    title: "Espaguete Low Carb de Abobrinha à Bolonhesa",
    macros: { kcal: 270, prot: 40, carb: 12, gord: 9 },
    ing: [
      "1 abobrinha cortada em tiras finas (espaguete)",
      "150g de patinho moído",
      "1/2 xícara de molho de tomate natural",
      "Manjericão fresco"
    ],
    prep: [
      "Refogue a carne moída no molho de tomate temperado",
      "Escalde as tiras de abobrinha em água fervente por apenas 30 segundos",
      "Sirva o molho à bolonhesa por cima do espaguete de abobrinha",
      "Finalize com folhas de manjericão"
    ]
  },
  {
    id: 17,
    title: "Salada Fresca de Atum com Grão-de-Bico",
    macros: { kcal: 250, prot: 28, carb: 18, gord: 8 },
    ing: [
      "1 lata de atum em água escorrido",
      "3 colheres de sopa de grão-de-bico cozido",
      "Tomate e cebola roxa picados",
      "Azeite de oliva e limão"
    ],
    prep: [
      "Desfie o atum em uma tigela",
      "Misture o grão-de-bico, tomate e cebola",
      "Tempere com um fio de azeite e suco de limão"
    ]
  },
  {
    id: 18,
    title: "Frittata Nutritiva de Frango e Brócolis",
    macros: { kcal: 410, prot: 52, carb: 6, gord: 20 },
    ing: [
      "4 ovos inteiros",
      "150g de peito de frango desfiado",
      "1/2 xícara de floretes de brócolis pré-cozidos",
      "Tomate picado e orégano"
    ],
    prep: [
      "Bata os ovos com temperos em uma tigela",
      "Misture o frango, os brócolis e os tomates",
      "Despeje em um refratário untado",
      "Asse a 180°C por 25 minutos até dourar"
    ]
  },
  {
    id: 19,
    title: "Tilápia Aromática no Papelote",
    macros: { kcal: 180, prot: 30, carb: 6, gord: 4 },
    ing: [
      "150g de filé de tilápia",
      "Tomates cereja cortados ao meio",
      "Pimentão em tiras",
      "Fio de azeite e alecrim"
    ],
    prep: [
      "Disponha o filé de tilápia sobre uma folha de papel alumínio",
      "Tempere e adicione os tomates, pimentão e alecrim",
      "Feche bem o envelope de alumínio",
      "Asse a 200°C por 20 minutos"
    ]
  },
  {
    id: 20,
    title: "Mignon Grelhado com Mix de Folhas Verdes",
    macros: { kcal: 290, prot: 42, carb: 5, gord: 11 },
    ing: [
      "150g de medalhão de filé mignon",
      "Sal grosso moído na hora",
      "Mix de folhas verdes (rúcula, agrião, alface)",
      "Suco de limão"
    ],
    prep: [
      "Aqueça bem a grelha ou frigideira de ferro",
      "Tempere o mignon com sal grosso",
      "Grelhe por 4 minutos de cada lado para manter a suculência",
      "Sirva acompanhado de salada verde temperada com limão"
    ]
  }
];
