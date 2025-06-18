// epingle.js - Gestion de l'épinglage des discussions
import { rechargerApresArchivage } from "./accueilvue";
const URL_GROUPES = "https://devchat-jsi7.onrender.com/groupes";

const URL_UTILISATEURS = "https://devchat-jsi7.onrender.com/utilisateurs";

/**
 * Initialise la fonctionnalité d'épinglage
 */
export function initialiserEpinglage() {
    console.log("Initialisation de la fonctionnalité d'épinglage");
}

/**
 * Ajoute les options d'épinglage au menu contextuel des conversations
 * @param {Element} elementConversation - L'élément de conversation
 * @param {string} conversationId - ID de la conversation
 * @param {string} type - Type de conversation (contact/groupe)
 */
export function ajouterMenuEpinglage(elementConversation, conversationId, type) {
    // Ajouter l'événement de clic droit pour le menu contextuel
    elementConversation.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        afficherMenuContextuel(e, conversationId, type);
    });

    // Ajouter l'événement de long press pour mobile
    let pressTimer;
    elementConversation.addEventListener('mousedown', (e) => {
        pressTimer = setTimeout(() => {
            afficherMenuContextuel(e, conversationId, type);
        }, 800);
    });

    elementConversation.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
    });

    elementConversation.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
    });
}

/**
 * Affiche le menu contextuel avec l'option d'épinglage
 * @param {Event} event - Événement de clic
 * @param {string} conversationId - ID de la conversation
 * @param {string} type - Type de conversation
 */
function afficherMenuContextuel(event, conversationId, type) {
    // Supprimer les menus existants
    const menusExistants = document.querySelectorAll('.menu-contextuel-epingle');
    menusExistants.forEach(menu => menu.remove());

    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    const conversation = utilisateurConnecte.conversations?.find(conv => {
        if (type === 'groupe') {
            return conv.groupe_id === conversationId;
        } else {
            return conv.participants?.includes(conversationId);
        }
    });

    const estEpingle = conversation?.epingle || false;

    const menu = document.createElement('div');
    menu.className = 'menu-contextuel-epingle fixed bg-white shadow-lg rounded-lg border z-50 py-2 min-w-[180px]';
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;

     if (type === 'groupe') {
        menu.innerHTML = `
            <div class="menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm" data-action="${estEpingle ? 'desepingler' : 'epingler'}">
                <i class="fa-solid ${estEpingle ? 'fa-thumbtack-slash' : 'fa-thumbtack'} text-gray-600"></i>
                <span>${estEpingle ? 'Désépingler la discussion' : 'Épingler la discussion'}</span>
            </div>
            <div class="menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm" data-action="gerer-membres">
                <i class="fa-solid fa-users-cog text-blue-600"></i>
                <span>Gérer les membres</span>
            </div>
            <div class="menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm" data-action="ajouter-membre">
                <i class="fa-solid fa-user-plus text-green-600"></i>
                <span>Ajouter un membre</span>
            </div>
            <div class="menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm" data-action="silencieux">
                <i class="fa-solid ${conversation?.silencieux ? 'fa-bell' : 'fa-bell-slash'} text-gray-600"></i>
                <span>${conversation?.silencieux ? 'Activer les notifications' : 'Désactiver les notifications'}</span>
            </div>
            <div class="menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm" data-action="archiver">
                <i class="fa-solid fa-box-archive text-gray-600"></i>
                <span>Archiver la discussion</span>
            </div>
            <div class="menu-item px-4 py-2 hover:bg-red-100 cursor-pointer flex items-center gap-3 text-sm text-red-600" data-action="supprimer">
                <i class="fa-solid fa-trash text-red-600"></i>
                <span>Supprimer la discussion</span>
            </div>
        `;
    } else {
        // Menu pour les contacts individuels (code existant)
        menu.innerHTML = `
            <div class="menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm" data-action="${estEpingle ? 'desepingler' : 'epingler'}">
                <i class="fa-solid ${estEpingle ? 'fa-thumbtack-slash' : 'fa-thumbtack'} text-gray-600"></i>
                <span>${estEpingle ? 'Désépingler la discussion' : 'Épingler la discussion'}</span>
            </div>
            <div class="menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm" data-action="silencieux">
                <i class="fa-solid ${conversation?.silencieux ? 'fa-bell' : 'fa-bell-slash'} text-gray-600"></i>
                <span>${conversation?.silencieux ? 'Activer les notifications' : 'Désactiver les notifications'}</span>
            </div>
            <div class="menu-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm" data-action="archiver">
                <i class="fa-solid fa-box-archive text-gray-600"></i>
                <span>Archiver la discussion</span>
            </div>
            <div class="menu-item px-4 py-2 hover:bg-red-100 cursor-pointer flex items-center gap-3 text-sm text-red-600" data-action="supprimer">
                <i class="fa-solid fa-trash text-red-600"></i>
                <span>Supprimer la discussion</span>
            </div>
        `;
    }


    document.body.appendChild(menu);

    // Ajuster la position si le menu dépasse de l'écran
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
        menu.style.left = `${event.clientX - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
        menu.style.top = `${event.clientY - rect.height}px`;
    }

    // Gérer les clics sur les options du menu
    menu.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            const action = e.currentTarget.dataset.action;
            await gererActionMenu(action, conversationId, type);
            menu.remove();
        });
    });

    // Fermer le menu en cliquant ailleurs
    setTimeout(() => {
        document.addEventListener('click', fermerMenu);
    }, 100);

    function fermerMenu() {
        menu.remove();
        document.removeEventListener('click', fermerMenu);
    }
}
// MODIFICATIONS POUR epingle.js

// Dans la fonction epinglerConversation, remplacer la logique d'épinglage par :
export async function epinglerConversation(conversationId, type, epingler) {
    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        if (!utilisateurConnecte.conversations) {
            utilisateurConnecte.conversations = [];
        }

        // NOUVEAU: Vérifier la limite d'épinglage
        if (epingler) {
            const conversationsEpinglees = utilisateurConnecte.conversations.filter(conv => conv.epingle);
            if (conversationsEpinglees.length >= 3) {
                afficherNotification('Vous ne pouvez épingler que 3 conversations maximum', 'error');
                return;
            }
        }

        // Trouver ou créer la conversation
        let conversation = utilisateurConnecte.conversations.find(conv => {
            if (type === 'groupe') {
                return conv.groupe_id === conversationId;
            } else {
                return conv.participants?.includes(conversationId);
            }
        });

        if (!conversation) {
            // Créer une nouvelle conversation si elle n'existe pas
            conversation = {
                id: `conv_${Date.now()}`,
                type: type === 'groupe' ? 'groupe' : 'individuelle',
                participants: type === 'groupe' ? [] : [utilisateurConnecte.id, conversationId],
                groupe_id: type === 'groupe' ? conversationId : undefined,
                derniere_activite: new Date().toISOString(),
                messages_non_lus: 0,
                epingle: epingler,
                archive: false,
                silencieux: false
            };
            utilisateurConnecte.conversations.push(conversation);
        } else {
            conversation.epingle = epingler;
        }

        // Mettre à jour sur le serveur
        const response = await fetch(`${URL_UTILISATEURS}/${utilisateurConnecte.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversations: utilisateurConnecte.conversations
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour');
        }

        // Mettre à jour le localStorage
        localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurConnecte));

        // Afficher la notification
        const message = epingler ? 'Discussion épinglée' : 'Discussion désépinglée';
        afficherNotification(message, 'success');

        // Rafraîchir l'affichage des conversations
        if (window.rafraichirContactsGroupes) {
            await window.rafraichirContactsGroupes();
        }

        // Réorganiser les conversations (épinglées en haut)
        reorganiserConversations();

    } catch (error) {
        console.error('Erreur lors de l\'épinglage:', error);
        afficherNotification('Erreur lors de l\'épinglage', 'error');
    }
}
/**
 * Gère les actions du menu contextuel
 * @param {string} action - Action à effectuer
 * @param {string} conversationId - ID de la conversation
 * @param {string} type - Type de conversation
 */
 async function gererActionMenu(action, conversationId, type) {
    try {
        switch (action) {
            case 'epingler':
                await epinglerConversation(conversationId, type, true);
                break;
            case 'desepingler':
                await epinglerConversation(conversationId, type, false);
                break;
            case 'gerer-membres':
                await ouvrirGestionMembres(conversationId);
                break;
            case 'ajouter-membre':
                await ouvrirAjoutMembre(conversationId);
                break;
            case 'silencieux':
                await basculerSilencieux(conversationId, type);
                break;
            case 'archiver':
                await archiverConversation(conversationId, type);
                break;
            case 'supprimer':
                await supprimerConversation(conversationId, type);
                break;
        }
    } catch (error) {
        console.error('Erreur lors de l\'action:', error);
        afficherNotification('Erreur lors de l\'opération', 'error');
    }
}

/**
 * Épingle ou désépingle une conversation
 * @param {string} conversationId - ID de la conversation
 * @param {string} type - Type de conversation
 * @param {boolean} epingler - true pour épingler, false pour désépingler
 */


/**
 * Bascule le mode silencieux d'une conversation
 * @param {string} conversationId - ID de la conversation
 * @param {string} type - Type de conversation
 */
async function basculerSilencieux(conversationId, type) {
    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        const conversation = utilisateurConnecte.conversations?.find(conv => {
            if (type === 'groupe') {
                return conv.groupe_id === conversationId;
            } else {
                return conv.participants?.includes(conversationId);
            }
        });

        if (conversation) {
            conversation.silencieux = !conversation.silencieux;

            const response = await fetch(`${URL_UTILISATEURS}/${utilisateurConnecte.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversations: utilisateurConnecte.conversations
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour');
            }

            localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurConnecte));
            
            const message = conversation.silencieux ? 'Notifications désactivées' : 'Notifications activées';
            afficherNotification(message, 'success');

            if (window.rafraichirContactsGroupes) {
                await window.rafraichirContactsGroupes();
            }
        }
    } catch (error) {
        console.error('Erreur lors du basculement silencieux:', error);
        afficherNotification('Erreur lors de l\'opération', 'error');
    }
}

/**
 * Archive une conversation
 * @param {string} conversationId - ID de la conversation
 * @param {string} type - Type de conversation
 */
async function archiverConversation(conversationId, type) {
    if (!confirm('Êtes-vous sûr de vouloir archiver cette discussion ?')) {
        return;
    }

    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        const conversation = utilisateurConnecte.conversations?.find(conv => {
            if (type === 'groupe') {
                return conv.groupe_id === conversationId;
            } else {
                return conv.participants?.includes(conversationId);
            }
        });

        if (conversation) {
            conversation.archive = true;
            conversation.epingle = false;  

            const response = await fetch(`${URL_UTILISATEURS}/${utilisateurConnecte.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversations: utilisateurConnecte.conversations
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'archivage');
            }

            localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurConnecte));
            afficherNotification('Discussion archivée', 'success');

            if (window.rafraichirContactsGroupes) {
                await window.rafraichirContactsGroupes();
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'archivage:', error);
        afficherNotification('Erreur lors de l\'archivage', 'error');
    }
}

/**
 * Supprime une conversation
 * @param {string} conversationId - ID de la conversation
 * @param {string} type - Type de conversation
 */
async function supprimerConversation(conversationId, type) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette discussion ? Cette action est irréversible.')) {
        return;
    }

    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        // Retirer la conversation de la liste
        utilisateurConnecte.conversations = utilisateurConnecte.conversations?.filter(conv => {
            if (type === 'groupe') {
                return conv.groupe_id !== conversationId;
            } else {
                return !conv.participants?.includes(conversationId);
            }
        }) || [];

        const response = await fetch(`${URL_UTILISATEURS}/${utilisateurConnecte.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversations: utilisateurConnecte.conversations
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }

        localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurConnecte));
        afficherNotification('Discussion supprimée', 'success');

        if (window.rafraichirContactsGroupes) {
            await window.rafraichirContactsGroupes();
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        afficherNotification('Erreur lors de la suppression', 'error');
    }
}

/**
 * Réorganise les conversations pour mettre les épinglées en haut
 */
export function reorganiserConversations() {
    const listeContainer = document.getElementById('listeContactsGroupes');
    if (!listeContainer) return;

    const elements = Array.from(listeContainer.querySelectorAll('.contact-groupe-item'));
    const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');

    // Trier les éléments: épinglés en premier, puis par date
    elements.sort((a, b) => {
        const idA = a.dataset.id;
        const typeA = a.dataset.type;
        const idB = b.dataset.id;
        const typeB = b.dataset.type;

        const convA = utilisateurConnecte.conversations?.find(conv => {
            if (typeA === 'groupe') {
                return conv.groupe_id === idA;
            } else {
                return conv.participants?.includes(idA);
            }
        });

        const convB = utilisateurConnecte.conversations?.find(conv => {
            if (typeB === 'groupe') {
                return conv.groupe_id === idB;
            } else {
                return conv.participants?.includes(idB);
            }
        });

        const epingleA = convA?.epingle || false;
        const epingleB = convB?.epingle || false;

         
        if (epingleA && !epingleB) return -1;
        if (!epingleA && epingleB) return 1;

        
        const dateA = new Date(convA?.derniere_activite || 0);
        const dateB = new Date(convB?.derniere_activite || 0);
        return dateB - dateA;
    });

    // Réorganiser dans le DOM
    elements.forEach(element => {
        listeContainer.appendChild(element);
        
        // Ajouter l'indicateur d'épinglage
        const id = element.dataset.id;
        const type = element.dataset.type;
        const conversation = utilisateurConnecte.conversations?.find(conv => {
            if (type === 'groupe') {
                return conv.groupe_id === id;
            } else {
                return conv.participants?.includes(id);
            }
        });

        if (conversation?.epingle) {
            ajouterIndicateurEpingle(element);
        }
    });
}

/**
 * Ajoute un indicateur visuel d'épinglage à un élément de conversation
 * @param {Element} element - Élément de conversation
 */
function ajouterIndicateurEpingle(element) {
    // Retirer l'indicateur existant s'il y en a un
    const indicateurExistant = element.querySelector('.indicateur-epingle');
    if (indicateurExistant) {
        indicateurExistant.remove();
    }

    // Ajouter le nouvel indicateur
    const indicateur = document.createElement('div');
    indicateur.className = 'indicateur-epingle absolute top-1 right-1 bg-fuchsia-500 text-white rounded-full p-1';
    indicateur.innerHTML = '<i class="fa-solid fa-thumbtack text-[10px]"></i>';
    indicateur.title = 'Discussion épinglée';

    const containerImage = element.querySelector('.relative');
    if (containerImage) {
        containerImage.appendChild(indicateur);
    }
}

/**
 * Affiche une notification à l'utilisateur
 * @param {string} message - Message à afficher
 * @param {string} type - Type de notification (success, error, info)
 */
function afficherNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const couleurs = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    notification.className = `fixed top-4 right-4 ${couleurs[type]} text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in`;
    notification.textContent = message;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Styles CSS pour les animations
const styles = `
    .animate-fade-in {
        animation: fadeIn 0.3s ease-in-out;
    }
    
    .animate-fade-out {
        animation: fadeOut 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    .menu-contextuel-epingle {
        animation: scaleIn 0.15s ease-out;
    }
    
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;
 
if (!document.querySelector('#epingle-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'epingle-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

export { reorganiserConversations as default };


/**
 * Ouvre la popup de gestion des membres du groupe
 * @param {string} groupeId - ID du groupe
 */

async function ouvrirGestionMembres(groupeId) {
    try {
        // Récupérer les données du groupe
        const responseGroupe = await fetch(`${URL_GROUPES}/${groupeId}`);
        if (!responseGroupe.ok) {
            throw new Error(`Groupe non trouvé: ${responseGroupe.status}`);
        }
        const groupe = await responseGroupe.json();

        // Utiliser les contacts de l'utilisateur connecté
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        const contacts = utilisateurConnecte.liste_contacts || [];

        // Créer la popup
        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        popup.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-800">Gérer les membres - ${groupe.nom}</h3>
                    <button class="btn-fermer text-gray-500 hover:text-gray-700">
                        <i class="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="space-y-4">
                   
 
${groupe.membres.map(membre => {
    const membreId = membre.utilisateur_id;
    
     
    if (!membreId) {
        console.warn('Membre sans ID trouvé:', membre);
        return '';
    }
     
    const idUtilisateurReel = extraireIdUtilisateur(membreId);
    
    // Chercher d'abord dans les contacts avec l'ID extrait
    let contact = contacts.find(c => extraireIdUtilisateur(c.id) === idUtilisateurReel);
    
    const estAdmin = membre.role === 'administrateur';
    const estCreateur = groupe.createur === membreId;
    const peutModifier = groupe.membres.find(m => m.id === utilisateurConnecte.id)?.role === 'administrateur' || groupe.createur === utilisateurConnecte.id;
    
    // Déterminer le nom et la photo à afficher
    let nomAffiche, photoAffichee;
    
    if (membreId === utilisateurConnecte.id || idUtilisateurReel === utilisateurConnecte.id) {
        // C'est l'utilisateur connecté lui-même
        nomAffiche = utilisateurConnecte.nom;
        photoAffichee = utilisateurConnecte.photo_profil || 'src/img/default-avatar.png';
    } else if (contact) {
        // C'est un contact
        nomAffiche = contact.nom_personnalise || contact.nom;
        photoAffichee = contact.photo_profil || 'src/img/default-avatar.png';
    } else {
        // Contact non trouvé, utiliser l'ID comme nom
        nomAffiche = `Utilisateur ${idUtilisateurReel}`;
        photoAffichee = 'src/img/default-avatar.png';
    }
    
    return `
        <div class="flex items-center justify-between p-3 border rounded-lg">
            <div class="flex items-center gap-3">
                <img src="${photoAffichee}" 
                     alt="Profil" class="w-10 h-10 rounded-full object-cover">
                <div>
                    <h4 class="font-semibold">${nomAffiche}</h4>
                    <p class="text-sm text-gray-500">
                        ${estCreateur ? 'Créateur du groupe' : (estAdmin ? 'Administrateur' : 'Membre')}
                    </p>
                </div>
            </div>
            
            ${peutModifier && !estCreateur && membreId !== utilisateurConnecte.id ? `
                <div class="flex gap-2">
                    <button class="btn-admin ${estAdmin ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-3 py-1 rounded text-sm"
                            data-membre-id="${membreId}" data-est-admin="${estAdmin}">
                        ${estAdmin ? 'Retirer admin' : 'Nommer admin'}
                    </button>
                    <button class="btn-exclure bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            data-membre-id="${membreId}">
                        Exclure
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}).join('')}
                </div>
                
                <div class="mt-6 flex justify-end">
                    <button class="btn-fermer bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        Fermer
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Gérer les événements
        popup.querySelectorAll('.btn-fermer').forEach(btn => {
            btn.addEventListener('click', () => popup.remove());
        });

        popup.querySelectorAll('.btn-admin').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const membreId = e.target.dataset.membreId;
                const estAdmin = e.target.dataset.estAdmin === 'true';
                await basculerAdministrateur(groupeId, membreId, !estAdmin);
                popup.remove();
                await ouvrirGestionMembres(groupeId); // Recharger la popup
            });
        });

        popup.querySelectorAll('.btn-exclure').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const membreId = e.target.dataset.membreId;
                if (confirm('Êtes-vous sûr de vouloir exclure ce membre ?')) {
                    await retirerMembreGroupe(groupeId, membreId);
                    popup.remove();
                    await ouvrirGestionMembres(groupeId); // Recharger la popup
                }
            });
        });

        // Fermer en cliquant à l'extérieur
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.remove();
        });

    } catch (error) {
        console.error('Erreur lors de l\'ouverture de la gestion des membres:', error);
        afficherNotification('Erreur lors du chargement des membres', 'error');
    }
}

/**
 * Ouvre la popup d'ajout de membre
 * @param {string} groupeId - ID du groupe
 */
async function ouvrirAjoutMembre(groupeId) {
    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        const contacts = utilisateurConnecte.liste_contacts || [];

        // Récupérer les données du groupe
        const responseGroupe = await fetch(`${URL_GROUPES}/${groupeId}`);
        if (!responseGroupe.ok) {
            throw new Error(`Groupe non trouvé: ${responseGroupe.status}`);
        }
        const groupe = await responseGroupe.json();

        // CORRECTION: Filtrer les contacts qui ne sont pas déjà membres
        const membresIds = groupe.membres.map(membre => membre.id);
        const contactsDisponibles = contacts.filter(contact => 
            !membresIds.includes(contact.id)
        );

        if (contactsDisponibles.length === 0) {
            afficherNotification('Tous vos contacts sont déjà membres de ce groupe', 'info');
            return;
        }

        const popup = document.createElement('div');
        popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        popup.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-800">Ajouter un membre</h3>
                    <button class="btn-fermer text-gray-500 hover:text-gray-700">
                        <i class="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="space-y-3 max-h-60 overflow-y-auto">
                    ${contactsDisponibles.map(contact => `
                        <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div class="flex items-center gap-3">
                                <img src="${contact.photo_profil || 'src/img/default-avatar.png'}" 
                                     alt="Profil" class="w-10 h-10 rounded-full object-cover">
                                <h4 class="font-semibold">${contact.nom}</h4>
                            </div>
                            <button class="btn-ajouter bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                    data-contact-id="${contact.id}">
                                Ajouter
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="mt-6 flex justify-end gap-2">
                    <button class="btn-fermer bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        Annuler
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        // Gérer les événements
        popup.querySelectorAll('.btn-fermer').forEach(btn => {
            btn.addEventListener('click', () => popup.remove());
        });

        popup.querySelectorAll('.btn-ajouter').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const contactId = e.target.dataset.contactId;
                await ajouterMembreGroupe(groupeId, contactId);
                popup.remove();
            });
        });

        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.remove();
        });

    } catch (error) {
        console.error('Erreur lors de l\'ouverture de l\'ajout de membre:', error);
        afficherNotification('Erreur lors du chargement des contacts', 'error');
    }
}

/**
 * Bascule le statut d'administrateur d'un membre
 * @param {string} groupeId - ID du groupe
 * @param {string} membreId - ID du membre
 * @param {boolean} nommerAdmin - true pour nommer admin, false pour retirer
 */

async function basculerAdministrateur(groupeId, membreId, nommerAdmin) {
    try {
        const responseGroupe = await fetch(`${URL_GROUPES}/${groupeId}`);
        if (!responseGroupe.ok) {
            throw new Error(`Groupe non trouvé: ${responseGroupe.status}`);
        }
        const groupe = await responseGroupe.json();

        // CORRECTION: Modifier le rôle du membre dans l'array membres
        const membreIndex = groupe.membres.findIndex(m => m.id === membreId);
        if (membreIndex !== -1) {
            groupe.membres[membreIndex].role = nommerAdmin ? 'administrateur' : 'membre';
        }

        const response = await fetch(`${URL_GROUPES}/${groupeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                membres: groupe.membres
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour');
        }

        const message = nommerAdmin ? 'Administrateur ajouté avec succès' : 'Administrateur retiré avec succès';
        afficherNotification(message, 'success');

        // Rafraîchir l'affichage
        if (window.rafraichirContactsGroupes) {
            await window.rafraichirContactsGroupes();
        }

    } catch (error) {
        console.error('Erreur lors du basculement administrateur:', error);
        afficherNotification('Erreur lors de la modification', 'error');
    }
}


/**
 * Ajoute un membre au groupe
 * @param {string} groupeId - ID du groupe
 * @param {string} membreId - ID du membre à ajouter
 */

async function ajouterMembreGroupe(groupeId, membreId) {
    try {
        const responseGroupe = await fetch(`${URL_GROUPES}/${groupeId}`);
        if (!responseGroupe.ok) {
            throw new Error(`Groupe non trouvé: ${responseGroupe.status}`);
        }
        const groupe = await responseGroupe.json();

        // CORRECTION: Vérifier si le membre n'existe pas déjà
        const membreExiste = groupe.membres.find(m => m.id === membreId);
        if (!membreExiste) {
            // Ajouter le nouveau membre avec la structure correcte
            const nouveauMembre = {
                id: membreId,
                role: "membre",
                date_ajout: new Date().toISOString(),
                ajoute_par: JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}').id
            };
            groupe.membres.push(nouveauMembre);

            const response = await fetch(`${URL_GROUPES}/${groupeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    membres: groupe.membres
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout');
            }

            // CORRECTION: Vérifier si l'utilisateur existe avant de le modifier
            const responseUtilisateur = await fetch(`${URL_UTILISATEURS}/${membreId}`);
            if (responseUtilisateur.ok) {
                const utilisateur = await responseUtilisateur.json();
                
                if (!utilisateur.groupes_membre.includes(groupeId)) {
                    utilisateur.groupes_membre.push(groupeId);
                    
                    await fetch(`${URL_UTILISATEURS}/${membreId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            groupes_membre: utilisateur.groupes_membre
                        })
                    });
                }
            }

            afficherNotification('Membre ajouté avec succès', 'success');

            // Rafraîchir l'affichage
            if (window.rafraichirContactsGroupes) {
                await window.rafraichirContactsGroupes();
            }
        }

    } catch (error) {
        console.error('Erreur lors de l\'ajout du membre:', error);
        afficherNotification('Erreur lors de l\'ajout du membre', 'error');
    }
}

/**
 * Retire un membre du groupe
 * @param {string} groupeId - ID du groupe
 * @param {string} membreId - ID du membre à retirer
 */

async function retirerMembreGroupe(groupeId, membreId) {
    try {
        const responseGroupe = await fetch(`${URL_GROUPES}/${groupeId}`);
        if (!responseGroupe.ok) {
            throw new Error(`Groupe non trouvé: ${responseGroupe.status}`);
        }
        const groupe = await responseGroupe.json();

        // CORRECTION: Retirer le membre de l'array membres
        groupe.membres = groupe.membres.filter(membre => membre.id !== membreId);

        const response = await fetch(`${URL_GROUPES}/${groupeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                membres: groupe.membres
            })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }

        // Retirer le groupe de la liste des groupes de l'utilisateur
        const responseUtilisateur = await fetch(`${URL_UTILISATEURS}/${membreId}`);
        if (responseUtilisateur.ok) {
            const utilisateur = await responseUtilisateur.json();
            
            utilisateur.groupes_membre = utilisateur.groupes_membre.filter(id => id !== groupeId);
            
            await fetch(`${URL_UTILISATEURS}/${membreId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    groupes_membre: utilisateur.groupes_membre
                })
            });
        }

        afficherNotification('Membre exclu avec succès', 'success');

        // Rafraîchir l'affichage
        if (window.rafraichirContactsGroupes) {
            await window.rafraichirContactsGroupes();
        }

    } catch (error) {
        console.error('Erreur lors de l\'exclusion du membre:', error);
        afficherNotification('Erreur lors de l\'exclusion du membre', 'error');
    }
}


// Fonction corrigée pour extraire l'ID utilisateur des contacts
function extraireIdUtilisateur(contactId) {
    // Si l'ID contient "_mutual", extraire seulement la partie numérique
    if (contactId.includes('_mutual')) {
        const parties = contactId.split('_');
        // Retourner la partie qui contient les chiffres (généralement la deuxième partie)
        return parties.find(partie => /^\d+$/.test(partie)) || contactId;
    }
    return contactId;
}
