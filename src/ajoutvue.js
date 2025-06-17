 
export function AjoutContactPopup() {
    
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    overlay.id = 'popupAjoutContact';
    
    overlay.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-[450px] max-w-[90vw] transform transition-all duration-300">
            <!-- Header -->
            <div class="bg-fuchsia-900 text-white p-6 rounded-t-2xl">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold flex items-center gap-2">
                        <i class="fa-solid fa-user-plus"></i>
                        Ajouter un contact
                    </h2>
                    <button class="text-white hover:text-gray-200 transition-colors" id="fermerPopup">
                        <i class="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
            </div>
            
            <!-- Contenu du formulaire -->
            <div class="p-6">
                <form id="formulaireAjoutContact" class="space-y-4">
                    <!-- Champ Nom -->
                    <div>
                        <label for="nomContact" class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fa-solid fa-user text-fuchsia-500 mr-2"></i>Nom complet
                        </label>
                        <input 
                            type="text" 
                            id="nomContact" 
                            name="nom"
                            placeholder="Ex: Marie Dupont"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                            required
                        >
                    </div>
                    
                    <!-- Champ Téléphone -->
                    <div>
                        <label for="telephoneContact" class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fa-solid fa-phone text-fuchsia-500 mr-2"></i>Numéro de téléphone
                        </label>
                        <input 
                            type="tel" 
                            id="telephoneContact" 
                            name="telephone"
                            placeholder="Ex: +221 77 123 45 67"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                            required
                        >
                    </div>
                    
                         <div>
        <label for="photoContact" class="block text-sm font-medium text-gray-700 mb-2">
            <i class="fa-solid fa-camera text-fuchsia-500 mr-2"></i>Photo de profil (optionnel)
        </label>
        <div class="flex items-center gap-4">
            <div class="relative">
                <input 
                    type="file" 
                    id="photoContact" 
                    name="photo"
                    accept="image/*"
                    class="hidden"
                >
                <button 
                    type="button" 
                    onclick="document.getElementById('photoContact').click()"
                    class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <i class="fa-solid fa-upload"></i>
                    Choisir une photo
                </button>
            </div>
            <div id="previewPhoto" class="hidden">
                <img id="imagePreview" class="w-12 h-12 rounded-full object-cover border-2 border-fuchsia-200" alt="Aperçu">
            </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
    </div>
                    <!-- Nom personnalisé (optionnel) -->
                    <div>
                        <label for="nomPersonnalise" class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fa-solid fa-heart text-fuchsia-500 mr-2"></i>Nom personnalisé (optionnel)
                        </label>
                        <input 
                            type="text" 
                            id="nomPersonnalise" 
                            name="nomPersonnalise"
                            placeholder="Ex: Marie ❤️, Papa, etc."
                            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                        >
                    </div>
                    
                    <!-- Options -->
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="text-sm font-medium text-gray-700 mb-3">Options</h3>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input type="checkbox" id="favori" name="favori" class="rounded text-fuchsia-500 focus:ring-fuchsia-500">
                                <span class="ml-2 text-sm text-gray-600">
                                    <i class="fa-solid fa-star text-yellow-500 mr-1"></i>Ajouter aux favoris
                                </span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- Message d'erreur -->
                    <div id="messageErreur" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                        <i class="fa-solid fa-exclamation-triangle mr-2"></i>
                        <span id="texteErreur"></span>
                    </div>
                    
                    <!-- Message de succès -->
                    <div id="messageSucces" class="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                        <i class="fa-solid fa-check-circle mr-2"></i>
                        Contact ajouté avec succès !
                    </div>
                    
                    <!-- Boutons -->
                    <div class="flex gap-3 pt-4">
                        <button 
                            type="button" 
                            class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            id="annulerAjout"
                        >
                            <i class="fa-solid fa-times mr-2"></i>Annuler
                        </button>
                        <button 
                            type="submit" 
                            class="flex-1 px-4 py-3 bg-fuchsia-900 text-white rounded-lg hover:bg-fuchsia-800 transition-colors font-medium"
                            id="confirmerAjout"
                        >
                            <i class="fa-solid fa-user-plus mr-2"></i>Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    ajouterGestionnairesEvenementsAvecPhoto(overlay);
    
    return overlay;
}

function ajouterGestionnairesEvenementsAvecPhoto(popup) {
    const fermerPopup = popup.querySelector('#fermerPopup');
    const annulerAjout = popup.querySelector('#annulerAjout');
    const formulaire = popup.querySelector('#formulaireAjoutContact');
    
    const fermerPopupFunction = () => {
        popup.classList.add('opacity-0');
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300);
    };

    fermerPopup.addEventListener('click', fermerPopupFunction);
    annulerAjout.addEventListener('click', fermerPopupFunction);
    
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            fermerPopupFunction();
        }
    });

    formulaire.addEventListener('submit', async (e) => {
        e.preventDefault();
        await gererAjoutContactAvecPhoto(formulaire, popup);
    });

    popup.querySelector('#telephoneContact').addEventListener('input', validerTelephone);
    
    ajouterGestionnairePhoto(popup);
}

function validerTelephone(e) {
    const telephone = e.target.value;
    const regex = /^(\+221|221)?[\s-]?[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
    
    if (telephone && !regex.test(telephone)) {
        e.target.classList.add('border-red-500');
        e.target.classList.remove('border-gray-300');
    } else {
        e.target.classList.remove('border-red-500');
        e.target.classList.add('border-gray-300');
    }
}

function verifierUtilisateurConnecte() {
    
    const estConnecte = localStorage.getItem("estConnecte");
    if (!estConnecte || estConnecte !== "true") {
        console.error("Utilisateur non connecté");
        return null;
    }
    
    const utilisateur = localStorage.getItem("utilisateurConnecte");
    console.log("Utilisateur dans localStorage:", utilisateur);
    
    if (!utilisateur || utilisateur === "null") {
        console.error("Aucun utilisateur connecté trouvé dans localStorage");
        return null;
    }
    
    try {
        return JSON.parse(utilisateur);
    } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur:", error);
        return null;
    }
}
async function gererAjoutContactAvecPhoto(formulaire, popup) {
    const messageErreur = popup.querySelector('#messageErreur');
    const messageSucces = popup.querySelector('#messageSucces');
    const texteErreur = popup.querySelector('#texteErreur');
    const boutonConfirmer = popup.querySelector('#confirmerAjout');

    messageErreur.classList.add('hidden');
    messageSucces.classList.add('hidden');

    const formData = new FormData(formulaire);
    const nom = formData.get('nom').trim();
    const telephone = formData.get('telephone').trim();
    const nomPersonnalise = formData.get('nomPersonnalise').trim();
    const favori = formData.get('favori') === 'on';
    const fichierPhoto = formData.get('photo');

    if (!nom || !telephone) {
        return afficherErreur('Tous les champs obligatoires doivent être remplis.', messageErreur, texteErreur);
    }

    if (!/^(\+221|221)?[\s-]?[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/.test(telephone)) {
        return afficherErreur('Le numéro de téléphone n\'est pas valide.', messageErreur, texteErreur);
    }

    boutonConfirmer.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Ajout en cours...';
    boutonConfirmer.disabled = true;

    try {
        let utilisateur = JSON.parse(localStorage.getItem('utilisateurConnecte'));
        
        if (!utilisateur) {
            throw new Error('Aucun utilisateur connecté trouvé. Veuillez vous reconnecter.');
        }
 
        if (utilisateur.liste_contacts.find(contact => contact.telephone === telephone)) {
            throw new Error('Ce contact existe déjà dans votre liste.');
        }
 
        let photoUrl = null;
        if (fichierPhoto && fichierPhoto.size > 0) {
            photoUrl = await convertirImageEnBase64(fichierPhoto);
        } else {
            
            photoUrl = genererPhotoParDefaut(nom);
        }

        
        let utilisateurExistant = await verifierUtilisateurExistant(telephone);
        if (!utilisateurExistant) {
            utilisateurExistant = await creerNouvelUtilisateur(nom, telephone);
        }

        const nouveauContact = {
            id: `contact_${Date.now()}`,
            nom: nom,
            telephone: telephone,
            nom_personnalise: nomPersonnalise || nom,
            photo_profil: photoUrl,
            bloque: false,
            favori: favori,
            date_ajout: new Date().toISOString(),
            derniere_interaction: null
        };

        utilisateur.liste_contacts.push(nouveauContact);

      
        await ajouterContactMutuel(utilisateur, utilisateurExistant);
 
        localStorage.setItem('utilisateurConnecte', JSON.stringify(utilisateur));
        await fetch(`https://devchat-jsi7.onrender.com/utilisateurs/${utilisateur.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(utilisateur)
});

        await sauvegarderUtilisateurs();

        messageSucces.classList.remove('hidden');
        formulaire.reset();
        popup.querySelector('#previewPhoto').classList.add('hidden');

        setTimeout(() => {
            popup.classList.add('opacity-0');
            setTimeout(() => {
                document.body.removeChild(popup);
                rafraichirAffichageContacts();
            }, 300);
        }, 2000);

    } catch (error) {
        console.error('Erreur lors de l\'ajout du contact:', error);
        afficherErreur(error.message || 'Une erreur est survenue lors de l\'ajout du contact.', messageErreur, texteErreur);
    } finally {
        boutonConfirmer.innerHTML = '<i class="fa-solid fa-user-plus mr-2"></i>Ajouter';
        boutonConfirmer.disabled = false;
    }
}
async function verifierUtilisateurExistant(telephone) {
    try {
        const response = await fetch('https://devchat-jsi7.onrender.com/utilisateurs');
        const utilisateurs = await response.json();
        
        return utilisateurs.find(user => user.telephone === telephone);
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error);
        return null;
    }
}

async function ajouterContactMutuel(utilisateurConnecte, autreUtilisateur) {
    
    const contactExistant = autreUtilisateur.liste_contacts.find(
        contact => contact.telephone === utilisateurConnecte.telephone
    );
    
    if (!contactExistant) {
        const contactMutuel = {
            id: `contact_${Date.now()}_mutual`,
            nom: utilisateurConnecte.nom,
            telephone: utilisateurConnecte.telephone,
            nom_personnalise: utilisateurConnecte.nom,
            bloque: false,
            favori: false,
            date_ajout: new Date().toISOString(),
            derniere_interaction: null
        };
        
        autreUtilisateur.liste_contacts.push(contactMutuel);
        
        try {
            const response = await fetch(`https://devchat-jsi7.onrender.com/utilisateurs/${autreUtilisateur.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(autreUtilisateur)
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du contact mutuel');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du contact mutuel:', error);
        }
    }
} 
async function creerNouvelUtilisateur(nom, telephone) {
    const nouvelUtilisateur = {
        id: `user_${Date.now()}`,
        nom: nom,
        telephone: telephone,
        email: `${telephone}@temp.com`,  
        password: "motdepasse123",  
        photo_profil: null,
        statut: {
            texte: "Nouveau sur l'application",
            date_modification: new Date().toISOString(),
            visible_pour: "contacts"
        },
        derniere_connexion: new Date().toISOString(),
        en_ligne: false,
        parametre_confidentialite: {
            photo_profil_visible: "contacts",
            statut_visible: "contacts",
            derniere_connexion_visible: "contacts",
            lecture_confirme: true,
            double_verification: false
        },
        liste_contacts: [],
        groupes_membre: [],
        conversations: []
    };
    
    try {
        const response = await fetch('https://devchat-jsi7.onrender.com/utilisateurs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nouvelUtilisateur)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la création de l\'utilisateur');
        }
        
        console.log('Nouvel utilisateur créé:', nom);
        return nouvelUtilisateur;
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
}


function afficherErreur(message, messageErreur, texteErreur) {
    texteErreur.textContent = message;
    messageErreur.classList.remove('hidden');
}
 
function rafraichirAffichageContacts() {
    console.log('Rafraîchissement de l\'affichage des contacts...');
    
    // Recharger les données de l'utilisateur connecté
    const utilisateurMisAJour = JSON.parse(localStorage.getItem('utilisateurConnecte'));
    if (utilisateurMisAJour && window.rafraichirContactsGroupes) {
        // Déclencher le rechargement dans accueil.js
        window.rafraichirContactsGroupes();
    }
}

export function ouvrirPopupAjoutContact() {
    const utilisateur = verifierUtilisateurConnecte();
    if (!utilisateur) {
        alert('Vous devez être connecté pour ajouter un contact. Veuillez vous reconnecter.');
        return;
    }
    
    const popupExistant = document.getElementById('popupAjoutContact');
    if (popupExistant) {
        return;  
    }
    
    const popup = AjoutContactPopup();
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('opacity-100');
    }, 10);
}

async function sauvegarderUtilisateurs() {
    try {
        const utilisateurConnecte = JSON.parse(localStorage.getItem('utilisateurConnecte'));
        
        const response = await fetch(`https://devchat-jsi7.onrender.com/utilisateurs/${utilisateurConnecte.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(utilisateurConnecte)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde');
        }
        
        console.log('Utilisateur sauvegardé avec succès');
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        throw error;
    }
}
 
function ajouterGestionnairePhoto(popup) {
    const inputPhoto = popup.querySelector('#photoContact');
    const previewDiv = popup.querySelector('#previewPhoto');
    const imagePreview = popup.querySelector('#imagePreview');
    
    inputPhoto.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
             
            if (file.size > 5 * 1024 * 1024) {
                alert('La photo ne doit pas dépasser 5MB');
                inputPhoto.value = '';
                return;
            }
            
             
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner une image valide');
                inputPhoto.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                previewDiv.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            previewDiv.classList.add('hidden');
        }
    });
}
 
function convertirImageEnBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

 
function genererPhotoParDefaut(nom) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
     
    const couleurs = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const couleurFond = couleurs[Math.floor(Math.random() * couleurs.length)];
    
    ctx.fillStyle = couleurFond;
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