import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@recipebuilder.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    })
    console.log(`✅ Admin user created: ${adminEmail}`)
  } else {
    console.log(`ℹ️  Admin user already exists: ${adminEmail}`)
  }

  // Create some sample recipes
  const sampleRecipes = [
    {
      title: 'Easy Spaghetti Bolognese',
      description: 'A classic Italian pasta dish that kids and adults love!',
      ingredients: JSON.stringify([
        '400g spaghetti',
        '500g ground beef',
        '1 onion, diced',
        '2 garlic cloves, minced',
        '800g canned tomatoes',
        'Salt and pepper to taste',
        'Parmesan cheese for serving',
      ]),
      instructions: JSON.stringify([
        'Cook spaghetti according to package directions',
        'Brown the ground beef in a large pan',
        'Add onion and garlic, cook until soft',
        'Add canned tomatoes and simmer for 20 minutes',
        'Season with salt and pepper',
        'Serve over spaghetti with parmesan cheese',
      ]),
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'BEGINNER',
      category: 'Pasta',
    },
    {
      title: 'Chicken Stir Fry',
      description: 'A quick and healthy dinner packed with vegetables',
      ingredients: JSON.stringify([
        '500g chicken breast, sliced',
        '2 cups mixed vegetables',
        '3 tbsp soy sauce',
        '2 tbsp vegetable oil',
        '1 tbsp ginger, minced',
        '2 garlic cloves, minced',
        'Rice for serving',
      ]),
      instructions: JSON.stringify([
        'Heat oil in a wok or large pan',
        'Cook chicken until browned',
        'Add vegetables, ginger, and garlic',
        'Stir fry for 5 minutes',
        'Add soy sauce and cook for 2 more minutes',
        'Serve over rice',
      ]),
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      difficulty: 'BEGINNER',
      category: 'Asian',
    },
    {
      title: 'Homemade Pizza',
      description: 'Make your own delicious pizza from scratch!',
      ingredients: JSON.stringify([
        '500g pizza dough',
        '200ml pizza sauce',
        '300g mozzarella cheese',
        'Your favorite toppings',
        'Olive oil',
        'Italian herbs',
      ]),
      instructions: JSON.stringify([
        'Preheat oven to 220°C (425°F)',
        'Roll out pizza dough',
        'Spread pizza sauce evenly',
        'Add cheese and toppings',
        'Drizzle with olive oil',
        'Bake for 12-15 minutes until golden',
      ]),
      prepTime: 20,
      cookTime: 15,
      servings: 2,
      difficulty: 'INTERMEDIATE',
      category: 'Italian',
    },
  ]

  for (const recipe of sampleRecipes) {
    const existing = await prisma.recipe.findFirst({
      where: { title: recipe.title },
    })

    if (!existing) {
      await prisma.recipe.create({ data: recipe })
      console.log(`✅ Created recipe: ${recipe.title}`)
    }
  }

  console.log('🌱 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
