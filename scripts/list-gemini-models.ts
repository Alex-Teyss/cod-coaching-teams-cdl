/**
 * Script pour lister tous les modèles Gemini disponibles
 * Usage: npx tsx scripts/list-gemini-models.ts
 */

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY n'est pas définie dans .env");
  process.exit(1);
}

const ai = new GoogleGenAI({});

async function listModels() {
  try {
    console.log("🔍 Récupération des modèles disponibles...\n");

    // Note: Le SDK JS ne fournit pas de méthode listModels()
    // Nous allons donc tester les modèles connus

    const modelsToTest = [
      "gemini-pro",
      "gemini-pro-vision",
      "gemini-1.5-pro",
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-8b",
      "gemini-2.0-flash-exp",
      "gemini-2.5-flash",
      "gemini-exp-1206",
    ];

    console.log("📋 Modèles à tester:");
    for (const modelName of modelsToTest) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: "Hello",
        });
        const text = response.text;
        console.log(`✅ ${modelName} - Fonctionne!`);
      } catch (error: any) {
        if (error.message?.includes("404")) {
          console.log(`❌ ${modelName} - Non trouvé (404)`);
        } else if (error.message?.includes("API key")) {
          console.log(`⚠️  ${modelName} - Problème de clé API`);
        } else {
          console.log(
            `❌ ${modelName} - Erreur: ${error.message?.substring(0, 50)}`
          );
        }
      }
    }

    console.log("\n✨ Test terminé!");
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

listModels();
