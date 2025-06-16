import './style.css'
import { loginComposant } from './loginVue'
import { ComposantAccueil } from './accueilvue';

const URL_UTILISATEURS = 'https://devchat-jsi7.onrender.com/utilisateurs';
const URL_GROUPES = 'https://devchat-jsi7.onrender.com/groupes';
const URL_MESSAGES = 'https://devchat-jsi7.onrender.com/messages'
const URL_STATUTS = 'https://devchat-jsi7.onrender.com/statuts'
const URL_APPELS = 'https://devchat-jsi7.onrender.com/appels'
const URL_PARAMETRES_APPLICATION = 'https://devchat-jsi7.onrender.com/parametres_application'

window.addEventListener('DOMContentLoaded', () => {
  const estConnecte = localStorage.getItem('estConnecte') === 'true';

  if(estConnecte){
    ComposantAccueil(document.body);  
  } else {
    loginComposant(document.body);  
  }
});
