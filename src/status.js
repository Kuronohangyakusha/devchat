 

const URL_STATUTS = "https://devchat-jsi7.onrender.com/statuts";
const URL_UTILISATEURS = "https://devchat-jsi7.onrender.com/utilisateurs";

let popupStatutOuvert = false;

export function initialiserStatut() {
    const boutonStatut = document.querySelector(".Statut .boutonStatut");
    if (boutonStatut) {
        boutonStatut.addEventListener("click", ouvrirPopupStatut);
    }
}

export function ouvrirPopupStatut() {
    if (popupStatutOuvert) return;
    
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    if (!utilisateurConnecte.id) {
        alert('Vous devez être connecté pour publier un statut.');
        return;
    }

    popupStatutOuvert = true;

    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.id = 'popupStatut';
    
    popup.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-[500px] max-h-[600px] overflow-y-auto">
            <div class="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white p-4 rounded-t-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold flex items-center gap-2">
                        <i class="fa-solid fa-circle-info"></i>
                        Publier un statut
                    </h3>
                    <button id="fermerPopupStatut" class="text-white hover:text-gray-200 transition-colors">
                        <i class="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <!-- Aperçu du profil -->
                <div class="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                    <img src="${utilisateurConnecte.photo_profil || 'src/img/default-avatar.png'}" 
                         alt="Profil" class="w-12 h-12 rounded-full object-cover">
                    <div>
                        <h4 class="font-semibold text-gray-800">${utilisateurConnecte.nom}</h4>
                        <p class="text-sm text-gray-500">Publier pour: Mes contacts</p>
                    </div>
                </div>

                <!-- Zone de saisie du statut -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Votre statut
                    </label>
                    <textarea 
                        id="texteStatut" 
                        placeholder="Que voulez-vous partager avec vos contacts ?" 
                        class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none text-lg"
                        rows="4"
                        maxlength="150"
                    ></textarea>
                    <div class="flex justify-between items-center mt-2">
                        <span id="compteurCaracteres" class="text-sm text-gray-500">0/150 caractères</span>
                        <span class="text-xs text-gray-400">
                            <i class="fa-solid fa-clock mr-1"></i>
                            Expire dans 24h
                        </span>
                    </div>
                </div>

                <!-- Choix de couleur de fond -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Couleur d'arrière-plan
                    </label>
                    <div class="grid grid-cols-6 gap-3">
                        <button class="couleur-fond w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-fuchsia-500 transition-colors active" 
                                data-couleur="#4ECDC4" style="background-color: #4ECDC4"></button>
                        <button class="couleur-fond w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-fuchsia-500 transition-colors" 
                                data-couleur="#FF6B6B" style="background-color: #FF6B6B"></button>
                        <button class="couleur-fond w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-fuchsia-500 transition-colors" 
                                data-couleur="#4DABF7" style="background-color: #4DABF7"></button>
                        <button class="couleur-fond w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-fuchsia-500 transition-colors" 
                                data-couleur="#69DB7C" style="background-color: #69DB7C"></button>
                        <button class="couleur-fond w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-fuchsia-500 transition-colors" 
                                data-couleur="#FFD43B" style="background-color: #FFD43B"></button>
                        <button class="couleur-fond w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-fuchsia-500 transition-colors" 
                                data-couleur="#9775FA" style="background-color: #9775FA"></button>
                    </div>
                </div>

                <!-- Aperçu du statut -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Aperçu
                    </label>
                    <div id="apercuStatut" class="w-full h-32 rounded-lg flex items-center justify-center text-white font-semibold text-lg text-center p-4" 
                         style="background-color: #4ECDC4">
                        <span id="texteApercu">Votre statut apparaîtra ici...</span>
                    </div>
                </div>

                <!-- Paramètres de visibilité -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                        Visible pour
                    </label>
                    <select id="visibiliteStatut" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500">
                        <option value="contacts">Mes contacts</option>
                        <option value="favoris">Contacts favoris seulement</option>
                        <option value="tous">Tous (public)</option>
                    </select>
                </div>

                <!-- Boutons d'action -->
                <div class="flex gap-3">
                    <button id="annulerStatut" 
                            class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                        <i class="fa-solid fa-times mr-2"></i>
                        Annuler
                    </button>
                    <button id="publierStatut" 
                            class="flex-1 px-4 py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-lg hover:from-fuchsia-600 hover:to-pink-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fa-solid fa-paper-plane mr-2"></i>
                        Publier
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    initialiserEvenementsPopup();
    
    // Focus sur le textarea
    document.getElementById('texteStatut').focus();
}

function initialiserEvenementsPopup() {
    const popup = document.getElementById('popupStatut');
    
    // Fermeture du popup
    const btnFermer = popup.querySelector('#fermerPopupStatut');
    const btnAnnuler = popup.querySelector('#annulerStatut');
    
    btnFermer.addEventListener('click', fermerPopupStatut);
    btnAnnuler.addEventListener('click', fermerPopupStatut);
    
    // Fermeture en cliquant à l'extérieur
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            fermerPopupStatut();
        }
    });

    // Gestion du texte
    const texteStatut = popup.querySelector('#texteStatut');
    const compteurCaracteres = popup.querySelector('#compteurCaracteres');
    const texteApercu = popup.querySelector('#texteApercu');
    const btnPublier = popup.querySelector('#publierStatut');

    texteStatut.addEventListener('input', (e) => {
        const longueur = e.target.value.length;
        compteurCaracteres.textContent = `${longueur}/150 caractères`;
        
        // Mise à jour de l'aperçu
        if (e.target.value.trim()) {
            texteApercu.textContent = e.target.value;
        } else {
            texteApercu.textContent = 'Votre statut apparaîtra ici...';
        }
        
        // Activer/désactiver le bouton publier
        btnPublier.disabled = !e.target.value.trim();
        
        // Changer la couleur du compteur si limite proche
        if (longueur > 130) {
            compteurCaracteres.classList.add('text-red-500');
        } else {
            compteurCaracteres.classList.remove('text-red-500');
        }
    });

    // Gestion des couleurs
    const boutonsColeur = popup.querySelectorAll('.couleur-fond');
    const apercuStatut = popup.querySelector('#apercuStatut');
    
    boutonsColeur.forEach(bouton => {
        bouton.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            boutonsColeur.forEach(b => b.classList.remove('active', 'border-fuchsia-500'));
            boutonsColeur.forEach(b => b.classList.add('border-gray-300'));
            
            // Ajouter la classe active au bouton cliqué
            bouton.classList.add('active', 'border-fuchsia-500');
            bouton.classList.remove('border-gray-300');
            
            // Changer la couleur d'arrière-plan de l'aperçu
            const couleur = bouton.dataset.couleur;
            apercuStatut.style.backgroundColor = couleur;
        });
    });

    // Publication du statut
    btnPublier.addEventListener('click', publierStatut);
}

async function publierStatut() {
    const texte = document.getElementById('texteStatut').value.trim();
    const visibilite = document.getElementById('visibiliteStatut').value;
    const couleurFond = document.querySelector('.couleur-fond.active').dataset.couleur;
    
    if (!texte) {
        alert('Veuillez saisir un texte pour votre statut.');
        return;
    }

    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    
    try {
        const btnPublier = document.getElementById('publierStatut');
        btnPublier.disabled = true;
        btnPublier.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Publication...';

        // Créer le nouveau statut
        const nouveauStatut = {
            id: `status_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            proprietaire: utilisateurConnecte.id,
            contenu: {
                type: "texte",
                texte: texte,
                couleur_fond: couleurFond,
                police: "normal"
            },
            timestamp: new Date().toISOString(),
            expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
            visible_pour: visibilite,
            vues: [],
            reactions: []
        };

        // Envoyer à l'API
        const response = await fetch(URL_STATUTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nouveauStatut)
        });

        if (response.ok) {
    afficherNotificationStatut('Statut publié avec succès !', 'success');
    fermerPopupStatut();
    mettreAJourIndicateurStatut(); // Ajouter cette ligne
}else {
            throw new Error('Erreur lors de la publication');
        }

    } catch (error) {
        console.error('Erreur lors de la publication du statut:', error);
        afficherNotificationStatut('Erreur lors de la publication du statut', 'error');
        
        // Réactiver le bouton
        const btnPublier = document.getElementById('publierStatut');
        btnPublier.disabled = false;
        btnPublier.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i>Publier';
    }
     
}

function fermerPopupStatut() {
    const popup = document.getElementById('popupStatut');
    if (popup) {
        popup.remove();
        popupStatutOuvert = false;
    }

}

function afficherNotificationStatut(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white font-medium transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <i class="fa-solid ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            }"></i>
            <span>${message}</span>
            <button class="ml-2 hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animation d'apparition
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Suppression automatique après 4 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(full)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Fonction pour charger et afficher les statuts (pour usage futur)
export async function chargerStatuts() {
    try {
        const response = await fetch(URL_STATUTS);
        const statuts = await response.json();
        
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        const maintenant = new Date();
        
        // Filtrer les statuts non expirés et visibles pour l'utilisateur
        const statutsVisibles = statuts.filter(statut => {
            const expiration = new Date(statut.expiration);
            const nonExpire = expiration > maintenant;
            
            // Logique de visibilité selon les paramètres
            const visible = statut.visible_pour === 'tous' || 
                           (statut.visible_pour === 'contacts' && utilisateurConnecte.liste_contacts?.some(c => c.id === statut.proprietaire));
            
            return nonExpire && visible;
        });

        return statutsVisibles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
    } catch (error) {
        console.error('Erreur lors du chargement des statuts:', error);
        return [];
    }
}

// Fonction pour supprimer automatiquement les statuts expirés
export async function nettoyerStatutsExpires() {
    try {
        const response = await fetch(URL_STATUTS);
        const statuts = await response.json();
        
        const maintenant = new Date();
        const statutsExpires = statuts.filter(statut => {
            const expiration = new Date(statut.expiration);
            return expiration <= maintenant;
        });

        // Supprimer les statuts expirés
        for (const statut of statutsExpires) {
            await fetch(`${URL_STATUTS}/${statut.id}`, {
                method: 'DELETE'
            });
        }

        console.log(`${statutsExpires.length} statut(s) expiré(s) supprimé(s)`);
        
    } catch (error) {
        console.error('Erreur lors du nettoyage des statuts expirés:', error);
    }
}

// Démarrer le nettoyage automatique toutes les heures
setInterval(nettoyerStatutsExpires, 60 * 60 * 1000); // 1 heure

// Dans status.js - Ajouter ces fonctions

// Fonction pour vérifier si l'utilisateur a un statut actif
export async function verifierStatutActif(utilisateurId) {
    try {
        const response = await fetch(URL_STATUTS);
        const statuts = await response.json();
        
        const maintenant = new Date();
        const statutActif = statuts.find(statut => {
            const expiration = new Date(statut.expiration);
            return statut.proprietaire === utilisateurId && expiration > maintenant;
        });
        
        return statutActif;
    } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
        return null;
    }
}

// Fonction pour mettre à jour l'indicateur de statut
export async function mettreAJourIndicateurStatut() {
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    if (!utilisateurConnecte.id) return;
    
    const photoElement = document.getElementById('photoProfilUtilisateur');
    const containerPhoto = photoElement?.parentElement;
    
    if (!containerPhoto) return;
    
    const statutActif = await verifierStatutActif(utilisateurConnecte.id);
    
    // Retirer l'ancien indicateur s'il existe
    containerPhoto.classList.remove('ring-4', 'ring-green-400', 'ring-offset-2');
    
    if (statutActif) {
        // Ajouter l'indicateur de statut actif
        containerPhoto.classList.add('ring-4', 'ring-green-400', 'ring-offset-2', 'cursor-pointer');
        containerPhoto.title = 'Cliquez pour voir votre statut';
        
        // Ajouter l'événement de clic pour voir le statut
        containerPhoto.onclick = () => afficherStatutUtilisateur(statutActif);
    } else {
        containerPhoto.classList.remove('cursor-pointer');
        containerPhoto.onclick = null;
        containerPhoto.title = '';
    }
}

// Fonction pour afficher le statut de l'utilisateur
function afficherStatutUtilisateur(statut) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.id = 'popupVoirStatut';
    
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    const tempsRestant = calculerTempsRestant(statut.expiration);
    
    popup.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl w-[400px] max-h-[500px] overflow-y-auto">
            <div class="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white p-4 rounded-t-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold flex items-center gap-2">
                        <i class="fa-solid fa-circle-info"></i>
                        Votre statut
                    </h3>
                    <button id="fermerPopupVoirStatut" class="text-white hover:text-gray-200 transition-colors">
                        <i class="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <!-- Profil -->
                <div class="flex items-center gap-3 mb-4">
                    <img src="${utilisateurConnecte.photo_profil || 'src/img/default-avatar.png'}" 
                         alt="Profil" class="w-12 h-12 rounded-full object-cover ring-2 ring-green-400">
                    <div>
                        <h4 class="font-semibold text-gray-800">${utilisateurConnecte.nom}</h4>
                        <p class="text-sm text-gray-500">${tempsRestant}</p>
                    </div>
                </div>

                <!-- Affichage du statut -->
                <div class="mb-4">
                    <div class="w-full h-32 rounded-lg flex items-center justify-center text-white font-semibold text-lg text-center p-4" 
                         style="background-color: ${statut.contenu.couleur_fond}">
                        <span>${statut.contenu.texte}</span>
                    </div>
                </div>

                <!-- Informations -->
                <div class="text-sm text-gray-500 mb-4">
                    <p><i class="fa-solid fa-eye mr-2"></i>Vu par ${statut.vues.length} personne(s)</p>
                    <p><i class="fa-solid fa-users mr-2"></i>Visible pour: ${
                        statut.visible_pour === 'tous' ? 'Tous' :
                        statut.visible_pour === 'contacts' ? 'Mes contacts' :
                        'Contacts favoris'
                    }</p>
                </div>

                <!-- Boutons d'action -->
                <div class="flex gap-3">
                    <button id="supprimerStatut" 
                            class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
                        <i class="fa-solid fa-trash mr-2"></i>
                        Supprimer
                    </button>
                    <button id="fermerStatut" 
                            class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                        <i class="fa-solid fa-times mr-2"></i>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    
    // Événements
    const btnFermer = popup.querySelector('#fermerPopupVoirStatut');
    const btnFermerStatut = popup.querySelector('#fermerStatut');
    const btnSupprimer = popup.querySelector('#supprimerStatut');
    
    btnFermer.addEventListener('click', () => popup.remove());
    btnFermerStatut.addEventListener('click', () => popup.remove());
    btnSupprimer.addEventListener('click', () => supprimerStatut(statut.id, popup));
    
    // Fermer en cliquant à l'extérieur
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    });
}

// Fonction pour calculer le temps restant
function calculerTempsRestant(expiration) {
    const maintenant = new Date();
    const fin = new Date(expiration);
    const diff = fin - maintenant;
    
    if (diff <= 0) return 'Expiré';
    
    const heures = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (heures > 0) {
        return `Expire dans ${heures}h ${minutes}m`;
    } else {
        return `Expire dans ${minutes}m`;
    }
}

// Fonction pour supprimer un statut
async function supprimerStatut(statutId, popup) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce statut ?')) {
        return;
    }
    
    try {
        const response = await fetch(`${URL_STATUTS}/${statutId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            afficherNotificationStatut('Statut supprimé avec succès !', 'success');
            popup.remove();
            mettreAJourIndicateurStatut(); // Mettre à jour l'indicateur
        } else {
            throw new Error('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du statut:', error);
        afficherNotificationStatut('Erreur lors de la suppression du statut', 'error');
    }
}
