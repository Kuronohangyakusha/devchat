// messaging.js - Système de messagerie corrigé
const URL_MESSAGES = "https://devchat-jsi7.onrender.com/messages";
const URL_UTILISATEURS = "https://devchat-jsi7.onrender.com/utilisateurs";

let conversationActive = null;
let intervalRafraichissement = null;

/**
 * Initialise le système de messagerie
 */
export function initialiserMessaging() {
    console.log("Initialisation du système de messagerie");
    
    // Démarrer la surveillance des nouveaux messages
    demarrerSurveillanceMessages();
    
    // Écouter les événements de saisie
    document.addEventListener('click', (e) => {
        if (e.target.closest('.contact-groupe-item')) {
            const element = e.target.closest('.contact-groupe-item');
            const id = element.dataset.id;
            const type = element.dataset.type;
            const nom = element.querySelector('h4').textContent;
            
            ouvrirConversation(id, type, nom);
        }
    });
}

/**
 * Ouvre une conversation
 */
async function ouvrirConversation(contactId, type, nom) {
    conversationActive = {
        id: contactId,
        type: type,
        nom: nom
    };
    
    // Mettre à jour l'interface
    mettreAJourInterfaceConversation(contactId, type, nom);
    
    // Charger les messages existants
    await chargerMessages(contactId, type);
    
    // Marquer les messages comme lus
    await marquerMessagesCommeVus(contactId, type);
}

/**
 * Met à jour l'interface de conversation
 */
function mettreAJourInterfaceConversation(contactId, type, nom) {
    const discussionContainer = document.querySelector('.discussion');
    if (!discussionContainer) return;
    
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    
    // Trouver les informations du contact/groupe
    let photoUrl = 'src/img/default-avatar.png';
    let statut = 'Hors ligne';
    
    if (type === 'contact') {
        const contact = utilisateurConnecte.liste_contacts?.find(c => c.id === contactId);
        if (contact) {
            photoUrl = contact.photo_profil || photoUrl;
            statut = contact.en_ligne ? 'En ligne' : 'Hors ligne';
        }
    }
    
    discussionContainer.innerHTML = `
        <!-- En-tête de conversation -->
        <div class="flex items-center justify-between bg-white p-4 shadow-sm border-b">
            <div class="flex items-center space-x-3">
                <img src="${photoUrl}" alt="Profil" class="w-10 h-10 rounded-full object-cover">
                <div>
                    <h4 class="font-semibold text-gray-800">${nom}</h4>
                    <p class="text-sm text-gray-500">${statut}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button class="p-2 hover:bg-gray-100 rounded-full" title="Appel vocal">
                    <i class="fa-solid fa-phone text-gray-600"></i>
                </button>
                <button class="p-2 hover:bg-gray-100 rounded-full" title="Appel vidéo">
                    <i class="fa-solid fa-video text-gray-600"></i>
                </button>
                <button class="p-2 hover:bg-gray-100 rounded-full" title="Plus d'options">
                    <i class="fa-solid fa-ellipsis-vertical text-gray-600"></i>
                </button>
            </div>
        </div>

        <!-- Zone des messages -->
        <div id="zoneMessages" class="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div class="flex items-center justify-center h-full">
                <div class="text-center text-gray-500">
                    <i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i>
                    <p>Chargement des messages...</p>
                </div>
            </div>
        </div>

        <!-- Zone de saisie -->
        <div class="bg-white p-4 border-t">
            <div class="flex items-center space-x-3">
                <button class="p-2 hover:bg-gray-100 rounded-full" title="Joindre un fichier">
                    <i class="fa-solid fa-paperclip text-gray-600"></i>
                </button>
                <div class="flex-1 relative">
                    <input 
                        type="text" 
                        id="champMessage" 
                        placeholder="Tapez votre message..." 
                        class="w-full p-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    >
                    <button class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full" title="Emoji">
                        <i class="fa-solid fa-face-smile text-gray-600"></i>
                    </button>
                </div>
                <button id="btnEnvoyerMessage" class="p-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-full transition-colors">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    // Ajouter les événements
    ajouterEvenementsConversation(contactId, type);
}

/**
 * Ajoute les événements pour la conversation
 */
function ajouterEvenementsConversation(contactId, type) {
    const champMessage = document.getElementById('champMessage');
    const btnEnvoyer = document.getElementById('btnEnvoyerMessage');
    
    if (!champMessage || !btnEnvoyer) return;
    
    // Envoi avec Enter
    champMessage.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            envoyerMessage(contactId, type);
        }
    });
    
    // Envoi avec le bouton
    btnEnvoyer.addEventListener('click', () => {
        envoyerMessage(contactId, type);
    });
    
    // Indicateur de frappe
    let timeoutFrappe = null;
    champMessage.addEventListener('input', () => {
        // Envoyer indicateur de frappe
        envoyerIndicateurFrappe(contactId, type, true);
        
        // Arrêter l'indicateur après 3 secondes d'inactivité
        clearTimeout(timeoutFrappe);
        timeoutFrappe = setTimeout(() => {
            envoyerIndicateurFrappe(contactId, type, false);
        }, 3000);
    });
}

/**
 * Envoie un message
 */
async function envoyerMessage(contactId, type) {
    const champMessage = document.getElementById('champMessage');
    if (!champMessage) return;
    
    const texte = champMessage.value.trim();
    if (!texte) return;
    
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    
    try {
        // Créer l'ID de conversation
        const conversationId = creerIdConversation(contactId, type, utilisateurConnecte.id);
        
        // Créer le message
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversation_id: conversationId,
            expediteur: utilisateurConnecte.id,
            contenu: {
                type: "texte",
                texte: texte,
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
            ephemere: false
        };
        
        // Afficher immédiatement le message (optimistic UI)
        afficherMessage(message, true);
        
        // Vider le champ de saisie
        champMessage.value = '';
        
        // Envoyer à l'API
        const response = await fetch(URL_MESSAGES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi');
        }
        
        // Mettre à jour le statut du message
        message.statut.livre = true;
        mettreAJourStatutMessage(message.id, 'livre');
        
        // Mettre à jour la conversation dans les données utilisateur
        await mettreAJourConversationUtilisateur(conversationId, contactId, type, message);
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        afficherErreurEnvoi();
    }
}

/**
 * Crée un ID de conversation cohérent
 */
function creerIdConversation(contactId, type, utilisateurId) {
    if (type === 'groupe') {
        return `conv_group_${contactId}`;
    } else {
        // Pour les conversations individuelles, créer un ID basé sur les deux utilisateurs
        const ids = [utilisateurId, contactId].sort();
        return `conv_${ids[0]}_${ids[1]}`;
    }
}

/**
 * Charge les messages d'une conversation
 */
async function chargerMessages(contactId, type) {
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    const conversationId = creerIdConversation(contactId, type, utilisateurConnecte.id);
    
    try {
        const response = await fetch(`${URL_MESSAGES}?conversation_id=${conversationId}`);
        const messages = await response.json();
        
        // Trier les messages par timestamp
        messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Afficher les messages
        const zoneMessages = document.getElementById('zoneMessages');
        if (zoneMessages) {
            zoneMessages.innerHTML = '';
            
            if (messages.length === 0) {
                zoneMessages.innerHTML = `
                    <div class="flex items-center justify-center h-full">
                        <div class="text-center text-gray-500">
                            <i class="fa-solid fa-comments text-4xl mb-2"></i>
                            <p>Aucun message pour le moment</p>
                            <p class="text-sm">Commencez la conversation !</p>
                        </div>
                    </div>
                `;
            } else {
                messages.forEach(message => {
                    afficherMessage(message, message.expediteur === utilisateurConnecte.id);
                });
                
                // Faire défiler vers le bas
                zoneMessages.scrollTop = zoneMessages.scrollHeight;
            }
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        const zoneMessages = document.getElementById('zoneMessages');
        if (zoneMessages) {
            zoneMessages.innerHTML = `
                <div class="flex items-center justify-center h-full">
                    <div class="text-center text-red-500">
                        <i class="fa-solid fa-exclamation-triangle text-4xl mb-2"></i>
                        <p>Erreur lors du chargement des messages</p>
                    </div>
                </div>
            `;
        }
    }
}

/**
 * Affiche un message dans l'interface
 */
function afficherMessage(message, estExpediteur) {
    const zoneMessages = document.getElementById('zoneMessages');
    if (!zoneMessages) return;
    
    // Si c'est le premier message, vider le contenu par défaut
    if (zoneMessages.querySelector('.text-center')) {
        zoneMessages.innerHTML = '';
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex mb-4 ${estExpediteur ? 'justify-end' : 'justify-start'}`;
    messageDiv.dataset.messageId = message.id;
    
    const heureMessage = new Date(message.timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageDiv.innerHTML = `
        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            estExpediteur 
                ? 'bg-fuchsia-500 text-white' 
                : 'bg-white text-gray-800 border'
        }">
            <p class="text-sm">${message.contenu.texte}</p>
            <div class="flex items-center justify-end mt-1 space-x-1">
                <span class="text-xs ${estExpediteur ? 'text-fuchsia-100' : 'text-gray-500'}">${heureMessage}</span>
                ${estExpediteur ? `
                    <div class="flex space-x-1">
                        <i class="fa-solid fa-check text-xs ${message.statut.livre ? 'text-fuchsia-200' : 'text-fuchsia-300'}"></i>
                        ${message.statut.lu ? '<i class="fa-solid fa-check text-xs text-blue-300"></i>' : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    zoneMessages.appendChild(messageDiv);
    zoneMessages.scrollTop = zoneMessages.scrollHeight;
}

/**
 * Démarre la surveillance des nouveaux messages
 */
function demarrerSurveillanceMessages() {
    // Arrêter l'ancien intervalle s'il existe
    if (intervalRafraichissement) {
        clearInterval(intervalRafraichissement);
    }
    
    // Vérifier les nouveaux messages toutes les 2 secondes
    intervalRafraichissement = setInterval(async () => {
        if (conversationActive) {
            await verifierNouveauxMessages();
        }
    }, 2000);
}

/**
 * Vérifie s'il y a de nouveaux messages
 */
async function verifierNouveauxMessages() {
    if (!conversationActive) return;
    
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    const conversationId = creerIdConversation(
        conversationActive.id, 
        conversationActive.type, 
        utilisateurConnecte.id
    );
    
    try {
        const response = await fetch(`${URL_MESSAGES}?conversation_id=${conversationId}`);
        const messages = await response.json();
        
        // Vérifier s'il y a de nouveaux messages
        const zoneMessages = document.getElementById('zoneMessages');
        if (!zoneMessages) return;
        
        const messagesAffiches = zoneMessages.querySelectorAll('[data-message-id]');
        const idsAffiches = Array.from(messagesAffiches).map(el => el.dataset.messageId);
        
        const nouveauxMessages = messages.filter(msg => !idsAffiches.includes(msg.id));
        
        if (nouveauxMessages.length > 0) {
            nouveauxMessages
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .forEach(message => {
                    afficherMessage(message, message.expediteur === utilisateurConnecte.id);
                    
                    // Marquer comme lu si ce n'est pas notre message
                    if (message.expediteur !== utilisateurConnecte.id) {
                        marquerMessageCommeLu(message.id);
                    }
                });
        }
        
    } catch (error) {
        console.error('Erreur lors de la vérification des nouveaux messages:', error);
    }
}

/**
 * Marque un message comme lu
 */
async function marquerMessageCommeLu(messageId) {
    try {
        await fetch(`${URL_MESSAGES}/${messageId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'statut.lu': true,
                'statut.timestamp_lecture': new Date().toISOString()
            })
        });
    } catch (error) {
        console.error('Erreur lors du marquage comme lu:', error);
    }
}

/**
 * Marque tous les messages d'une conversation comme vus
 */
async function marquerMessagesCommeVus(contactId, type) {
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    const conversationId = creerIdConversation(contactId, type, utilisateurConnecte.id);
    
    try {
        const response = await fetch(`${URL_MESSAGES}?conversation_id=${conversationId}`);
        const messages = await response.json();
        
        const messagesNonLus = messages.filter(msg => 
            msg.expediteur !== utilisateurConnecte.id && !msg.statut.lu
        );
        
        for (const message of messagesNonLus) {
            await marquerMessageCommeLu(message.id);
        }
        
    } catch (error) {
        console.error('Erreur lors du marquage des messages comme vus:', error);
    }
}

/**
 * Met à jour le statut d'un message
 */
function mettreAJourStatutMessage(messageId, statut) {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (!messageElement) return;
    
    const icones = messageElement.querySelectorAll('.fa-check');
    if (statut === 'livre' && icones.length > 0) {
        icones[0].classList.remove('text-fuchsia-300');
        icones[0].classList.add('text-fuchsia-200');
    }
    if (statut === 'lu' && icones.length > 1) {
        icones[1].classList.add('text-blue-300');
    }
}

/**
 * Envoie un indicateur de frappe
 */
async function envoyerIndicateurFrappe(contactId, type, enTrain) {
    // Implémentation pour l'indicateur "en train d'écrire"
    console.log(`Indicateur de frappe: ${enTrain ? 'début' : 'fin'}`);
}

/**
 * Met à jour la conversation dans les données utilisateur
 */
async function mettreAJourConversationUtilisateur(conversationId, contactId, type, message) {
    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        if (!utilisateurConnecte.conversations) {
            utilisateurConnecte.conversations = [];
        }
        
        let conversation = utilisateurConnecte.conversations.find(conv => 
            conv.id === conversationId || 
            (type === 'groupe' && conv.groupe_id === contactId) ||
            (type === 'contact' && conv.participants?.includes(contactId))
        );
        
        if (!conversation) {
            conversation = {
                id: conversationId,
                type: type === 'groupe' ? 'groupe' : 'individuelle',
                participants: type === 'groupe' ? [] : [utilisateurConnecte.id, contactId],
                groupe_id: type === 'groupe' ? contactId : undefined,
                derniere_activite: message.timestamp,
                dernier_message: message.contenu.texte,
                messages_non_lus: 0,
                epingle: false,
                archive: false,
                silencieux: false
            };
            utilisateurConnecte.conversations.push(conversation);
        } else {
            conversation.derniere_activite = message.timestamp;
            conversation.dernier_message = message.contenu.texte;
        }
        
        // Sauvegarder
        localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurConnecte));
        
        await fetch(`${URL_UTILISATEURS}/${utilisateurConnecte.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversations: utilisateurConnecte.conversations
            })
        });
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la conversation:', error);
    }
}

/**
 * Affiche une erreur d'envoi
 */
function afficherErreurEnvoi() {
    const zoneMessages = document.getElementById('zoneMessages');
    if (!zoneMessages) return;
    
    const erreurDiv = document.createElement('div');
    erreurDiv.className = 'flex justify-center mb-4';
    erreurDiv.innerHTML = `
        <div class="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
            <i class="fa-solid fa-exclamation-triangle mr-2"></i>
            Erreur lors de l'envoi du message
        </div>
    `;
    
    zoneMessages.appendChild(erreurDiv);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        erreurDiv.remove();
    }, 3000);
}

/**
 * Nettoie les ressources lors de la fermeture
 */
export function nettoyerMessaging() {
    if (intervalRafraichissement) {
        clearInterval(intervalRafraichissement);
        intervalRafraichissement = null;
    }
    conversationActive = null;
}

// Initialiser automatiquement
document.addEventListener('DOMContentLoaded', () => {
    initialiserMessaging();
});