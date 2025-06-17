// archivage.js - Système d'archivage pour les conversations
const URL_UTILISATEURS = "https://devchat-jsi7.onrender.com/utilisateurs";

let conversationSelectionneeArchive = null;


export function initialiserArchivage() {
    const boutonArchive = document.querySelector('.Archivage');
    if (boutonArchive) {
        boutonArchive.addEventListener('click', gererArchivage);
    }
}
// Fonction principale pour gérer l'archivage
async function gererArchivage() {
    // Vérifier si une conversation est sélectionnée
    const conversationActive = obtenirConversationActive();
    
    if (!conversationActive) {
        afficherNotification('Veuillez sélectionner une conversation à archiver', 'warning');
        return;
    }

    // Afficher popup de confirmation
    afficherPopupConfirmationArchivage(conversationActive);
}

// Fonction pour obtenir la conversation actuellement active
function obtenirConversationActive() {
    const elementSelectionne = document.querySelector('.contact-groupe-item.bg-fuchsia-50');
    if (!elementSelectionne) return null;

    const id = elementSelectionne.dataset.id;
    const type = elementSelectionne.dataset.type;
    const nom = elementSelectionne.querySelector('h4').textContent;

    return {
        id: id,
        type: type,
        nom: nom,
        element: elementSelectionne
    };
}

// Fonction pour afficher le popup de confirmation d'archivage
function afficherPopupConfirmationArchivage(conversation) {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    popup.id = 'popupArchivage';
    
    popup.innerHTML = `
        <div class="bg-white rounded-lg shadow-2xl p-6 w-96 max-w-md mx-4 transform transition-all duration-300 scale-95 opacity-0" id="contenuPopupArchivage">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center">
                    <i class="fa-solid fa-box-archive text-fuchsia-500 mr-2"></i>
                    Archiver la conversation
                </h3>
                <button class="text-gray-400 hover:text-gray-600 transition-colors" onclick="fermerPopupArchivage()">
                    <i class="fa-solid fa-times text-lg"></i>
                </button>
            </div>
            
            <div class="mb-6">
                <div class="flex items-center mb-3">
                    <div class="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center mr-3">
                        <i class="fa-solid fa-${conversation.type === 'groupe' ? 'users' : 'user'} text-fuchsia-600"></i>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-800">${conversation.nom}</h4>
                        <p class="text-sm text-gray-500">${conversation.type === 'groupe' ? 'Groupe' : 'Contact'}</p>
                    </div>
                </div>
                
                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <p class="text-sm text-yellow-800">
                        <i class="fa-solid fa-info-circle mr-1"></i>
                        Cette conversation sera archivée et ne sera plus visible dans votre liste principale. 
                        Vous pourrez la restaurer depuis les archives à tout moment.
                    </p>
                </div>
            </div>
            
            <div class="flex space-x-3">
                <button 
                    class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    onclick="fermerPopupArchivage()"
                >
                    Annuler
                </button>
                <button 
                    class="flex-1 bg-fuchsia-600 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors font-medium"
                    onclick="confirmerArchivage('${conversation.id}', '${conversation.type}')"
                >
                    <i class="fa-solid fa-box-archive mr-1"></i>
                    Archiver
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
     
    setTimeout(() => {
        const contenu = document.getElementById('contenuPopupArchivage');
        if (contenu) {
            contenu.classList.remove('scale-95', 'opacity-0');
            contenu.classList.add('scale-100', 'opacity-100');
        }
    }, 10);
}
 
window.fermerPopupArchivage = function() {
    const popup = document.getElementById('popupArchivage');
    if (popup) {
        const contenu = document.getElementById('contenuPopupArchivage');
        if (contenu) {
            contenu.classList.add('scale-95', 'opacity-0');
            contenu.classList.remove('scale-100', 'opacity-100');
        }
        
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
};

window.confirmerArchivage = async function(conversationId, conversationType) {
    try {
        // Récupérer l'utilisateur connecté
        const userConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        // Récupérer les données utilisateur depuis l'API
        const response = await fetch(URL_UTILISATEURS);
        const utilisateurs = await response.json();
        
        const utilisateurIndex = utilisateurs.findIndex(u => u.id === userConnecte.id);
        if (utilisateurIndex === -1) {
            throw new Error('Utilisateur non trouvé');
        }
        
        const utilisateur = utilisateurs[utilisateurIndex];
        
        // Trouver et modifier la conversation
        const conversationIndex = utilisateur.conversations.findIndex(conv => {
            if (conversationType === 'groupe') {
                return conv.groupe_id === conversationId;
            } else {
                return conv.participants && conv.participants.includes(conversationId);
            }
        });
        
        if (conversationIndex !== -1) {
            // Marquer la conversation comme archivée
            utilisateur.conversations[conversationIndex].archive = true;
            utilisateur.conversations[conversationIndex].date_archivage = new Date().toISOString();
            
            // Mettre à jour via l'API
            const updateResponse = await fetch(`${URL_UTILISATEURS}/${utilisateur.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(utilisateur)
            });
            
            if (updateResponse.ok) {
                // Fermer le popup
                fermerPopupArchivage();
                
                // Afficher notification de succès
                afficherNotification('Conversation archivée avec succès', 'success');
                
                // Rafraîchir l'affichage
                await rafraichirAffichageApresArchivage(conversationId, conversationType);
                
                // Effacer la sélection de conversation
                effacerSelectionConversation();
                
            } else {
                throw new Error('Erreur lors de la mise à jour');
            }
        } else {
            throw new Error('Conversation non trouvée');
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'archivage:', error);
        afficherNotification('Erreur lors de l\'archivage de la conversation', 'error');
    }
};



async function rafraichirAffichageApresArchivage(conversationId, conversationType) {
     
    const elementASupprimer = document.querySelector(`[data-id="${conversationId}"]`);
    if (elementASupprimer) {
        elementASupprimer.style.transition = 'all 0.3s ease';
        elementASupprimer.style.transform = 'translateX(-100%)';
        elementASupprimer.style.opacity = '0';
        
        setTimeout(() => {
            elementASupprimer.remove();
        }, 300);
    }
     
    try {
       
        const { rechargerApresArchivage } = await import('./accueilvue.js');
        
        setTimeout(async () => {
            await rechargerApresArchivage();
            
             
            const listeContainer = document.querySelector("#listeContactsGroupes");
            if (listeContainer && listeContainer.children.length === 0) {
                listeContainer.innerHTML = `
                    <div class="text-center text-gray-500 py-8">
                        <i class="fa-solid fa-archive text-4xl text-gray-300 mb-2"></i>
                        <p>Aucune conversation disponible</p>
                        <p class="text-sm">Toutes vos conversations sont archivées</p>
                    </div>
                `;
            }
        }, 400);
        
    } catch (error) {
        console.error('Erreur lors du rechargement:', error);
        // Fallback : recharger la page complète si nécessaire
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}


// Fonction pour effacer la sélection de conversation
function effacerSelectionConversation() {
    // Réinitialiser la zone de discussion
    const zoneDiscussion = document.querySelector('.discussion');
    if (zoneDiscussion) {
        zoneDiscussion.innerHTML = `
            <!-- En-tête -->
            <div class="flex items-center justify-between bg-white p-3 shadow">
                <div class="flex items-center space-x-4">
                    <img src="src/img/ndeye.jpeg" alt="Profil" class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <h4 class="font-semibold text-gray-800">Sélectionnez une conversation</h4>
                        <p class="text-sm text-gray-500">Choisissez un contact ou groupe pour commencer</p>
                    </div>
                </div>
            </div>

            <!-- Zone des messages -->
            <div class="flex-1 p-4 overflow-y-auto space-y-4 flex items-center justify-center">
                <div class="text-center text-gray-500">
                    <i class="fa-solid fa-comments text-6xl text-gray-300 mb-4"></i>
                    <p class="text-lg">Sélectionnez une conversation pour commencer à discuter</p>
                </div>
            </div>
        `;
    }
}

// Fonction pour afficher les notifications
function afficherNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const notificationExistante = document.querySelector('.notification-archivage');
    if (notificationExistante) {
        notificationExistante.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification-archivage fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
    
    const couleurs = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    const icones = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.className += ` ${couleurs[type]}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fa-solid ${icones[type]} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Suppression automatique après 3 secondes
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Fonction pour voir les conversations archivées
export function afficherConversationsArchivees() {
     
    console.log('Affichage des conversations archivées...');
    // Implémenter selon les besoins
}

export async function restaurerConversation(conversationId, conversationType) {
    try {
        const userConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        const response = await fetch(URL_UTILISATEURS);
        const utilisateurs = await response.json();
        
        const utilisateurIndex = utilisateurs.findIndex(u => u.id === userConnecte.id);
        if (utilisateurIndex === -1) {
            throw new Error('Utilisateur non trouvé');
        }
        
        const utilisateur = utilisateurs[utilisateurIndex];
        
        const conversationIndex = utilisateur.conversations.findIndex(conv => {
            if (conversationType === 'groupe') {
                return conv.groupe_id === conversationId;
            } else {
                return conv.participants && conv.participants.includes(conversationId);
            }
        });
        
        if (conversationIndex !== -1) {
            utilisateur.conversations[conversationIndex].archive = false;
            delete utilisateur.conversations[conversationIndex].date_archivage;
            
            const updateResponse = await fetch(`${URL_UTILISATEURS}/${utilisateur.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(utilisateur)
            });
            
            if (updateResponse.ok) {
                // Mettre à jour localStorage
                localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateur));
                
                afficherNotification('Conversation restaurée avec succès', 'success');
                
                // Recharger l'affichage si on est dans le filtre archives
                if (window.filtreActuel === 'archives') {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
                
                return true;
            } else {
                throw new Error('Erreur lors de la restauration');
            }
        }
        
    } catch (error) {
        console.error('Erreur lors de la restauration:', error);
        afficherNotification('Erreur lors de la restauration de la conversation', 'error');
        return false;
    }
}

export async function afficherListeArchives() {
    try {
        const userConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        const response = await fetch(URL_UTILISATEURS);
        const utilisateurs = await response.json();
        
        const utilisateur = utilisateurs.find(u => u.id === userConnecte.id);
        if (!utilisateur) {
            throw new Error('Utilisateur non trouvé');
        }
        
        // Récupérer les conversations archivées
        const conversationsArchivees = utilisateur.conversations?.filter(conv => conv.archive) || [];
        
        // Récupérer les groupes et contacts pour obtenir les détails
        const responseGroupes = await fetch("https://devchat-jsi7.onrender.com/groupes");
        const groupes = await responseGroupes.json();
        
        const archives = [];
        
        for (const conv of conversationsArchivees) {
            let item = null;
            let type = '';
            
            if (conv.groupe_id) {
               
                item = groupes.find(g => g.id === conv.groupe_id);
                type = 'groupe';
            } else if (conv.participants) {
                
                const autreParticipant = conv.participants.find(p => p !== userConnecte.id);
                item = utilisateur.liste_contacts?.find(c => c.id === autreParticipant);
                type = 'contact';
            }
            
            if (item) {
                archives.push({
                    conversation: conv,
                    item: item,
                    type: type
                });
            }
        }
        
        afficherPopupArchives(archives);
        
    } catch (error) {
        console.error('Erreur lors du chargement des archives:', error);
        afficherNotification('Erreur lors du chargement des archives', 'error');
    }
}

export async function compterConversationsArchivees() {
    try {
        const userConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        const response = await fetch(URL_UTILISATEURS);
        const utilisateurs = await response.json();
        
        const utilisateur = utilisateurs.find(u => u.id === userConnecte.id);
        if (!utilisateur || !utilisateur.conversations) {
            return 0;
        }
        
        return utilisateur.conversations.filter(conv => conv.archive === true).length;
    } catch (error) {
        console.error('Erreur lors du comptage des archives:', error);
        return 0;
    }
}