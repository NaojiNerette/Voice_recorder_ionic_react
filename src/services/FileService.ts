import { Plugins } from '@capacitor/core';
import { Directory, FilesystemDirectory, FilesystemEncoding } from '@capacitor/filesystem';
const { Filesystem } = Plugins;

export interface Recipe {
  id: string;
  audioUri: string;
  transcription: string;
}

export class FileService {
  async saveRecipe(fileName: string, audioBase64: string, transcription: string): Promise<void> {
    try {
      const audioUri = await this.saveAudio(audioBase64, fileName);
      const recipe: Recipe = {
        id: fileName,
        audioUri,
        transcription
      };
      await this.saveRecipeData(recipe);
    } catch (error) {
      console.error('Error al guardar la receta:', error);
      throw error;
    }
  }

  private async saveAudio(base64Data: string, fileName: string): Promise<string> {
    try {
      const result = await Filesystem.writeFile({
        path: `recetas/${fileName}.wav`,
        data: base64Data,
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
      return result.uri;
    } catch (error) {
      console.error('Error al guardar el archivo de audio:', error);
      throw error;
    }
  }

  private async saveRecipeData(recipe: Recipe): Promise<void> {
    try {
      await Filesystem.writeFile({
        path: `recetas/${recipe.id}.json`,
        data: JSON.stringify(recipe),
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      });
    } catch (error) {
      console.error('Error al guardar los datos de la receta:', error);
      throw error;
    }
  }

  async getRecipes(): Promise<Recipe[]> {
    try {
      const result = await Filesystem.readdir({
        path: 'recetas',
        directory: FilesystemDirectory.Documents
      });
      
      const recipes: Recipe[] = [];
      for (const file of result.files) {
        if (file.endsWith('.json')) {
          const content = await Filesystem.readFile({
            path: `recetas/${file}`,
            directory: FilesystemDirectory.Documents,
            encoding: FilesystemEncoding.UTF8
          });
          recipes.push(JSON.parse(content.data));
        }
      }
      return recipes;
    } catch (error) {
      console.error('Error al leer las recetas:', error);
      throw error;
    }
  }
}