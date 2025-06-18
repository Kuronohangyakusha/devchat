// appel.js - Système d'appels vocaux
const URL_APPELS = "https://devchat-jsi7.onrender.com/appels";

let appelEnCours = null;
let mediaStream = null;
let peerConnection = null;

// Initialiser le système d'appels
export function initialiserAppels() {
    // Écouter les boutons d'appel dans les conversations
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-appel-vocal')) {
            const btn = e.target.closest('.btn-appel-vocal');
            const contactId = btn.dataset.contactId;
            const contactNom = btn.dataset.contactNom;
            demarrerAppel(contactId, contactNom, 'audio');
        }
        
        if (e.target.closest('.btn-appel-video')) {
            const btn = e.target.closest('.btn-appel-video');
            const contactId = btn.dataset.contactId;
            const contactNom = btn.dataset.contactNom;
            demarrerAppel(contactId, contactNom, 'video');
        }
    });
}

// Démarrer un appel
async function demarrerAppel(contactId, contactNom, type = 'audio') {
    if (appelEnCours) {
        alert('Un appel est déjà en cours');
        return;
    }

    try {
        // Demander l'accès au micro (et caméra si vidéo)
        const constraints = {
            audio: true,
            video: type === 'video'
        };
        
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Créer l'appel dans la base de données
        const nouvelAppel = {
            id: `call_${Date.now()}`,
            type: type,
            initiateur: JSON.parse(localStorage.getItem('utilisateurConnecte')).id,
            participants: [JSON.parse(localStorage.getItem('utilisateurConnecte')).id, contactId],
            timestamp_debut: new Date().toISOString(),
            timestamp_fin: null,
            duree: null,
            statut: 'en_cours',
            qualite: 'bonne'
        };

        // Sauvegarder l'appel
        await sauvegarderAppel(nouvelAppel);
        appelEnCours = nouvelAppel;
        
        // Afficher l'interface d'appel
        afficherInterfaceAppel(contactNom, type);
        
        // Démarrer le chronomètre
        demarrerChronometre();
        
    } catch (error) {
        console.error('Erreur lors du démarrage de l\'appel:', error);
        alert('Impossible d\'accéder au microphone/caméra');
    }
}

// Afficher l'interface d'appel
function afficherInterfaceAppel(contactNom, type) {
    const interfaceAppel = document.createElement('div');
    interfaceAppel.id = 'interfaceAppel';
    interfaceAppel.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
    
    interfaceAppel.innerHTML = `
        <div class="bg-white rounded-lg p-6 text-center max-w-md w-full mx-4">
            <div class="mb-6">
                <img src="src/img/default-avatar.png" alt="Contact" class="w-24 h-24 rounded-full mx-auto mb-4">
                <h3 class="text-xl font-semibold text-gray-800">${contactNom}</h3>
                <p class="text-gray-600">
                    ${type === 'video' ? 'Appel vidéo' : 'Appel vocal'} en cours...
                </p>
                <div id="dureeAppel" class="text-2xl font-mono text-fuchsia-600 mt-2">00:00</div>
            </div>
            
            ${type === 'video' ? '<video id="videoLocal" class="w-full h-48 bg-gray-200 rounded mb-4" autoplay muted></video>' : ''}
            
            <div class="flex justify-center space-x-4">
                <button id="btnMuteAppel" class="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition duration-300">
                    <i class="fa-solid fa-microphone"></i>
                </button>
                
                ${type === 'video' ? `
                    <button id="btnCameraAppel" class="p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition duration-300">
                        <i class="fa-solid fa-video"></i>
                    </button>
                ` : ''}
                
                <button id="btnRaccrocherAppel" class="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-300">
                    <i class="fa-solid fa-phone-slash"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(interfaceAppel);
    
    // Si appel vidéo, afficher le flux local
    if (type === 'video' && mediaStream) {
        const videoLocal = document.getElementById('videoLocal');
        if (videoLocal) {
            videoLocal.srcObject = mediaStream;
        }
    }
    
    // Ajouter les événements
    document.getElementById('btnMuteAppel')?.addEventListener('click', toggleMute);
    document.getElementById('btnCameraAppel')?.addEventListener('click', toggleCamera);
    document.getElementById('btnRaccrocherAppel')?.addEventListener('click', terminerAppel);
}

// Démarrer le chronomètre
function demarrerChronometre() {
    let secondes = 0;
    
    appelEnCours.intervalChrono = setInterval(() => {
        secondes++;
        const minutes = Math.floor(secondes / 60);
        const sec = secondes % 60;
        const dureeElement = document.getElementById('dureeAppel');
        if (dureeElement) {
            dureeElement.textContent = `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Basculer le mute
function toggleMute() {
    if (!mediaStream) return;
    
    const audioTrack = mediaStream.getAudioTracks()[0];
    if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const btn = document.getElementById('btnMuteAppel');
        const icon = btn.querySelector('i');
        
        if (audioTrack.enabled) {
            btn.className = btn.className.replace('bg-red-500', 'bg-gray-500');
            icon.className = 'fa-solid fa-microphone';
        } else {
            btn.className = btn.className.replace('bg-gray-500', 'bg-red-500');
            icon.className = 'fa-solid fa-microphone-slash';
        }
    }
}

// Basculer la caméra
function toggleCamera() {
    if (!mediaStream) return;
    
    const videoTrack = mediaStream.getVideoTracks()[0];
    if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const btn = document.getElementById('btnCameraAppel');
        const icon = btn.querySelector('i');
        
        if (videoTrack.enabled) {
            btn.className = btn.className.replace('bg-red-500', 'bg-gray-500');
            icon.className = 'fa-solid fa-video';
        } else {
            btn.className = btn.className.replace('bg-gray-500', 'bg-red-500');
            icon.className = 'fa-solid fa-video-slash';
        }
    }
}

// Terminer l'appel
async function terminerAppel() {
    if (!appelEnCours) return;
    
    try {
        // Arrêter le chronomètre
        if (appelEnCours.intervalChrono) {
            clearInterval(appelEnCours.intervalChrono);
        }
        
        // Calculer la durée
        const debut = new Date(appelEnCours.timestamp_debut);
        const fin = new Date();
        const duree = Math.floor((fin - debut) / 1000);
        
        // Mettre à jour l'appel
        appelEnCours.timestamp_fin = fin.toISOString();
        appelEnCours.duree = duree;
        appelEnCours.statut = 'termine';
        
        // Sauvegarder
        await mettreAJourAppel(appelEnCours);
        
        // Arrêter les flux média
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
        
        // Fermer l'interface
        const interfaceAppel = document.getElementById('interfaceAppel');
        if (interfaceAppel) {
            interfaceAppel.remove();
        }
        
        // Afficher le résumé
        afficherResumeAppel(appelEnCours);
        
        appelEnCours = null;
        
    } catch (error) {
        console.error('Erreur lors de la fin d\'appel:', error);
    }
}

// Afficher le résumé d'appel
function afficherResumeAppel(appel) {
    const minutes = Math.floor(appel.duree / 60);
    const secondes = appel.duree % 60;
    const dureeFormatee = `${minutes}:${secondes.toString().padStart(2, '0')}`;
    
    const resume = document.createElement('div');
    resume.className = 'fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-sm';
    resume.innerHTML = `
        <div class="flex items-center gap-3 mb-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="font-semibold">Appel terminé</span>
        </div>
        <p class="text-gray-600 text-sm">Durée: ${dureeFormatee}</p>
        <p class="text-gray-600 text-sm">Type: ${appel.type === 'video' ? 'Vidéo' : 'Audio'}</p>
        <button onclick="this.parentElement.remove()" class="mt-2 text-xs text-gray-500 hover:text-gray-700">
            Fermer
        </button>
    `;
    
    document.body.appendChild(resume);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (resume.parentElement) {
            resume.remove();
        }
    }, 5000);
}

// Sauvegarder un appel
async function sauvegarderAppel(appel) {
    try {
        const response = await fetch(URL_APPELS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appel)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur sauvegarde appel:', error);
        throw error;
    }
}

// Mettre à jour un appel
async function mettreAJourAppel(appel) {
    try {
        const response = await fetch(`${URL_APPELS}/${appel.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appel)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur mise à jour appel:', error);
        throw error;
    }
}

// Obtenir l'historique des appels
export async function obtenirHistoriqueAppels(utilisateurId) {
    try {
        const response = await fetch(URL_APPELS);
        const appels = await response.json();
        
        return appels.filter(appel => 
            appel.participants.includes(utilisateurId)
        ).sort((a, b) => new Date(b.timestamp_debut) - new Date(a.timestamp_debut));
        
    } catch (error) {
        console.error('Erreur chargement historique:', error);
        return [];
    }
}

// Ajouter les boutons d'appel dans l'interface de conversation
export function ajouterBoutonsAppel(contactId, contactNom) {
    const container = document.querySelector('.discussion .flex.items-center.space-x-2');
    if (!container) return;
    
    // Vérifier si les boutons existent déjà
    if (container.querySelector('.btn-appel-vocal')) return;
    
    const btnAudio = document.createElement('button');
    btnAudio.className = 'btn-appel-vocal p-2 hover:bg-gray-100 rounded-full';
    btnAudio.dataset.contactId = contactId;
    btnAudio.dataset.contactNom = contactNom;
    btnAudio.innerHTML = '<i class="fa-solid fa-phone text-gray-600"></i>';
    
    const btnVideo = document.createElement('button');
    btnVideo.className = 'btn-appel-video p-2 hover:bg-gray-100 rounded-full';
    btnVideo.dataset.contactId = contactId;
    btnVideo.dataset.contactNom = contactNom;
    btnVideo.innerHTML = '<i class="fa-solid fa-video text-gray-600"></i>';
    
    // Insérer avant le menu (dernier élément)
    const dernierElement = container.lastElementChild;
    container.insertBefore(btnVideo, dernierElement);
    container.insertBefore(btnAudio, dernierElement);
}