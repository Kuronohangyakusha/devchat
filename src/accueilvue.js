import { ouvrirPopupAjoutContact } from './ajoutvue.js';
import { ouvrirPopupAjoutGroupe } from './groupevue.js';
import { deconnecterUtilisateur } from './loginVue.js';
import { initialiserStatut, mettreAJourIndicateurStatut } from './status.js';
import { initialiserDiffusion } from './diffusion.js';
import { initialiserArchivage } from './archivage.js';
import { initialiserEpinglage, ajouterMenuEpinglage, reorganiserConversations } from './epingle.js';
import { initialiserAppels } from './appel.js';
import { initialiserMessaging } from './messaging.js';

const URL_UTILISATEURS = "https://devchat-jsi7.onrender.com/utilisateurs";
const URL_GROUPES = "https://devchat-jsi7.onrender.com/groupes";
const URL_MESSAGES = "https://devchat-jsi7.onrender.com/messages";

let filtreActuel = 'tous';
let conversationSelectionnee = null;

export function ComposantAccueil(composant) {
    composant.innerHTML = `
        <div class="flex h-screen bg-gray-100">
            <!-- Sidebar gauche -->
            <div class="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                <!-- Header avec profil utilisateur -->
                <div class="navbarRecherche bg-fuchsia-900 text-white p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="relative">
                                <img id="photoProfilUtilisateur" src="src/img/ndeye.jpeg" alt="Profil" class="w-10 h-10 rounded-full object-cover cursor-pointer">
                            </div>
                            <div>
                                <h3 id="nomUtilisateur" class="font-semibold">Utilisateur</h3>
                                <p class="text-sm text-fuchsia-200">En ligne</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="Statut p-2 hover:bg-fuchsia-700 rounded-full transition-colors" title="Statut">
                                <div class="boutonStatut">
                                    <i class="fa-solid fa-circle-info text-white"></i>
                                </div>
                            </button>
                            <button class="p-2 hover:bg-fuchsia-700 rounded-full transition-colors" title="Nouvelle discussion">
                                <i class="fa-solid fa-comment-dots text-white"></i>
                            </button>
                            <button id="btnDeconnexion" class="p-2 hover:bg-fuchsia-700 rounded-full transition-colors" title="Déconnexion">
                                <i class="fa-solid fa-sign-out-alt text-white"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Barre de recherche -->
                <div class="p-4 border-b">
                    <div class="relative">
                        <input type="text" id="rechercheConversation" placeholder="Rechercher une conversation..." 
                               class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                        <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                <!-- Filtres -->
                <div class="p-4 border-b">
                    <div class="flex space-x-2">
                        <button class="filtre-btn active px-3 py-1 text-sm rounded-full bg-fuchsia-100 text-fuchsia-700" data-filtre="tous">
                            Tous
                        </button>
                        <button class="filtre-btn px-3 py-1 text-sm rounded-full hover:bg-gray-100" data-filtre="non-lus">
                            Non lus
                        </button>
                        <button class="filtre-btn px-3 py-1 text-sm rounded-full hover:bg-gray-100" data-filtre="favoris">
                            Favoris
                        </button>
                        <button class="filtre-btn px-3 py-1 text-sm rounded-full hover:bg-gray-100" data-filtre="groupes">
                            Groupes
                        </button>
                    </div>
                </div>

                <!-- Actions rapides -->
                <div class="p-4 border-b">
                    <div class="grid grid-cols-4 gap-2">
                        <button id="btnAjouterContact" class="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <i class="fa-solid fa-user-plus text-fuchsia-600 text-lg mb-1"></i>
                            <span class="text-xs text-gray-600">Contact</span>
                        </button>
                        <button id="btnAjouterGroupe" class="flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <i class="fa-solid fa-users text-green-600 text-lg mb-1"></i>
                            <span class="text-xs text-gray-600">Groupe</span>
                        </button>
                        <button class="Diffusion flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <i class="fa-solid fa-broadcast-tower text-blue-600 text-lg mb-1"></i>
                            <span class="text-xs text-gray-600">Diffusion</span>
                        </button>
                        <button class="Archivage flex flex-col items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <i class="fa-solid fa-box-archive text-orange-600 text-lg mb-1"></i>
                            <span class="text-xs text-gray-600">Archives</span>
                        </button>
                    </div>
                </div>

                <!-- Liste des conversations -->
                <div class="flex-1 overflow-y-auto">
                    <div id="listeContactsGroupes" class="space-y-1">
                        <!-- Les conversations seront chargées ici -->
                    </div>
                </div>
            </div>

            <!-- Zone de discussion principale -->
            <div class="flex-1 flex flex-col discussion">
                <!-- État initial -->
                <div class="flex items-center justify-between bg-white p-4 shadow-sm">
                    <div class="flex items-center space-x-4">
                        <img src="src/img/ndeye.jpeg" alt="Profil" class="w-10 h-10 rounded-full object-cover">
                        <div>
                            <h4 class="font-semibold text-gray-800">Sélectionnez une conversation</h4>
                            <p class="text-sm text-gray-500">Choisissez un contact ou groupe pour commencer</p>
                        </div>
                    </div>
                </div>

                <div class="flex-1 flex items-center justify-center bg-gray-50">
                    <div class="text-center text-gray-500">
                        <i class="fa-solid fa-comments text-6xl text-gray-300 mb-4"></i>
                        <p class="text-lg">Sélectionnez une conversation pour commencer à discuter</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialiser tous les modules
    initialiserComposants();
    
    // Charger les données utilisateur
    chargerDonneesUtilisateur();
    
    // Charger les conversations
    chargerContactsEtGroupes();
}

function initialiserComposants() {
    // Initialiser tous les modules
    initialiserMessaging();
    initialiserStatut();
    initialiserDiffusion();
    initialiserArchivage();
    initialiserEpinglage();
    initialiserAppels();
    
    // Ajouter les événements
    ajouterEvenements();
}

function ajouterEvenements() {
    // Bouton déconnexion
    document.getElementById('btnDeconnexion')?.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            deconnecterUtilisateur();
            location.reload();
        }
    });

    // Boutons d'ajout
    document.getElementById('btnAjouterContact')?.addEventListener('click', ouvrirPopupAjoutContact);
    document.getElementById('btnAjouterGroupe')?.addEventListener('click', ouvrirPopupAjoutGroupe);

    // Filtres
    document.querySelectorAll('.filtre-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filtre = e.target.dataset.filtre;
            changerFiltre(filtre);
        });
    });

    // Recherche
    document.getElementById('rechercheConversation')?.addEventListener('input', (e) => {
        rechercherConversations(e.target.value);
    });
}

function chargerDonneesUtilisateur() {
    const utilisateur = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
    
    if (utilisateur.nom) {
        document.getElementById('nomUtilisateur').textContent = utilisateur.nom;
    }
    
    if (utilisateur.photo_profil) {
        document.getElementById('photoProfilUtilisateur').src = utilisateur.photo_profil;
    }
    
    // Mettre à jour l'indicateur de statut
    mettreAJourIndicateurStatut();
}

async function chargerContactsEtGroupes() {
    try {
        const utilisateur = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        if (!utilisateur.id) return;

        const listeContainer = document.getElementById('listeContactsGroupes');
        if (!listeContainer) return;

        listeContainer.innerHTML = '<div class="p-4 text-center text-gray-500">Chargement...</div>';

        // Charger les contacts
        const contacts = utilisateur.liste_contacts || [];
        
        // Charger les groupes
        const responseGroupes = await fetch(URL_GROUPES);
        const tousGroupes = await responseGroupes.json();
        const groupesUtilisateur = tousGroupes.filter(groupe => 
            groupe.membres.some(membre => membre.id === utilisateur.id)
        );

        // Charger les conversations pour obtenir les derniers messages
        const conversations = utilisateur.conversations || [];

        // Combiner et trier
        const elements = [];

        // Ajouter les contacts
        contacts.forEach(contact => {
            const conversation = conversations.find(conv => 
                conv.participants?.includes(contact.id)
            );
            
            elements.push({
                type: 'contact',
                id: contact.id,
                nom: contact.nom_personnalise || contact.nom,
                photo: contact.photo_profil || genererPhotoParDefaut(contact.nom),
                dernierMessage: conversation?.dernier_message || '',
                derniereActivite: conversation?.derniere_activite || contact.date_ajout,
                messagesNonLus: conversation?.messages_non_lus || 0,
                epingle: conversation?.epingle || false,
                archive: conversation?.archive || false,
                favori: contact.favori || false,
                enLigne: contact.en_ligne || false
            });
        });

        // Ajouter les groupes
        groupesUtilisateur.forEach(groupe => {
            const conversation = conversations.find(conv => 
                conv.groupe_id === groupe.id
            );
            
            elements.push({
                type: 'groupe',
                id: groupe.id,
                nom: groupe.nom,
                photo: groupe.photo_groupe || genererPhotoParDefaut(groupe.nom),
                dernierMessage: conversation?.dernier_message || '',
                derniereActivite: conversation?.derniere_activite || groupe.date_creation,
                messagesNonLus: conversation?.messages_non_lus || 0,
                epingle: conversation?.epingle || false,
                archive: conversation?.archive || false,
                membres: groupe.membres.length
            });
        });

        // Filtrer selon le filtre actuel
        const elementsFiltres = filtrerElements(elements);

        // Trier par épinglage puis par dernière activité
        elementsFiltres.sort((a, b) => {
            if (a.epingle && !b.epingle) return -1;
            if (!a.epingle && b.epingle) return 1;
            return new Date(b.derniereActivite) - new Date(a.derniereActivite);
        });

        // Afficher
        afficherElements(elementsFiltres);

    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        const listeContainer = document.getElementById('listeContactsGroupes');
        if (listeContainer) {
            listeContainer.innerHTML = `
                <div class="p-4 text-center text-red-500">
                    <i class="fa-solid fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>Erreur lors du chargement</p>
                </div>
            `;
        }
    }
}

function filtrerElements(elements) {
    switch (filtreActuel) {
        case 'non-lus':
            return elements.filter(el => el.messagesNonLus > 0);
        case 'favoris':
            return elements.filter(el => el.favori);
        case 'groupes':
            return elements.filter(el => el.type === 'groupe');
        case 'archives':
            return elements.filter(el => el.archive);
        default:
            return elements.filter(el => !el.archive);
    }
}

function afficherElements(elements) {
    const listeContainer = document.getElementById('listeContactsGroupes');
    if (!listeContainer) return;

    if (elements.length === 0) {
        listeContainer.innerHTML = `
            <div class="p-4 text-center text-gray-500">
                <i class="fa-solid fa-inbox text-4xl text-gray-300 mb-2"></i>
                <p>Aucune conversation</p>
                <p class="text-sm">Ajoutez des contacts ou créez un groupe</p>
            </div>
        `;
        return;
    }

    listeContainer.innerHTML = '';

    elements.forEach(element => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'contact-groupe-item flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors';
        elementDiv.dataset.id = element.id;
        elementDiv.dataset.type = element.type;

        const heureMessage = element.derniereActivite ? 
            new Date(element.derniereActivite).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            }) : '';

        elementDiv.innerHTML = `
            <div class="relative mr-3">
                <img src="${element.photo}" alt="${element.nom}" class="w-12 h-12 rounded-full object-cover">
                ${element.epingle ? '<div class="absolute -top-1 -right-1 bg-fuchsia-500 text-white rounded-full p-1"><i class="fa-solid fa-thumbtack text-xs"></i></div>' : ''}
                ${element.type === 'contact' && element.enLigne ? '<div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>' : ''}
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-gray-800 truncate">${element.nom}</h4>
                    <div class="flex items-center space-x-2">
                        ${heureMessage ? `<span class="text-xs text-gray-500">${heureMessage}</span>` : ''}
                        ${element.messagesNonLus > 0 ? `<span class="bg-fuchsia-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">${element.messagesNonLus}</span>` : ''}
                    </div>
                </div>
                <div class="flex items-center justify-between mt-1">
                    <p class="text-sm text-gray-600 truncate">${element.dernierMessage || (element.type === 'groupe' ? `${element.membres} membres` : 'Aucun message')}</p>
                    <div class="flex items-center space-x-1">
                        ${element.favori ? '<i class="fa-solid fa-star text-yellow-500 text-xs"></i>' : ''}
                        ${element.type === 'groupe' ? '<i class="fa-solid fa-users text-gray-400 text-xs"></i>' : ''}
                    </div>
                </div>
            </div>
        `;

        // Ajouter les événements
        elementDiv.addEventListener('click', () => {
            selectionnerConversation(elementDiv, element);
        });

        // Ajouter le menu contextuel
        ajouterMenuEpinglage(elementDiv, element.id, element.type);

        listeContainer.appendChild(elementDiv);
    });
}

function selectionnerConversation(elementDiv, element) {
    // Retirer la sélection précédente
    document.querySelectorAll('.contact-groupe-item').forEach(el => {
        el.classList.remove('bg-fuchsia-50', 'border-l-4', 'border-fuchsia-500');
    });

    // Ajouter la sélection actuelle
    elementDiv.classList.add('bg-fuchsia-50', 'border-l-4', 'border-fuchsia-500');

    conversationSelectionnee = element;

    // Déclencher l'ouverture de la conversation dans le module messaging
    const event = new CustomEvent('ouvrirConversation', {
        detail: {
            id: element.id,
            type: element.type,
            nom: element.nom
        }
    });
    document.dispatchEvent(event);
}

function changerFiltre(nouveauFiltre) {
    filtreActuel = nouveauFiltre;
    
    // Mettre à jour l'interface des filtres
    document.querySelectorAll('.filtre-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-fuchsia-100', 'text-fuchsia-700');
        btn.classList.add('hover:bg-gray-100');
    });
    
    const btnActif = document.querySelector(`[data-filtre="${nouveauFiltre}"]`);
    if (btnActif) {
        btnActif.classList.add('active', 'bg-fuchsia-100', 'text-fuchsia-700');
        btnActif.classList.remove('hover:bg-gray-100');
    }
    
    // Recharger les conversations
    chargerContactsEtGroupes();
}

function rechercherConversations(terme) {
    const elements = document.querySelectorAll('.contact-groupe-item');
    const termeNormalise = terme.toLowerCase().trim();
    
    elements.forEach(element => {
        const nom = element.querySelector('h4').textContent.toLowerCase();
        const dernierMessage = element.querySelector('p').textContent.toLowerCase();
        
        if (nom.includes(termeNormalise) || dernierMessage.includes(termeNormalise)) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

function genererPhotoParDefaut(nom) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    
    const couleurs = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const couleur = couleurs[Math.floor(Math.random() * couleurs.length)];
    
    ctx.fillStyle = couleur;
    ctx.fillRect(0, 0, 100, 100);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const initiales = nom.split(' ')
        .map(mot => mot[0])
        .join('')
        .toUpperCase();
    
    ctx.fillText(initiales.substring(0, 2), 50, 50);
    
    return canvas.toDataURL();
}

// Fonctions exportées pour les autres modules
export async function rafraichirContactsGroupes() {
    await chargerContactsEtGroupes();
}

export async function rechargerApresArchivage() {
    await chargerContactsEtGroupes();
}

// Rendre les fonctions disponibles globalement
window.rafraichirContactsGroupes = rafraichirContactsGroupes;
window.rechargerApresArchivage = rechargerApresArchivage;
window.filtreActuel = filtreActuel;

// Écouter l'événement d'ouverture de conversation
document.addEventListener('ouvrirConversation', (e) => {
    const { id, type, nom } = e.detail;
    // Le module messaging gérera l'ouverture
});