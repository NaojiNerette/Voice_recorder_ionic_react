import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { FileService, Recipe } from '../services/FileService';
import { Plugins } from '@capacitor/core';

const { Share } = Plugins;

const ViewRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const fileService = new FileService();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const loadedRecipes = await fileService.getRecipes();
      setRecipes(loadedRecipes);
    } catch (error) {
      console.error('Error al cargar las recetas:', error);
    }
  };

  const shareRecipe = async (recipe: Recipe) => {
    try {
      await Share.share({
        title: 'Receta Médica',
        text: `Aquí está tu receta médica: ${recipe.transcription}`,
        dialogTitle: 'Compartir Receta'
      });
    } catch (error) {
      console.error('Error al compartir la receta:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recetas Guardadas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {recipes.map((recipe) => (
            <IonCard key={recipe.id}>
              <IonCardHeader>
                <IonCardTitle>{recipe.id}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{recipe.transcription}</p>
                <IonButton onClick={() => shareRecipe(recipe)}>Compartir</IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ViewRecipes;