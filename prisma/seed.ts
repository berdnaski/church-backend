import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de categorias e subcategorias...');

  // Definição das categorias e subcategorias
  const categoriesWithSubcategories = {
    'Louvor': ['Guitarrista', 'Baterista', 'Vocal', 'Tecladista', 'Baixista', 'Violonista', 'Saxofonista'],
    'Departamento Infantil': ['Professor', 'Ajudante', 'Contador de histórias', 'Recreador', 'Coordenador'],
    'Mídia': ['Fotógrafo', 'Operador de câmera', 'Editor de vídeo', 'Designer gráfico', 'Operador de som', 'Social media'],
    'Obreiros': ['Recepção', 'Segurança', 'Estacionamento', 'Limpeza', 'Manutenção'],
    'Dança': ['Coreógrafo', 'Dançarino', 'Instrutor', 'Figurinista'],
    'Intercessão': ['Líder de oração', 'Intercessor', 'Coordenador de vigília'],
    'Evangelismo': ['Evangelista', 'Apoio', 'Coordenador', 'Distribuidor de materiais'],
    'Outra': ['Personalizado'],
  };

  const existingCategoriesCount = await prisma.category.count();
  
  if (existingCategoriesCount > 0) {
    console.log('Categorias já existem no banco de dados. Pulando seed...');
    return;
  }
  
  console.log(`Criando categorias globais sem vínculo com tenant`);

  for (const [categoryName, subcategories] of Object.entries(categoriesWithSubcategories)) {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        description: `Categoria ${categoryName}`,
      },
    });
    
    console.log(`Categoria criada: ${categoryName}`);
    
    for (const subcategoryName of subcategories) {
      await prisma.subcategory.create({
        data: {
          name: subcategoryName,
          description: `Subcategoria ${subcategoryName} para ${categoryName}`,
          categoryId: category.id,
        },
      });
      
      console.log(`Subcategoria criada: ${subcategoryName} para ${categoryName}`);
    }
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });