import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recetas Médicas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>Bienvenido a la aplicación de Recetas Médicas</h1>
        <IonButton expand="block" onClick={() => history.push('/record')}>
          Grabar Nueva Receta
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;