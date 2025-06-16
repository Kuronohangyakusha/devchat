const URL_UTILISATEURS = "https://devchat-jsi7.onrender.com/utilisateurs";
const URL_GROUPES = "https://devchat-jsi7.onrender.com/groupes";
const URL_MESSAGES = "https://devchat-jsi7.onrender.com/messages";
const URL_STATUTS = "https://devchat-jsi7.onrender.com/statuts";
const URL_APPELS = "https://devchat-jsi7.onrender.com/appels";
const URL_PARAMETRES_APPLICATION = "https://devchat-jsi7.onrender.com/parametres_application";

import { ouvrirPopupAjoutContact } from "./ajoutvue.js";
import { ouvrirPopupAjoutGroupe } from "./groupevue.js";
import { initialiserArchivage } from "./archivage";
import { initialiserDiffusion } from "./diffusion";

let utilisateurConnecte = null;
let contactsAffiches = [];
let groupesAffiches = [];
let filtreActuel = 'tous';  

export function ComposantAccueil(e) {
    e.innerHTML = `
    <div class="w-full h-[100vh] flex flex-row">
        <div class="sidebar w-[15%] h-full bg-white flex flex-col gap-16 border-2 border-fuchsia-900">
            <div class="logo w-full h-[10%] bg-white shadow-lg flex flex-row justify-center items-center transform hover:-translate-y-1 transition-transform duration-300">
                <img src="/img/logo-transparent.png" alt="" class="w-[60px]">
                <img src="/img/flower.jpeg" alt="" class="w-[30px]">
            </div>

            <div class="iconeMenu w-full h-[60%] flex flex-col justify-center items-center gap-4">
                <div class="contact flex flex-col h-[100px] justify-center items-center w-full border-b-2 shadow-lg border-fuchsia-900 hover:-translate-y-1 transition-transform duration-300">
                    <div class="buttonAjout w-[30px] h-[30px] rounded-full bg-white flex text-center items-center justify-center border-solid border-fuchsia-300 border-2">
                        <i class="fa-solid fa-user-plus text-fuchsia-300 text-[0.9rem]"></i>
                    </div>
                    <h6 class="text-fuchsia-500 text-[0.6rem]">Ajouter Contact</h6>
                </div>
                <div class="groupes flex flex-col justify-center items-center w-full h-[100px] border-b-2 shadow-lg border-fuchsia-900 hover:-translate-y-1 transition-transform duration-300">
                    <div class="boutonAjoutGroup w-[30px] h-[30px] rounded-full bg-white flex text-center items-center justify-center border-solid border-fuchsia-300 border-2">
                        <i class="fa-solid fa-people-group text-fuchsia-300 text-[0.9rem]"></i>
                    </div>
                    <h6 class="text-fuchsia-500 text-[0.6rem]">Ajouter groupe</h6>
                </div>
                <div class="Archivage flex flex-col justify-center items-center w-full h-[100px] border-b-2 shadow-lg border-fuchsia-900 hover:-translate-y-1 transition-transform duration-300">
                    <div class="boutonArchive w-[30px] h-[30px] rounded-full bg-white flex text-center items-center justify-center border-solid border-fuchsia-300 border-2">
                        <i class="fa-solid fa-box-archive text-fuchsia-300 text-[0.9rem]"></i>
                    </div>
                    <h6 class="text-fuchsia-500 text-[0.6rem]">Archiver</h6>
                </div>
                <div class="Diffusion flex flex-col justify-center items-center w-full h-[100px] border-b-2 shadow-lg border-fuchsia-900 hover:-translate-y-1 transition-transform duration-300">
                    <div class="boutonDiffusion w-[30px] h-[30px] rounded-full bg-white flex text-center items-center justify-center border-solid border-fuchsia-300 border-2">
                        <i class="fa-solid fa-broadcast-tower text-fuchsia-300 text-[0.9rem]"></i>
                    </div>
                    <h6 class="text-fuchsia-500 text-[0.6rem]">Diffusion</h6>
                </div>
                <div class="Statut flex flex-col justify-center items-center w-full h-[100px] border-b-2 shadow-lg border-fuchsia-900 hover:-translate-y-1 transition-transform duration-300">
                    <div class="boutonStatut w-[30px] h-[30px] rounded-full bg-white flex text-center items-center justify-center border-solid border-fuchsia-300 border-2">
                        <i class="fa-solid fa-circle-info text-fuchsia-300 text-[0.9rem]"></i>
                    </div>
                    <h6 class="text-fuchsia-500 text-[0.6rem]">Statut</h6>
                </div>
                <div class="Deconnecion flex flex-col justify-center items-center w-full h-[100px] border-b-2 shadow-lg border-fuchsia-900 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                    <div class="boutonDeconnexion w-[30px] h-[30px] rounded-full bg-white flex text-center items-center justify-center border-solid border-fuchsia-300 border-2" id="btnDeconnexion">
                        <i class="fa-solid fa-right-from-bracket text-fuchsia-300 text-[0.9rem]"></i>
                    </div>
                    <h6 class="text-fuchsia-500 text-[0.6rem]">Deconnexion</h6>
                </div>
            </div>
        </div>

        <div class="contactGroupe w-[85%] h-full flex flex-col justify-between">
            <div class="navbarRecherche w-full h-[10.5%] bg-fuchsia-900 shadow-lg flex flex-row justify-between items-center">
                <div class="relative w-[50%]">
                    <input 
                        id="rechercheInput"
                        type="text" 
                        placeholder="Rechercher..." 
                        class="w-full p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white shadow-sm transition duration-300" 
                    />
                    <svg class="w-5 h-5 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" 
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M21 21l-4.35-4.35m1.4-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div class="photoprofil w-[40px] h-[40px] bg-black rounded-full">
                    <img id="photoProfilUtilisateur" src="src/img/ndeye.jpeg" alt="" class="bg-black rounded-full w-full h-full object-cover">
                </div>
            </div>
            
            <div class="filter h-[10%] w-full bg-white flex items-center text-gray-600 font-medium border-b shadow-sm">
                <button id="filtreTous" class="flex items-center gap-2 px-4 py-2 text-slate-500 rounded-full bg-gray-100 hover:bg-gray-100 transition duration-300 filtre-btn active">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                    Tous
                </button>
                <button id="filtreNonLus" class="flex items-center gap-2 px-4 py-2 text-slate-500 rounded-full hover:bg-gray-100 transition duration-300 filtre-btn">
                    <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Non lus
                </button>
                <button id="filtreGroupes" class="flex items-center gap-2 px-4 py-2 text-slate-500 rounded-full hover:bg-gray-100 transition duration-300 filtre-btn">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 00-3-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    Groupes
                </button>
            </div>

            <div class="ALL w-full h-[85%] flex flex-row justify-between">
                <div class="espace w-[1%] h-full"></div>
                <div class="conversations w-full h-full flex flex-row">
                    <div class="affichageContactGroupe w-[30%] h-full overflow-y-auto">
                        <div id="listeContactsGroupes" class="space-y-2 p-2">
                            <!-- Les contacts et groupes seront affichés ici dynamiquement -->
                        </div>
                    </div>
                    <div class="espace w-[1%] h-full"></div>
                    <div class="discussion w-[70%] h-full bg-gray-100 flex flex-col">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    
    initialiserEvenements(e);
    chargerUtilisateurConnecte();
}

function initialiserEvenements(container) {
     
    const btnDeconnexion = container.querySelector("#btnDeconnexion");
    if (btnDeconnexion) {
        btnDeconnexion.addEventListener("click", gererDeconnexion);
    }
 
    const btnAjoutContact = container.querySelector(".contact .buttonAjout");
    if (btnAjoutContact) {
        btnAjoutContact.addEventListener("click", (e) => {
            e.preventDefault();
            ouvrirPopupAjoutContact();
        });
    }

     const btnAjoutGroupe = container.querySelector(".groupes .boutonAjoutGroup");
    if (btnAjoutGroupe) {
        btnAjoutGroupe.addEventListener("click", async (e) => {
            console.log("Bouton ajouter groupe cliqué"); // Debug
            e.preventDefault();
            e.stopPropagation();
            
            // Vérifier que l'utilisateur est connecté
            const userConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
            if (!userConnecte.id) {
                alert('Vous devez être connecté pour créer un groupe.');
                return;
            }
            
            try {
                // Importer et appeler la fonction
                const { ouvrirPopupAjoutGroupe } = await import("./groupevue.js");
                ouvrirPopupAjoutGroupe();
            } catch (error) {
                console.error("Erreur lors de l'ouverture du popup groupe:", error);
                alert("Erreur lors de l'ouverture du formulaire de groupe");
            }
        });
    } else {
        console.error("Bouton ajouter groupe non trouvé");
    }


   
    const filtreTous = container.querySelector("#filtreTous");
    const filtreNonLus = container.querySelector("#filtreNonLus");
    const filtreGroupes = container.querySelector("#filtreGroupes");

    if (filtreTous) {
        filtreTous.addEventListener("click", () => changerFiltre('tous'));
    }
    if (filtreNonLus) {
        filtreNonLus.addEventListener("click", () => changerFiltre('non_lus'));
    }
    if (filtreGroupes) {
        filtreGroupes.addEventListener("click", () => changerFiltre('groupes'));
    }

    
    const rechercheInput = container.querySelector("#rechercheInput");
    if (rechercheInput) {
        rechercheInput.addEventListener("input", (e) => {
            filtrerContactsGroupes(e.target.value);
        });
    }
    initialiserArchivage();
     initialiserDiffusion();
}

async function chargerUtilisateurConnecte() {
    try {
        // Récupérer l'utilisateur connecté depuis localStorage
        const userConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        // Charger les données complètes de l'utilisateur
        const response = await fetch(URL_UTILISATEURS);
        const utilisateurs = await response.json();
        
        utilisateurConnecte = utilisateurs.find(u => u.id === userConnecte.id) || utilisateurs[0];
        
        if (utilisateurConnecte) {
            // Mettre à jour la photo de profil
            const photoElement = document.querySelector("#photoProfilUtilisateur");
            if (photoElement && utilisateurConnecte.photo_profil) {
                photoElement.src = utilisateurConnecte.photo_profil;
            }
            
            // Charger les contacts et groupes
            await chargerContactsEtGroupes();
        }
    } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur:", error);
    }
}


// Dans accueil.js - Modifier la fonction chargerContactsEtGroupes pour recharger l'utilisateur
async function chargerContactsEtGroupes() {
    try {
        // Recharger les données de l'utilisateur connecté depuis localStorage
        const userConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        
        // Recharger depuis l'API pour avoir les données les plus récentes
        const response = await fetch(URL_UTILISATEURS);
        const utilisateurs = await response.json();
        
        // Mettre à jour l'utilisateur connecté avec les dernières données
        utilisateurConnecte = utilisateurs.find(u => u.id === userConnecte.id);
        
        if (utilisateurConnecte) {
            // Mettre à jour localStorage avec les nouvelles données
            localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateurConnecte));
        }
        
        // Charger les groupes
        const responseGroupes = await fetch(URL_GROUPES);
        const tousLesGroupes = await responseGroupes.json();
        
        groupesAffiches = tousLesGroupes.filter(groupe => 
            utilisateurConnecte.groupes_membre.includes(groupe.id)
        );
        
        // Charger les contacts
        contactsAffiches = utilisateurConnecte.liste_contacts || [];
        
        // Afficher avec le nouveau tri
        afficherContactsGroupes();
        
    } catch (error) {
        console.error("Erreur lors du chargement des contacts et groupes:", error);
    }
}

function changerFiltre(nouveauFiltre) {
    filtreActuel = nouveauFiltre;
    
    // Mettre à jour l'apparence des boutons de filtre
    document.querySelectorAll('.filtre-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-gray-100');
        btn.classList.add('hover:bg-gray-100');
    });
    
    const btnActif = document.querySelector(`#filtre${nouveauFiltre.charAt(0).toUpperCase() + nouveauFiltre.slice(1).replace('_', '')}`);
    if (btnActif) {
        btnActif.classList.add('active', 'bg-gray-100');
        btnActif.classList.remove('hover:bg-gray-100');
    }
    
    afficherContactsGroupes();
}

function afficherContactsGroupes() {
    const container = document.querySelector("#listeContactsGroupes");
    if (!container) return;
    
    let elements = [];
    
    switch (filtreActuel) {
        case 'tous':
            elements = [...contactsAffiches, ...groupesAffiches];
            break;
        case 'non_lus':
            elements = [...contactsAffiches, ...groupesAffiches].filter(item => {
                const conversation = utilisateurConnecte.conversations?.find(conv => 
                    conv.participants?.includes(item.id) || conv.groupe_id === item.id
                );
                return conversation && conversation.messages_non_lus > 0;
            });
            break;
        case 'groupes':
            elements = [...groupesAffiches];
            break;
    }
    window.rafraichirContactsGroupes = async () => {
    if (utilisateurConnecte) {
        await chargerContactsEtGroupes();
    }
};
    // Filtrer les éléments archivés
    elements = elements.filter(item => {
        const estGroupe = !!item.nom && !item.telephone;
        const conversation = utilisateurConnecte.conversations?.find(conv => {
            if (estGroupe) {
                return conv.groupe_id === item.id;
            } else {
                return conv.participants?.includes(item.id);
            }
        });
        
        return !conversation || !conversation.archive;
    });
    
    // NOUVEAU: Trier les éléments par date d'ajout (plus récent en premier)
    elements.sort((a, b) => {
        const dateA = new Date(a.date_ajout || a.date_creation || 0);
        const dateB = new Date(b.date_ajout || b.date_creation || 0);
        return dateB - dateA; // Tri décroissant (plus récent en premier)
    });
    
    container.innerHTML = elements.map(item => creerElementContactGroupe(item)).join('');
    
    container.querySelectorAll('.contact-groupe-item').forEach(element => {
        element.addEventListener('click', () => {
            const id = element.dataset.id;
            const type = element.dataset.type;
            selectionnerConversation(id, type);
        });
    });
}


export async function rechargerApresArchivage() {
    if (utilisateurConnecte) {
        // Recharger l'utilisateur connecté pour avoir les dernières données
        const userConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte') || '{}');
        const response = await fetch(URL_UTILISATEURS);
        const utilisateurs = await response.json();
        
        utilisateurConnecte = utilisateurs.find(u => u.id === userConnecte.id);
        
        if (utilisateurConnecte) {
            await chargerContactsEtGroupes();
        }
    }
}

function creerElementContactGroupe(item) {
    const estGroupe = !!item.nom && !item.telephone;  
    const nom = estGroupe ? item.nom : (item.nom_personnalise || item.nom);
    const photo = item.photo_profil || item.photo_groupe || "src/img/default-avatar.png";
    
    // Trouver la conversation associée
    const conversation = utilisateurConnecte.conversations?.find(conv => 
        conv.participants?.includes(item.id) || conv.groupe_id === item.id
    );
    
    const messagesNonLus = conversation ? conversation.messages_non_lus : 0;
    
    // NOUVEAU: Récupérer le dernier message de la conversation
    let dernierMessage = "Aucun message";
    let heureMessage = "";
    
    if (conversation && conversation.messages && conversation.messages.length > 0) {
        const dernierMsg = conversation.messages[conversation.messages.length - 1];
        
        // Tronquer le message s'il est trop long
        const contenu = dernierMsg.contenu || dernierMsg.texte || "";
        dernierMessage = contenu.length > 30 ? contenu.substring(0, 30) + "..." : contenu;
        
        // Formater l'heure
        heureMessage = new Date(dernierMsg.timestamp || dernierMsg.date_envoi).toLocaleTimeString('fr-FR', {
            hour: '2-digit', 
            minute: '2-digit'
        });
    } else if (estGroupe) {
        dernierMessage = "Groupe créé";
    } else {
        dernierMessage = "Contact ajouté";
        // Pour un nouveau contact, afficher l'heure d'ajout
        if (item.date_ajout) {
            heureMessage = new Date(item.date_ajout).toLocaleTimeString('fr-FR', {
                hour: '2-digit', 
                minute: '2-digit'
            });
        }
    }
    
    const badgeNonLus = messagesNonLus > 0 ? 
        `<span class="bg-fuchsia-500 text-white text-xs rounded-full px-2 py-1 ml-2">${messagesNonLus}</span>` : '';
    
    const iconType = estGroupe ? 
        '<i class="fa-solid fa-users text-blue-500 text-xs"></i>' : 
        '<i class="fa-solid fa-user text-green-500 text-xs"></i>';
    
    return `
        <div class="contact-groupe-item flex items-center bg-white h-[70px] rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition duration-300 mb-2 p-3" 
             data-id="${item.id}" 
             data-type="${estGroupe ? 'groupe' : 'contact'}">
            <div class="relative">
                <img src="${photo}" alt="Profil" class="w-12 h-12 rounded-full object-cover">
                <div class="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                    ${iconType}
                </div>
            </div>
            <div class="ml-4 flex-1 min-w-0">
                <div class="flex justify-between items-center">
                    <h4 class="font-semibold text-gray-800 truncate">${nom}</h4>
                    <div class="flex items-center">
                        <span class="text-sm text-gray-500">${heureMessage}</span>
                        ${badgeNonLus}
                    </div>
                </div>
                <p class="text-sm text-gray-600 truncate">${dernierMessage}</p>
                ${item.favori ? '<i class="fa-solid fa-star text-yellow-400 text-xs"></i>' : ''}
            </div>
        </div>
    `;
}
window.rafraichirContactsGroupes = rafraichirContactsGroupes;

function filtrerContactsGroupes(termeRecherche) {
    const elements = document.querySelectorAll('.contact-groupe-item');
    
    elements.forEach(element => {
        const nom = element.querySelector('h4').textContent.toLowerCase();
        const visible = nom.includes(termeRecherche.toLowerCase());
        element.style.display = visible ? 'flex' : 'none';
    });
}

 
 
let conversationActive = null;
let messagesAffiches = [];
let intervalleRefresh = null; 
async function selectionnerConversation(id, type) {
    
    document.querySelectorAll('.contact-groupe-item').forEach(el => {
        el.classList.remove('bg-fuchsia-50', 'border-l-4', 'border-fuchsia-500');
    });
    
    const elementSelectionne = document.querySelector(`[data-id="${id}"]`);
    if (elementSelectionne) {
        elementSelectionne.classList.add('bg-fuchsia-50', 'border-l-4', 'border-fuchsia-500');
    }
    
    const item = type === 'groupe' ? 
        groupesAffiches.find(g => g.id === id) : 
        contactsAffiches.find(c => c.id === id);
    
    if (item) {
        conversationActive = {
            id: id,
            type: type,
            item: item
        };
 
        await afficherConversation(item, type);
        
        await chargerMessages(id, type);
    
        demarrerRefreshMessages();
    }
}

function gererDeconnexion() {
    if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
        // Arrêter le refresh des messages
        arreterRefreshMessages();
        
        localStorage.removeItem("estConnecte");
        localStorage.removeItem("utilisateurConnecte");
        
        document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea').forEach((el) => {
            el.value = "";
        });
        
        location.reload();
        console.log("Déconnexion réussie");
    }
}
export function rafraichirContactsGroupes() {
    if (utilisateurConnecte) {
        chargerContactsEtGroupes();
    }
}

function afficherConversation(item, type) {
    const discussionContainer = document.querySelector('.discussion');
    const nom = type === 'groupe' ? item.nom : (item.nom_personnalise || item.nom);
    const photo = item.photo_profil || item.photo_groupe || "src/img/default-avatar.png";
    const statut = type === 'groupe' ? `${item.membres?.length || 0} membres` : "En ligne";
    
    discussionContainer.innerHTML = `
        <!-- En-tête de la conversation -->
        <div class="flex items-center justify-between bg-white p-3 shadow border-b">
            <div class="flex items-center space-x-4">
                <img src="${photo}" alt="Profil" class="w-10 h-10 rounded-full object-cover">
                <div>
                    <h4 class="font-semibold text-gray-800">${nom}</h4>
                    <p class="text-sm text-gray-500">${statut}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button class="p-2 hover:bg-gray-100 rounded-full">
                    <i class="fa-solid fa-video text-gray-600"></i>
                </button>
                <button class="p-2 hover:bg-gray-100 rounded-full">
                    <i class="fa-solid fa-phone text-gray-600"></i>
                </button>
                <button class="p-2 hover:bg-gray-100 rounded-full">
                    <i class="fa-solid fa-ellipsis-vertical text-gray-600"></i>
                </button>
            </div>
        </div>

        <!-- Zone des messages -->
        <div id="messagesContainer" class="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div class="text-center text-gray-500 py-8">
                <i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i>
                <p>Chargement des messages...</p>
            </div>
        </div>

        <!-- Zone de saisie -->
        <div class="bg-white p-4 border-t">
            <div class="flex items-center space-x-3">
                <button class="p-2 hover:bg-gray-100 rounded-full">
                    <i class="fa-solid fa-paperclip text-gray-600"></i>
                </button>
                <div class="flex-1 relative">
                    <input 
                        id="messageInput" 
                        type="text" 
                        placeholder="Tapez votre message..." 
                        class="w-full p-3 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    />
                    <button class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
                        <i class="fa-solid fa-face-smile text-gray-600"></i>
                    </button>
                </div>
                <button 
                    id="btnEnvoyerMessage" 
                    class="p-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-full transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    // Ajouter les événements pour l'envoi de messages
    const messageInput = document.getElementById('messageInput');
    const btnEnvoyer = document.getElementById('btnEnvoyerMessage');
    
    if (messageInput && btnEnvoyer) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                envoyerMessage();
            }
        });
        
        btnEnvoyer.addEventListener('click', envoyerMessage);
        
        // Gérer l'état du bouton d'envoi
        messageInput.addEventListener('input', () => {
            btnEnvoyer.disabled = !messageInput.value.trim();
        });
        
        btnEnvoyer.disabled = true;
    }
}
let dernierTimestampMessage = null;
let intervalleRefreshRapide = null;

// Fonction améliorée pour charger les messages
async function chargerMessages(contactId, type) {
    try {
        const response = await fetch(URL_MESSAGES);
        const tousLesMessages = await response.json();
        
        // Déterminer l'ID de conversation
        let conversationId;
        if (type === 'groupe') {
            conversationId = `conv_group_${contactId}`;
        } else {
            conversationId = `conv_contact_${contactId}`;
        }
        
        // Filtrer les messages pour cette conversation
        const nouveauxMessages = tousLesMessages.filter(message => 
            message.conversation_id === conversationId
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Vérifier s'il y a de nouveaux messages
        const ancienNombre = messagesAffiches.length;
        const dernierAncienTimestamp = messagesAffiches.length > 0 ? 
            messagesAffiches[messagesAffiches.length - 1].timestamp : null;
        
        messagesAffiches = nouveauxMessages;
        
        // Mettre à jour le dernier timestamp
        if (messagesAffiches.length > 0) {
            dernierTimestampMessage = messagesAffiches[messagesAffiches.length - 1].timestamp;
        }
        
        afficherMessages();
        
        // Si de nouveaux messages sont arrivés, faire défiler et jouer un son
        if (messagesAffiches.length > ancienNombre || 
            (dernierAncienTimestamp && messagesAffiches.length > 0 && 
             messagesAffiches[messagesAffiches.length - 1].timestamp !== dernierAncienTimestamp)) {
            
            const container = document.getElementById('messagesContainer');
            if (container) {
                // Défiler vers le bas avec animation fluide
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
                
                // Jouer un son pour les messages reçus (pas les siens)
                const dernierMessage = messagesAffiches[messagesAffiches.length - 1];
                if (dernierMessage && dernierMessage.expediteur !== utilisateurConnecte.id) {
                    jouerSonNotification();
                }
            }
        }
        
    } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);
        document.getElementById('messagesContainer').innerHTML = `
            <div class="text-center text-red-500 py-8">
                <i class="fa-solid fa-exclamation-triangle text-2xl mb-2"></i>
                <p>Erreur lors du chargement des messages</p>
            </div>
        `;
    }
}

// Fonction pour afficher les messages
function afficherMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    
    if (messagesAffiches.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <i class="fa-solid fa-comments text-4xl mb-4"></i>
                <p class="text-lg">Aucun message dans cette conversation</p>
                <p class="text-sm">Envoyez le premier message pour commencer la discussion</p>
            </div>
        `;
        return;
    }
    
    const messagesHTML = messagesAffiches.map(message => creerElementMessage(message)).join('');
    container.innerHTML = messagesHTML;
    
    // Faire défiler vers le bas
    container.scrollTop = container.scrollHeight;
}

function creerElementMessage(message) {
    const estMoi = message.expediteur === utilisateurConnecte.id;
    const timestamp = new Date(message.timestamp);
    const heureFormatee = timestamp.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const statutMessage = message.statut || {};
    let iconStatut = '';
    
    if (estMoi) {
        if (statutMessage.lu) {
            iconStatut = '<i class="fa-solid fa-check-double text-blue-400 text-xs ml-1" title="Lu"></i>';
        } else if (statutMessage.livre) {
            iconStatut = '<i class="fa-solid fa-check-double text-gray-300 text-xs ml-1" title="Livré"></i>';
        } else if (statutMessage.envoye) {
            iconStatut = '<i class="fa-solid fa-check text-gray-300 text-xs ml-1" title="Envoyé"></i>';
        } else {
            iconStatut = '<i class="fa-solid fa-clock text-gray-300 text-xs ml-1" title="En cours d\'envoi"></i>';
        }
    }
    
    // Animation pour les nouveaux messages
    const estNouveauMessage = isNouveauMessage(message);
    const animationClass = estNouveauMessage ? 'animate-fade-in' : '';
    
    return `
        <div class="flex ${estMoi ? 'justify-end' : 'justify-start'} mb-4 ${animationClass}">
            <div class="max-w-xs lg:max-w-md ${estMoi ? 'order-2' : 'order-1'}">
                ${!estMoi ? `
                    <div class="flex items-center mb-1">
                        <img src="${getPhotoExpediteur(message.expediteur)}" 
                             alt="Profil" 
                             class="w-6 h-6 rounded-full object-cover mr-2">
                        <span class="text-sm text-gray-600 font-medium">${getNomExpediteur(message.expediteur)}</span>
                    </div>
                ` : ''}
                
                <div class="relative ${estMoi ? 
                    'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white shadow-lg' : 
                    'bg-white text-gray-800 shadow-md border border-gray-200'
                } rounded-2xl p-3 ${estMoi ? 'rounded-br-md' : 'rounded-bl-md'} 
                transition-all duration-300 hover:shadow-lg">
                    <p class="text-sm whitespace-pre-wrap leading-relaxed">${message.contenu.texte}</p>
                    
                    <div class="flex items-center justify-end mt-2 space-x-1">
                        <span class="text-xs ${estMoi ? 'text-fuchsia-100' : 'text-gray-400'} font-medium">
                            ${heureFormatee}
                        </span>
                        ${iconStatut}
                    </div>
                    
                    <!-- Indicateur de message reçu -->
                    ${!estMoi ? `
                        <div class="absolute -left-1 top-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}
// Fonction pour obtenir la photo de l'expéditeur
function getPhotoExpediteur(expediteurId) {
    if (expediteurId === utilisateurConnecte.id) {
        return utilisateurConnecte.photo_profil || "src/img/default-avatar.png";
    }
    
    const contact = contactsAffiches.find(c => c.id === expediteurId);
    if (contact) {
        return contact.photo_profil || "src/img/default-avatar.png";
    }
    
    return "src/img/default-avatar.png";
}

// Fonction pour obtenir le nom de l'expéditeur
function getNomExpediteur(expediteurId) {
    if (expediteurId === utilisateurConnecte.id) {
        return "Vous";
    }
    
    const contact = contactsAffiches.find(c => c.id === expediteurId);
    if (contact) {
        return contact.nom_personnalise || contact.nom;
    }
    
    return "Utilisateur inconnu";
}

function isNouveauMessage(message) {
    const maintenant = new Date();
    const timestampMessage = new Date(message.timestamp);
    const diffMinutes = (maintenant - timestampMessage) / (1000 * 60);
    return diffMinutes < 1; // Message de moins d'une minute = nouveau
}

// Fonction améliorée pour envoyer un message
async function envoyerMessage() {
    const messageInput = document.getElementById('messageInput');
    const btnEnvoyer = document.getElementById('btnEnvoyerMessage');
    
    if (!messageInput || !conversationActive) return;
    
    const texteMessage = messageInput.value.trim();
    if (!texteMessage) return;
    
    // Créer un ID temporaire pour le message
    const messageTemporaireId = `msg_temp_${Date.now()}`;
    
    // Créer l'objet message temporaire pour affichage immédiat
    const messageTemporaire = {
        id: messageTemporaireId,
        conversation_id: conversationActive.type === 'groupe' ? 
            `conv_group_${conversationActive.id}` : 
            `conv_contact_${conversationActive.id}`,
        expediteur: utilisateurConnecte.id,
        contenu: {
            type: "texte",
            texte: texteMessage,
            mise_en_forme: []
        },
        timestamp: new Date().toISOString(),
        statut: {
            envoye: false,  // En cours d'envoi
            livre: false,
            lu: false,
            timestamp_lecture: null
        },
        reponse_a: null,
        transfere_de: null,
        reactions: [],
        ephemere: false,
        temporaire: true  // Marquer comme temporaire
    };
    
    // Ajouter immédiatement le message à l'affichage
    messagesAffiches.push(messageTemporaire);
    afficherMessages();
    
    // Vider le champ de saisie immédiatement
    messageInput.value = '';
    btnEnvoyer.disabled = true;
    
    // Faire défiler vers le bas
    const container = document.getElementById('messagesContainer');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
    
    try {
        // Créer l'objet message final
        const nouveauMessage = {
            ...messageTemporaire,
            id: `msg_${Date.now()}`,
            statut: {
                envoye: true,
                livre: false,
                lu: false,
                timestamp_lecture: null
            }
        };
        delete nouveauMessage.temporaire;
        
        // Envoyer le message au serveur
        const response = await fetch(URL_MESSAGES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nouveauMessage)
        });
        
        if (response.ok) {
            // Remplacer le message temporaire par le message confirmé
            const indexTemp = messagesAffiches.findIndex(m => m.id === messageTemporaireId);
            if (indexTemp !== -1) {
                messagesAffiches[indexTemp] = nouveauMessage;
                afficherMessages();
            }
            
            // Simuler la livraison après un délai
            setTimeout(() => {
                marquerCommeLivre(nouveauMessage.id);
            }, 1000 + Math.random() * 2000);
            
            // Démarrer un refresh rapide pour voir les réponses
            demarrerRefreshRapide();
            
        } else {
            throw new Error('Erreur lors de l\'envoi du message');
        }
        
    } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
        
        // Marquer le message comme échec
        const indexTemp = messagesAffiches.findIndex(m => m.id === messageTemporaireId);
        if (indexTemp !== -1) {
            messagesAffiches[indexTemp].statut.echec = true;
            messagesAffiches[indexTemp].statut.envoye = false;
            afficherMessages();
        }
        
        // Afficher une notification d'erreur discrète
        afficherNotificationErreur("Échec de l'envoi. Touchez pour réessayer.");
    } finally {
        // Réactiver l'interface
        btnEnvoyer.disabled = false;
        messageInput.focus();
    }
}
// Fonction pour marquer un message comme livré
async function marquerCommeLivre(messageId) {
    try {
        const message = messagesAffiches.find(m => m.id === messageId);
        if (message) {
            message.statut.livre = true;
            
            // Mettre à jour sur le serveur
            await fetch(`${URL_MESSAGES}/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    statut: message.statut
                })
            });
            
            // Réafficher les messages
            afficherMessages();
            
            // Simuler la lecture après 2 secondes
            setTimeout(() => {
                marquerCommeLu(messageId);
            }, 2000);
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
    }
}

// Fonction pour marquer un message comme lu
async function marquerCommeLu(messageId) {
    try {
        const message = messagesAffiches.find(m => m.id === messageId);
        if (message && message.expediteur === utilisateurConnecte.id) {
            message.statut.lu = true;
            message.statut.timestamp_lecture = new Date().toISOString();
            
            // Mettre à jour sur le serveur
            await fetch(`${URL_MESSAGES}/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    statut: message.statut
                })
            });
            
            // Réafficher les messages
            afficherMessages();
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de lecture:", error);
    }
}

// Fonction pour démarrer le refresh automatique des messages
function demarrerRefreshRapide() {
    // Arrêter le refresh rapide existant
    if (intervalleRefreshRapide) {
        clearInterval(intervalleRefreshRapide);
    }
    
    // Refresh rapide pendant 30 secondes pour capturer les réponses
    let compteur = 0;
    intervalleRefreshRapide = setInterval(async () => {
        if (conversationActive && compteur < 30) {
            await chargerMessages(conversationActive.id, conversationActive.type);
            compteur++;
        } else {
            clearInterval(intervalleRefreshRapide);
            intervalleRefreshRapide = null;
        }
    }, 1000); // Toutes les secondes pendant 30 secondes
}

// Fonction améliorée pour démarrer le refresh automatique des messages
function demarrerRefreshMessages() {
    // Arrêter les refresh précédents
    if (intervalleRefresh) {
        clearInterval(intervalleRefresh);
    }
    if (intervalleRefreshRapide) {
        clearInterval(intervalleRefreshRapide);
    }
    
    // Démarrer un nouveau refresh toutes les 3 secondes (plus fréquent)
    intervalleRefresh = setInterval(async () => {
        if (conversationActive) {
            await chargerMessages(conversationActive.id, conversationActive.type);
        }
    }, 3000);
}

// Fonction pour arrêter tous les refresh
function arreterRefreshMessages() {
    if (intervalleRefresh) {
        clearInterval(intervalleRefresh);
        intervalleRefresh = null;
    }
    if (intervalleRefreshRapide) {
        clearInterval(intervalleRefreshRapide);
        intervalleRefreshRapide = null;
    }
}

// Fonction pour jouer un son de notification
function jouerSonNotification() {
    try {
        // Créer un son simple avec Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        // Ignorer les erreurs de audio si pas supporté
        console.log("Notification sonore non disponible");
    }
}

// Fonction pour afficher une notification d'erreur
function afficherNotificationErreur(message) {
    // Créer une notification discrète
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

 