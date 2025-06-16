const URL_UTILISATEURS = 'https://devchat-jsi7.onrender.com/utilisateurs';
const URL_GROUPES = 'https://devchat-jsi7.onrender.com/groupes';
const URL_MESSAGES = 'https://devchat-jsi7.onrender.com/messages'
const URL_STATUTS = 'https://devchat-jsi7.onrender.com/statuts'
const URL_APPELS = 'https://devchat-jsi7.onrender.com/appels'
const URL_PARAMETRES_APPLICATION = 'https://devchat-jsi7.onrender.com/parametres_application'


export function validerEmail(email) {
  if (!email || email.trim() === '') {
    return { valide: false, message: "L'email est obligatoire" };
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return { valide: false, message: "Email invalide" };
  }
  return { valide: true, message: "" };
}

export function validerMotDePasse(password) {
  if (!password || password.trim() === '') {
    return { valide: false, message: "Le mot de passe est obligatoire" };
  }
  if (password.length < 6) {
    return { valide: false, message: "Le mot de passe doit contenir au moins 6 caractères" };
  }
  return { valide: true, message: "" };
}

export function validerTelephone(phone) {
  if (!phone || phone.trim() === '') {
    return { valide: false, message: "Le numéro de téléphone est obligatoire" };
  }
  const regex = /^7[05678][0-9]{7}$/;
  if (!regex.test(phone)) {
    return { valide: false, message: "Numéro de téléphone invalide" };
  }
  return { valide: true, message: "" };
}

export function viderChamps(composant) {
  composant.querySelector('#email').value = '';
  composant.querySelector('#password').value = '';
  composant.querySelector('#phone').value = '';
}

export async function connecterUtilisateur(email, password, phone) {
  try {
    const response = await fetch(`${URL_UTILISATEURS}?email=${email}&password=${password}&telephone=${phone}`);
    const users = await response.json();

    if (users.length > 0) {
      return { success: true, user: users[0] };
    } else {
      return { success: false, message: 'Identifiants invalides' };
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return { success: false, message: 'Erreur serveur' };
  }
}
