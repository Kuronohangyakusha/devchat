import {validerEmail,validerMotDePasse,validerTelephone, viderChamps} from './loginService.js';
import { connecterUtilisateur } from './loginService.js';

export function loginComposant(composant){
  composant.innerHTML = `
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-700">Connexion</h2>
      
      <form id="form" action="#" method="POST" class="space-y-4">
        <div>
          <label class="block text-gray-600 mb-1" for="email">Email</label>
          <input type="text" id="email" name="email" placeholder="Votre email"
                 class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-600">
          <p class="error-message text-red-500 text-sm mt-1 hidden" id="error-email"></p>
        </div>
        <div>
          <label class="block text-gray-600 mb-1" for="password">Mot de passe</label>
          <input type="password" id="password" name="password" placeholder="Votre mot de passe"
                 class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-600">
          <p class="error-message text-red-500 text-sm mt-1 hidden" id="error-password"></p>
        </div>
        <div>
          <label class="block text-gray-600 mb-1" for="phone">Numéro de téléphone</label>
          <input type="text" id="phone" name="phone" placeholder="+221 77 123 45 67"
                 class="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-600">
          <p class="error-message text-red-500 text-sm mt-1 hidden" id="error-phone"></p>
        </div>
        <button type="submit"
                class="w-full bg-fuchsia-500 text-white p-3 rounded hover:bg-fuchsia-600 transition duration-300">
          Se connecter
        </button>
      </form>
    </div>
  `;

  const form = composant.querySelector('#form');

  function afficherErreur(idErreur, message) {
    const erreurEl = composant.querySelector(idErreur);
    if (message) {
      erreurEl.textContent = message;
      erreurEl.classList.remove('hidden');
    } else {
      erreurEl.textContent = '';
      erreurEl.classList.add('hidden');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = composant.querySelector('#email').value;
    const password = composant.querySelector('#password').value;
    const phone = composant.querySelector('#phone').value;

     
    afficherErreur('#error-email', '');
    afficherErreur('#error-password', '');
    afficherErreur('#error-phone', '');

     
    const emailValidation = validerEmail(email);
    const passwordValidation = validerMotDePasse(password);
    const phoneValidation = validerTelephone(phone);

    let erreur = false;

    if (!emailValidation.valide) {
      afficherErreur('#error-email', emailValidation.message);
      erreur = true;
    }
    if (!passwordValidation.valide) {
      afficherErreur('#error-password', passwordValidation.message);
      erreur = true;
    }
    if (!phoneValidation.valide) {
      afficherErreur('#error-phone', phoneValidation.message);
      erreur = true;
    }
    if (erreur) return;

    
    const result = await connecterUtilisateur(email, password, phone);

    if (result.success) {
      console.log('Connexion réussie', result.user);
      viderChamps(composant);
        
    localStorage.setItem("utilisateurConnecte", JSON.stringify(result.user));
    localStorage.setItem("estConnecte", "true");
    
    location.reload();
      location.reload(); 
       
    } else {
      alert(result.message);
    }
  });
}
 
export function deconnecterUtilisateur() {
    try {
        
        localStorage.removeItem('estConnecte');
        localStorage.removeItem('utilisateurConnecte');
        
        return { success: true, message: 'Déconnexion réussie' };
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return { success: false, message: 'Erreur lors de la déconnexion' };
    }
}

 
export function estUtilisateurConnecte() {
    return localStorage.getItem('estConnecte') === 'true';
} 
export function getUtilisateurConnecte() {
    const userData = localStorage.getItem('utilisateurConnecte');
    return userData ? JSON.parse(userData) : null;
}