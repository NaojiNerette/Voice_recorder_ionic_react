import React, { useState, useRef } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonText } from '@ionic/react';
import { Filesystem, Directory } from '@capacitor/filesystem';

const RecordAudio: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        saveAudio(audioBlob);
      };

      audioChunks.current = [];
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const saveAudio = async (audioBlob: Blob) => {
    try {
      const fileName = `receta_${new Date().getTime()}.wav`;
      const base64Data = await blobToBase64(audioBlob);
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents
      });
      console.log('Audio guardado:', fileName);
    } catch (error) {
      console.error('Error al guardar el audio:', error);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Grabar Receta</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
          <IonButton onClick={stopRecording}>Detener Grabación</IonButton>
          <IonButton onClick={startRecording}>Iniciar Grabación</IonButton>
        {audioURL && (
          <div>
            <IonText>Grabación guardada</IonText>
            <audio src={audioURL} controls />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RecordAudio;