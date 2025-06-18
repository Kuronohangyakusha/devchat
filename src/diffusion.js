 

const URL_MESSAGES = "https://devchat-jsi7.onrender.com/messages";

let destinatairesSelectionnes = [];
let modeDiffusionActif = false;

// Fonction principale pour initialiser la diffusion
export function initialiserDiffusion() {
    const boutonDiffusion = document.querySelector('.Diffusion');
    if (boutonDiffusion) {
        boutonDiffusion.addEventListener('click', ouvrirInterfaceDiffusion);
    }
}

// Fonction pour ouvrir l'interface de diffusion
function ouvrirInterfaceDiffusion() {
    modeDiffusionActif = true;
    destinatairesSelectionnes = [];
    
    // Modifier l'affichage des contacts et groupes pour inclure les checkboxes
    modifierAffichagePourDiffusion();
    
    // Afficher le panneau de diffusion
    afficherPanneauDiffusion();
}

// Fonction pour modifier l'affichage avec les checkboxes
function modifierAffichagePourDiffusion() {
    const listeContainer = document.querySelector("#listeContactsGroupes");
    if (!listeContainer) return;
    
    // Ajouter la classe pour le mode diffusion
    listeContainer.classList.add('mode-diffusion');
    
    // Ajouter les checkboxes à tous les éléments existants
    const elements = listeContainer.querySelectorAll('.contact-groupe-item');
    elements.forEach(element => {
        if (!element.querySelector('.checkbox-diffusion')) {
            ajouterCheckboxAElement(element);
        }
    });
    
    // Modifier le header pour montrer le mode diffusion
    modifierHeaderPourDiffusion();
}

// Fonction pour ajouter une checkbox à un élément
function ajouterCheckboxAElement(element) {
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox-diffusion absolute top-2 right-2 z-10';
    checkbox.innerHTML = `
        <input type="checkbox" 
               class="w-5 h-5 text-fuchsia-600 bg-white border-2 border-gray-300 rounded focus:ring-fuchsia-500 focus:ring-2 checkbox-destinataire" 
               data-id="${element.dataset.id}" 
               data-type="${element.dataset.type}">
    `;
    
    // Positionner l'élément en relatif pour la checkbox absolue
    element.classList.add('relative');
    element.appendChild(checkbox);
    
    // Ajouter l'événement change
    const checkboxInput = checkbox.querySelector('input');
    checkboxInput.addEventListener('change', gererSelectionDestinataire);
    
    // Empêcher la propagation du clic sur la checkbox
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Fonction pour gérer la sélection des destinataires
function gererSelectionDestinataire(event) {
    const checkbox = event.target;
    const id = checkbox.dataset.id;
    const type = checkbox.dataset.type;
    
    const element = checkbox.closest('.contact-groupe-item');
    const nom = element.querySelector('h4').textContent;
    const photo = element.querySelector('img').src;
    
    if (checkbox.checked) {
        // Ajouter à la sélection
        destinatairesSelectionnes.push({
            id: id,
            type: type,
            nom: nom,
            photo: photo
        });
        
        // Marquer visuellement l'élément sélectionné
        element.classList.add('bg-fuchsia-50', 'border-2', 'border-fuchsia-300');
    } else {
        // Retirer de la sélection
        destinatairesSelectionnes = destinatairesSelectionnes.filter(dest => 
            !(dest.id === id && dest.type === type)
        );
        
        // Retirer le marquage visuel
        element.classList.remove('bg-fuchsia-50', 'border-2', 'border-fuchsia-300');
    }
    
    // Mettre à jour l'affichage du compteur
    mettreAJourCompteurSelection();
}

// Fonction pour modifier le header en mode diffusion
function modifierHeaderPourDiffusion() {
    const navbarRecherche = document.querySelector('.navbarRecherche');
    if (!navbarRecherche) return;
    
    // Sauvegarder le contenu original
    if (!navbarRecherche.dataset.originalContent) {
        navbarRecherche.dataset.originalContent = navbarRecherche.innerHTML;
    }
    
    navbarRecherche.innerHTML = `
        <div class="flex items-center justify-between w-full px-4">
            <div class="flex items-center space-x-4">
                <button id="btnAnnulerDiffusion" class="p-2 hover:bg-fuchsia-700 rounded-full transition-colors">
                    <i class="fa-solid fa-arrow-left text-white text-xl"></i>
                </button>
                <div class="text-white">
                    <h3 class="font-semibold text-lg">Nouvelle diffusion</h3>
                    <p class="text-sm text-fuchsia-200" id="compteurSelection">Sélectionnez les destinataires</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button id="btnToutSelectionner" class="px-3 py-1 bg-fuchsia-700 hover:bg-fuchsia-600 text-white text-sm rounded-lg transition-colors">
                    Tout sélectionner
                </button>
                <button id="btnToutDeselectionner" class="px-3 py-1 bg-fuchsia-700 hover:bg-fuchsia-600 text-white text-sm rounded-lg transition-colors">
                    Tout désélectionner
                </button>
            </div>
        </div>
    `;
    
    // Ajouter les événements
    document.getElementById('btnAnnulerDiffusion').addEventListener('click', annulerDiffusion);
    document.getElementById('btnToutSelectionner').addEventListener('click', toutSelectionner);
    document.getElementById('btnToutDeselectionner').addEventListener('click', toutDeselectionner);
}

// Fonction pour afficher le panneau de diffusion
function afficherPanneauDiffusion() {
    const discussionContainer = document.querySelector('.discussion');
    if (!discussionContainer) return;
    
    discussionContainer.innerHTML = `
        <div class="flex flex-col h-full bg-gradient-to-br from-fuchsia-50 to-purple-50">
            <!-- Header du panneau -->
            <div class="bg-white p-4 shadow-md border-b-2 border-fuchsia-200">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center">
                        <i class="fa-solid fa-broadcast-tower text-white text-xl"></i>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">Diffusion de message</h2>
                        <p class="text-sm text-gray-600">Envoyez un message à plusieurs destinataires</p>
                    </div>
                </div>
            </div>
            
            <!-- Liste des destinataires sélectionnés -->
            <div class="bg-white p-4 border-b">
                <h3 class="font-semibold text-gray-700 mb-3">Destinataires sélectionnés (<span id="nombreDestinataires">0</span>)</h3>
                <div id="listeDestinatairesDiffusion" class="flex flex-wrap gap-2 min-h-[40px] max-h-32 overflow-y-auto">
                    <div class="text-gray-500 text-sm italic">Aucun destinataire sélectionné</div>
                </div>
            </div>
            
            <!-- Zone de composition du message -->
            <div class="flex-1 p-4 flex flex-col">
                <div class="bg-white rounded-lg shadow-lg p-4 flex-1 flex flex-col">
                    <label class="font-semibold text-gray-700 mb-2">Votre message :</label>
                    <textarea 
                        id="messageTexteDiffusion" 
                        placeholder="Tapez votre message ici..."
                        class="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                        rows="8"
                    ></textarea>
                    
                    <!-- Compteur de caractères -->
                    <div class="flex justify-between items-center mt-2 text-sm text-gray-500">
                        <span id="compteurCaracteres">0 caractères</span>
                        <span class="text-xs">Conseil: Gardez votre message court et clair</span>
                    </div>
                </div>
            </div>
            
            <!-- Boutons d'action -->
            <div class="bg-white p-4 border-t flex justify-between items-center shadow-lg">
                <div class="text-sm text-gray-600">
                    <i class="fa-solid fa-info-circle text-blue-500 mr-1"></i>
                    Le message sera envoyé individuellement à chaque destinataire
                </div>
                <div class="flex space-x-3">
                    <button id="btnAnnulerDiffusionMessage" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Annuler
                    </button>
                    <button id="btnEnvoyerDiffusion" class="px-6 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-lg hover:from-fuchsia-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        <i class="fa-solid fa-paper-plane mr-2"></i>
                        Envoyer la diffusion
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Initialiser les événements du panneau
    initialiserEvenementsPanneau();
}

// Fonction pour initialiser les événements du panneau de diffusion
function initialiserEvenementsPanneau() {
    const messageTextarea = document.getElementById('messageTexteDiffusion');
    const btnEnvoyer = document.getElementById('btnEnvoyerDiffusion');
    const btnAnnuler = document.getElementById('btnAnnulerDiffusionMessage');
    const compteurCaracteres = document.getElementById('compteurCaracteres');
    
    // Gestion du textarea
    if (messageTextarea) {
        messageTextarea.addEventListener('input', () => {
            const texte = messageTextarea.value;
            const longueur = texte.length;
            
            // Mettre à jour le compteur
            compteurCaracteres.textContent = `${longueur} caractères`;
            
            // Activer/désactiver le bouton d'envoi
            btnEnvoyer.disabled = texte.trim().length === 0 || destinatairesSelectionnes.length === 0;
        });
        
        // Focus automatique
        messageTextarea.focus();
    }
    
    // Bouton d'envoi
    if (btnEnvoyer) {
        btnEnvoyer.addEventListener('click', envoyerDiffusion);
    }
    
    // Bouton d'annulation
    if (btnAnnuler) {
        btnAnnuler.addEventListener('click', annulerDiffusion);
    }
}

// Fonction pour mettre à jour le compteur de sélection
function mettreAJourCompteurSelection() {
    const compteur = document.getElementById('compteurSelection');
    const nombreDestinataires = document.getElementById('nombreDestinataires');
    const listeDestinataires = document.getElementById('listeDestinatairesDiffusion');
    const btnEnvoyer = document.getElementById('btnEnvoyerDiffusion');
    
    const nombre = destinatairesSelectionnes.length;
    
    if (compteur) {
        if (nombre === 0) {
            compteur.textContent = 'Sélectionnez les destinataires';
        } else {
            compteur.textContent = `${nombre} destinataire${nombre > 1 ? 's' : ''} sélectionné${nombre > 1 ? 's' : ''}`;
        }
    }
    
    if (nombreDestinataires) {
        nombreDestinataires.textContent = nombre;
    }
    
    // Mettre à jour la liste des destinataires
    if (listeDestinataires) {
        if (nombre === 0) {
            listeDestinataires.innerHTML = '<div class="text-gray-500 text-sm italic">Aucun destinataire sélectionné</div>';
        } else {
            listeDestinataires.innerHTML = destinatairesSelectionnes.map(dest => `
                <div class="flex items-center bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full text-sm">
                    <img src="${dest.photo}" alt="" class="w-5 h-5 rounded-full mr-2 object-cover">
                    <span>${dest.nom}</span>
                    <button class="ml-2 text-fuchsia-600 hover:text-fuchsia-800" onclick="retirerDestinataire('${dest.id}', '${dest.type}')">
                        <i class="fa-solid fa-times text-xs"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    // Mettre à jour l'état du bouton d'envoi
    if (btnEnvoyer) {
        const messageTexte = document.getElementById('messageTexteDiffusion')?.value.trim() || '';
        btnEnvoyer.disabled = nombre === 0 || messageTexte.length === 0;
    }
}

// Fonction pour retirer un destinataire (accessible globalement)
window.retirerDestinataire = function(id, type) {
    // Décocher la checkbox correspondante
    const checkbox = document.querySelector(`input[data-id="${id}"][data-type="${type}"]`);
    if (checkbox) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change'));
    }
};

// Fonction pour sélectionner tout
function toutSelectionner() {
    const checkboxes = document.querySelectorAll('.checkbox-destinataire');
    checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
}

// Fonction pour tout désélectionner
function toutDeselectionner() {
    const checkboxes = document.querySelectorAll('.checkbox-destinataire');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
}

// Fonction pour envoyer la diffusion
async function envoyerDiffusion() {
    const messageTexte = document.getElementById('messageTexteDiffusion')?.value.trim();
    const btnEnvoyer = document.getElementById('btnEnvoyerDiffusion');
    
    if (!messageTexte || destinatairesSelectionnes.length === 0) {
        alert('Veuillez saisir un message et sélectionner au moins un destinataire.');
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    btnEnvoyer.disabled = true;
    btnEnvoyer.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Envoi en cours...';
    
    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        const promessesEnvoi = [];
        
       destinatairesSelectionnes.forEach(destinataire => {
    let conversationId;
    
    if (destinataire.type === 'groupe') {
        conversationId = `conv_group_${destinataire.id}`;
    } else {
        // Pour les contacts, créer un ID de conversation unique basé sur les deux utilisateurs
        const currentUserId = utilisateurConnecte.id;
        const contactId = destinataire.id;
        
        // Générer un ID de conversation cohérent (toujours dans le même ordre)
        const ids = [currentUserId, contactId].sort();
        conversationId = `conv_${ids[0]}_${ids[1]}`;
    }
    
    const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversation_id: conversationId,
        expediteur: utilisateurConnecte.id,
        contenu: {
            type: "texte",
            texte: messageTexte,
            mise_en_forme: []
        },
        timestamp: new Date().toISOString(),
        statut: {
            envoye: true,
            livre: false,
            lu: false,
            timestamp_lecture: null
        },
        reponse_a: null,
        transfere_de: null,
        reactions: [],
        ephemere: false,
        diffusion: true
    };
    
    promessesEnvoi.push(
        fetch(URL_MESSAGES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
    );
});
        
        // Attendre que tous les messages soient envoyés
        const resultats = await Promise.allSettled(promessesEnvoi);
        
        // Vérifier les résultats
        const succes = resultats.filter(r => r.status === 'fulfilled').length;
        const echecs = resultats.filter(r => r.status === 'rejected').length;
        
        // Afficher le résultat
        if (echecs === 0) {
            afficherNotificationSucces(`Diffusion envoyée avec succès à ${succes} destinataire${succes > 1 ? 's' : ''} !`);
        } else {
            afficherNotificationAvertissement(`Diffusion partiellement envoyée : ${succes} succès, ${echecs} échec${echecs > 1 ? 's' : ''}`);
        }
        
        // Fermer le mode diffusion après un délai
        setTimeout(() => {
            annulerDiffusion();
        }, 2000);
        
    } catch (error) {
        console.error('Erreur lors de la diffusion:', error);
        afficherNotificationErreur('Erreur lors de l\'envoi de la diffusion');
        
        // Réactiver le bouton
        btnEnvoyer.disabled = false;
        btnEnvoyer.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i>Envoyer la diffusion';
    }
}

// Fonction pour annuler la diffusion
function annulerDiffusion() {
    modeDiffusionActif = false;
    destinatairesSelectionnes = [];
    
    // Restaurer l'affichage normal
    restaurerAffichageNormal();
    
    // Restaurer le header
    restaurerHeaderNormal();
    
    // Restaurer la zone de discussion
    restaurerDiscussionNormale();
}

// Fonction pour restaurer l'affichage normal
function restaurerAffichageNormal() {
    const listeContainer = document.querySelector("#listeContactsGroupes");
    if (!listeContainer) return;
    
    // Retirer la classe de mode diffusion
    listeContainer.classList.remove('mode-diffusion');
    
    // Supprimer toutes les checkboxes
    const checkboxes = listeContainer.querySelectorAll('.checkbox-diffusion');
    checkboxes.forEach(checkbox => checkbox.remove());
    
    // Retirer les styles de sélection
    const elements = listeContainer.querySelectorAll('.contact-groupe-item');
    elements.forEach(element => {
        element.classList.remove('relative', 'bg-fuchsia-50', 'border-2', 'border-fuchsia-300');
    });
}

// Fonction pour restaurer le header normal
function restaurerHeaderNormal() {
    const navbarRecherche = document.querySelector('.navbarRecherche');
    if (!navbarRecherche || !navbarRecherche.dataset.originalContent) return;
    
    navbarRecherche.innerHTML = navbarRecherche.dataset.originalContent;
    delete navbarRecherche.dataset.originalContent;
}

// Fonction pour restaurer la discussion normale
function restaurerDiscussionNormale() {
    const discussionContainer = document.querySelector('.discussion');
    if (!discussionContainer) return;
    
    discussionContainer.innerHTML = `
        <div class="flex items-center justify-between bg-white p-3 shadow">
            <div class="flex items-center space-x-4">
                <img src="src/img/ndeye.jpeg" alt="Profil" class="w-10 h-10 rounded-full object-cover">
                <div>
                    <h4 class="font-semibold text-gray-800">Sélectionnez une conversation</h4>
                    <p class="text-sm text-gray-500">Choisissez un contact ou groupe pour commencer</p>
                </div>
            </div>
        </div>
        <div class="flex-1 p-4 overflow-y-auto space-y-4 flex items-center justify-center">
            <div class="text-center text-gray-500">
                <i class="fa-solid fa-comments text-6xl text-gray-300 mb-4"></i>
                <p class="text-lg">Sélectionnez une conversation pour commencer à discuter</p>
            </div>
        </div>
    `;
}

// Fonctions de notification
function afficherNotificationSucces(message) {
    afficherNotification(message, 'success');
}

function afficherNotificationAvertissement(message) {
    afficherNotification(message, 'warning');
}

function afficherNotificationErreur(message) {
    afficherNotification(message, 'error');
}

function afficherNotification(message, type) {
    const couleurs = {
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500'
    };
    
    const icones = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${couleurs[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in`;
    notification.innerHTML = `
        <i class="fa-solid ${icones[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}